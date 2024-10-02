import * as React from "react";
import { useState, useEffect } from "react";
import "./popup.css";

const Custom: React.FC = () => {
  const [formData, setFormData] = useState({
    height: "",
    weight: "",
    age: "",
    location: "",
    disease: {
      diabetes: false,
      allergic: false,
    },
    exerciseRegularity: "",
    fastFoodRegularity: "",
    productName: "",
    productDescription: "",
    productIngredients: "",
  });

  const [apiResponse, setApiResponse] = useState<any>(null); // State to store API response
  const [loading, setLoading] = useState(false); // State for loading indicator
  const [error, setError] = useState<string | null>(null); // State for error handling

  // Function to save form data to local storage
  const saveToLocalStorage = (data: any) => {
    localStorage.setItem("formData", JSON.stringify(data));
  };

  // Load data from local storage when component mounts
  useEffect(() => {
    const savedFormData = localStorage.getItem("formData");
    if (savedFormData) {
      setFormData(JSON.parse(savedFormData));
    }
  }, []);

  // Update formData and save to local storage whenever form values change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;

    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked; // Type assertion to access 'checked'
      setFormData((prevData) => {
        const updatedData = {
          ...prevData,
          disease: {
            ...prevData.disease,
            [name]: checked,
          },
        };
        saveToLocalStorage(updatedData); // Save updated data to local storage
        return updatedData;
      });
    } else {
      setFormData((prevData) => {
        const updatedData = { ...prevData, [name]: value };
        saveToLocalStorage(updatedData); // Save updated data to local storage
        return updatedData;
      });
    }
  };

  const handleRadioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => {
      const updatedData = { ...prevData, [name]: value };
      saveToLocalStorage(updatedData); // Save updated data to local storage
      return updatedData;
    });
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError(null); // Reset error state before making a new request
    try {
      // Call your API here. Replace 'YOUR_API_URL' with the actual URL.
      const response = await fetch('http://localhost:4000/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      setApiResponse(data); // Set the API response data
    } catch (err: any) {
      setError(err.message); // Set error message if API call fails
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ai-extension">
      <h1>AI Food Analyser</h1>
      <form>
        {/* User General Data */}
        <section>
          <h2>General User Data</h2>
          <div className="input-group">
            <label>Height</label>
            <input
              type="text"
              name="height"
              value={formData.height}
              onChange={handleChange}
              placeholder="Enter your height"
            />
          </div>
          <div className="input-group">
            <label>Weight</label>
            <input
              type="text"
              name="weight"
              value={formData.weight}
              onChange={handleChange}
              placeholder="Enter your weight"
            />
          </div>
          <div className="input-group">
            <label>Age</label>
            <input
              type="text"
              name="age"
              value={formData.age}
              onChange={handleChange}
              placeholder="Enter your age"
            />
          </div>
          <div className="input-group">
            <label>Location</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="Enter your location"
            />
          </div>

          {/* Disease */}
          <div className="input-group">
            <label>Diseases:</label>
            <label>
              <input
                type="checkbox"
                name="diabetes"
                checked={formData.disease.diabetes}
                onChange={handleChange}
              />
              Diabetes
            </label>
            <label>
              <input
                type="checkbox"
                name="allergic"
                checked={formData.disease.allergic}
                onChange={handleChange}
              />
              Allergic
            </label>
          </div>
        </section>

        {/* Exercise Regularity */}
        <section>
          <h2>Exercise Regularity</h2>
          <label>
            <input
              type="radio"
              name="exerciseRegularity"
              value="daily"
              checked={formData.exerciseRegularity === "daily"}
              onChange={handleRadioChange}
            />
            Daily
          </label>
          <label>
            <input
              type="radio"
              name="exerciseRegularity"
              value="weekly"
              checked={formData.exerciseRegularity === "weekly"}
              onChange={handleRadioChange}
            />
            Weekly
          </label>
          <label>
            <input
              type="radio"
              name="exerciseRegularity"
              value="sometimes"
              checked={formData.exerciseRegularity === "sometimes"}
              onChange={handleRadioChange}
            />
            Sometimes
          </label>
        </section>

        {/* Fastfood Regularity */}
        <section>
          <h2>Fastfood Regularity</h2>
          <label>
            <input
              type="radio"
              name="fastFoodRegularity"
              value="daily"
              checked={formData.fastFoodRegularity === "daily"}
              onChange={handleRadioChange}
            />
            Daily
          </label>
          <label>
            <input
              type="radio"
              name="fastFoodRegularity"
              value="after 2-3 days"
              checked={formData.fastFoodRegularity === "after 2-3 days"}
              onChange={handleRadioChange}
            />
            After 2-3 days
          </label>
          <label>
            <input
              type="radio"
              name="fastFoodRegularity"
              value="sometimes"
              checked={formData.fastFoodRegularity === "sometimes"}
              onChange={handleRadioChange}
            />
            Sometimes
          </label>
        </section>

        {/* Product Data */}
        <section>
          <h2>Product Data</h2>
          <div className="input-group">
            <label>Product Name</label>
            <input
              type="text"
              name="productName"
              value={formData.productName}
              onChange={handleChange}
              placeholder="Enter product name"
            />
          </div>
          <div className="input-group">
            <label>Product Description</label>
            <textarea
              name="productDescription"
              value={formData.productDescription}
              onChange={handleChange}
              placeholder="Enter product description"
            />
          </div>
          <div className="input-group">
            <label>Product Ingredients</label>
            <textarea
              name="productIngredients"
              value={formData.productIngredients}
              onChange={handleChange}
              placeholder="Enter product ingredients separated by commas"
            />
          </div>
        </section>

        {/* Inspect Button */}
        <button type="button" onClick={handleSubmit}>
          Inspect Item
        </button>
        <br></br>
        <br></br>
        <br></br>
        <hr></hr>
        <br></br>
         {/* Display API Response */}
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}

      
{apiResponse && (
  <div className="api-response">
    <h2>Analysis Results:</h2>
    <div className="general-report">
      <h3>General Report</h3>
      <p><strong>Authenticity of Product:</strong> {apiResponse.data?.General_Report?.Authenticity_of_Product || "N/A"}</p>
      <p><strong>Is Vegetarian:</strong> {apiResponse.data?.General_Report?.Is_vegetarian || "N/A"}</p>
      <p><strong>Is Good for Diabetic Users:</strong> {apiResponse.data?.General_Report?.Is_good_for_Diabetic || "N/A"}</p>
      <p><strong>Is Good for Children:</strong> {apiResponse.data?.General_Report?.Is_good_for_children || "N/A"}</p>
    </div>
    <div className="customer-fit">
      <h3>Customer Fit</h3>
      <p><strong>Suggestions based on user input:</strong> {apiResponse.data?.Customer_Fit?.Suggestions_based_on_user_input || "N/A"}</p>
      <p><strong>Consumption Recommendations:</strong> {apiResponse.data?.Customer_Fit?.Consumption_recommendations || "N/A"}</p>
    </div>
  </div>
)}




      </form>

     
    </div>
  );
};

export default Custom;
