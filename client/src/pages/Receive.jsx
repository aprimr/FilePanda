import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ArrowLeft, ArrowDownToLine } from "lucide-react";
import socket from "../config/socket";

export default function Receive() {
  const [searchParams] = useSearchParams();
  const code = searchParams.get("join");
  const navigate = useNavigate();

  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    socket.emit("check-room", code, (exists) => {
      if (!exists) {
        toast.error("Invalid join code.");
        navigate("/");
      }
    });

    socket.on("receive-files", (files) => {
      setFiles(files);
      setLoading(false);
    });

    return () => {
      socket.off("receive-files");
    };
  }, [code, navigate]);

  const slots = [...files];

  return (
    <section className="min-h-[100svh] bg-white text-black flex flex-col items-center justify-center px-4 py-8">
      <div className="bg-white border sm:border-black rounded-md w-full max-w-4xl p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/")}
            className="hover:opacity-60 cursor-pointer"
            aria-label="Go back"
          >
            <ArrowLeft size={24} />
          </button>
          <h2 className="text-lg sm:text-xl font-semibold">
            Files shared with code: <span className="font-bold">{code}</span>
          </h2>
        </div>

        {/* Files container */}
        <div className="flex flex-wrap justify-center gap-4">
          {loading ? (
            <p>Loading files...</p>
          ) : slots.length === 0 ? (
            <p>No files received yet.</p>
          ) : (
            slots.map((file, idx) =>
              file?.file ? (
                <div
                  key={idx}
                  className="flex flex-col items-center"
                  style={{
                    flexBasis: "calc(50% - 1rem)", // 2 per row with gap
                    maxWidth: "140px",
                  }}
                >
                  <div
                    className="relative border border-black rounded-lg overflow-hidden bg-gray-100"
                    style={{ width: 120, height: 120 }}
                  >
                    <a
                      href={
                        typeof file.file === "string"
                          ? file.file
                          : URL.createObjectURL(file.file)
                      }
                      download={file.name || `filepanda-shared-${idx}`}
                      className="absolute top-2 right-2 z-10 bg-white p-1 rounded-full shadow hover:bg-gray-200 transition cursor-pointer"
                      title="Download"
                    >
                      <ArrowDownToLine size={18} className="text-black" />
                    </a>

                    <img
                      src={
                        typeof file.file === "string"
                          ? file.file
                          : URL.createObjectURL(file.file)
                      }
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
              ) : (
                <div
                  key={idx}
                  className="flex flex-col items-center justify-center border-2 border-dashed border-black rounded-lg w-full"
                  style={{
                    flexBasis: "calc(50% - 1rem)",
                    maxWidth: "140px",
                    height: 120,
                  }}
                >
                  <span className="text-xs italic text-gray-500">
                    Empty slot
                  </span>
                </div>
              )
            )
          )}
        </div>

        <p className="text-center text-xs pt-2 text-gray-500">
          100% private — No tracking, no logging ⚡
        </p>
      </div>
    </section>
  );
}
