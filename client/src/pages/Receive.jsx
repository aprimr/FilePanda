import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, FileText, Image, ArrowDownToLine } from "lucide-react";
import InvalidCode from "../components/InvalidCode";

export default function Receive() {
  const { code } = useParams();
  const navigate = useNavigate();

  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isValidCode, setIsValidCode] = useState(true);

  // Simulated fetch
  useEffect(() => {
    setTimeout(() => {
      if (code === "invalid" || code.length < 4) {
        setIsValidCode(false);
        setFiles([]);
      } else {
        setIsValidCode(true);
        setFiles([
          { name: "Report.pdf", type: "pdf", url: "/docs/sample.pdf" },
        ]);
      }
      setLoading(false);
    }, 1000);
  }, [code]);

  // Always render 3 slots
  const slots = Array.from({ length: 3 }, (_, i) => files[i] || null);

  return (
    <section className="min-h-screen bg-white text-black flex items-center justify-center px-4 py-8">
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
        {loading ? (
          <p className="text-center text-sm">Loading files...</p>
        ) : !isValidCode ? (
          <InvalidCode code={code} />
        ) : (
          <>
            <div className="flex flex-col gap-4">
              {slots.map((file, idx) =>
                file ? (
                  <div
                    key={idx}
                    className="flex items-center justify-between border border-black rounded-lg p-4 bg-white h-[72px]"
                  >
                    <div className="flex items-center gap-3">
                      <Image className="text-black" />
                      <span className="text-sm font-medium truncate max-w-[140px]">
                        {file.name}
                      </span>
                    </div>
                    <a
                      href={file.url}
                      download
                      className="hover:underline"
                      title="Download"
                    >
                      <ArrowDownToLine size={20} />
                    </a>
                  </div>
                ) : (
                  <div
                    key={idx}
                    className="flex items-center justify-center border-2 border-dashed border-black rounded-lg p-4 h-[72px]"
                  >
                    <span className="text-xs italic">Empty slot</span>
                  </div>
                )
              )}
            </div>

            <p className="text-center text-xs pt-2">
              Files shared with FilePanda are private and secure.
            </p>
          </>
        )}
      </div>
    </section>
  );
}
