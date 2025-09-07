import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import type { Student } from "@/types";
import { fetchStudentById, fetchStudents, fetchComments, addComment } from "../api.ts";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function StudentPage() {
  const { classId, studentId } = useParams();
  const navigate = useNavigate();
  const classNum = Number(classId);

  const [student, setStudent] = useState<Student | null>(null);
  const [classStudents, setClassStudents] = useState<Student[]>([]);
  const [compareList, setCompareList] = useState<Student[]>([]);
  const [comment, setComment] = useState<string>("");
  const [savedComments, setSavedComments] = useState<{ students: string; comment: string }[]>([]);

  // Fetch student and class students
  useEffect(() => {
  const fetchStudent = async () => {
    if (!studentId) return;
    try {
      const data = await fetchStudentById(Number(studentId));
      setStudent(data);
    } catch (err) {
      console.error("Failed to fetch student:", err);
    }
  };

  const fetchClassStudentsData = async () => {
    if (!classNum) return;
    try {
      const data = await fetchStudents(classNum);
      setClassStudents(data.filter((s: Student) => s.id !== Number(studentId)));
    } catch (err) {
      console.error("Failed to fetch class students:", err);
    }
  };

  fetchStudent();
  fetchClassStudentsData();
}, [studentId, classNum]);


  // Fetch saved comments from backend
  useEffect(() => {
    const loadSavedComments = async () => {
      if (!student) return;

      try {
        const commentsData = await fetchComments([student.id]);
        const mappedComments = commentsData.map((c: any) => ({
          students: c.student_ids
            .map((id: number) => {
              if (id === student.id) return student.name;
              const compareStudent = classStudents.find((s) => s.id === id);
              return compareStudent ? compareStudent.name : "";
            })
            .filter(Boolean)
            .join(" | "),
          comment: c.comment,
        }));
        setSavedComments(mappedComments);
      } catch (err) {
        console.error("Failed to load comments:", err);
      }
    };

    loadSavedComments();
  }, [student, classStudents]);

  if (!student) return <p className="text-red-500">Student not found.</p>;

  const addToCompare = (s: Student) => {
    if (!compareList.find((c) => c.id === s.id)) {
      setCompareList([...compareList, s]);
    }
  };

  const chartData = {
    labels: ["Physics", "Chemistry", "English", "Tamil"],
    datasets: [
      {
        data: [student.physics, student.chemistry, student.english, student.tamil],
        backgroundColor: ["#6366F1", "#22D3EE", "#FACC15", "#F43F5E"],
        borderColor: "#1F2937",
        borderWidth: 2,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { labels: { color: "white" } } },
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      {/* Back Button */}
      <Button
        className="mb-6 bg-blue-600 hover:bg-blue-700 text-white"
        onClick={() => navigate(`/class/${classNum}`)}
      >
        ← Back 
      </Button>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Student Marks */}
        <Card className="p-6 bg-gray-800 border border-gray-700 shadow-lg text-white">
          <h1 className="text-2xl font-bold mb-4">{student.name} - Marks</h1>
          <table className="w-full border border-gray-700 rounded-lg overflow-hidden text-white">
            <tbody className="divide-y divide-gray-700">
              <tr><td className="p-3">Physics</td><td className="p-3 text-right">{student.physics}</td></tr>
              <tr><td className="p-3">Chemistry</td><td className="p-3 text-right">{student.chemistry}</td></tr>
              <tr><td className="p-3">English</td><td className="p-3 text-right">{student.english}</td></tr>
              <tr><td className="p-3">Tamil</td><td className="p-3 text-right">{student.tamil}</td></tr>
            </tbody>
          </table>
        </Card>

        {/* Compare & Comment Dialog */}
        <Card className="p-6 bg-gray-800 border border-gray-700 shadow-lg text-white flex flex-col">
          <h2 className="text-xl font-semibold mb-4">Compare Student Marks</h2>
          <Dialog>
            <DialogTrigger asChild>
              <Button className="w-full py-4 text-lg font-bold bg-purple-600 hover:bg-purple-700 text-white">
                Compare
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-5xl bg-gray-900 text-white">
              <DialogHeader>
                <DialogTitle className="text-white">Select students to compare</DialogTitle>
              </DialogHeader>

              {/* Student Selection */}
              <div className="flex flex-wrap gap-2 mb-4">
                {classStudents.map((s) => (
                  <Button
                    key={s.id}
                    variant="outline"
                    onClick={() => addToCompare(s)}
                    className="text-black border-gray-600 hover:bg-gray-700"
                  >
                    + {s.name}
                  </Button>
                ))}
              </div>

              {/* Comparison Table */}
              {compareList.length > 0 && (
                <div className="overflow-x-auto mb-4">
                  <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${compareList.length + 1}, minmax(200px, 1fr))` }}>
                    {/* Base Student */}
                    <Card className="p-4 bg-gray-800 border border-gray-700 text-white">
                      <h3 className="font-bold mb-2">{student.name}</h3>
                      <p>Physics: {student.physics}</p>
                      <p>Chemistry: {student.chemistry}</p>
                      <p>English: {student.english}</p>
                      <p>Tamil: {student.tamil}</p>
                    </Card>

                    {/* Compared Students */}
                    {compareList.map((s) => (
                      <Card key={s.id} className="p-4 bg-gray-800 border border-gray-700 text-white overflow-hidden">
                        <h3 className="font-bold mb-2">{s.name}</h3>
                        <p>Physics: {s.physics}</p>
                        <p>Chemistry: {s.chemistry}</p>
                        <p>English: {s.english}</p>
                        <p>Tamil: {s.tamil}</p>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {/* Comment Box */}
              {compareList.length > 0 && (
                <div className="mt-4">
                  <h3 className="font-semibold mb-2">Add Comment</h3>
                  <Textarea
                    placeholder="Write your comment about this comparison..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="mb-2 bg-gray-800 text-white border-gray-700"
                  />
                  <Button
                    onClick={async () => {
                      if (!comment) return;

                      try {
                        const studentIds = [student.id, ...compareList.map((s) => s.id)];
                        await addComment(studentIds, comment);

                        const updatedComments = await fetchComments(studentIds);
                        const mappedComments = updatedComments.map((c: any) => ({
                          students: c.student_ids
                            .map((id: number) => {
                              if (id === student.id) return student.name;
                              const compareStudent = classStudents.find((s) => s.id === id);
                              return compareStudent ? compareStudent.name : "";
                            })
                            .filter(Boolean)
                            .join(" | "),
                          comment: c.comment,
                        }));

                        setSavedComments(mappedComments);
                        setComment("");
                        setCompareList([]);
                        alert("Comment saved successfully!");
                      } catch (err) {
                        console.error(err);
                        alert("Failed to save comment.");
                      }
                    }}
                    className="bg-green-600 hover:bg-green-700 text-white"
                  >
                    Save Comment
                  </Button>
                </div>
              )}
            </DialogContent>
          </Dialog>
        </Card>

        {/* Student Marks Circle Chart */}
        <Card className="p-6 bg-gray-800 border border-gray-700 shadow-lg text-white h-80">
          <h2 className="text-xl font-semibold mb-4">Marks Overview</h2>
          <div className="h-64">
            <Doughnut data={chartData} options={chartOptions} />
          </div>
        </Card>

        {/* Saved Comments */}
        <Card className="p-6 bg-gray-800 border border-gray-700 shadow-lg text-white">
          <h2 className="text-xl font-semibold mb-4">Saved Comments</h2>
          {savedComments.length > 0 ? (
            savedComments.map((c, idx) => (
              <Card key={idx} className="p-3 mb-2 bg-gray-700 border border-gray-600 text-white">
                <p><span className="font-bold">Students:</span> {c.students}</p>
                <p><span className="font-bold">Comment:</span> {c.comment}</p>
              </Card>
            ))
          ) : (
            <p className="text-gray-400">No comments saved yet.</p>
          )}
        </Card>
      </div>
    </div>
  );
}