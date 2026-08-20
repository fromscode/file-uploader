import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { CiFolderOn } from "react-icons/ci";

import Navbar from "./Navbar";

export default function Dashboard() {
  const navigate = useNavigate();

  const backend = import.meta.env.VITE_backend_uri;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [folders, setFolders] = useState([]);
  const [files, setFiles] = useState([]);

  useEffect(() => {
    async function getData() {
      const response = await fetch(backend + "home", {
        mode: "cors",
        credentials: "include",
      });

      switch (response.status) {
        case 401:
          navigate("/begin");
          break;
        case 200: {
          setLoading(false);
          const jsonResponse = await response.json();
          setFolders(jsonResponse.folders);
          setFiles(jsonResponse.files);
          break;
        }
        default:
          setLoading(false);
          setError(response.status + " error!");
          console.error(response.status);
          break;
      }
    }

    getData();
  }, [backend, navigate]);

  if (loading)
    return (
      <>
        <Navbar />
        <section className="flex flex-col mx-auto w-xl text-zinc-400">
          Loading...
        </section>
      </>
    );

  if (error)
    return (
      <>
        <Navbar />
        <section className="flex flex-col mx-auto w-xl text-zinc-400">
          {error}
        </section>
      </>
    );

  return (
    <>
      <Navbar />
      <section className="flex flex-col mx-auto w-xl text-zinc-400 text-lg">
        <div className="bg-zinc-900 w-full px-6 py-1 mb-5">Name</div>
        <div>
          {folders.map((folder) => (
            <div className="flex items-center gap-2 mb-4 pb-1 border-b border-zinc-600 ">
              <CiFolderOn className="text-xl" />
              <div className="hover:cursor-pointer font-light hover:font-medium">
                {folder.name}
              </div>
            </div>
          ))}
          {files.map((file) => (
            <div className="flex items-center gap-2 mb-4 pb-1 border-b border-zinc-600 ">
              <CiFolderOn className="text-xl" />
              <div className="hover:cursor-pointer font-light hover:font-medium">
                {file.name}
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
