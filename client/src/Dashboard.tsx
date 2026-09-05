import React, { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import { CiFileOn, CiFolderOn } from "react-icons/ci";
import { AiOutlineFileAdd } from "react-icons/ai";
import { LuFolderPlus } from "react-icons/lu";
import { MdDeleteOutline } from "react-icons/md";
import { AiOutlineLogout } from "react-icons/ai";
import { IoMdArrowBack } from "react-icons/io";

import Navbar from "./Navbar";
import type { File, Folder } from "./types";

export default function Dashboard() {
  const navigate = useNavigate();
  const backend = import.meta.env.VITE_backend_uri;

  const [currentFolderId, setCurrentFolderId] = useState<string | number>(
    "home",
  );

  const logoutRef = useRef<HTMLDivElement>(null);

  async function handleLogoutClick() {
    try {
      const response = await fetch(backend + "logout", {
        mode: "cors",
        credentials: "include",
      });

      switch (response.status) {
        case 200:
          navigate("/begin");
          break;
        default:
          console.error(await response.json());
      }
    } catch (e) {
      console.error(e);
    }
  }

  return (
    <>
      <Navbar />
      <section className="flex flex-col mx-auto w-xl text-zinc-400 text-lg">
        <CurrentFolderContents
          currentFolderId={currentFolderId}
          setCurrentFolderId={setCurrentFolderId}
        />

        <div
          className="fixed bottom-10 left-10 bg-zinc-800 p-3 rounded-full
        cursor-pointer flex gap-2 items-center justify-center hover:bg-zinc-500 hover:text-black"
          onClick={handleLogoutClick}
          onMouseEnter={() => {
            logoutRef.current!.classList.remove("hidden");
          }}
          onMouseLeave={() => {
            logoutRef.current!.classList.add("hidden");
          }}
        >
          <AiOutlineLogout className="font-bold text-xl" />
          <div className="hidden text-base" ref={logoutRef}>
            Logout
          </div>
        </div>
      </section>
    </>
  );
}

interface currentFolderProps {
  currentFolderId: number | string;
  setCurrentFolderId: React.Dispatch<React.SetStateAction<string | number>>;
}

function CurrentFolderContents({
  currentFolderId,
  setCurrentFolderId,
}: currentFolderProps) {
  const backend = import.meta.env.VITE_backend_uri;

  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentFolder, setCurrentFolder] = useState<Folder>();
  const [folders, setFolders] = useState<Folder[]>([]);
  const [files, setFiles] = useState<File[]>([]);
  const [parentList, setParentList] = useState<{ name: string; id: number }[]>(
    [],
  );

  const [itemToBeDeleted, setItemToBeDeleted] = useState<File | Folder>();

  const [addFileModalDisplayed, setAddFileModalDisplayed] = useState(false);
  const [addFolderModalDisplayed, setAddFolderModalDisplayed] = useState(false);

  const [fileName, setFileName] = useState("");
  const [url, setUrl] = useState("");
  const [folderName, setFolderName] = useState("");

  const addFileRef = useRef<HTMLDivElement>(null);
  const addFolderRef = useRef<HTMLDivElement>(null);

  const folderNameInputRef = useRef<HTMLInputElement>(null);
  const fileNameInputRef = useRef<HTMLInputElement>(null);

  const folderNavigationPane = useRef<HTMLDivElement>(null);

  const [
    deleteConfirmationModalDisplayed,
    setDeleteConfirmationModalDisplayed,
  ] = useState(false);

  async function handleAddFile(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    try {
      const response = await fetch(backend + "upload", {
        mode: "cors",
        credentials: "include",
        body: JSON.stringify({
          name: fileName,
          url: url,
          folderId: currentFolder!.id,
        }),
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
      });

      switch (response.status) {
        case 400:
        case 403: {
          console.error(await response.json());
          break;
        }
        case 201: {
          getData();
          setAddFileModalDisplayed(false);
          setFileName("");
          setUrl("");
        }
      }
    } catch (e) {
      console.error(e);
    }
  }

  async function handleAddFolder(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    try {
      const response = await fetch(backend + "create", {
        mode: "cors",
        credentials: "include",
        body: JSON.stringify({
          parentId: currentFolder!.id,
          folderName,
        }),
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
      });

      switch (response.status) {
        case 201: {
          getData();
          setAddFolderModalDisplayed(false);
          setFolderName("");
          break;
        }
        default: {
          console.error(await response.json());
        }
      }
    } catch (e) {
      console.error(e);
    }
  }

  function handleMouseEnter() {
    addFileRef.current!.classList.remove("hidden");
    addFolderRef.current!.classList.remove("hidden");
  }

  function handleMouseLeave() {
    addFileRef.current!.classList.add("hidden");
    addFolderRef.current!.classList.add("hidden");
  }

  async function handleDelete() {
    const url =
      backend +
      (Object.hasOwn(itemToBeDeleted!, "url") ? `file` : `folder`) +
      `/${itemToBeDeleted!.id}`;
    try {
      const response = await fetch(url, {
        mode: "cors",
        credentials: "include",
        method: "DELETE",
      });

      switch (response.status) {
        case 204:
          getData();
          setDeleteConfirmationModalDisplayed(false);
          break;
        default:
          console.error(await response.json());
      }
    } catch (e) {
      console.error(e);
    }
  }

  const getData = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch(
        backend +
          (typeof currentFolderId === "string"
            ? "home"
            : `folder/${currentFolderId}`),
        {
          mode: "cors",
          credentials: "include",
        },
      );

      switch (response.status) {
        case 401:
          navigate("/begin");
          break;
        case 200: {
          setLoading(false);
          const jsonResponse = await response.json();
          setCurrentFolder(jsonResponse.currentFolder);
          setFolders(jsonResponse.folders);
          setFiles(jsonResponse.files);
          setParentList(jsonResponse.parentList);
          break;
        }
        default:
          setLoading(false);
          setError(response.status + " error!");
          console.error(response.status);
          break;
      }
    } catch (e) {
      console.error(e);
      setLoading(false);
      setError("Connection error");
    }

    setTimeout(() => {
      folderNavigationPane.current!.scrollBy({
        left: folderNavigationPane.current!.scrollWidth,
      });
    }, 0);
  }, [backend, currentFolderId, navigate]);

  useEffect(() => {
    getData();
  }, [getData]);

  if (loading) return <div>Loading...</div>;

  if (error) return <div>{error}</div>;

  return (
    <div className="">
      <div
        className="bg-zinc-900 w-full px-7 py-1 mb-5 text-base flex overflow-x-auto gap-1 scrollbar-thumb-zinc-700"
        ref={folderNavigationPane}
      >
        {parentList.map((parent) => (
          <div className="flex gap-1" key={parent.id}>
            <span
              className="underline underline-offset-2 cursor-pointer hover:no-underline"
              onClick={() => {
                setCurrentFolderId(parent.id);
              }}
            >
              {parent.name}
            </span>
            <span>/</span>
          </div>
        ))}
        <div>
          <span>{currentFolder?.name}</span>
        </div>
      </div>
      <div className="bg-zinc-900 w-full py-1 mb-5 flex items-center">
        <div
          className={
            currentFolder?.parentId
              ? "hover:bg-zinc-700 rounded-full p-1 cursor-pointer"
              : "rounded-full text-zinc-900 p-1"
          }
          onClick={() => {
            setCurrentFolderId(currentFolder!.parentId!);
          }}
        >
          <IoMdArrowBack className="text-xl" />
        </div>
        <span>Name</span>
      </div>
      <div>
        <div className="mb-10">
          {folders.map((folder) => (
            <div
              className="flex items-center gap-2 mb-4 pb-1 border-b border-zinc-600 "
              key={folder.id}
            >
              <CiFolderOn className="text-xl" />
              <div
                className="hover:cursor-pointer font-light hover:font-medium"
                onClick={() => setCurrentFolderId(folder.id)}
              >
                {folder.name}
              </div>
              <MdDeleteOutline
                className="text-red-500 hover:text-red-700 ml-auto cursor-pointer"
                onClick={() => {
                  setDeleteConfirmationModalDisplayed(true);
                  setItemToBeDeleted(folder);
                }}
              />
            </div>
          ))}
        </div>
        <div>
          {files.map((file) => (
            <div
              className="flex items-center gap-2 mb-4 pb-1 border-b border-zinc-600 "
              key={file.id}
            >
              <CiFileOn className="text-xl" />
              <a
                className="hover:cursor-pointer font-light hover:font-medium"
                href={file.url}
                target="_blank"
                rel="noopener noreferer"
              >
                {file.name}
              </a>
              <MdDeleteOutline
                className="text-red-500 hover:text-red-700 ml-auto cursor-pointer"
                onClick={() => {
                  setDeleteConfirmationModalDisplayed(true);
                  setItemToBeDeleted(file);
                }}
              />
            </div>
          ))}
        </div>

        {!folders.length && !files.length && (
          <div className="flex items-center justify-center">No Contents</div>
        )}
      </div>

      <div
        className="fixed bottom-10 right-10 text-2xl flex flex-col gap-4"
        onMouseEnter={() => handleMouseEnter()}
        onMouseLeave={() => handleMouseLeave()}
      >
        <div
          className="bg-blue-800 rounded-full flex gap-2 items-center justify-center p-3 hover:cursor-pointer text-zinc-950 hover:text-zinc-50"
          onClick={() => {
            setAddFileModalDisplayed(true);
            setTimeout(() => {
              fileNameInputRef.current!.focus();
            }, 0);
          }}
        >
          <AiOutlineFileAdd />
          <div className="hidden text-base" ref={addFileRef}>
            Add File
          </div>
        </div>
        <div
          className="bg-blue-800 rounded-full flex gap-2 items-center justify-center p-3 hover:cursor-pointer text-zinc-950 hover:text-zinc-50 "
          onClick={() => {
            setAddFolderModalDisplayed(true);
            setTimeout(() => {
              folderNameInputRef.current!.focus();
            }, 0);
          }}
        >
          <LuFolderPlus />
          <div className="hidden text-base" ref={addFolderRef}>
            Add Folder
          </div>
        </div>
      </div>

      {deleteConfirmationModalDisplayed && (
        <section className="h-screen w-screen absolute left-0 top-0 bg-zinc-800/80 flex flex-col items-center justify-center text-white font-light tracking-tight pb-40">
          <button
            className="absolute top-5 right-5 bg-zinc-900 rounded-full px-3 py-1 text-xl hover:opacity-80 cursor-pointer"
            onClick={() => setDeleteConfirmationModalDisplayed(false)}
          >
            X
          </button>
          <div className="bg-zinc-900 border border-zinc-400 p-3">
            <h3 className="text-xl mb-10 text-center">
              Delete {itemToBeDeleted!.name}?
            </h3>
            <div className="flex gap-2">
              <button
                className="bg-red-700 rounded-full cursor-pointer flex items-center justify-center px-4 py-1 hover:opacity-80 mr-auto"
                onClick={() => handleDelete()}
              >
                Delete
              </button>
              <button
                className="bg-zinc-800 rounded-full cursor-pointer flex items-center justify-center px-4 py-1 hover:opacity-80"
                onClick={() => setDeleteConfirmationModalDisplayed(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </section>
      )}

      {addFileModalDisplayed && (
        <section className="h-screen w-screen absolute left-0 top-0 bg-zinc-800/80 flex flex-col items-center justify-center text-white font-light tracking-tight pb-40">
          <button
            className="absolute top-5 right-5 bg-zinc-900 rounded-full px-3 py-1 text-xl hover:opacity-80 cursor-pointer"
            onClick={() => setAddFileModalDisplayed(false)}
          >
            X
          </button>
          <div className="bg-zinc-900 border border-zinc-400 p-3">
            <h3 className="text-xl mb-10 text-center">Add File</h3>
            <form className="text-base" onSubmit={(e) => handleAddFile(e)}>
              <div className="flex flex-col mb-5">
                <label htmlFor="name">Name</label>
                <input
                  className="border border-zinc-400 min-w-sm px-2 py-1 text-zinc-400"
                  type="text"
                  name="name"
                  id="name"
                  value={fileName}
                  onChange={(e) => setFileName(e.target.value)}
                  ref={fileNameInputRef}
                  required
                />
              </div>
              <div className="flex flex-col mb-5">
                <label htmlFor="url">Url</label>
                <input
                  className="border border-zinc-400 min-w-sm px-2 py-1 text-zinc-400"
                  type="url"
                  name="url"
                  id="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  required
                />
              </div>
              <div className="flex flex-col mb-5 items-center justify-center mt-10">
                <button
                  type="submit"
                  className="bg-blue-800 text-white cursor-pointer px-5 py-2 rounded-full text-lg hover:bg-blue-700"
                >
                  Add File
                </button>
              </div>
            </form>
          </div>
        </section>
      )}

      {addFolderModalDisplayed && (
        <section className="h-screen w-screen absolute left-0 top-0 bg-zinc-800/80 flex flex-col items-center justify-center text-white font-light tracking-tight pb-40">
          <button
            className="absolute top-5 right-5 bg-zinc-900 rounded-full px-3 py-1 text-xl hover:opacity-80 cursor-pointer"
            onClick={() => setAddFolderModalDisplayed(false)}
          >
            X
          </button>
          <div className="bg-zinc-900 border border-zinc-400 p-3">
            <h3 className="text-xl mb-10 text-center">Add Folder</h3>
            <form className="text-base" onSubmit={handleAddFolder}>
              <div className="flex flex-col mb-5">
                <label htmlFor="name">Name</label>
                <input
                  className="border border-zinc-400 min-w-sm px-2 py-1 text-zinc-400"
                  type="text"
                  name="name"
                  id="name"
                  value={folderName}
                  onChange={(e) => setFolderName(e.target.value)}
                  ref={folderNameInputRef}
                  required
                />
              </div>
              <div className="flex flex-col mb-5 items-center justify-center mt-10">
                <button
                  type="submit"
                  className="bg-blue-800 text-white cursor-pointer px-5 py-2 rounded-full text-lg hover:bg-blue-700"
                >
                  Add Folder
                </button>
              </div>
            </form>
          </div>
        </section>
      )}
    </div>
  );
}
