import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import HomePage from "./pages/HomePage";
import AuthPage from "./pages/AuthPage";
import Start from "./pages/Start";
import Language from "./pages/Language";
import Path from "./pages/Path";
import Lecture from "./pages/Lecture";
import Dashboard from "./pages/Dashboard";
import Game from "./pages/Game"
import { LessonsProvider } from './context/LessonsContext';

function App() {
  return (
    <LessonsProvider>
        <Router>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/start" element={<Start />} />
            <Route path="/language" element={<Language/>} />
            <Route path="/path" element={<Path />} />
            <Route path="/lecture/:id" element={<Lecture />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/game" element={<Game />} />
          </Routes>
      </Router>
    </LessonsProvider>

  );
}

export default App;
