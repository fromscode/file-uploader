import { NavLink } from "react-router";

export default function Navbar() {
  return (
    <nav className="bg-cyan-700 text-2xl text-cyan-50 px-2 py-3">
      <NavLink to="/" className="cursor-pointer">
        DriveCloud
      </NavLink>
    </nav>
  );
}
