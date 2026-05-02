"use client";

import { useEffect, useState } from "react";
import { getDB } from "@/lib/db";
import { Student, Faculty } from "@/lib/types";

export default function StudentsPage() {
  const [students, setStudents] = useState<(Student & { advisorName: string })[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const stuData = getDB<Student>('students');
    const faculty = getDB<Faculty>('faculty');

    const enriched = stuData.map(s => {
      const adv = faculty.find(f => f.id === s.advisorId);
      return { ...s, advisorName: adv?.name || 'Unassigned' };
    });

    setStudents(enriched);
  }, []);

  const filteredStudents = students.filter(s =>
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-4">
        <h1 className="text-3xl font-bold text-university-navy">Student Information System</h1>
        <input
          type="text"
          placeholder="Search by name or ID..."
          className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-university-navy"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="overflow-x-auto bg-white rounded-lg shadow border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-university-gray">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Program / Year</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">GPA</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Advisor</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hold</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredStudents.map(student => (
              <tr key={student.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{student.id}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{student.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div>{student.program}</div>
                  <div className="text-xs text-gray-400">Year {student.year}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-university-navy">{student.gpa.toFixed(2)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{student.advisorName}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                    ${student.enrollmentStatus === 'Active' ? 'bg-green-100 text-green-800' :
                      student.enrollmentStatus === 'Graduated' ? 'bg-blue-100 text-blue-800' :
                      'bg-red-100 text-red-800'}`}>
                    {student.enrollmentStatus}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {student.financialHold ? (
                    <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded">Hold</span>
                  ) : (
                    <span className="text-gray-400">-</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredStudents.length === 0 && (
          <div className="p-8 text-center text-gray-500">No students found matching your search.</div>
        )}
      </div>
    </div>
  );
}
