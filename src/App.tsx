// src/App.tsx
import Header from "./components/Header";
import PasteContainer from "./components/Board/Board"; // ✅ Now this works!
import Footer from "./components/Footer";
import "./index.css";

function App() {
  return (
    <div id="root">
      <Header />
      <main>
        <PasteContainer />
      </main>
      <Footer />
    </div>
  );
}

export default App;
