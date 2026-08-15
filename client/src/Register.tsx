import { useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";

interface RegisterProps {
  toggleDisplay: () => void;
}

export default function Register({ toggleDisplay }: RegisterProps) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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
    <div className="w-screen flex flex-col justify-center items-center max-w-md">
      <div className="bg-red-100 text-red-600 mb-2 min-w-full flex justify-center">
        {error}
      </div>
      <form
        className="flex flex-col items-stretch gap-5 min-w-md"
        onSubmit={handleSubmit}
      >
        <div className="flex-1 flex flex-col">
          <label className="text-lg" htmlFor="username">
            Username
          </label>
          <input
            className="border rounded-sm text-lg pr-5 pl-1 py-2 min-w-md"
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div className="flex-1 flex flex-col">
          <label className="text-lg" htmlFor="email">
            Email
          </label>
          <input
            className="border rounded-sm text-lg pr-5 pl-1 py-2 min-w-md"
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="flex-1 flex flex-col">
          <label htmlFor="password" className="text-lg">
            Password
          </label>
          <div className="flex relative">
            <input
              id="password"
              className="border rounded-sm text-lg pr-5 pl-1 py-2 min-w-md"
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
        <div className="flex-1 flex flex-col">
          <label htmlFor="confirmPassword" className="text-lg">
            Confirm Password
          </label>
          <div className="relative">
            <input
              id="confirmPassword"
              className="border rounded-sm text-lg pr-5 pl-1 py-2 min-w-md"
              type={showConfirmPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            {confirmPassword && (
              <button
                type="button"
                onClick={() => setShowConfirmPassword((p) => !p)}
              >
                {!showConfirmPassword ? (
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
            Register
          </button>
        </div>
      </form>

      <p
        className="mt-5 underline cursor-pointer hover:no-underline underline-offset-2 decoration-0"
        onClick={toggleDisplay}
      >
        Already have an account? Log In instead
      </p>
    </div>
  );
}
