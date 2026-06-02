import { useState } from "react";
import Login from "./Login";
import Register from "./Register";

export default function App() {
  const [isLoginDisplayed, setIsLoginDisplayed] = useState(true);

  function toggleDisplay() {
    setIsLoginDisplayed((p) => !p);
  }

  return <>
  <section className="flex justify-center">
    {isLoginDisplayed ? (
    <Login toggleDisplay={toggleDisplay} />
  ) : (
    <Register toggleDisplay={toggleDisplay} />
  )}
  </section>
  
  </>
}
