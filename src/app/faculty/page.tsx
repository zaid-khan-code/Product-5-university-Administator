"use client";

import { useEffect, useState } from "react";
import { getDB } from "@/lib/db";
import { Faculty, Department, Course } from "@/lib/types";

export default function FacultyPage() {
  const [faculty, setFaculty] = useState<(Faculty & { departmentName: string, courseTitles: string[] })[]>([]);

  useEffect(() => {
    const facData = getDB<Faculty>('faculty');
    const depts = getDB<Department>('departments');
    const courses = getDB<Course>('courses');

    const enriched = facData.map(f => {
      const dept = depts.find(d => d.id === f.departmentId);
      const facCourses = f.assignedCourseIds.map(cId => {
        const c = courses.find(course => course.id === cId);
        return c ? c.title : cId;
      });
      return { ...f, departmentName: dept?.name || 'Unknown', courseTitles: facCourses };
    });

    setFaculty(enriched);
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-university-navy border-b pb-4">Faculty Directory</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {faculty.map(fac => (
          <div key={fac.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="bg-university-maroon text-white p-4">
              <h2 className="text-xl font-bold">{fac.name}</h2>
              <p className="text-university-gold text-sm font-medium">{fac.rank}</p>
            </div>
            <div className="p-4 space-y-3">
              <div>
                <span className="text-gray-500 text-sm">Department</span>
                <p className="font-medium text-university-navy">{fac.departmentName}</p>
              </div>

              <div>
                <span className="text-gray-500 text-sm">Research Interests</span>
                <div className="flex flex-wrap gap-2 mt-1">
                  {fac.researchInterests.map(interest => (
                    <span key={interest} className="bg-blue-50 text-blue-700 px-2 py-1 rounded text-xs font-medium border border-blue-100">
                      {interest}
                    </span>
                  ))}
                  {fac.researchInterests.length === 0 && <span className="text-gray-400 text-sm">None specified</span>}
                </div>
              </div>

              <div>
                <span className="text-gray-500 text-sm">Assigned Courses</span>
                <ul className="mt-1 space-y-1">
                  {fac.courseTitles.map((title, idx) => (
                    <li key={idx} className="text-sm flex items-center before:content-['•'] before:mr-2 before:text-university-gold">
                      {title}
                    </li>
                  ))}
                  {fac.courseTitles.length === 0 && <li className="text-gray-400 text-sm">No courses assigned</li>}
                </ul>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
