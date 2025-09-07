import { useParams } from "react-router-dom";
import ClassDashboard from "../components/Class.tsx";

export default function ClassPage() {
  const { classId } = useParams<{ classId: string }>();
  if (!classId) return <p className="text-red-500">Class ID not found</p>;

  const classNum = parseInt(classId, 10);
  if (isNaN(classNum)) return <p className="text-red-500">Invalid class number</p>;

  return <ClassDashboard classNum={classNum} />;
}
