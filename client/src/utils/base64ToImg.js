function base64ToImage(base64) {
  if (!base64.startsWith("data:")) return "";

  const [header, data] = base64.split(",");
  const mimeMatch = header.match(/data:(.*);base64/);
  const mime = mimeMatch ? mimeMatch[1] : "image/png"; // default fallback

  const byteString = atob(data);
  const arrayBuffer = new ArrayBuffer(byteString.length);
  const uintArray = new Uint8Array(arrayBuffer);

  for (let i = 0; i < byteString.length; i++) {
    uintArray[i] = byteString.charCodeAt(i);
  }

  const blob = new Blob([arrayBuffer], { type: mime });
  return URL.createObjectURL(blob);
}

export default base64ToImage;
