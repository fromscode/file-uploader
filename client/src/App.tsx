import { useState } from "react";
import Login from "./Login";
import Register from "./Register";

export default function App() {
  const [isLoginDisplayed, setIsLoginDisplayed] = useState(true);

  function toggleDisplay() {
    setIsLoginDisplayed((p) => !p);
  }

  return isLoginDisplayed ? (
    <Login toggleDisplay={toggleDisplay} />
  ) : (
    <Register toggleDisplay={toggleDisplay} />
  );
}
