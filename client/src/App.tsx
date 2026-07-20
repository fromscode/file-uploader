import { useState } from "react";
import Login from "./Login";
import Register from "./Register";
import Navbar from "./Navbar";

export default function App() {
  const [isLoginDisplayed, setIsLoginDisplayed] = useState(true);

  function toggleDisplay() {
    setIsLoginDisplayed((p) => !p);
  }

  return <>
  <Navbar/>
  <section className="flex justify-center -mt-10">
    {isLoginDisplayed ? (
    <Login toggleDisplay={toggleDisplay} />
  ) : (
    <Register toggleDisplay={toggleDisplay} />
  )}
  </section>
  
  </>
}
