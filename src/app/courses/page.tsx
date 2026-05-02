"use client";

import { useEffect, useState } from "react";
import { getDB, setDB } from "@/lib/db";
import { Course, Department, Faculty } from "@/lib/types";

export default function CoursesPage() {
  const [courses, setCourses] = useState<(Course & { departmentName: string })[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [faculty, setFaculty] = useState<Faculty[]>([]);
  const [selectedDept, setSelectedDept] = useState<string>("All");

  const loadData = () => {
    const courseData = getDB<Course>('courses');
    const deptData = getDB<Department>('departments');
    const facData = getDB<Faculty>('faculty');

    setDepartments(deptData);
    setFaculty(facData);

    const enriched = courseData.map(c => ({
      ...c,
      departmentName: deptData.find(d => d.id === c.departmentId)?.name || 'Unknown'
    }));
    setCourses(enriched);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleRegister = (courseId: string, sectionId: string) => {
    // In a real app, we'd check student constraints here (prereqs, conflicts).
    // For this mock, we just increment enrollment.
    const allCourses = getDB<Course>('courses');
    const course = allCourses.find(c => c.id === courseId);
    if (!course) return;

    const section = course.sections.find(s => s.id === sectionId);
    if (!section || section.enrolled >= section.capacity) {
      alert("Section is full!");
      return;
    }

    section.enrolled += 1;
    setDB('courses', allCourses);
    loadData();
    alert("Successfully registered!");
  };

  const handleDrop = (courseId: string, sectionId: string) => {
    const allCourses = getDB<Course>('courses');
    const course = allCourses.find(c => c.id === courseId);
    if (!course) return;

    const section = course.sections.find(s => s.id === sectionId);
    if (!section || section.enrolled <= 0) return;

    section.enrolled -= 1;
    setDB('courses', allCourses);
    loadData();
    alert("Successfully dropped course!");
  };

  const getInstructorName = (id: string) => faculty.find(f => f.id === id)?.name || id;

  const filteredCourses = selectedDept === "All" ? courses : courses.filter(c => c.departmentId === selectedDept);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-4">
        <h1 className="text-3xl font-bold text-university-navy">Course Catalog</h1>
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

      <div className="grid gap-6">
        {filteredCourses.map(course => (
          <div key={course.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="bg-university-gray p-4 border-b flex justify-between items-center">
              <div>
                <h2 className="text-xl font-bold text-university-navy">{course.code}: {course.title}</h2>
                <p className="text-sm text-gray-600">{course.departmentName} • {course.credits} Credits</p>
              </div>
              {course.prerequisites.length > 0 && (
                <div className="text-xs font-medium bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full">
                  Prereqs: {course.prerequisites.length}
                </div>
              )}
            </div>

            <div className="p-4">
              <h3 className="font-semibold text-gray-700 mb-3">Available Sections</h3>
              <div className="space-y-3">
                {course.sections.map(section => {
                  const isFull = section.enrolled >= section.capacity;
                  return (
                    <div key={section.id} className="flex flex-col md:flex-row md:items-center justify-between p-3 bg-gray-50 rounded border border-gray-100">
                      <div>
                        <p className="font-medium">Section {section.id.split('-').pop()}</p>
                        <p className="text-sm text-gray-500">Instructor: {getInstructorName(section.instructorId)}</p>
                      </div>
                      <div className="mt-3 md:mt-0 flex items-center space-x-4">
                        <div className="text-sm">
                          <span className={isFull ? "text-red-600 font-bold" : "text-green-600 font-bold"}>
                            {section.enrolled}
                          </span>
                          <span className="text-gray-500"> / {section.capacity} seats</span>
                        </div>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleRegister(course.id, section.id)}
                            disabled={isFull}
                            className={`px-3 py-1 text-sm rounded text-white ${isFull ? 'bg-gray-400 cursor-not-allowed' : 'bg-university-navy hover:bg-blue-800'}`}
                          >
                            Register
                          </button>
                          <button
                            onClick={() => handleDrop(course.id, section.id)}
                            disabled={section.enrolled === 0}
                            className={`px-3 py-1 text-sm rounded text-university-maroon border border-university-maroon hover:bg-red-50 ${section.enrolled === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                          >
                            Drop
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        ))}
        {filteredCourses.length === 0 && (
          <div className="p-8 text-center text-gray-500 bg-white rounded shadow-sm">No courses found for this department.</div>
        )}
      </div>
    </div>
  );
}
