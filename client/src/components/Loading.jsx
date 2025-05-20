import React, { useState, useEffect } from "react";
import { ArrowLeft, ArrowDownToLine } from "lucide-react";

export default function Receive() {
  const [files, setFiles] = useState([]);

  useEffect(() => {
    const dummyFiles = [
      { name: "cat.jpg", file: "https://placekitten.com/300/300" },
      { name: "dog.jpg", file: "https://placedog.net/300/300" },
      { name: "mountain.jpg", file: "https://picsum.photos/id/1015/300/300" },
    ];
    setFiles(dummyFiles);
  }, []);

  return (
    <section className="min-h-[100svh] bg-white text-black flex flex-col items-center justify-center px-4 py-8">
      <div className="bg-white border border-black rounded-md w-full max-w-4xl p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => alert("Go back clicked!")}
            className="hover:opacity-60 cursor-pointer"
            aria-label="Go back"
          >
            <ArrowLeft size={24} />
          </button>
          <h2 className="text-lg sm:text-xl font-semibold">
            Files shared with code: <span className="font-bold">DUMMY123</span>
          </h2>
        </div>

        {/* Flex container for files */}
        <div className="flex flex-wrap justify-center gap-4">
          {files.map((file, idx) => (
            <div
              key={idx}
              className="flex flex-col items-center"
              style={{
                flexBasis: "calc(50% - 1rem)", // two per row with gap
                maxWidth: "140px",
              }}
            >
              <div
                className="relative border border-black rounded-lg overflow-hidden bg-gray-100"
                style={{ width: 120, height: 120 }}
              >
                <a
                  href={file.file}
                  download={file.name || `filepanda-shared-${idx}`}
                  className="absolute top-2 right-2 z-10 bg-white p-1 rounded-full shadow hover:bg-gray-200 transition cursor-pointer"
                  title="Download"
                >
                  <ArrowDownToLine size={18} className="text-black" />
                </a>

                <img
                  src={file.file}
                  alt={file.name}
                  className="object-cover w-full h-full"
                  loading="lazy"
                />
              </div>

              <span
                className="mt-2 text-sm text-center font-medium truncate w-full"
                title={file.name}
              >
                {file.name}
              </span>
            </div>
          ))}
        </div>

        <p className="text-center text-xs pt-2 text-gray-500">
          100% private — No tracking, no logging ⚡
        </p>
      </div>
    </section>
  );
}
