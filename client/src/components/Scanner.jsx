// QRScanner.js
import { useState } from "react";
import { Scanner } from "@yudiel/react-qr-scanner";

const QRScanner = ({ onScanResult }) => {
  const [data, setData] = useState(null);

  const handleScan = (result) => {
    if (result && result[0]) {
      const value = result[0].rawValue;
      setData(value);
      if (onScanResult) onScanResult(value);
    }
  };

  return <Scanner onScan={handleScan} />;
};

export default QRScanner;
