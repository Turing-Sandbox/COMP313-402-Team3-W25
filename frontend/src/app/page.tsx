import Background from "./components/background";
import Navbar from "./components/navbar";
import Register from "./pages/Authentication/Register";

export default function View() {
  return (
    <>
      <Background />

      {/* IF AUTHENTICATED */}

      {/* ELSE */}

      <Navbar />
      <Register />
    </>
  );
}
