import React, { useMemo, useState } from 'react';
import {
  Search,
  Upload,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  UserCheck,
  UserMinus,
  XCircle,
  FileSearch
} from 'lucide-react';

// Data Mocks
const initialAttendanceRows = [
  { id: 'att-1', session: 'Basketball Offensive Training', date: 'April 26, 2025', time: '15:00', status: 'Present' },
  { id: 'att-2', session: 'Basic Dribbling Practice', date: 'April 22, 2025', time: '15:00', status: 'Present' },
  { id: 'att-3', session: 'Mini Match Simulation', date: 'April 19, 2025', time: '15:00', status: 'Excused' },
  { id: 'att-4', session: 'Physical Conditioning', date: 'April 15, 2025', time: '15:00', status: 'Present' },
  { id: 'att-5', session: 'Shooting Accuracy Drill', date: 'April 12, 2025', time: '15:00', status: 'Present' },
  { id: 'att-6', session: 'Shooting Accuracy Drill', date: 'April 12, 2025', time: '15:00', status: 'Absent' },
  { id: 'att-7', session: 'Shooting Accuracy Drill', date: 'April 12, 2025', time: '15:00', status: 'Present' },
];

const statusPill = (status) => {
  switch (status) {
    case 'Present':
      return 'bg-[#ECFDF3] text-[#12B76A]';
    case 'Excused':
      return 'bg-[#FFF7ED] text-[#FB6514]';
    case 'Absent':
      return 'bg-[#FEF2F2] text-[#F04438]';
    default:
      return 'bg-gray-100 text-gray-500';
  }
};

// CSV Export Helpers
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

const Attendance = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 5;

  // Filtering and Pagination Logic
  const filteredAttendance = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return initialAttendanceRows;
    return initialAttendanceRows.filter((r) =>
      `${r.session} ${r.date} ${r.time} ${r.status}`.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  const totalPages = Math.max(1, Math.ceil(filteredAttendance.length / ITEMS_PER_PAGE));
  const safePage = Math.min(currentPage, totalPages);

  const pageData = filteredAttendance.slice(
    (safePage - 1) * ITEMS_PER_PAGE,
    safePage * ITEMS_PER_PAGE
  );

  const isEmpty = filteredAttendance.length === 0;

  // Export CSV Action
  const handleExportCSV = () => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');

    const headers = [
      { key: 'session', label: 'Session' },
      { key: 'date', label: 'Date' },
      { key: 'time', label: 'Time' },
      { key: 'status', label: 'Status' },
    ];
    const csv = toCSV(filteredAttendance, headers);
    downloadCSV(csv, `child_attendance_${yyyy}-${mm}-${dd}.csv`);
  };

  // Showing text helpers
  const buildShowingText = () => {
    if (filteredAttendance.length === 0) return 'Showing 0-0 of 0 Data';
    const start = (safePage - 1) * ITEMS_PER_PAGE + 1;
    const end = Math.min(safePage * ITEMS_PER_PAGE, filteredAttendance.length);
    const dummyTotal = 47;
    return `Showing ${start}-${end} of ${dummyTotal} Data`;
  };

  return (
    <div className="p-8 flex flex-col flex-1 gap-6 bg-white font-sans min-h-screen">

      {/* Cards Section */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

        {/* Card 1: Attendance Overview */}
        <div className="bg-gray-50 border border-gray-200 rounded-2xl p-1.5">
          <h2 className="text-base font-semibold text-gray-900 mb-3 pl-4">Attendance Overview</h2>

          <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
            <div className="grid grid-cols-2">
              <div className="px-5 py-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl border border-gray-200 flex items-center justify-center text-gray-500 bg-white shrink-0">
                    <TrendingUp size={18} />
                  </div>
                  <span className="text-sm font-semibold text-gray-900">Attendance Rate</span>
                </div>

                <div className="mt-6">
                  <div className="text-3xl font-semibold text-gray-900 leading-none">100%</div>
                  <div className="text-xs text-gray-400 mt-3">Attendance consistency.</div>
                </div>
              </div>

              <div className="border-l border-gray-200 px-5 py-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl border border-gray-200 flex items-center justify-center text-gray-500 bg-white shrink-0">
                    <UserCheck size={18} />
                  </div>
                  <span className="text-sm font-semibold text-gray-900">Total Present</span>
                </div>

                <div className="mt-6">
                  <div className="text-3xl font-semibold text-gray-900 leading-none">7</div>
                  <div className="text-xs text-gray-400 mt-3">Sessions attended.</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Card 2: Attendance Exceptions */}
        <div className="bg-gray-50 border border-gray-200 rounded-2xl p-1.5">
          <h2 className="text-base font-semibold text-gray-900 mb-3 pl-4">Attendance Exceptions</h2>

          <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
            <div className="grid grid-cols-2">
              <div className="px-5 py-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl border border-gray-200 flex items-center justify-center text-gray-500 bg-white shrink-0">
                    <UserMinus size={18} />
                  </div>
                  <span className="text-sm font-semibold text-gray-900">Excused</span>
                </div>

                <div className="mt-6">
                  <div className="text-3xl font-semibold text-gray-900 leading-none">1</div>
                  <div className="text-xs text-gray-400 mt-3">Approved absences.</div>
                </div>
              </div>

              <div className="border-l border-gray-200 px-5 py-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl border border-gray-200 flex items-center justify-center text-gray-500 bg-white shrink-0">
                    <XCircle size={18} />
                  </div>
                  <span className="text-sm font-semibold text-gray-900">Absent</span>
                </div>

                <div className="mt-6">
                  <div className="text-3xl font-semibold text-gray-900 leading-none">1</div>
                  <div className="text-xs text-gray-400 mt-3">Unexcused absences.</div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Search & Export Row */}
      <div className="flex items-center justify-between mt-2">
        <div className="relative w-[320px]">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          <input
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Search..."
            className="w-full h-11 pl-11 pr-4 rounded-xl border border-gray-200 bg-white text-sm text-gray-700 placeholder:text-gray-400 outline-none focus:ring-1 focus:border-[#C1200C] transition-all"
          />
        </div>

        <button
          type="button"
          onClick={handleExportCSV}
          className="h-11 px-5 rounded-xl border border-gray-200 bg-white text-sm font-medium text-gray-700 flex items-center gap-2.5 hover:bg-gray-50 transition cursor-pointer shadow-sm"
        >
          <Upload size={16} className="text-gray-600" strokeWidth={2} />
          Export CSV
        </button>
      </div>

      {/* Table Section */}
      {isEmpty ? (
        <div className="flex flex-col items-center justify-center flex-1 py-16 border border-dashed border-gray-300 rounded-2xl bg-gray-50/50">
          <div className="w-16 h-16 bg-[#FEF2F2] rounded-2xl flex items-center justify-center mb-5">
            <FileSearch size={28} className="text-[#C1200C]" />
          </div>
          <h3 className="text-[17px] font-bold text-gray-900 mb-1.5 tracking-tight">No Attendance Found</h3>
          <p className="text-sm text-gray-400 text-center max-w-sm">
            We couldn't find any attendance matching your search criteria.
          </p>
        </div>
      ) : (
        <div className="w-full overflow-x-auto">
          <table className="w-full text-left border-separate border-spacing-0">
            <thead>
              <tr className="bg-[#F8F9FA]">
                <th className="px-6 py-4 text-sm font-semibold text-gray-900 rounded-tl-2xl rounded-bl-2xl w-[40%]">Session</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-900 w-[20%]">Date</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-900 w-[20%]">Time</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-900 rounded-tr-2xl rounded-br-2xl w-[20%]">Status</th>
              </tr>
            </thead>

            <tbody>
              {pageData.map((row, index) => (
                <tr key={index} className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-5 text-sm font-medium text-gray-900 border-b border-gray-100">{row.session}</td>
                  <td className="px-6 py-5 text-sm text-gray-500 border-b border-gray-100">{row.date}</td>
                  <td className="px-6 py-5 text-sm text-gray-500 border-b border-gray-100">{row.time}</td>
                  <td className="px-6 py-5 border-b border-gray-100">
                    <span className={`px-4 py-1.5 rounded-full text-xs font-medium inline-block whitespace-nowrap ${statusPill(row.status)}`}>
                      {row.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {!isEmpty && (
        <div className="flex items-center justify-between mt-4 text-sm text-gray-900 font-medium pb-4">
          <span>{buildShowingText()}</span>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={safePage === 1}
              className={`w-9 h-9 flex items-center justify-center rounded-full border border-gray-200 transition-colors ${safePage === 1 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:bg-gray-50 cursor-pointer'
                }`}
            >
              <ChevronLeft size={16} />
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .slice(0, 3)
              .map((page) => (
                <span
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-9 h-9 flex items-center justify-center rounded-full cursor-pointer transition-colors ${safePage === page ? 'text-gray-900 font-semibold' : 'text-gray-500 hover:text-gray-900'
                    }`}
                >
                  {page}
                </span>
              ))}

            <button
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={safePage === totalPages}
              className={`w-9 h-9 flex items-center justify-center rounded-full border border-gray-200 transition-colors ${safePage === totalPages ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:bg-gray-50 cursor-pointer'
                }`}
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}

    </div>
  );
};

export default Attendance;