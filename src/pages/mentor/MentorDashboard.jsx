import React, { useMemo, useState } from 'react';
import {
  Search,
  Upload,
  Users,
  Percent,
  CalendarDays,
  FileText,
  ArrowUpRight
} from 'lucide-react';

// Data Mocks
const generateAttendanceData = () => {
  return [
    { id: 'a1', date: '26 Apr 2025', present: 28, excused: 1, absent: 1, total: 30 },
    { id: 'a2', date: '19 Apr 2025', present: 27, excused: 2, absent: 1, total: 30 },
    { id: 'a3', date: '12 Apr 2025', present: 29, excused: 0, absent: 1, total: 30 },
    { id: 'a4', date: '05 Apr 2025', present: 26, excused: 1, absent: 3, total: 30 },
    { id: 'a5', date: '29 Mar 2025', present: 28, excused: 1, absent: 1, total: 30 },
    { id: 'a6', date: '22 Mar 2025', present: 25, excused: 2, absent: 3, total: 30 }
  ];
};

// CSV helpers
const escapeCSV = (value) => {
  const s = String(value ?? '');
  const escaped = s.replace(/"/g, '""');
  if (/[",\n]/.test(escaped)) return `"${escaped}"`;
  return escaped;
};

const toCSV = (rows, headers) => {
  const headLine = headers.map((h) => escapeCSV(h.label)).join(',');
  const lines = rows.map((row) => headers.map((h) => escapeCSV(row[h.key])).join(','));
  return [headLine, ...lines].join('\n');
};

const downloadCSV = (csvText, filename) => {
  const blob = new Blob([csvText], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();

  URL.revokeObjectURL(url);
};

const MentorDashboard = () => {
  // table data
  const [attendanceData] = useState(generateAttendanceData);

  // search
  const [searchQuery, setSearchQuery] = useState('');

  const filteredAttendance = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();

    if (!q) return attendanceData;

    return attendanceData.filter((row) => {
      const haystack = [
        row.date,
        `${row.present}`,
        `${row.excused}`,
        `${row.absent}`,
        `${row.total}`,
        `${row.present} student`,
        `${row.excused} student`,
        `${row.absent} student`,
        `${row.total} student`,
      ]
        .join(' ')
        .toLowerCase();

      return haystack.includes(q);
    });
  }, [attendanceData, searchQuery]);

  const isEmpty = filteredAttendance.length === 0;

  const handleExportCSV = () => {
    const headers = [
      { key: 'date', label: 'Date' },
      { key: 'present', label: 'Present' },
      { key: 'excused', label: 'Excused' },
      { key: 'absent', label: 'Absent' },
      { key: 'total', label: 'Total Student' },
    ];

    const csv = toCSV(filteredAttendance, headers);

    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');

    downloadCSV(csv, `mentor_attendance_${yyyy}-${mm}-${dd}.csv`);
  };

  return (
    <div className="px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Members Card */}
        <div className="bg-gray-50 border border-gray-200 rounded-2xl p-1.5">
          <h2 className="text-base font-semibold text-gray-900 mb-3 pl-4">Members</h2>

          <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
            <div className="grid grid-cols-2">
              {/* Total Students */}
              <div className="px-5 py-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl border border-gray-200 flex items-center justify-center text-gray-500 bg-white shrink-0">
                    <Users size={18} />
                  </div>
                  <span className="text-sm font-semibold text-gray-900">Total Students</span>
                </div>

                <div className="mt-6 flex items-center justify-between">
                  <div className="text-3xl font-semibold text-gray-900 leading-none">30</div>

                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-50 text-green-700 text-xs font-medium border border-green-100">
                    <span className="w-5 h-5 rounded-full bg-green-600 flex items-center justify-center">
                      <ArrowUpRight size={12} className="text-white" />
                    </span>
                    84%
                  </div>
                </div>

                <div className="text-xs text-gray-400 mt-3">Active Students</div>
              </div>

              {/* Average Attendance */}
              <div className="border-l border-gray-200 px-5 py-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl border border-gray-200 flex items-center justify-center text-gray-500 bg-white shrink-0">
                    <Percent size={18} />
                  </div>
                  <span className="text-sm font-semibold text-gray-900">Average Attendance</span>
                </div>

                <div className="mt-6 flex items-center justify-between">
                  <div className="text-3xl font-semibold text-gray-900 leading-none">93.3%</div>

                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-50 text-green-700 text-xs font-medium border border-green-100">
                    <span className="w-5 h-5 rounded-full bg-green-600 flex items-center justify-center">
                      <ArrowUpRight size={12} className="text-white" />
                    </span>
                    84%
                  </div>
                </div>

                <div className="text-xs text-gray-400 mt-3">This Month</div>
              </div>
            </div>
          </div>
        </div>

        {/* Activities Card */}
        <div className="bg-gray-50 border border-gray-200 rounded-2xl p-1.5">
          <h2 className="text-base font-semibold text-gray-900 mb-3 pl-4">Activities</h2>

          <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
            <div className="grid grid-cols-2">
              {/* Monthly Activities */}
              <div className="px-5 py-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl border border-gray-200 flex items-center justify-center text-gray-500 bg-white shrink-0">
                    <CalendarDays size={18} />
                  </div>
                  <span className="text-sm font-semibold text-gray-900">Monthly Activities</span>
                </div>

                <div className="mt-6">
                  <div className="text-3xl font-semibold text-gray-900 leading-none">16</div>
                  <div className="text-xs text-gray-400 mt-3">Activities This Month</div>
                </div>
              </div>

              {/* Pending Reports */}
              <div className="border-l border-gray-200 px-5 py-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl border border-gray-200 flex items-center justify-center text-gray-500 bg-white shrink-0">
                    <FileText size={18} />
                  </div>
                  <span className="text-sm font-semibold text-gray-900">Pending Reports</span>
                </div>

                <div className="mt-6">
                  <div className="text-3xl font-semibold text-gray-900 leading-none">1</div>
                  <div className="text-xs text-gray-400 mt-3">Awaiting Review</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Upcoming Schedule */}
        <div className="bg-white border border-gray-200 rounded-2xl p-5">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-11 h-11 rounded-xl border border-gray-200 flex items-center justify-center text-gray-500 bg-white">
              <CalendarDays size={18} />
            </div>
            <h2 className="text-sm font-semibold text-gray-900">Upcoming Schedule</h2>
          </div>

          <div className="border border-gray-200 rounded-2xl overflow-hidden bg-[#F3F4F6]">
            <div className="p-4 bg-[#F3F4F6]">
              <div className="flex items-center justify-between">
                <div className="text-sm font-semibold text-gray-900">Basketball</div>
                <div className="inline-flex items-center px-3 py-1 rounded-full bg-green-50 text-green-700 text-xs font-medium border border-green-100">
                  Upcoming
                </div>
              </div>
              <div className="flex items-center justify-between mt-2">
                <div className="text-xs text-gray-500">Monday, April 28 2025 • 15:00 - 17:00</div>
                <div className="text-xs text-gray-500">Basketball Court</div>
              </div>
            </div>

            <div className="border-t border-gray-200 p-4 bg-[#F3F4F6]">
              <div className="flex items-center justify-between">
                <div className="text-sm font-semibold text-gray-900">Basketball</div>
                <div className="inline-flex items-center px-3 py-1 rounded-full bg-green-50 text-green-700 text-xs font-medium border border-green-100">
                  Upcoming
                </div>
              </div>
              <div className="flex items-center justify-between mt-2">
                <div className="text-xs text-gray-500">Monday, April 28 2025 • 15:00 - 17:00</div>
                <div className="text-xs text-gray-500">Basketball Court</div>
              </div>
            </div>
          </div>
        </div>

        {/* Ongoing Session */}
        <div className="bg-white border border-gray-200 rounded-2xl p-5">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-11 h-11 rounded-xl border border-gray-200 flex items-center justify-center text-gray-500 bg-white">
              <CalendarDays size={18} />
            </div>
            <h2 className="text-sm font-semibold text-gray-900">Ongoing Session</h2>
          </div>

          <div className="border border-gray-200 rounded-2xl overflow-hidden bg-[#F3F4F6] p-4">
            <div className="flex items-center justify-between">
              <div className="text-sm font-semibold text-gray-900">Basketball</div>
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-orange-50 text-orange-600 text-xs font-medium border border-orange-100">
                In Progress
              </div>
            </div>
            <div className="flex items-center justify-between mt-2">
              <div className="text-xs text-gray-500">Monday, April 28 2025 • 15:00 - 17:00</div>
              <div className="text-xs text-gray-500">Basketball Court</div>
            </div>
          </div>

          <button className="mt-5 w-full h-12 rounded-2xl bg-[#C1200C] text-white text-sm font-medium hover:opacity-95 transition">
            Take Attendance
          </button>
        </div>
      </div>

      {/* Search + Export */}
      <div className="mt-8 flex items-center justify-between gap-4">
        <div className="w-full max-w-xs">
          <div className="h-11 w-full rounded-xl border border-gray-200 flex items-center gap-3 px-4 text-gray-400 bg-white">
            <Search size={16} />
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full outline-none text-sm text-gray-700 placeholder:text-gray-400 bg-transparent"
              placeholder="Search attendance..."
            />
          </div>
        </div>

        <button
          type="button"
          onClick={handleExportCSV}
          className="h-11 px-5 rounded-xl border border-gray-200 text-sm text-gray-700 flex items-center gap-3 hover:bg-gray-50 transition shrink-0 bg-white cursor-pointer"
        >
          <Upload size={16} className="text-gray-500" />
          Export CSV
        </button>
      </div>

      {/* Table / Empty */}
      {isEmpty ? (
        <div className="flex flex-col items-center justify-center py-20 pb-28">
          <div className="w-20 h-20 bg-[#FEF2F2] rounded-3xl flex items-center justify-center mb-6">
            <CalendarDays size={32} className="text-[#C1200C]" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2 tracking-tight">No Attendance Found</h3>
          <p className="text-sm text-gray-400 text-center max-w-sm leading-relaxed">
           No attendance data matches your search criteria.
          </p>
        </div>
      ) : (
        <div className="w-full overflow-x-auto mt-6">
          <table className="w-full text-left border-separate border-spacing-0">
            <thead>
              <tr className="bg-[#F8F9FA]">
                <th className="px-6 py-4 text-sm font-semibold text-gray-900 border-l border-t border-b border-gray-200 rounded-tl-2xl rounded-bl-2xl w-[28%]">
                  Date
                </th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-900 border-t border-b border-gray-200 text-center w-[18%]">
                  Present
                </th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-900 border-t border-b border-gray-200 text-center w-[18%]">
                  Excused
                </th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-900 border-t border-b border-gray-200 text-center w-[18%]">
                  Absent
                </th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-900 border-r border-t border-b border-gray-200 rounded-tr-2xl rounded-br-2xl text-right w-[18%]">
                  Total Student
                </th>
              </tr>
            </thead>

            <tbody>
              {filteredAttendance.map((row) => (
                <tr
                  key={row.id}
                  className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors"
                >
                  <td className="px-6 py-5 text-sm font-medium text-gray-900">{row.date}</td>
                  <td className="px-6 py-5 text-sm text-gray-500 text-center">{row.present} Student</td>
                  <td className="px-6 py-5 text-sm text-gray-500 text-center">{row.excused} Student</td>
                  <td className="px-6 py-5 text-sm text-gray-500 text-center">{row.absent} Student</td>
                  <td className="px-6 py-5 text-sm text-gray-500 text-right">{row.total} Student</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Footer Pagination */}
      <div className="mt-6 flex items-center justify-between">
        <div className="text-xs text-gray-700">Showing 1-5 of 47 Data</div>

        <div className="flex items-center gap-4">
          <button className="w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center text-gray-700 hover:bg-gray-50 transition bg-white">
            ‹
          </button>

          <div className="flex items-center gap-6 text-sm text-gray-700">
            <span className="text-gray-900">1</span>
            <span className="text-gray-500">2</span>
            <span className="text-gray-500">3</span>
          </div>

          <button className="w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center text-gray-700 hover:bg-gray-50 transition bg-white">
            ›
          </button>
        </div>
      </div>
    </div>
  );
};

export default MentorDashboard;