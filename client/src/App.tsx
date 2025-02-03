// src/App.tsx
import PasteContainer from "./components/PasteContainer";
import "./index.css"; // No need for App.css anymore

function App() {
  return (
    <div id="root">
      <h1 className="app-title">brb, saving that</h1>
      <PasteContainer />
    </div>
  );
}

export default App;
