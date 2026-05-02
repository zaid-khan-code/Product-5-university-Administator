export type Department = {
  id: string;
  name: string;
  dean: string;
  programsOffered: string[];
  facultyCount: number;
  budget: number;
};

export type Faculty = {
  id: string;
  name: string;
  rank: 'Professor' | 'Associate Professor' | 'Assistant Professor' | 'Lecturer';
  departmentId: string;
  assignedCourseIds: string[];
  researchInterests: string[];
};

export type Course = {
  id: string;
  code: string;
  title: string;
  departmentId: string;
  credits: number;
  prerequisites: string[]; // Course IDs
  sections: { id: string; instructorId: string; capacity: number; enrolled: number }[];
};

export type Student = {
  id: string;
  name: string;
  program: string;
  year: number;
  gpa: number;
  advisorId: string;
  enrollmentStatus: 'Active' | 'Inactive' | 'Graduated' | 'Suspended';
  financialHold: boolean;
};

export type Grade = {
  studentId: string;
  courseId: string;
  grade: 'A' | 'B' | 'C' | 'D' | 'F' | 'IP';
  credits: number;
};

export type ApplicationStatus = 'Submitted' | 'Shortlisted' | 'Interview' | 'Admitted' | 'Rejected';

export type AdmissionApplication = {
  id: string;
  applicantName: string;
  program: string;
  status: ApplicationStatus;
  documents: { name: string; submitted: boolean }[];
};

export type Book = {
  id: string;
  title: string;
  author: string;
  isbn: string;
  status: 'Available' | 'Checked Out' | 'Lost';
  dueDate?: string;
  checkedOutTo?: string; // Student ID
};

export type Exam = {
  id: string;
  courseId: string;
  date: string;
  time: string;
  departmentId: string;
  invigilators: string[]; // Faculty IDs
  hallSeating: string;
};

export type Event = {
  id: string;
  title: string;
  date: string;
  description: string;
  registeredAttendees: string[]; // Student/Faculty IDs
};

export type FeeAccount = {
  studentId: string;
  balance: number;
  transactions: { date: string; amount: number; description: string; type: 'Charge' | 'Payment' | 'Scholarship' }[];
};
