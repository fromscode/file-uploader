import type React from "react";
import { useRef, useState } from "react";

export default function FileInsert() {
  const [fileName, setFileName] = useState("");

  const fileinputref = useRef<HTMLInputElement>(null);

  function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    const fileList = fileinputref.current?.files;
    if (!fileList || !fileList.length) return;
    const file = fileList[0];

    console.log({
      name: fileName ? fileName : file.name,
      file,
    });
  }
  return (
    <form
      action="/hello"
      className="bg-white flex flex-col justify-center gap-2"
      encType="multipart/form-data"
      onSubmit={handleSubmit}
    >
      <input
        type="file"
        name="file"
        id="file"
        accept="text/*, image/*"
        ref={fileinputref}
      />
      <label htmlFor="name">File Name (Optional)</label>
      <input
        type="text"
        id="name"
        name="name"
        value={fileName}
        onChange={(e) => setFileName(e.target.value)}
      />
      <button type="submit">Submit</button>
    </form>
  );
}
