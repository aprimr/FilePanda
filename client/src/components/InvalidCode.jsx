import { AlertTriangle } from "lucide-react";

export default function InvalidCode({ code }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-6 text-center bg-red-50 border border-red-200 rounded-xl shadow-sm">
      <AlertTriangle size={40} className="text-red-500 mb-4" />
      <h2 className="text-lg font-semibold text-red-600 mb-2">Invalid Code</h2>
      <p className="text-sm text-red-500">
        The code{" "}
        <span className="font-mono bg-red-100 px-2 py-0.5 rounded">{code}</span>{" "}
        is not valid or has expired.
      </p>
    </div>
  );
}
