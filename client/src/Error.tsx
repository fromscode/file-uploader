import { NavLink } from "react-router";

export default function Error() {
    return <div className="h-screen items-center justify-center flex flex-col pb-48 gap-5">
    <div className="text-2xl flex justify-center items-center">
        404 | The requested page could not be found
    </div>
    
    <NavLink to="/" className="underline hover:no-underline underline-offset-1">Click here to go somewhere safe!</NavLink>
    </div>
}