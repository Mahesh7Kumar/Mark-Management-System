const BASE_URL = import.meta.env.VITE_API_URL; 

export async function fetchStudents(classNum: number, filter?: string) {
  const url = `${BASE_URL}/api/students/${classNum}${filter ? `?filter=${filter}` : ''}`;
  const res = await fetch(url);
  return res.json();
}

export async function fetchStudentById(studentId: number) {
  const res = await fetch(`${BASE_URL}/students/student/${studentId}`);
  return res.json();
}

export async function fetchComments(studentIds: number[]) {
  const url = `${BASE_URL}/api/comments?studentIds=${studentIds.join(',')}`;
  const res = await fetch(url);
  return res.json();
}

export async function addComment(studentIds: number[], comment: string) {
  const res = await fetch(`${BASE_URL}/comments`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ student_ids: studentIds, comment }),
  });
  return res.json();
}
