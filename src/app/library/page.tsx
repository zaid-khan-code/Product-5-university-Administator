"use client";

import { useEffect, useState } from "react";
import { getDB, setDB } from "@/lib/db";
import { Book, Student } from "@/lib/types";

export default function LibraryPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  const loadData = () => {
    setBooks(getDB<Book>('books'));
    setStudents(getDB<Student>('students'));
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCheckout = (bookId: string) => {
    const studentId = prompt("Enter Student ID to check out to:");
    if (!studentId) return;

    if (!students.find(s => s.id === studentId)) {
      alert("Invalid Student ID.");
      return;
    }

    const allBooks = getDB<Book>('books');
    const index = allBooks.findIndex(b => b.id === bookId);
    if (index > -1) {
      allBooks[index].status = 'Checked Out';
      allBooks[index].checkedOutTo = studentId;
      allBooks[index].dueDate = new Date(Date.now() + 86400000 * 14).toISOString(); // 14 days
      setDB('books', allBooks);
      loadData();
    }
  };

  const handleReturn = (bookId: string) => {
    const allBooks = getDB<Book>('books');
    const index = allBooks.findIndex(b => b.id === bookId);
    if (index > -1) {
      allBooks[index].status = 'Available';
      delete allBooks[index].checkedOutTo;
      delete allBooks[index].dueDate;
      setDB('books', allBooks);
      loadData();
    }
  };

  const filteredBooks = books.filter(b =>
    b.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.isbn.includes(searchTerm)
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-4">
        <h1 className="text-3xl font-bold text-university-navy">University Library</h1>
        <input
          type="text"
          placeholder="Search title, author, ISBN..."
          className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-university-navy"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredBooks.map(book => {
          const isOverdue = book.dueDate && new Date(book.dueDate) < new Date();
          return (
            <div key={book.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-5 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-2">
                  <h2 className="text-xl font-bold text-gray-900">{book.title}</h2>
                  <span className={`px-2 py-1 text-xs font-bold rounded ${
                    book.status === 'Available' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {book.status}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-1">By {book.author}</p>
                <p className="text-xs text-gray-400 font-mono mb-4">ISBN: {book.isbn}</p>

                {book.status === 'Checked Out' && (
                  <div className={`p-3 rounded text-sm mb-4 ${isOverdue ? 'bg-red-50 border border-red-200' : 'bg-gray-50 border border-gray-200'}`}>
                    <p><span className="font-semibold text-gray-700">Checked out to:</span> {book.checkedOutTo}</p>
                    <p className={isOverdue ? 'text-red-600 font-bold' : 'text-gray-600'}>
                      <span className="font-semibold text-gray-700">Due:</span> {new Date(book.dueDate!).toLocaleDateString()}
                      {isOverdue && ' (OVERDUE)'}
                    </p>
                  </div>
                )}
              </div>

              <div className="mt-4 pt-4 border-t flex gap-2">
                {book.status === 'Available' ? (
                  <button
                    onClick={() => handleCheckout(book.id)}
                    className="w-full bg-university-navy text-white py-2 rounded text-sm font-medium hover:bg-blue-800 transition-colors"
                  >
                    Check Out
                  </button>
                ) : (
                  <button
                    onClick={() => handleReturn(book.id)}
                    className="w-full bg-white text-university-navy border border-university-navy py-2 rounded text-sm font-medium hover:bg-gray-50 transition-colors"
                  >
                    Process Return
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
