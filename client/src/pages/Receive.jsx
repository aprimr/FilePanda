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
      console.log(files);
    });

    return () => {
      socket.off("receive-files");
    };
  }, []);

  // Ensure 3 slots, filling empty ones with null
  const slots = [...files];
  while (slots.length < 3) slots.push(null);

  return (
    <section className="min-h-[100svh] bg-white text-black flex items-center justify-center px-4 py-8">
      <div className="bg-white border border-black rounded-md w-full max-w-4xl p-8 space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/")}
            className="hover:opacity-60 cursor-pointer"
          >
            <ArrowLeft size={24} />
          </button>
          <h2 className="text-xl font-semibold">
            Files shared with code: <span className="font-bold">{code}</span>
          </h2>
        </div>

        {/* Main content */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {slots.map((file, idx) =>
            file?.file ? (
              <div
                key={idx}
                className="flex flex-col items-center w-full max-w-[160px] mx-auto"
              >
                {/* Image box */}
                <div className="relative w-full aspect-square border border-black rounded-lg overflow-hidden bg-gray-100">
                  {/* Download button */}
                  <a
                    href={
                      typeof file.file === "string"
                        ? file.file
                        : URL.createObjectURL(file.file)
                    }
                    download={`filepanda-shared-${idx}`}
                    className="absolute top-2 right-2 z-10 bg-white p-1 rounded-full shadow hover:bg-gray-200 transition cursor-pointer"
                    title="Download"
                  >
                    <ArrowDownToLine size={18} className="text-black" />
                  </a>

                  {/* Image */}
                  <img
                    src={
                      typeof file.file === "string"
                        ? file.file
                        : URL.createObjectURL(file.file)
                    }
                    alt={file.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Filename */}
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
                className="flex flex-col items-center justify-center border-2 border-dashed border-black rounded-lg w-full aspect-square max-w-[160px] mx-auto bg-white"
              >
                <span className="text-xs italic text-gray-500">Empty slot</span>
              </div>
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
