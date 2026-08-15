import { useState } from "react";

interface RegisterProps {
  toggleDisplay: () => void;
}

export default function Register({ toggleDisplay }: RegisterProps) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const backenduri = import.meta.env.VITE_backend_uri;

  async function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();

    try {
      const response = await fetch(backenduri + "register", {
        body: JSON.stringify({ username, password, email }),
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
        case 409: {
          const field = (await response.json()).fields[0] as string;
          setError(
            field.slice(0, 1).toUpperCase + field.slice(1) + " already exists!",
          );
          break;
        }
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
      setError("Some error occurred! Refer to console.");
      console.error(e);
    }
  }

  return (
    <div className="h-screen w-screen flex flex-col justify-center items-center max-w-md">
      <div className="bg-red-100 text-red-600 text-xl mb-2 min-w-full flex justify-center">
        {error}
      </div>
      <form
        className="flex flex-col items-stretch gap-5 min-w-md"
        onSubmit={handleSubmit}
      >
        <div className="flex-1 flex flex-col">
          <label className="text-xl" htmlFor="username">
            Username:{" "}
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
          <label className="text-xl" htmlFor="email">
            Email:{" "}
          </label>
          <input
            className="border rounded-sm text-2xl pr-5 pl-1 py-2 min-w-md"
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="flex-1 flex flex-col">
          <label htmlFor="password" className="text-xl">
            Password:{" "}
          </label>
          <input
            id="password"
            className="border rounded-sm text-2xl pr-5 pl-1 py-2 min-w-md"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className="flex-1 flex flex-col">
          <label htmlFor="confirmPassword" className="text-xl">
            Confirm Password:{" "}
          </label>
          <input
            id="confirmPassword"
            className="border rounded-sm text-2xl pr-5 pl-1 py-2 min-w-md"
            type="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>

        <div className="flex-1 flex flex-col">
          <button
            type="submit"
            className="text-2xl flex items-center justify-center px-7 py-3 rounded-xl bg-cyan-800 text-white cursor-pointer hover:bg-cyan-700"
          >
            Register
          </button>
        </div>
      </form>

      <p
        className="mt-5 underline cursor-pointer hover:no-underline underline-offset-1"
        onClick={toggleDisplay}
      >
        Already have an account? Log In instead
      </p>
    </div>
  );
}
