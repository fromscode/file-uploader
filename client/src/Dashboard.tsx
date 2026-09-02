import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import { CiFolderOn } from "react-icons/ci";
import { AiOutlineFileAdd } from "react-icons/ai";
import { LuFolderPlus } from "react-icons/lu";

import Navbar from "./Navbar";
import type { File, Folder } from "./types";

export default function Dashboard() {
  const navigate = useNavigate();

  const backend = import.meta.env.VITE_backend_uri;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [folders, setFolders] = useState<Folder[]>([]);
  const [files, setFiles] = useState<File[]>([]);

  const addFileRef = useRef<HTMLDivElement>(null);
  const addFolderRef = useRef<HTMLDivElement>(null);

  /* 
  TO-DO: Add links to each folder, file and the add buttons
  */

  function handleMouseEnter() {
    addFileRef.current!.classList.remove("hidden");
    addFolderRef.current!.classList.remove("hidden");
  }

  function handleMouseLeave() {
    addFileRef.current!.classList.add("hidden");
    addFolderRef.current!.classList.add("hidden");
  }

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

        <div
          className="absolute bottom-20 right-10 text-2xl flex flex-col gap-4"
          onMouseEnter={() => handleMouseEnter()}
          onMouseLeave={() => handleMouseLeave()}
        >
          <div className="bg-blue-800 rounded-full flex gap-2 items-center justify-center p-3 hover:cursor-pointer text-zinc-950 hover:text-zinc-50">
            <AiOutlineFileAdd />
            <div className="hidden text-base" ref={addFileRef}>
              Add File
            </div>
          </div>
          <div className="bg-blue-800 rounded-full flex gap-2 items-center justify-center p-3 hover:cursor-pointer text-zinc-950 hover:text-zinc-50 ">
            <LuFolderPlus />
            <div className="hidden text-base" ref={addFolderRef}>
              Add Folder
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
