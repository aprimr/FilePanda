import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { UploadCloud, X } from "lucide-react";
import convertToBase64 from "../utils/convertToBase64";
import socket from "../config/socket";
import { useRoomCode } from "../context/RoomCode.context.jsx";
import generateRoomCode from "../utils/generateRoomCode";

export default function Home() {
  const [isDragging, setIsDragging] = useState(false);
  const [files, setFiles] = useState([null, null, null]);
  const [fileFullScreenPreview, setFileFullScreenPreview] = useState(null);
  const { roomCode, setRoomCode } = useRoomCode();

  const allFilled = files.every((f) => f !== null);

  useEffect(() => {
    const newRoomCode = generateRoomCode();
    setRoomCode(newRoomCode);

    socket.on("connect", () => {
      socket.emit("create-room", newRoomCode);
    });
  }, []);

  useEffect(() => {
    socket.emit("send-files", {
      roomCode,
      files: [
        { id: 1, file: files[0] },
        { id: 2, file: files[1] },
        { id: 3, file: files[2] },
      ],
    });
  }, [files[0], files[1], files[2]]);

  const addFile = async (file) => {
    if (!file) return;

    const base64 = await convertToBase64(file);
    setFiles((prev) => {
      const newFiles = [...prev];
      const emptyIndex = newFiles.findIndex((f) => f === null);
      if (emptyIndex !== -1) {
        newFiles[emptyIndex] = base64;
      }
      return newFiles;
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    addFile(file);
    e.target.value = null;
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFiles = e.dataTransfer.files;
    for (let i = 0; i < droppedFiles.length; i++) {
      addFile(droppedFiles[i]);
    }
  };

  const removeFileAtIndex = (index) => {
    setFiles((prev) => {
      const newFiles = [...prev];
      newFiles[index] = null;
      return newFiles;
    });
  };

  const renderPreviewSlot = (file, index) => (
    <div key={index} className="relative w-18 h-18 sm:w-24 sm:h-24">
      {file && (
        <button
          onClick={() => removeFileAtIndex(index)}
          className="absolute -top-2 -right-2 bg-black text-white rounded-full p-1 shadow-md z-10"
          title="Remove"
          type="button"
        >
          <X size={16} />
        </button>
      )}

      <div
        onClick={() => file && setFileFullScreenPreview(file)}
        className="w-full h-full rounded-md overflow-hidden border-2 border-black/70 border-dotted flex items-center justify-center bg-transparent cursor-pointer"
      >
        {file ? (
          <img
            src={file}
            alt="Preview"
            className="w-full h-full object-contain"
          />
        ) : (
          <span className="text-black/80 text-xs sm:text-base">Preview</span>
        )}
      </div>
    </div>
  );

  return (
    <section className="w-screen h-[100svh] bg-white text-slate-900 flex flex-col justify-between">
      <form
        className={`relative w-full h-full border sm:border-2 rounded-xs border-dashed border-black/80 flex flex-col justify-between
          ${isDragging ? "bg-black/10" : "bg-transparent"}
        `}
        onDragEnter={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={(e) => {
          e.preventDefault();
          if (e.currentTarget === e.target) setIsDragging(false);
        }}
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
      >
        <input
          type="file"
          id="fileInput"
          accept="image/png, image/jpeg, image/jpg"
          className="hidden"
          disabled={allFilled}
          onChange={handleFileChange}
          multiple={false}
        />

        <label
          htmlFor="fileInput"
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
          onClick={() => {
            allFilled && toast.info("Max 3 files are allowed");
          }}
        />

        <div className="flex-1 mt-10 mx-auto px-4 py-8 flex flex-col items-center justify-center gap-3 text-center transition-colors duration-300 pointer-events-none">
          <motion.div
            initial={{ scale: 1, rotate: 0 }}
            animate={{
              scale: isDragging ? 1.2 : 1,
              rotate: isDragging ? 10 : 0,
            }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <UploadCloud className="w-20 h-20 text-black transition-all duration-300 drop-shadow-md" />
          </motion.div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-black -mt-2">
            Drop it like it's hot
          </h1>

          <p className="text-black/70 text-base sm:text-xl font font-mono">
            Drop files in this window or click anywhere on the screen
          </p>

          <p className="text-black/60 text-xs sm:text-sm italic">
            PNG, JPG, JPEG — Max 3 files
          </p>
        </div>

        <div className="w-auto bg-transparent py-4 px-4 flex flex-col items-center pointer-events-auto">
          <h3 className="text-black text-lg mb-4 text-center cursor-default z-10">
            Upload Preview
          </h3>
          <div className="flex gap-4 flex-wrap justify-center sm:flex-row z-10">
            {files.map((file, i) => renderPreviewSlot(file, i))}
          </div>
        </div>
      </form>

      {/* Fullscreen preview */}
      {fileFullScreenPreview && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50">
          <button
            onClick={() => setFileFullScreenPreview(null)}
            className="absolute top-4 right-4 bg-white text-black p-2 rounded-full shadow"
            title="Close"
          >
            <X size={20} />
          </button>
          <img
            src={fileFullScreenPreview}
            alt="Fullscreen Preview"
            className="w-96 h-auto px-4 sm:p-0 sm:max-w-screen-md sm:max-h-screen rounded-md shadow-lg"
          />
        </div>
      )}
    </section>
  );
}
