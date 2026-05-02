"use client";

import { useEffect, useState } from "react";
import { getDB } from "@/lib/db";
import { Exam, Course, Department, Faculty } from "@/lib/types";

export default function ExaminationsPage() {
  const [exams, setExams] = useState<(Exam & { courseTitle: string, courseCode: string, deptName: string, invigilatorNames: string[] })[]>([]);
  const [selectedDept, setSelectedDept] = useState<string>("All");
  const [departments, setDepartments] = useState<Department[]>([]);

  useEffect(() => {
    const examData = getDB<Exam>('exams');
    const courses = getDB<Course>('courses');
    const depts = getDB<Department>('departments');
    const faculty = getDB<Faculty>('faculty');

    setDepartments(depts);

    const enriched = examData.map(e => {
      const course = courses.find(c => c.id === e.courseId);
      const dept = depts.find(d => d.id === e.departmentId);
      const invigNames = e.invigilators.map(iId => faculty.find(f => f.id === iId)?.name || iId);

      return {
        ...e,
        courseTitle: course?.title || 'Unknown',
        courseCode: course?.code || 'Unknown',
        deptName: dept?.name || 'Unknown',
        invigilatorNames: invigNames
      };
    }).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    setExams(enriched);
  }, []);

  const filteredExams = selectedDept === "All" ? exams : exams.filter(e => e.departmentId === selectedDept);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-4">
        <h1 className="text-3xl font-bold text-university-navy">Examination Schedule</h1>
        <select
          className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-university-navy bg-white"
          value={selectedDept}
          onChange={e => setSelectedDept(e.target.value)}
        >
          <option value="All">All Departments</option>
          {departments.map(d => (
            <option key={d.id} value={d.id}>{d.name}</option>
          ))}
        </select>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-university-gray">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date & Time</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Course</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Seating</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Invigilators</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredExams.map(exam => (
              <tr key={exam.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  <div>{new Date(exam.date).toLocaleDateString()}</div>
                  <div className="text-gray-500 text-xs mt-1">{exam.time}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <div className="font-bold text-university-navy">{exam.courseCode}</div>
                  <div className="text-gray-500">{exam.courseTitle}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{exam.deptName}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                  <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded font-medium border border-blue-100">
                    {exam.hallSeating}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <ul className="list-disc pl-4">
                    {exam.invigilatorNames.map((name, idx) => (
                      <li key={idx}>{name}</li>
                    ))}
                  </ul>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredExams.length === 0 && (
          <div className="p-8 text-center text-gray-500">No exams scheduled for this department.</div>
        )}
      </div>
    </div>
  );
}
