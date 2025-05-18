import { Loader2 } from "lucide-react";
import Logo from "../assets/logo-w.png";

export default function Loading() {
  return (
    <div className="h-[100svh] w-full flex flex-col justify-center items-center relative bg-white px-4">
      <Loader2 className="animate-spin text-black h-20 w-20 sm:h-28 sm:w-28" />

      {/* Logo image fixed at bottom center */}
      <img
        src={Logo}
        alt="Logo"
        className="absolute bottom-6 left-1/2 transform -translate-x-1/2 h-5 sm:h-6"
      />
    </div>
  );
}
