import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import CreateRoom from "./pages/CreateRoom";
import Room from "./pages/Room";
import Play from "./pages/Play";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/create" element={<CreateRoom />} />
        <Route path="/room/:id" element={<Room />} />
        <Route path="/play/:id" element={<Play />} />
      </Routes>
    </Router>
  );
}

export default App;
