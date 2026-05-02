"use client";

import { useEffect, useState } from "react";
import { getDB } from "@/lib/db";
import { Department } from "@/lib/types";

export default function DepartmentsPage() {
  const [departments, setDepartments] = useState<Department[]>([]);

  useEffect(() => {
    setDepartments(getDB<Department>('departments'));
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-university-navy border-b pb-4">Academic Departments</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {departments.map(dept => (
          <div key={dept.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="bg-university-navy text-white p-4">
              <h2 className="text-xl font-bold">{dept.name}</h2>
            </div>
            <div className="p-4 space-y-3">
              <div>
                <span className="text-gray-500 text-sm">Dean</span>
                <p className="font-medium">{dept.dean}</p>
              </div>
              <div>
                <span className="text-gray-500 text-sm">Programs Offered</span>
                <div className="flex flex-wrap gap-2 mt-1">
                  {dept.programsOffered.map(prog => (
                    <span key={prog} className="bg-university-gray text-university-navy px-2 py-1 rounded text-xs font-medium">
                      {prog}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex justify-between pt-3 border-t">
                <div>
                  <span className="text-gray-500 text-sm">Faculty</span>
                  <p className="font-bold text-university-maroon">{dept.facultyCount}</p>
                </div>
                <div className="text-right">
                  <span className="text-gray-500 text-sm">Annual Budget</span>
                  <p className="font-bold text-university-navy">${dept.budget.toLocaleString()}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
