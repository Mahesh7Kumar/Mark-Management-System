import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/Home";
import ClassPage from "./pages/Classpage.tsx";
import StudentPage from "./pages/Student.tsx";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/class/:classId" element={<ClassPage />} />
        <Route path="/class/:classId/students/student/:studentId" element={<StudentPage />} />
      </Routes>
    </BrowserRouter>
  );
}
