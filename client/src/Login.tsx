import React, { useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { useNavigate } from "react-router";

interface LoginProps {
  toggleDisplay: () => void;
}

export default function Login({ toggleDisplay }: LoginProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  const [error, setError] = useState("");

  const navigate = useNavigate();

  const backenduri = import.meta.env.VITE_backend_uri;

  async function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();

    try {
      const response = await fetch(backenduri + "login", {
        body: JSON.stringify({ username, password }),
        method: "POST",
        mode: "cors",
        credentials: "include",
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
          navigate("/");
          break; // TO-DO: Change this
        case 404:
          setError("Failed to connect to server");
          break;
        default:
          setError("Some error occurred! Refer to console");
          console.log(response);
      }
    } catch (e) {
      setError("Some error occurred! Refer to console.");
      console.error(e);
    }
  }

  return (
    <div className="w-screen flex flex-col justify-center items-center max-w-md">
      <div className="mb-2 min-w-full flex justify-center">{error}</div>
      <form
        className="flex flex-col items-stretch gap-5"
        onSubmit={handleSubmit}
      >
        <div className="flex-1 flex flex-col">
          <label className="text-lg" htmlFor="username">
            Username or Email
          </label>
          <input
            className="border rounded-sm text-lg pr-5 pl-2 py-2 min-w-md"
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div className="flex-1 flex flex-col">
          <label htmlFor="password" className="text-lg">
            Password
          </label>
          <div className="flex relative">
            <input
              id="password"
              className="border rounded-sm text-lg pr-5 pl-2 py-2 min-w-md"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {password && (
              <button type="button" onClick={() => setShowPassword((p) => !p)}>
                {!showPassword ? (
                  <FiEye className="absolute right-2 text-xl top-3.5" />
                ) : (
                  <FiEyeOff className="absolute right-2 text-xl top-3.5" />
                )}
              </button>
            )}
          </div>
        </div>

        <div className="flex-1 flex flex-col items-center">
          <button
            type="submit"
            className="text-lg flex items-center justify-center px-7 py-3 rounded-full bg-blue-800 text-zinc-300 cursor-pointer hover:bg-blue-700"
          >
            Login
          </button>
        </div>
      </form>

      <p
        className="mt-5 underline cursor-pointer hover:no-underline underline-offset-2 decoration-0"
        onClick={toggleDisplay}
      >
        Don't have an account? Register for free
      </p>
    </div>
  );
}
