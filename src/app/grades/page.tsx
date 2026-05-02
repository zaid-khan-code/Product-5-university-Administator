"use client";

import { useEffect, useState } from "react";
import { getDB, setDB } from "@/lib/db";
import { Grade, Student, Course } from "@/lib/types";

export default function GradesPage() {
  const [grades, setGrades] = useState<Grade[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);

  // Faculty view state
  const [selectedCourse, setSelectedCourse] = useState("");
  const [selectedStudent, setSelectedStudent] = useState("");
  const [gradeInput, setGradeInput] = useState<Grade['grade']>('A');

  // Student view state
  const [viewStudentId, setViewStudentId] = useState("");

  const loadData = () => {
    setGrades(getDB<Grade>('grades'));
    setStudents(getDB<Student>('students'));
    setCourses(getDB<Course>('courses'));
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleGradeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCourse || !selectedStudent) return;

    const course = courses.find(c => c.id === selectedCourse);
    if (!course) return;

    const newGrade: Grade = {
      studentId: selectedStudent,
      courseId: selectedCourse,
      grade: gradeInput,
      credits: course.credits
    };

    const currentGrades = getDB<Grade>('grades');
    // Remove old grade if exists
    const updatedGrades = currentGrades.filter(g => !(g.studentId === selectedStudent && g.courseId === selectedCourse));
    updatedGrades.push(newGrade);

    setDB('grades', updatedGrades);

    // Auto-calculate and update student GPA
    updateStudentGPA(selectedStudent, updatedGrades);

    loadData();
    setSelectedCourse("");
    setSelectedStudent("");
    alert("Grade submitted successfully!");
  };

  const updateStudentGPA = (studentId: string, allGrades: Grade[]) => {
    const studentGrades = allGrades.filter(g => g.studentId === studentId);
    if (studentGrades.length === 0) return;

    let totalPoints = 0;
    let totalCredits = 0;

    const gradePoints: Record<string, number> = { 'A': 4, 'B': 3, 'C': 2, 'D': 1, 'F': 0, 'IP': 0 };

    studentGrades.forEach(g => {
      if (g.grade !== 'IP') {
        totalPoints += gradePoints[g.grade] * g.credits;
        totalCredits += g.credits;
      }
    });

    const newGpa = totalCredits > 0 ? totalPoints / totalCredits : 0;

    const allStudents = getDB<Student>('students');
    const studentIndex = allStudents.findIndex(s => s.id === studentId);
    if (studentIndex > -1) {
      allStudents[studentIndex].gpa = newGpa;
      setDB('students', allStudents);
    }
  };

  const studentTranscript = grades.filter(g => g.studentId === viewStudentId);
  const activeStudent = students.find(s => s.id === viewStudentId);

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-university-navy border-b pb-4">Grades & Transcripts</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

        {/* Faculty Grade Entry */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-xl font-bold text-university-maroon mb-4">Faculty: Enter Grades</h2>
          <form onSubmit={handleGradeSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Course</label>
              <select
                required
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-university-navy bg-white"
                value={selectedCourse}
                onChange={e => setSelectedCourse(e.target.value)}
              >
                <option value="">Select Course...</option>
                {courses.slice(0, 20).map(c => ( // limit for usability in mock
                  <option key={c.id} value={c.id}>{c.code} - {c.title}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Student</label>
              <select
                required
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-university-navy bg-white"
                value={selectedStudent}
                onChange={e => setSelectedStudent(e.target.value)}
              >
                <option value="">Select Student...</option>
                {students.slice(0, 50).map(s => ( // limit for usability in mock
                  <option key={s.id} value={s.id}>{s.name} ({s.id})</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Grade</label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-university-navy bg-white"
                value={gradeInput}
                onChange={e => setGradeInput(e.target.value as Grade['grade'])}
              >
                <option value="A">A (4.0)</option>
                <option value="B">B (3.0)</option>
                <option value="C">C (2.0)</option>
                <option value="D">D (1.0)</option>
                <option value="F">F (0.0)</option>
                <option value="IP">IP (In Progress)</option>
              </select>
            </div>

            <button type="submit" className="w-full bg-university-navy text-white py-2 rounded hover:bg-blue-800 transition-colors">
              Submit Grade
            </button>
          </form>
        </div>

        {/* Student Transcript View */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-xl font-bold text-university-navy mb-4">Student: View Transcript</h2>
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">Select Student</label>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-university-navy bg-white"
              value={viewStudentId}
              onChange={e => setViewStudentId(e.target.value)}
            >
              <option value="">Select your profile...</option>
              {students.slice(0, 50).map(s => (
                <option key={s.id} value={s.id}>{s.name} ({s.id})</option>
              ))}
            </select>
          </div>

          {activeStudent && (
            <div className="space-y-4">
              <div className="bg-university-gray p-4 rounded flex justify-between items-center">
                <div>
                  <h3 className="font-bold">{activeStudent.name}</h3>
                  <p className="text-sm text-gray-600">{activeStudent.program}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">Cumulative GPA</p>
                  <p className="text-2xl font-bold text-university-navy">{activeStudent.gpa.toFixed(2)}</p>
                </div>
              </div>

              {studentTranscript.length > 0 ? (
                <table className="w-full text-sm text-left">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="py-2 px-3">Course</th>
                      <th className="py-2 px-3 text-center">Credits</th>
                      <th className="py-2 px-3 text-center">Grade</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {studentTranscript.map((g, idx) => {
                      const course = courses.find(c => c.id === g.courseId);
                      return (
                        <tr key={idx}>
                          <td className="py-2 px-3">{course?.code} - {course?.title}</td>
                          <td className="py-2 px-3 text-center">{g.credits}</td>
                          <td className="py-2 px-3 text-center font-bold">{g.grade}</td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              ) : (
                <p className="text-gray-500 italic text-center py-4">No grades recorded yet.</p>
              )}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
