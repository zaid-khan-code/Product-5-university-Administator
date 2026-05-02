import Link from 'next/link';

export function Navigation() {
  return (
    <nav className="bg-university-navy text-white shadow-md w-64 min-h-screen flex flex-col fixed left-0 top-0">
      <div className="p-4 bg-university-maroon border-b border-university-gold">
        <h1 className="text-xl font-bold tracking-wider">National University</h1>
      </div>
      <div className="flex flex-col py-4 flex-grow overflow-y-auto">
        <NavLink href="/" label="Dashboard" />
        <NavLink href="/students" label="Students" />
        <NavLink href="/courses" label="Courses" />
        <NavLink href="/grades" label="Grades" />
        <NavLink href="/admissions" label="Admissions" />
        <NavLink href="/faculty" label="Faculty" />
        <NavLink href="/departments" label="Departments" />
        <NavLink href="/finance" label="Finance" />
        <NavLink href="/library" label="Library" />
        <NavLink href="/examinations" label="Examinations" />
        <NavLink href="/events" label="Events" />
      </div>
    </nav>
  );
}

function NavLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="px-6 py-3 hover:bg-university-gold hover:text-university-navy transition-colors font-medium border-b border-university-navy/30"
    >
      {label}
    </Link>
  );
}
