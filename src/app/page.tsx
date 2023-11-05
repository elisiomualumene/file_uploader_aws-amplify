"use client";

import { ChangeEvent, FormEvent, useState } from "react";

type IDataResponseProps = {
  status: number;
  message: string;
  metadata: {
    delay: number;
  };
  file: {
    host: string;
    link: string;
  };
};

export default function Home() {
  const [uploadedData, setData] = useState<IDataResponseProps>();
  const [file, setFile] = useState<File | null>(null);
  const [disable, setDisable] = useState<boolean>(false);
  const [status, setStatus] = useState<
    "initial" | "uploading" | "success" | "fail"
  >("initial");

  const handleSubmited = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (file) {
      setStatus("uploading");
      setDisable(true);
      try {
        const content = new FormData();
        content.append("file", file);

        const resp = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/upload`, {
          method: "POST",
          body: content,
        });
        const data = await resp.text();
        setData(JSON.parse(data));

        setStatus("success");
        setDisable(false);
      } catch (err) {
        console.log(err);
        setStatus("fail");
      }
    }
  };

  return (
    <main className="bg-zinc-100 h-screen w-screen flex items-center justify-center">
      <form onSubmit={handleSubmited} encType="multipart/form-data">
        <section className="grid grid-cols-2 gap-6 justify-self-center bg-white w-[42rem]  h-[24rem] rounded-[4rem] p-12 shadow-lg">
          <div className="flex items-center justify-center w-full">
            <label
              htmlFor="file"
              className="flex flex-col items-center justify-center w-full h-full border-2 border-blue-300 border-dashed rounded-xl cursor-pointer hover:border-blue-800 transition ease-in-out delay-150]"
            >
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <svg
                  className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 20 16"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                  />
                </svg>
                <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                  <span className="font-semibold">Click to upload</span> or drag
                  and drop
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  SVG, PNG, JPG or GIF
                </p>
              </div>
              <input
                id="file"
                type="file"
                className="hidden"
                onChange={(e: ChangeEvent<HTMLInputElement>) => {
                  if (e.target.files) {
                    setFile(e.target.files[0]!);
                    setStatus("initial");
                  }
                }}
              />
            </label>
          </div>
          <div className="w-full flex flex-col justify-between">
            <div>
              <p className="font-bold text-lg">Uploaded file</p>
              <div>
                <p className="mt-8">{file?.name}</p>
                {file && (
                  <p className="text-sm text-zinc-200">
                    size: {(file?.size / (1024 * 1024)).toFixed(3)} MB
                  </p>
                )}
              </div>
            </div>

            <Result status={status} />

            {uploadedData && (
              <a
                target="_blank"
                href={uploadedData?.file?.link}
                className="text-blue-700"
              >
                link
              </a>
            )}

            <button
              type="submit"
              className="border border-blue-300 border-dashed text-blue-300 font-bold text-xl w-full rounded-lg hover:bg-blue-300 hover:text-white"
              disabled={disable}
            >
              Upload file
            </button>
          </div>
        </section>
      </form>
    </main>
  );
}

const Result = ({ status }: { status: string }) => {
  if (status === "success") {
    return <p>✅ File uploaded successfully!</p>;
  } else if (status === "fail") {
    return <p>❌ File upload failed!</p>;
  } else if (status === "uploading") {
    return <p>⏳ Uploading selected file...</p>;
  } else {
    return null;
  }
};
