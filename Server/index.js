const express = require("express");
const cors = require("cors");
const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();

const app = express();
const genAI = new GoogleGenerativeAI(process.env.API_KEY);

app.use(cors());
app.use(express.json());


function parseAIAnalysisResult(text) {
  const sections = text.split(/##\s*/).filter(Boolean);
  const structuredResult = {};
  
  sections.forEach(section => {
    const lines = section.split("\n").filter(Boolean);
    const sectionTitle = lines[0].trim().replace(/\s+/g, "_").replace(/:$/, "");
    structuredResult[sectionTitle] = {};
    
    let currentCategory = "";
    
    lines.slice(1).forEach(line => {
      const categoryMatch = line.match(/^(.*?):\s*(.*)$/);
      
      if (categoryMatch) {
        // Remove '**' from the start of the category name
        currentCategory = categoryMatch[1].trim()
          .replace(/^\*\*/, '')  // Remove leading '**'
          .replace(/\s+/g, "_"); // Replace spaces with underscores
        
        let value = categoryMatch[2] ? categoryMatch[2].trim().replace(/^\*\*/, "") : "";
        structuredResult[sectionTitle][currentCategory] = value;
      } else if (line.startsWith("    *") && currentCategory) {
        if (!Array.isArray(structuredResult[sectionTitle][currentCategory])) {
          structuredResult[sectionTitle][currentCategory] = [];
        }
        const cleanedLine = line.replace("    *", "").trim();
        structuredResult[sectionTitle][currentCategory].push(cleanedLine);
      }
    });
  });
  
  return structuredResult;
}

async function generatePrompt(data) {
  return `Act as an expert nutritionist and health advisor. You will be provided with user data, including height, weight, age, location, disease conditions (e.g., diabetes or allergies), exercise regularity, and fast food consumption habits. Additionally, you will receive product information like the product name, description, and ingredients.

  Based on the input data provided, generate a comprehensive report that includes two sections and nothing else nothing means nothing:

  General Report:

  Authenticity of Product: Analyze the ingredients provided and determine if the product is authentic (i.e., whether it's a healthy, processed, or artificial food).
  Is vegetarian: Determine if the product is vegetarian based on its ingredients.
  Is good for Diabetic: Analyze whether the product is safe for a user with diabetes by evaluating the sugar content and other related ingredients.
  Is good for children: Based on the product description and ingredients, advise whether the product is suitable for children.

  Customer Fit:

  Suggestions based on user input: Evaluate whether the product is good or not for the user based on their input (e.g., disease conditions, exercise habits, fast food regularity, etc.). Provide specific reasons if it’s not suitable.
  Consumption recommendations: Offer suggestions on how much consumption of the product is healthy or advisable for the user based on their lifestyle and health conditions (e.g., for a person with diabetes, moderate or restricted consumption).

  User Data:

  Height: ${data.user.height}
  Weight: ${data.user.weight}
  Age: ${data.user.age}
  Location: ${data.user.location}
  Disease: Diabetes: ${data.user.disease.diabetes}, Allergic: ${data.user.disease.allergic}
  Exercise Regularity: ${data.user.exerciseRegularity}
  Fast Food Regularity: ${data.user.fastFoodRegularity}

  Product Data:
  Name: ${data.product.name}
  Description: ${data.product.description}
  Ingredients: ${data.product.ingredients.join(', ')}
  
  note : provide values for each field do not include any other field anything except this fields . in case of is vegetarian first responde with yes or no then a sort line to explain.similary in case if is diabetic and is good for children  
  `;

}

// async function run(data) {
//   try {
//     const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
//     const prompt = await generatePrompt(data);
//     console.log("Generated Prompt:", prompt); // Log the generated prompt

//     const result = await model.generateContent({ prompt });
//     console.log("API Response:", result); // Log the API response

//     return result.response?.text || "No response received from AI.";
//   } catch (error) {
//     console.error('Error in generating content:', error);
//     throw error;
//   }
// }


async function run(data) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const prompt = await generatePrompt(data);
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    return text;
  } catch (error) {
    console.error('Error in generating content:', error);
    throw error;
  }
}


app.post('/generate', async (req, res) => {
  try {
    const {
      height,
      weight,
      age,
      location,
      disease: { diabetes, allergic },
      exerciseRegularity,
      fastFoodRegularity,
      productName,
      productDescription,
      productIngredients
    } = req.body;

    // Validate essential fields
    if (!height || !weight || !age || !location || !productName || !productDescription || !productIngredients) {
      return res.status(400).json({ message: "Missing required fields." });
    }

    // Process the data (this is where you can implement your business logic)
    const processedData = {
      user: {
        height,
        weight,
        age,
        location,
        disease: {
          diabetes,
          allergic
        },
        exerciseRegularity,
        fastFoodRegularity
      },
      product: {
        name: productName,
        description: productDescription,
        ingredients: productIngredients.split(',').map(ingredient => ingredient.trim()), 
      }
    };

    // Simulating an AI analysis result (replace this with your actual logic or API call)
    const aiAnalysisResult = await run(processedData);
    const formatedres = parseAIAnalysisResult(aiAnalysisResult);
    // Send the response back to the frontend
    res.json({
      message: "Data processed successfully",
      data: formatedres
    });
  } catch (error) {
    console.error('Error processing data: post ', error);
    res.status(500).json({ error: 'Failed to process data  post' });
  }
});

app.get('/generate', (req, res) => {
  res.send('<h1>Hello World</h1>');
});


const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server is running on PORT ${PORT}`));
