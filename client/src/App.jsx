import NavBar from "./components/NavBar";
import Home from "./pages/Home";
import { Toaster } from "sonner";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Receive from "./pages/Receive";
import Loading from "./components/Loading";

function App() {
  return (
    <>
      <Router>
        <NavBar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/receive/:code" element={<Receive />} />
          <Route path="/test" element={<Loading />} />
        </Routes>
        <Toaster />
      </Router>
    </>
  );
}

export default App;
