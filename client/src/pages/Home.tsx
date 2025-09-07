import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function HomePage() {
  const [selectedClass, setSelectedClass] = useState<number | null>(null);
  const navigate = useNavigate();

  const classes = [10, 11, 12];

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <div className="w-64 bg-gray-900 text-white p-6 flex flex-col gap-4">
        <h2 className="text-xl font-bold mb-6">Classes</h2>
        {classes.map((cls) => (
          <button
            key={cls}
            className={`text-left p-2 rounded hover:bg-gray-700 transition ${
              selectedClass === cls ? "bg-gray-700" : ""
            }`}
            onClick={() => {
              setSelectedClass(cls);
              navigate(`/class/${cls}`);
            }}
          >
            {cls}th Standard
          </button>
        ))}
      </div>

      {/* Main content */}
      <div className="flex-1 p-8 bg-gray-800 flex flex-col items-center justify-center">
        {!selectedClass && (
          <div className="text-center">
            <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-blue-500 mb-4">
              Welcome to the Student Mark Management System
            </h1>
            <p className="text-lg text-gray-400">
              Choose any of the classes to view their dashboard.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
