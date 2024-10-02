import * as React from "react";
import { createRoot } from "react-dom/client";
import "./options.css";

const App: React.FC<{}> = () => {
  return (
    <div className="container">
      <div className="about-box">
        <h1>About Me</h1>
        <p>
          Hi, I'm <strong>RAJNISH KUMAR</strong> , a passionate Full Stack Developer. I love building web applications and learning
          new technologies.
        </p>
        Connect with me  : <a href="https://www.linkedin.com/in/rajnish-kumar-412aba106/">LinkedIn</a>

      </div>
      <div className="about-box">
        <h2>About project </h2>
        <h3>AI Prompt Generator</h3>
        <p>
          Are you tired of repetitive and mundane tasks? Do you wish you had a
          personal assistant to guide you with tailored prompts for your daily
          needs? Look no further! Our Chrome Extension, Custom Prompt Generator,
          is here to revolutionize your browsing experience.
        </p>
        <h3>Key Features:</h3>
        <ul>
          <li>
            <strong>Personalized Prompts:</strong> Get customized prompts based
            on your preferences and browsing habits.
          </li>
          <li>
            <strong>Productivity Boost:</strong> Receive suggestions that help
            you stay organized and productive throughout the day.
          </li>
          <li>
            <strong>Creative Ideas:</strong> Generate unique and creative ideas
            for your projects, writing, or brainstorming sessions.
          </li>
          <li>
            <strong>User-Friendly Interface:</strong> Enjoy a seamless and
            intuitive user interface designed for ease of use.
          </li>
          <li>
            <strong>Seamless Integration:</strong> Integrate effortlessly with
            your favorite tools and platforms for a smooth workflow.
          </li>
        </ul>
        <p>
          Enhance your productivity and creativity with our Custom Prompt
          Generator. Install the extension today and unlock the potential of
          personalized guidance at your fingertips!
        </p>
      </div>
    </div>
  );
};

const rootElement = document.createElement("div");
document.body.appendChild(rootElement);
const root = createRoot(rootElement);
root.render(<App />);
