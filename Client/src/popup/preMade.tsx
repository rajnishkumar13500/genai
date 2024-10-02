import * as React from "react";
import { useState } from "react";
import "./popup.css";
import Data from "../static/data.js";

const PreMade = () => {
  const [copiedId, setCopiedId] = useState(null);

  const copyToClipboard = (event, prompt, id) => {
    event.preventDefault();
    navigator.clipboard.writeText(prompt).then(() => {
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    });
  };

  return (
    <div className="pre-made-container">
      <h3 className="title">Explore Prompts : </h3>
      <div className="card-grid">
        {Data.map((e) => (
          <div key={e.id} className="card">
            <fieldset>
            <legend>{e.name} </legend>
            <p className="card-prompt">{e.prompt.substr(0, 100)}...</p>
            <button
              className="copy-button"
              onClick={(event) => copyToClipboard(event, e.prompt, e.id)}
            >
              {copiedId === e.id ? "Copied!" : "Copy to Clipboard"}
            </button>
            </fieldset>
            
          </div>
        ))}
      </div>
    </div>
  );
};

export default PreMade;