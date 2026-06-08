import React, { useMemo, useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import {
  Search,
  Upload,
  Users,
  Percent,
  CalendarDays,
  FileText,
  ArrowUpRight,
  X,
  ChevronDown,
  FileSearch
} from 'lucide-react';
import NotificationModal from '../../components/ui/NotificationModal';

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

// Take Attendance Drawer & Helpers
const initialStudents = [
  { id: 's1', name: 'Ayu Rahmawati', nis: '2023001', className: 'VIII A' },
  { id: 's2', name: 'Dian Pertiwi', nis: '2023002', className: 'VII B' },
  { id: 's3', name: 'Farah Amelia', nis: '2023003', className: 'VIII B' },
  { id: 's4', name: 'Hendra Kusuma', nis: '2023004', className: 'IX A' },
  { id: 's5', name: 'Intan Permata', nis: '2023005', className: 'VII A' },
  { id: 's6', name: 'Hendra Kusuma', nis: '2023006', className: 'VII B' },
  { id: 's7', name: 'Intan Permata', nis: '2023007', className: 'VIII B' },
];

const attendanceActionPillStyle = (value) => {
  switch (value) {
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

const TakeAttendanceDrawer = ({ isOpen, onClose, onSave }) => {
  const [query, setQuery] = useState('');
  const [openRowId, setOpenRowId] = useState(null);

  const [values, setValues] = useState(() => {
    const obj = {};
    initialStudents.forEach((s) => (obj[s.id] = 'Present'));
    return obj;
  });

  const filteredStudents = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return initialStudents;
    return initialStudents.filter((s) => {
      const hay = `${s.name} ${s.nis} ${s.className}`.toLowerCase();
      return hay.includes(q);
    });
  }, [query]);

  const canSave = filteredStudents.length > 0;
  const drawerRef = useRef(null);
  const actionBtnRefs = useRef({});
  const [dropdownPos, setDropdownPos] = useState({ top: 0, left: 0, width: 0 });

  return (
    <>
      <div
        className={`fixed inset-0 z-40 transition-opacity duration-300 ${isOpen ? 'opacity-100 bg-black/40 pointer-events-auto' : 'opacity-0 pointer-events-none'
          }`}
        onClick={() => {
          setOpenRowId(null);
          onClose();
        }}
      />

      <div
        ref={drawerRef}
        className={`fixed top-0 right-0 h-full w-180 bg-white z-50 shadow-2xl transform transition-transform duration-300 ease-in-out flex flex-col ${isOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-7 py-5 border-b border-gray-100 bg-white shrink-0">
          <h3 className="text-[16px] font-semibold text-gray-900">Take Attendance</h3>
          <button
            type="button"
            onClick={() => {
              setOpenRowId(null);
              onClose();
            }}
            className="w-10 h-10 flex items-center justify-center rounded-xl text-gray-400 hover:bg-gray-50 transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        <div className="px-7 pt-6 pb-6 overflow-y-auto flex-1">
          <div className="flex items-center justify-between mb-6">
            <h4 className="text-sm font-semibold text-gray-900">Student Attendance</h4>
            <div className="w-full max-w-65">
              <div className="h-11 w-full rounded-xl border border-gray-200 flex items-center gap-3 px-4 text-gray-400 bg-white">
                <Search size={16} />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="w-full outline-none text-sm text-gray-700 placeholder:text-gray-400 bg-transparent"
                  placeholder="Search name..."
                />
              </div>
            </div>
          </div>

          <div className="w-full overflow-x-auto">
            <table className="w-full text-left border-separate border-spacing-0">
              <thead>
                <tr className="bg-[#F8F9FA]">
                  <th className="px-6 py-4 text-sm font-semibold text-gray-900 border-l border-t border-b border-gray-200 rounded-tl-2xl rounded-bl-2xl w-[40%]">
                    Student Name
                  </th>
                  <th className="px-6 py-4 text-sm font-semibold text-gray-900 border-t border-b border-gray-200 w-[20%]">
                    NIS
                  </th>
                  <th className="px-6 py-4 text-sm font-semibold text-gray-900 border-t border-b border-gray-200 w-[20%]">
                    Class
                  </th>
                  <th className="px-6 py-4 text-sm font-semibold text-gray-900 border-r border-t border-b border-gray-200 rounded-tr-2xl rounded-br-2xl w-[20%] text-center">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.map((s) => {
                  const current = values[s.id] || 'Present';
                  const open = openRowId === s.id;

                  return (
                    <tr key={s.id} className="border-b border-gray-200">
                      <td className="px-6 py-5 text-sm font-medium text-gray-900">{s.name}</td>
                      <td className="px-6 py-5 text-sm text-gray-500">{s.nis}</td>
                      <td className="px-6 py-5 text-sm text-gray-500">{s.className}</td>
                      <td className="px-6 py-5 text-center relative">
                        <button
                          ref={(el) => { if (el) actionBtnRefs.current[s.id] = el; }}
                          type="button"
                          onClick={() => {
                            const next = open ? null : s.id;
                            setOpenRowId(next);
                            if (!open) {
                              const rect = actionBtnRefs.current[s.id]?.getBoundingClientRect();
                              if (rect) {
                                setDropdownPos({
                                  top: rect.bottom + 8,
                                  left: rect.right - 180,
                                  width: rect.width,
                                });
                              }
                            }
                          }}
                          className={`h-11 min-w-35 inline-flex items-center justify-between gap-3 px-5 rounded-xl border text-sm font-medium transition-colors cursor-pointer ${open ? 'border-[#C1200C]' : 'border-gray-200 hover:bg-gray-50'
                            }`}
                        >
                          <span className={`px-4 py-1.5 rounded-full text-xs font-medium ${attendanceActionPillStyle(current)}`}>
                            {current}
                          </span>
                          <ChevronDown size={16} className="text-gray-400" />
                        </button>

                        {open && createPortal(
                          <>
                            <div className="fixed inset-0 z-9998" onClick={() => setOpenRowId(null)} />
                            <div
                              className="fixed z-9999 w-45 bg-white border border-gray-100 rounded-2xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.12)] overflow-hidden py-2"
                              style={{ top: dropdownPos.top, left: dropdownPos.left }}
                            >
                              {['Present', 'Excused', 'Absent'].map((opt) => (
                                <button
                                  key={opt}
                                  type="button"
                                  onClick={() => {
                                    setValues((prev) => ({ ...prev, [s.id]: opt }));
                                    setOpenRowId(null);
                                  }}
                                  className="w-full text-left px-5 py-3 hover:bg-gray-50 transition-colors cursor-pointer"
                                >
                                  <span className={`px-4 py-1.5 rounded-full text-xs font-medium inline-block whitespace-nowrap ${attendanceActionPillStyle(opt)}`}>
                                    {opt}
                                  </span>
                                </button>
                              ))}
                            </div>
                          </>,
                          document.body
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {filteredStudents.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16">
              <div className="w-20 h-20 bg-[#FEF2F2] rounded-3xl flex items-center justify-center mb-6">
                <FileSearch size={32} className="text-[#C1200C]" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2 tracking-tight">No Students Found</h3>
              <p className="text-sm text-gray-400 text-center max-w-sm leading-relaxed">
                No students match your search criteria.
              </p>
            </div>
          )}
        </div>

        <div className="border-t border-gray-100 px-7 py-5 bg-white grid grid-cols-2 gap-4 shrink-0">
          <button
            type="button"
            onClick={() => {
              setOpenRowId(null);
              onClose();
            }}
            className="py-3.5 rounded-2xl border border-gray-200 text-sm font-medium text-gray-900 hover:bg-gray-50 transition-colors cursor-pointer bg-white"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={!canSave}
            onClick={() => {
              if (!canSave) return;
              onSave?.(values);
              setOpenRowId(null);
              onClose();
            }}
            className={`py-3.5 rounded-2xl text-sm font-medium transition-colors ${canSave ? 'bg-[#C1200C] text-white hover:bg-[#A31B0A] cursor-pointer' : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              }`}
          >
            Save Attendance
          </button>
        </div>
      </div>
    </>
  );
};

const MentorDashboard = () => {
  const [attendanceData, setAttendanceData] = useState(generateAttendanceData);

  // Take Attendance Drawer State
  const [isTakeOpen, setIsTakeOpen] = useState(false);
  const [isAttendanceSuccessOpen, setIsAttendanceSuccessOpen] = useState(false);

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
    <>
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

            <button 
              onClick={() => setIsTakeOpen(true)}
              className="mt-5 w-full h-12 rounded-2xl bg-[#C1200C] text-white text-sm font-medium hover:opacity-95 transition cursor-pointer"
            >
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

      <TakeAttendanceDrawer
        isOpen={isTakeOpen}
        onClose={() => setIsTakeOpen(false)}
        onSave={(values) => {
          const counts = Object.values(values).reduce(
            (acc, v) => {
              if (v === 'Present') acc.present += 1;
              else if (v === 'Excused') acc.excused += 1;
              else if (v === 'Absent') acc.absent += 1;
              return acc;
            },
            { present: 0, excused: 0, absent: 0 }
          );

          setAttendanceData((prev) => [
            {
              id: `a-${Date.now()}`,
              date: '28 Apr 2025',
              present: counts.present,
              excused: counts.excused,
              absent: counts.absent,
              total: counts.present + counts.excused + counts.absent,
            },
            ...prev,
          ]);

          setTimeout(() => setIsAttendanceSuccessOpen(true), 150);
        }}
      />

      <NotificationModal
        isOpen={isAttendanceSuccessOpen}
        type="success"
        title="Attendance Saved"
        message="The student attendance has been successfully recorded."
        buttonText="Return to Dashboard"
        onButtonClick={() => setIsAttendanceSuccessOpen(false)}
        onClose={() => setIsAttendanceSuccessOpen(false)}
      />
    </>
  );
};

export default MentorDashboard;