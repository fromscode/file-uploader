import { useState } from "react";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className="h-screen w-screen flex flex-col justify-center items-center">
      <form className="flex flex-col items-stretch gap-5">
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
          <label className="text-xl">Password: </label>
          <input
            className="border rounded-sm text-2xl pr-5 pl-1 py-2 min-w-md"
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

      <p className="mt-5 underline cursor-pointer hover:no-underline underline-offset-1">
        Don't have an account? Sign up for free
      </p>
    </div>
  );
}
