// src/App.tsx
import Header from "./components/Header";
import PasteContainer from "./components/Board/Board"; // ✅ Now this works!
import Footer from "./components/Footer";
import "./index.css";
import { useToast } from "./hooks/useToast";
import Toast from "./components/Board/Toast";

function App() {
  const { toastMessage, triggerToast } = useToast();

  return (
    <>
      <Header />
      <Toast
        message={toastMessage}
        onClose={() => {
          if (import.meta.env.MODE !== "production") {
            console.log("🚀 Toast closed");
          }
        }}
      />
      <main>
        <PasteContainer triggerToast={triggerToast} />
      </main>
      <Footer />
    </>
  );
}

export default App;
