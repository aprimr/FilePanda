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

  useEffect(() => {
    // Simulated fetch
    setTimeout(() => {
      if (code === "invalid" || code.length < 4) {
        setIsValidCode(false);
        setFiles([]);
      } else {
        setIsValidCode(true);
        setFiles([
          { name: "Report.pdf", type: "pdf", url: "/docs/sample.pdf" },
          { name: "Screenshot.jpg", type: "image", url: "/images/sample.jpg" },
        ]);
      }
      setLoading(false);
    }, 1000);
  }, [code]);

  return (
    <section className="min-h-screen bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center px-4 py-8">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl p-8 space-y-6">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/")}
            className="text-gray-600 hover:text-black"
          >
            <ArrowLeft size={24} />
          </button>
          <h2 className="text-xl font-semibold text-gray-800">
            Files shared with code:{" "}
            <span className="text-blue-600">{code}</span>
          </h2>
        </div>

        {loading ? (
          <p className="text-center text-gray-500 text-sm">Loading files...</p>
        ) : !isValidCode ? (
          <InvalidCode code={code} />
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {files.map((file, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between border border-gray-200 rounded-lg p-4 bg-gray-50 shadow-sm"
                >
                  <div className="flex items-center gap-3">
                    {file.type === "pdf" ? (
                      <FileText className="text-red-500" />
                    ) : (
                      <Image className="text-blue-500" />
                    )}
                    <span className="text-gray-800 text-sm font-medium truncate max-w-[200px]">
                      {file.name}
                    </span>
                  </div>
                  <a
                    href={file.url}
                    download
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <ArrowDownToLine size={20} />
                  </a>
                </div>
              ))}
            </div>
            <p className="text-center text-xs text-gray-500 pt-2">
              Files shared with FilePanda are private and secure.
            </p>
          </>
        )}
      </div>
    </section>
  );
}
