import Home from "./Home";
import Navbar from "./navbar";
import About from "./section-about/About";
import Contact from "./section-about/Contact";
import Map from "./section-demo/Map";
import Dashboard from "./section-demo/Dashboard";
import Documents from "./section-documents/Docs";
import Documentation from "./section-resources/Documentation";
import Learning from "./section-resources/Learning";
import Journal from "./section-resources/Journal";
import Login from "./section-demo/Login";

import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

function App() {
  return (
    <div>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/map" element={<Map />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/documents" element={<Documents />} />
          <Route path="/documentation" element={<Documentation />} />
          <Route path="/learning" element={<Learning />} />
          <Route path="/journal" element={<Journal />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
