import {
  Department, Faculty, Course, Student, Grade, AdmissionApplication, Book, Exam, Event, FeeAccount
} from './types';

// Mock Data Generators

function generateDepartments(): Department[] {
  const deptNames = [
    'Computer Science', 'Mathematics', 'Physics', 'Chemistry', 'Biology',
    'History', 'English', 'Philosophy', 'Economics', 'Political Science',
    'Psychology', 'Sociology', 'Engineering', 'Business Administration', 'Fine Arts'
  ];
  return deptNames.map((name, i) => ({
    id: `dept-${i + 1}`,
    name,
    dean: `Dr. Dean ${i + 1}`,
    programsOffered: [`BSc ${name}`, `MSc ${name}`],
    facultyCount: 0, // Will be updated
    budget: 1000000 + Math.floor(Math.random() * 5000000)
  }));
}

function generateFaculty(departments: Department[]): Faculty[] {
  const ranks: Faculty['rank'][] = ['Professor', 'Associate Professor', 'Assistant Professor', 'Lecturer'];
  const faculty: Faculty[] = [];
  for (let i = 1; i <= 30; i++) {
    const dept = departments[i % departments.length];
    faculty.push({
      id: `fac-${i}`,
      name: `Dr. Faculty ${i}`,
      rank: ranks[Math.floor(Math.random() * ranks.length)],
      departmentId: dept.id,
      assignedCourseIds: [],
      researchInterests: ['AI', 'Data Science', 'Quantum Computing'].sort(() => 0.5 - Math.random()).slice(0, 2)
    });
  }
  return faculty;
}

function generateCourses(departments: Department[], faculty: Faculty[]): Course[] {
  const courses: Course[] = [];
  for (let i = 1; i <= 80; i++) {
    const dept = departments[i % departments.length];
    const deptFaculty = faculty.filter(f => f.departmentId === dept.id);
    const instructor = deptFaculty.length > 0 ? deptFaculty[Math.floor(Math.random() * deptFaculty.length)].id : faculty[0].id;

    courses.push({
      id: `course-${i}`,
      code: `${dept.name.substring(0, 3).toUpperCase()}${100 + i}`,
      title: `Intro to ${dept.name} ${i}`,
      departmentId: dept.id,
      credits: [3, 4][Math.floor(Math.random() * 2)],
      prerequisites: i > 10 ? [`course-${i - 10}`] : [],
      sections: [
        { id: `sec-${i}-1`, instructorId: instructor, capacity: 30, enrolled: Math.floor(Math.random() * 30) },
        { id: `sec-${i}-2`, instructorId: instructor, capacity: 30, enrolled: Math.floor(Math.random() * 30) }
      ]
    });
  }
  return courses;
}

function generateStudents(faculty: Faculty[]): Student[] {
  const programs = ['BSc Computer Science', 'BA History', 'BSc Physics', 'BBA Business'];
  const students: Student[] = [];
  for (let i = 1; i <= 200; i++) {
    students.push({
      id: `stu-${1000 + i}`,
      name: `Student ${i}`,
      program: programs[Math.floor(Math.random() * programs.length)],
      year: Math.floor(Math.random() * 4) + 1,
      gpa: 2.0 + Math.random() * 2.0,
      advisorId: faculty[Math.floor(Math.random() * faculty.length)].id,
      enrollmentStatus: 'Active',
      financialHold: Math.random() > 0.9
    });
  }
  return students;
}

function generateAdmissions(): AdmissionApplication[] {
  const apps: AdmissionApplication[] = [];
  const statuses: AdmissionApplication['status'][] = ['Submitted', 'Shortlisted', 'Interview', 'Admitted', 'Rejected'];
  for (let i = 1; i <= 20; i++) {
    apps.push({
      id: `app-${i}`,
      applicantName: `Applicant ${i}`,
      program: 'BSc Computer Science',
      status: statuses[Math.floor(Math.random() * statuses.length)],
      documents: [
        { name: 'High School Transcript', submitted: true },
        { name: 'Recommendation Letter', submitted: Math.random() > 0.5 },
        { name: 'Personal Statement', submitted: true }
      ]
    });
  }
  return apps;
}

function generateBooks(): Book[] {
  const books: Book[] = [];
  for (let i = 1; i <= 50; i++) {
    const isCheckedOut = Math.random() <= 0.2;
    books.push({
      id: `book-${i}`,
      title: `Academic Book ${i}`,
      author: `Author ${i}`,
      isbn: `978-3-16-148410-${i}`,
      status: isCheckedOut ? 'Checked Out' : 'Available',
      ...(isCheckedOut && { checkedOutTo: `stu-${1000 + Math.floor(Math.random() * 10)}`, dueDate: new Date(Date.now() + 86400000 * 7).toISOString() })
    });
  }
  return books;
}

function generateExams(courses: Course[], faculty: Faculty[]): Exam[] {
  const exams: Exam[] = [];
  for (let i = 1; i <= 10; i++) {
    const course = courses[i];
    exams.push({
      id: `exam-${i}`,
      courseId: course.id,
      departmentId: course.departmentId,
      date: new Date(Date.now() + 86400000 * (10 + i)).toISOString().split('T')[0],
      time: '09:00 AM',
      invigilators: [faculty[0].id, faculty[1].id],
      hallSeating: `Hall ${i}: Rows A-F`
    });
  }
  return exams;
}

function generateEvents(): Event[] {
  return [
    { id: 'ev-1', title: 'Orientation Week', date: new Date(Date.now() + 86400000 * 5).toISOString().split('T')[0], description: 'Welcome new students', registeredAttendees: [] },
    { id: 'ev-2', title: 'Science Fair', date: new Date(Date.now() + 86400000 * 15).toISOString().split('T')[0], description: 'Annual science exhibition', registeredAttendees: [] },
    { id: 'ev-3', title: 'Career Fair', date: new Date(Date.now() + 86400000 * 30).toISOString().split('T')[0], description: 'Meet top employers', registeredAttendees: [] }
  ];
}

export function initializeDB() {
  if (typeof window === 'undefined') return;

  if (!localStorage.getItem('departments')) {
    const departments = generateDepartments();
    const faculty = generateFaculty(departments);
    const courses = generateCourses(departments, faculty);
    const students = generateStudents(faculty);
    const admissions = generateAdmissions();
    const books = generateBooks();
    const exams = generateExams(courses, faculty);
    const events = generateEvents();

    // Update faculty counts
    departments.forEach(d => {
      d.facultyCount = faculty.filter(f => f.departmentId === d.id).length;
    });

    // Update assigned courses
    courses.forEach(c => {
      c.sections.forEach(s => {
        const fac = faculty.find(f => f.id === s.instructorId);
        if (fac && !fac.assignedCourseIds.includes(c.id)) {
          fac.assignedCourseIds.push(c.id);
        }
      });
    });

    // Initialize grades and fee accounts
    const grades: Grade[] = [];
    const feeAccounts: FeeAccount[] = students.map(s => ({
      studentId: s.id,
      balance: 5000,
      transactions: [
        { date: new Date().toISOString(), amount: 10000, description: 'Tuition', type: 'Charge' },
        { date: new Date().toISOString(), amount: 5000, description: 'Payment', type: 'Payment' }
      ]
    }));

    localStorage.setItem('departments', JSON.stringify(departments));
    localStorage.setItem('faculty', JSON.stringify(faculty));
    localStorage.setItem('courses', JSON.stringify(courses));
    localStorage.setItem('students', JSON.stringify(students));
    localStorage.setItem('admissions', JSON.stringify(admissions));
    localStorage.setItem('books', JSON.stringify(books));
    localStorage.setItem('exams', JSON.stringify(exams));
    localStorage.setItem('events', JSON.stringify(events));
    localStorage.setItem('grades', JSON.stringify(grades));
    localStorage.setItem('feeAccounts', JSON.stringify(feeAccounts));
  }
}

// Helpers
export const getDB = <T>(key: string): T[] => {
  if (typeof window === 'undefined') return [];
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : [];
};

export const setDB = <T>(key: string, data: T[]) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(key, JSON.stringify(data));
  }
};
