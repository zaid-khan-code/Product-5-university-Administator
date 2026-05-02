"use client";

import { useEffect, useState } from "react";
import { getDB } from "@/lib/db";
import { Department, Student, Faculty, Course } from "@/lib/types";
import { Users, BookOpen, GraduationCap, Building2 } from "lucide-react";

export default function Dashboard() {
  const [stats, setStats] = useState({
    students: 0,
    faculty: 0,
    departments: 0,
    courses: 0
  });

  useEffect(() => {
    setStats({
      students: getDB<Student>('students').length,
      faculty: getDB<Faculty>('faculty').length,
      departments: getDB<Department>('departments').length,
      courses: getDB<Course>('courses').length,
    });
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-university-navy">National University Dashboard</h1>
        <p className="text-gray-600 mt-2">Welcome to the central administration system.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Students" value={stats.students} icon={<Users size={24} />} />
        <StatCard title="Total Faculty" value={stats.faculty} icon={<GraduationCap size={24} />} />
        <StatCard title="Departments" value={stats.departments} icon={<Building2 size={24} />} />
        <StatCard title="Active Courses" value={stats.courses} icon={<BookOpen size={24} />} />
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h2 className="text-xl font-bold text-university-navy mb-4">System Overview</h2>
        <p className="text-gray-700">
          This system provides access to all university management modules including student information,
          course registration, grading, admissions, faculty directory, department management, finance,
          library, examinations, and events.
        </p>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon }: { title: string, value: number, icon: React.ReactNode }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 flex items-center space-x-4 border-l-4 border-l-university-maroon">
      <div className="p-3 bg-university-gray rounded-full text-university-navy">
        {icon}
      </div>
      <div>
        <h3 className="text-gray-500 text-sm font-medium">{title}</h3>
        <p className="text-2xl font-bold text-university-navy">{value}</p>
      </div>
    </div>
  );
}
