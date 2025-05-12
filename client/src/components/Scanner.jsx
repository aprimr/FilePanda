import { Scanner } from "@yudiel/react-qr-scanner";

const QRScanner = () => {
  const handleScan = (result) => {
    return result["0"].rawValue;
  };
  return <Scanner onScan={(result) => handleScan(result)} />;
};

export default QRScanner;
