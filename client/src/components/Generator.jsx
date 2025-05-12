import QRCode from "react-qr-code";

function Generator({ value }) {
  return (
    <div>
      <QRCode value={value} bgColor="#fff" />
    </div>
  );
}

export default Generator;
