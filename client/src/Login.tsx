import React, { useState } from "react";

interface LoginProps {
  toggleDisplay: () => void;
}

export default function Login({ toggleDisplay }: LoginProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");

  const backenduri = import.meta.env.VITE_backend_uri;

  async function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();

    try {
      const response = await fetch(backenduri + "login", {
        body: JSON.stringify({ username, password }),
        method: "POST",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
        },
      });

      switch (response.status) {
        case 400:
          setError((await response.json()).errors[0]);
          break;
        case 401:
          setError("Invalid Username or Password");
          break;
        case 200:
          alert("Succesfull");
          break; // TO-DO: Change this
        case 404:
          setError("Failed to connect to server");
          break;
        default:
          setError("Some error occurred! Refer to console");
          console.log(response);
      }
    } catch (e) {
      setError("Some error occurred! Refer to console.")
      console.error(e);
    }
  }

  return (
    <div className="h-screen w-screen flex flex-col justify-center items-center max-w-md">
      <div className="bg-red-100 text-red-600 text-xl mb-2 min-w-full flex justify-center">{error}</div>
      <form
        className="flex flex-col items-stretch gap-5"
        onSubmit={handleSubmit}
      >
        <div className="flex-1 flex flex-col">
          <label className="text-xl" htmlFor="username">
            Username or Email:{" "}
          </label>
          <input
            className="border rounded-sm text-2xl pr-5 pl-1 py-2 min-w-md"
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div className="flex-1 flex flex-col">
          <label htmlFor="password" className="text-xl">
            Password:{" "}
          </label>
          <input
            className="border rounded-sm text-2xl pr-5 pl-1 py-2 min-w-md"
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <div className="flex-1 flex flex-col">
          <button
            type="submit"
            className="text-2xl flex items-center justify-center px-7 py-3 rounded-xl bg-cyan-800 text-white cursor-pointer hover:bg-cyan-700"
          >
            Login
          </button>
        </div>
      </form>

      <p
        className="mt-5 underline cursor-pointer hover:no-underline underline-offset-1"
        onClick={toggleDisplay}
      >
        Don't have an account? Register for free
      </p>
    </div>
  );
}
