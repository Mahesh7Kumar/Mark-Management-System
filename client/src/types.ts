export type Student = {
  id: number;
  name: string;
  class: number;
  physics: number;
  chemistry: number;
  english: number;
  tamil: number;
};

export type ComparisonComment = {
  id: number;
  student_ids: number[];
  comment: string;
  created_at: string;
};