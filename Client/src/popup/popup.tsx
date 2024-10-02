import * as React from "react";
import { useState } from "react";
import { createRoot } from "react-dom/client";
import "./popup.css";
import Custom from "./custom";
import PreMade from "./preMade";

const App: React.FC = () => {
  const [isCustom, setIsCustom] = useState(true);

  const handleToggle = (event: React.MouseEvent) => {
    event.preventDefault();
    setIsCustom(prevState => !prevState);
  };

  return (
    <div>
      
       
        {isCustom ? <Custom /> : <PreMade />}
      
    </div>
  );
};

export default App;

const rootElement = document.createElement("div");
document.body.appendChild(rootElement);
const root = createRoot(rootElement);
root.render(<App />);