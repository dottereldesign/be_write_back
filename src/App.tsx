// src/App.tsx
import Header from "./components/Header";
import PasteContainer from "./components/PasteContainer"; // ✅ Now this works!
import Footer from "./components/Footer";
import "./index.css";

function App() {
  return (
    <div id="root">
      <Header />
      <PasteContainer />
      <Footer />
    </div>
  );
}

export default App;
