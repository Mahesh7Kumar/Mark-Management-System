import { useEffect, useState } from "react";
import type { Student, ComparisonComment } from "../types";
import { fetchStudents, fetchComments } from "../api";
import { useNavigate } from "react-router-dom";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

// Chart.js
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";
ChartJS.register(ArcElement, Tooltip, Legend);

interface ClassDashboardProps {
  classNum: number;
}

export default function ClassDashboard({ classNum }: ClassDashboardProps) {
  const navigate = useNavigate();
  const [students, setStudents] = useState<Student[]>([]);
  const [comments, setComments] = useState<ComparisonComment[]>([]);
  const [filter, setFilter] = useState<"all" | "fail" | "above50" | "below90">("all");
  const [loading, setLoading] = useState(true);

  // Fetch students + comments
  useEffect(() => {
  async function loadData() {
    try {
      setLoading(true);
      const data = await fetchStudents(classNum, filter === "all" ? undefined : filter);
      setStudents(data);

      const studentIds = data.map((s: Student) => s.id);
      if (studentIds.length > 0) {
        const c = await fetchComments(studentIds);
        setComments(c);
      } else {
        setComments([]);
      }
    } catch (err) {
      console.error("Error fetching data:", err);
    } finally {
      setLoading(false);
    }
  }
  loadData();
}, [classNum, filter]);


  // Chart Calculations
  const totalStudents = students.length;

  const failStudentsCount = students.filter(
    (s) => s.physics < 50 || s.chemistry < 50 || s.english < 50 || s.tamil < 50
  ).length;

  const above50StudentsCount = students.filter(
    (s) => s.physics >= 50 && s.chemistry >= 50 && s.english >= 50 && s.tamil >= 50
  ).length;

  const above90StudentsCount = students.filter(
  (s) => s.physics > 90 && s.chemistry > 90 && s.english > 90 && s.tamil > 90
).length;

  const getPercentage = (count: number) =>
    totalStudents > 0 ? Math.round((count / totalStudents) * 100) : 0;

  const getChartData = (categoryCount: number, color: string) => ({
    labels: ["Category", "Remainder"],
    datasets: [
      {
        data: [categoryCount, totalStudents - categoryCount],
        backgroundColor: [color, "hsl(220, 10%, 20%)"],
        hoverBackgroundColor: [color, "hsl(220, 10%, 20%)"],
        borderWidth: 0,
      },
    ],
  });

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: "80%",
    plugins: { legend: { display: false } },
  };

  if (loading) {
    return (
      <div className="p-6 text-center text-white">
        Loading Class {classNum} Dashboard...
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
       <Button
        className="mb-6 bg-blue-600 hover:bg-blue-700 text-white"
        onClick={() => navigate(`/`)}
      >
        ← Back to Classes
      </Button>
      {/* Title */}
      <h1 className="text-3xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-blue-500">
        {classNum}th Standard Dashboard
      </h1>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card className="bg-slate-900 text-white border-none p-4 shadow-lg">
          <CardHeader className="p-0 mb-1">
            <CardTitle className="text-md font-normal">Failed Students</CardTitle>
          </CardHeader>
          <CardContent className="flex justify-center items-center relative h-48">
            <div className="text-4xl font-bold absolute z-10 text-white">
              {getPercentage(failStudentsCount)}%
            </div>
            <Doughnut data={getChartData(failStudentsCount, "#FF6384")} options={chartOptions} />
          </CardContent>
        </Card>

        <Card className="bg-slate-900 text-white border-none p-4 shadow-lg">
          <CardHeader className="p-0 mb-1">
            <CardTitle className="text-md font-normal">Above 50 Marks</CardTitle>
          </CardHeader>
          <CardContent className="flex justify-center items-center relative h-48">
            <div className="text-4xl font-bold absolute z-10 text-white">
              {getPercentage(above50StudentsCount)}%
            </div>
            <Doughnut data={getChartData(above50StudentsCount, "#36A2EB")} options={chartOptions} />
          </CardContent>
        </Card>

        <Card className="bg-slate-900 text-white border-none p-4 shadow-lg">
          <CardHeader className="p-0 mb-1">
            <CardTitle className="text-md font-normal">Above 90 Marks</CardTitle>
          </CardHeader>
          <CardContent className="flex justify-center items-center relative h-48">
            <div className="text-4xl font-bold absolute z-10 text-white">
              {getPercentage(above90StudentsCount)}%
            </div>
            <Doughnut data={getChartData(above90StudentsCount, "#FF9900")} options={chartOptions} />
          </CardContent>
        </Card>
      </div>

      {/* Table */}
      <Card className="bg-slate-900 text-white border-none p-6 shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Student Details</h2>
        </div>

        {/* Filters */}
        <div className="flex gap-3 mb-4">
          {["all", "fail", "above50", "above90"].map((f) => (
            <Button
              key={f}
              variant={filter === f ? "default" : "outline"}
              className={filter === f ? "" : "text-gray-500 hover:text-black"}
              onClick={() => setFilter(f as any)}
            >
              {f.toUpperCase()}
            </Button>
          ))}
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-gray-400">Name</TableHead>
              <TableHead className="text-gray-400">Physics</TableHead>
              <TableHead className="text-gray-400">Chemistry</TableHead>
              <TableHead className="text-gray-400">English</TableHead>
              <TableHead className="text-gray-400">Tamil</TableHead>
              <TableHead className="text-gray-400">Comments</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {students.length > 0 ? (
              students.map((s) => {
                const studentComments = comments.filter((c) =>
                  c.student_ids.includes(s.id)
                );
                return (
                  <TableRow
                    key={s.id}
                    className="cursor-pointer hover:bg-slate-800 transition"
                    onClick={() => navigate(`/class/${classNum}/students/student/${s.id}`)}
                  >
                    <TableCell className="font-medium text-white">{s.name}</TableCell>
                    <TableCell className="text-white">{s.physics}</TableCell>
                    <TableCell className="text-white">{s.chemistry}</TableCell>
                    <TableCell className="text-white">{s.english}</TableCell>
                    <TableCell className="text-white">{s.tamil}</TableCell>
                    <TableCell>
                      {studentComments.length > 0 ? (
                        studentComments.map((c) => (
                          <div
                            key={c.id}
                            className="mb-1 p-1 bg-yellow-900 rounded text-xs text-yellow-200"
                          >
                            {c.comment}
                          </div>
                        ))
                      ) : (
                        <span className="text-gray-500 text-sm">No comments</span>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-gray-500">
                  No students found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
