import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import socket from "../config/socket";
import Logo from "../assets/logo-w.png";
import { ArrowUpRight, ScanQrCode } from "lucide-react";
import { FaGithub } from "react-icons/fa";
import QRScanner from "./Scanner";
import Generator from "./Generator";
import { useRoomCode } from "../context/RoomCode.context.jsx";
import { useNavigate, useLocation } from "react-router-dom";

function NavBar() {
  const [showInfo, setShowInfo] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [scannedData, setScannedData] = useState("");
  const [enteredRoomCode, setEnteredRoomCode] = useState("");
  const [activeTab, setActiveTab] = useState("enter");
  const { roomCode, setRoomCode } = useRoomCode();

  const navigate = useNavigate();
  const location = useLocation();

  const receiveRoute = location.pathname.startsWith("/receive"); // check if it is recieve route

  const handleJoinRoom = () => {
    if (!enteredRoomCode) {
      toast.error("Please scan the QR or enter the room code.");
      return;
    }
    if (enteredRoomCode.length !== 8) {
      toast.error("Room Code must be 8 characters long.");
      return;
    }

    socket.emit("check-room", enteredRoomCode, (exists) => {
      if (!exists) {
        toast.error("Invalid join code."); // error if room code doesnt exist
        return;
      }
      socket.emit("join-room", enteredRoomCode); // join room if room code exists
      navigate(`/receive?join=${enteredRoomCode}`); // navigate to receive page
      setIsModalOpen(false);
    });
    setEnteredRoomCode("");
  };

  useEffect(() => {
    if (scannedData) {
      socket.emit("check-room", scannedData, (exists) => {
        if (!exists) {
          toast.error("Invalid join code."); // error if room code doesnt exist
          return;
        }
        socket.emit("join-room", scannedData); // join room if room code exists
        navigate(`/receive?join=${scannedData}`); // navigate to receive page
        setIsModalOpen(false);
      });
      setScannedData("");
    }
  }, [scannedData]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowInfo(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  const handleShareTabClick = () => {
    setActiveTab("share");
    socket.emit("join-room", roomCode);
  };

  return (
    <>
      <nav className="fixed flex items-center justify-between px-4 sm:px-10 md:px-20 h-16 sm:h-20 w-full bg-transparent z-50">
        {/* Logo */}
        <img
          src={Logo}
          alt="Logo"
          onClick={() => {
            navigate("/");
          }}
          className="h-8 sm:h-10 w-auto drop-shadow-2xl cursor-pointer"
        />

        {/* Desktop Nav Links */}
        <div className="hidden lg:flex items-center gap-4">
          {!receiveRoute && (
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center px-4 py-2 gap-1 bg-white rounded-md shadow-md cursor-pointer"
            >
              Enter or Share Code
            </button>
          )}
          <a
            href="#"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center px-4 py-2 gap-1 bg-white rounded-md shadow-md"
          >
            Source <ArrowUpRight className="h-4 w-4" />
          </a>
        </div>

        {/* Smallscreen Icons */}

        <div className="lg:hidden flex items-center gap-3">
          {!receiveRoute && (
            <button
              type="button"
              onClick={() => (setIsModalOpen(true), setShowInfo(false))}
              className="p-1 bg-white rounded-md shadow-md flex flex-col items-center relative"
            >
              <ScanQrCode className="h-5 w-5" />
              <AnimatePresence>
                {showInfo && (
                  <motion.div
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.6 }}
                    className="absolute top-full mt-4 w-65 text-white text-center"
                  >
                    <div className="absolute -top-1 left-0 right-18 bg-black rounded-md px-3 py-2 text-sm shadow-md">
                      Enter or share the code
                    </div>
                    <div className="absolute -top-3 left-0 right-0 mx-auto w-3 h-3 bg-black rotate-45 transform translate-y-1 z-[-1]" />
                  </motion.div>
                )}
              </AnimatePresence>
            </button>
          )}
          <a
            href="https://github.com/aprimr/FilePanda"
            target="_blank"
            rel="noopener noreferrer"
            className="p-1 bg-white rounded-md shadow-md"
          >
            <FaGithub className="h-5 w-5" />
          </a>
        </div>
      </nav>

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-lg shadow-xl p-6 w-[90%] max-w-md max-h-[90vh] overflow-y-auto"
            >
              <div className="flex justify-center border-b border-gray-300 mb-4">
                <button
                  onClick={() => setActiveTab("enter")}
                  className={`px-5 py-2 -mb-[1px] ${
                    activeTab === "enter"
                      ? "border-b-2 border-black text-black"
                      : "text-gray-500 cursor-pointer"
                  }`}
                >
                  Enter Code
                </button>
                <button
                  onClick={handleShareTabClick}
                  className={`px-5 py-2 -mb-[1px] ${
                    activeTab === "share"
                      ? "border-b-2 border-black text-black"
                      : "text-gray-500 cursor-pointer"
                  }`}
                >
                  Share Code
                </button>
              </div>

              {activeTab === "enter" && (
                <div>
                  <p className="block text-gray-700 text-sm font-bold mb-2">
                    Scan a QR code
                  </p>
                  <div className="border border-gray-300 rounded-md p-4 mb-3 bg-gray-100">
                    <QRScanner onScanResult={setScannedData} />
                  </div>
                  <div className="mb-3">
                    <label
                      htmlFor="joinCode"
                      className="block text-gray-700 text-sm font-bold mb-2"
                    >
                      Or enter Join Code Manually
                    </label>
                    <input
                      type="text"
                      id="joinCode"
                      placeholder="Enter Code Here"
                      value={enteredRoomCode}
                      onChange={(e) =>
                        setEnteredRoomCode(e.target.value.toUpperCase())
                      }
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    />
                  </div>
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => setIsModalOpen(false)}
                      className="px-4 py-2 rounded-md bg-gray-200 text-gray-800 cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleJoinRoom}
                      className="px-4 py-2 rounded-md bg-black text-white cursor-pointer"
                    >
                      JOIN
                    </button>
                  </div>
                </div>
              )}

              {activeTab === "share" && (
                <div>
                  <p className="block text-gray-700 text-sm font-bold mb-2">
                    Scan this QR code
                  </p>
                  <div className="border border-gray-300 rounded-md p-4 mb-3 bg-white flex justify-center items-center">
                    <div className="text-center">
                      <Generator value={roomCode} />
                    </div>
                  </div>
                  <p className="block text-gray-700 text-sm font-bold mb-2">
                    Or share this join code
                  </p>
                  <div className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight tracking-widest focus:outline-none focus:shadow-outline mb-3 text-center font-mono">
                    {roomCode}
                  </div>
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => setIsModalOpen(false)}
                      className="px-4 py-2 rounded-md bg-gray-200 text-gray-800 cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default NavBar;
