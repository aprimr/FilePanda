import { useState } from "react";
import { motion } from "framer-motion";
import { UploadCloud, Loader2, X } from "lucide-react";

export default function Home() {
  const [isDragging, setIsDragging] = useState(false);

  const renderEmptySlot = () => (
    <div className="relative w-18 h-18 sm:w-24 sm:h-24 rounded-md overflow-hidden border-2 border-white/70 border-dotted flex items-center justify-center bg-transparent z-100 cursor-default">
      <span className="text-white/80 text-xs sm:text-base">Preview</span>
    </div>
  );

  return (
    <section className="w-screen h-[100svh] bg-gradient-to-tl from-blue-500 to-blue-600 text-slate-900 flex flex-col justify-between">
      <form
        className="w-full h-full border sm:border-2 rounded-xs border-dashed border-white/80 flex flex-col justify-between"
        onDragEnter={() => setIsDragging(true)}
        onDragLeave={() => setIsDragging(false)}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => e.preventDefault()}
      >
        <input
          type="file"
          accept="image/png, image/jpeg, image/jpg, application/pdf"
          multiple
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
          onChange={() => {}}
        />

        <div className="flex-1 mx-auto p-8 flex flex-col items-center justify-center transition-colors duration-300">
          <motion.div
            initial={{ scale: 1 }}
            animate={{ scale: isDragging ? 1.05 : 1 }}
            transition={{ type: "spring", stiffness: 300 }}
            className="flex flex-col items-center text-center space-y-2 sm:space-y-3 pt-12"
          >
            <UploadCloud className="w-16 h-16 text-white mb-2 sm:mb-3" />
            <h1 className="text-white text-3xl sm:text-4xl font-semibold">
              Drop it like it's hot
            </h1>
            <h2 className="text-white text-sm sm:text-base">
              No tracking, no logging — Private & Safe
            </h2>
            <h2 className="text-white text-xs sm:text-sm">
              PNG, JPG, JPEG or PDF — Max 50KB
            </h2>
          </motion.div>
        </div>

        <div className="w-auto bg-transparent py-4 px-4 flex flex-col items-center">
          <h3 className="text-white text-lg mb-4 text-center cursor-default z-1">
            Upload Preview
          </h3>
          <div className="flex gap-2 flex-wrap justify-center sm:flex-row">
            {renderEmptySlot()}
            {renderEmptySlot()}
            {renderEmptySlot()}
            {renderEmptySlot()}
          </div>
        </div>
      </form>
    </section>
  );
}
