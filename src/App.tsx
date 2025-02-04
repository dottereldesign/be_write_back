// src/App.tsx
import Header from "./components/Header"; // ✅ Import Header Component
import PasteContainer from "./components/PasteContainer";
import Footer from "./components/Footer";
import "./index.css";

function App() {
  return (
    <div id="root">
      <Header /> {/* ✅ Replaces title + instructions */}
      <PasteContainer />
      <Footer />
    </div>
  );
}

export default App;
