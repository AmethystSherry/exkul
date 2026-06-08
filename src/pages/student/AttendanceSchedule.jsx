import React, { useMemo, useState } from 'react';
import {
  Search,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  CalendarDays,
  ClipboardList,
  CheckCircle2,
  TrendingUp,
  Clock3,
  MapPin,
  Upload,
  FileSearch,
  AlertCircle,
  XCircle,
  UserCheck,
  UserMinus,
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

const initialScheduleCards = [
  { id: 'sch-1', title: 'Basketball Offensive Training', dateText: 'April 21, 2026', status: 'Upcoming', time: '15:00', location: 'Basketball Court' },
  { id: 'sch-2', title: 'Basketball Offensive Training', dateText: 'April 21, 2026', status: 'Completed', time: '15:00', location: 'Basketball Court' },
  { id: 'sch-3', title: 'Basketball Offensive Training', dateText: 'April 21, 2026', status: 'Upcoming', time: '15:00', location: 'Basketball Court' },
  { id: 'sch-4', title: 'Basketball Offensive Training', dateText: 'April 21, 2026', status: 'Completed', time: '15:00', location: 'Basketball Court' },
];

const statusPill = (status) => {
  switch (status) {
    case 'Present':
      return 'bg-[#ECFDF3] text-[#12B76A]';
    case 'Excused':
      return 'bg-[#FFF7ED] text-[#FB6514]';
    case 'Absent':
      return 'bg-[#FEF2F2] text-[#F04438]';
    case 'Upcoming':
      return 'bg-[#FFF7ED] text-[#FB6514]';
    case 'Completed':
      return 'bg-[#ECFDF3] text-[#12B76A]';
    default:
      return 'bg-gray-100 text-gray-500';
  }
};

const STATUS_FILTER_OPTIONS = ['All Status', 'Completed', 'Upcoming'];

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

const AttendanceSchedule = () => {
  const [activeTab, setActiveTab] = useState('attendance');
  const [searchQuery, setSearchQuery] = useState('');

  // Attendance state
  const [attendanceRows] = useState(initialAttendanceRows);
  const [attendancePage, setAttendancePage] = useState(1);
  const ATT_ITEMS_PER_PAGE = 7;

  // Schedule state
  const [scheduleCards] = useState(initialScheduleCards);
  const [schedulePage, setSchedulePage] = useState(1);
  const SCH_ITEMS_PER_PAGE = 4;

  // Schedule filter dropdown
  const [statusFilter, setStatusFilter] = useState('All Status');
  const [statusOpen, setStatusOpen] = useState(false);

  const filteredAttendance = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return attendanceRows;
    return attendanceRows.filter((r) =>
      `${r.session} ${r.date} ${r.time} ${r.status}`.toLowerCase().includes(q)
    );
  }, [attendanceRows, searchQuery]);

  const attTotalPages = Math.max(1, Math.ceil(filteredAttendance.length / ATT_ITEMS_PER_PAGE));
  const safeAttendancePage = Math.min(attendancePage, attTotalPages);
  const attPageData = filteredAttendance.slice(
    (safeAttendancePage - 1) * ATT_ITEMS_PER_PAGE,
    safeAttendancePage * ATT_ITEMS_PER_PAGE
  );
  const attEmpty = filteredAttendance.length === 0;

  const filteredSchedule = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return scheduleCards.filter((c) => {
      const matchesSearch =
        q === '' || `${c.title} ${c.dateText} ${c.status} ${c.time} ${c.location}`.toLowerCase().includes(q);
      const matchesStatus = statusFilter === 'All Status' || c.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [scheduleCards, searchQuery, statusFilter]);

  const schTotalPages = Math.max(1, Math.ceil(filteredSchedule.length / SCH_ITEMS_PER_PAGE));
  const safeSchedulePage = Math.min(schedulePage, schTotalPages);
  const schPageData = filteredSchedule.slice(
    (safeSchedulePage - 1) * SCH_ITEMS_PER_PAGE,
    safeSchedulePage * SCH_ITEMS_PER_PAGE
  );
  const schEmpty = filteredSchedule.length === 0;

  // Export CSV handler
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
    downloadCSV(csv, `student_attendance_${yyyy}-${mm}-${dd}.csv`);
  };

  const scheduleSummary = {
    thisWeeksSchedule: 1,
    monthsTotal: 8,
    completedSessions: 3,
    avgAttendance: '95%',
  };

  const attendanceSummary = {
    attendanceRate: '100%',
    totalPresent: 7,
    excused: 1,
    absent: 1,
  };

  // Showing text helper
  const buildShowingText = ({ total, page, perPage }) => {
    if (total === 0) return 'Showing 0-0 of 0 Data';
    const start = (page - 1) * perPage + 1;
    const end = Math.min(page * perPage, total);
    return `Showing ${start}-${end} of ${total} Data`;
  };

  const showingText =
    activeTab === 'attendance'
      ? buildShowingText({ total: filteredAttendance.length, page: safeAttendancePage, perPage: ATT_ITEMS_PER_PAGE })
      : buildShowingText({ total: filteredSchedule.length, page: safeSchedulePage, perPage: SCH_ITEMS_PER_PAGE });

  const totalPages = activeTab === 'attendance' ? attTotalPages : schTotalPages;
  const currentPage = activeTab === 'attendance' ? safeAttendancePage : safeSchedulePage;

  const isEmpty = activeTab === 'attendance' ? attEmpty : schEmpty;

  return (
    <div className="p-8 pt-4 flex flex-col flex-1 gap-6 relative min-h-screen bg-white font-sans">
      {/* Tabs */}
      <div className="w-full bg-[#F3F4F6] rounded-2xl p-1.5 border border-gray-200 relative z-0 overflow-hidden">
        <div
          className={`absolute z-0 top-1.5 bottom-1.5 w-1/2 bg-white border border-gray-200 rounded-xl shadow-sm transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${activeTab === 'attendance' ? 'translate-x-0' : 'translate-x-full'
            }`}
        />

        <div className="relative z-10 flex items-center">
          <button
            type="button"
            onClick={() => {
              setActiveTab('attendance');
              setSearchQuery('');
              setAttendancePage(1);
              setStatusFilter('All Status');
              setStatusOpen(false);
            }}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-medium transition-colors cursor-pointer ${activeTab === 'attendance' ? 'text-gray-900' : 'text-gray-400'
              }`}
          >
            <ClipboardList size={16} className={activeTab === 'attendance' ? 'text-gray-900' : 'text-gray-400'} />
            Attendance
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab('schedule');
              setSearchQuery('');
              setSchedulePage(1);
              setStatusFilter('All Status');
              setStatusOpen(false);
            }}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-medium transition-colors cursor-pointer ${activeTab === 'schedule' ? 'text-gray-900' : 'text-gray-400'
              }`}
          >
            <CalendarDays size={16} className={activeTab === 'schedule' ? 'text-gray-900' : 'text-gray-400'} />
            Schedule
          </button>
        </div>
      </div>

      {/* Top cards */}
      {activeTab === 'attendance' ? (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {/* Attendance Overview */}
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
                    <div className="text-3xl font-semibold text-gray-900 leading-none">{attendanceSummary.attendanceRate}</div>
                    <div className="text-xs text-gray-400 mt-3">Excellent attendance performance</div>
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
                    <div className="text-3xl font-semibold text-gray-900 leading-none">{attendanceSummary.totalPresent}</div>
                    <div className="text-xs text-gray-400 mt-3">Total attended sessions</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Attendance Exceptions */}
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
                    <div className="text-3xl font-semibold text-gray-900 leading-none">{attendanceSummary.excused}</div>
                    <div className="text-xs text-gray-400 mt-3">Sessions with permission</div>
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
                    <div className="text-3xl font-semibold text-gray-900 leading-none">{attendanceSummary.absent}</div>
                    <div className="text-xs text-gray-400 mt-3">Missed sessions without notice</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {/* Schedule Overview */}
          <div className="bg-gray-50 border border-gray-200 rounded-2xl p-1.5">
            <h2 className="text-base font-semibold text-gray-900 mb-3 pl-4">Schedule Overview</h2>

            <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
              <div className="grid grid-cols-2">
                <div className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl border border-gray-200 flex items-center justify-center text-gray-500 bg-white shrink-0">
                      <CalendarDays size={18} />
                    </div>
                    <span className="text-sm font-semibold text-gray-900">This Week’s Schedule</span>
                  </div>

                  <div className="mt-6">
                    <div className="text-3xl font-semibold text-gray-900 leading-none">{scheduleSummary.thisWeeksSchedule}</div>
                    <div className="text-xs text-gray-400 mt-3">Sessions scheduled this week</div>
                  </div>
                </div>

                <div className="border-l border-gray-200 px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl border border-gray-200 flex items-center justify-center text-gray-500 bg-white shrink-0">
                      <CalendarDays size={18} />
                    </div>
                    <span className="text-sm font-semibold text-gray-900">This Month’s Total</span>
                  </div>

                  <div className="mt-6">
                    <div className="text-3xl font-semibold text-gray-900 leading-none">{scheduleSummary.monthsTotal}</div>
                    <div className="text-xs text-gray-400 mt-3">Total sessions this month</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Session Insights */}
          <div className="bg-gray-50 border border-gray-200 rounded-2xl p-1.5">
            <h2 className="text-base font-semibold text-gray-900 mb-3 pl-4">Session Insights</h2>

            <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
              <div className="grid grid-cols-2">
                <div className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl border border-gray-200 flex items-center justify-center text-gray-500 bg-white shrink-0">
                      <CheckCircle2 size={18} />
                    </div>
                    <span className="text-sm font-semibold text-gray-900">Completed Sessions</span>
                  </div>

                  <div className="mt-6">
                    <div className="text-3xl font-semibold text-gray-900 leading-none">{scheduleSummary.completedSessions}</div>
                    <div className="text-xs text-gray-400 mt-3">Sessions already completed</div>
                  </div>
                </div>

                <div className="border-l border-gray-200 px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl border border-gray-200 flex items-center justify-center text-gray-500 bg-white shrink-0">
                      <TrendingUp size={18} />
                    </div>
                    <span className="text-sm font-semibold text-gray-900">Average Attendance</span>
                  </div>

                  <div className="mt-6">
                    <div className="text-3xl font-semibold text-gray-900 leading-none">{scheduleSummary.avgAttendance}</div>
                    <div className="text-xs text-gray-400 mt-3">Average student attendance rate</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Search + Actions row */}
      <div className="flex items-center justify-between gap-4">
        {/* Search */}
        <div className="w-full max-w-xs">
          <div className="h-11 w-full rounded-xl border border-gray-200 flex items-center gap-3 px-4 text-gray-400 bg-white">
            <Search size={16} />
            <input
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                if (activeTab === 'attendance') setAttendancePage(1);
                else setSchedulePage(1);
              }}
              className="w-full outline-none text-sm text-gray-700 placeholder:text-gray-400 bg-transparent"
              placeholder="Search..."
            />
          </div>
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Attendance: Export CSV (only attendance) */}
          {activeTab === 'attendance' ? (
            <button
              type="button"
              onClick={handleExportCSV}
              className="h-11 px-5 rounded-xl border border-gray-200 text-sm text-gray-700 flex items-center gap-3 hover:bg-gray-50 transition bg-white cursor-pointer"
            >
              <Upload size={16} className="text-gray-500" />
              Export CSV
            </button>
          ) : (

            <div className="relative">
              <button
                type="button"
                onClick={() => setStatusOpen((v) => !v)}
                className={`h-11 flex items-center gap-3 px-5 rounded-xl border bg-white text-sm font-medium transition-colors cursor-pointer ${statusOpen ? 'border-[#C1200C] text-gray-700' : 'border-gray-200 text-gray-500 hover:bg-gray-50'
                  }`}
              >
                <span className="truncate max-w-28">{statusFilter}</span>
                <ChevronDown size={14} className="text-gray-400 shrink-0" />
              </button>

              {statusOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setStatusOpen(false)} />
                  <div className="absolute right-0 top-full mt-2 w-56 bg-white border border-gray-100 rounded-2xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.12)] z-20 overflow-hidden py-2">
                    {STATUS_FILTER_OPTIONS.map((opt) => (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => {
                          setStatusFilter(opt);
                          setStatusOpen(false);
                          setSchedulePage(1);
                        }}
                        className="w-full text-left px-5 py-3 hover:bg-gray-50 transition-colors cursor-pointer"
                      >
                        {opt === 'All Status' ? (
                          <span className={`text-sm ${statusFilter === opt ? 'text-[#C1200C] font-medium' : 'text-gray-700'}`}>
                            {opt}
                          </span>
                        ) : (
                          <span className={`px-4 py-1.5 rounded-full text-xs font-medium inline-block whitespace-nowrap ${statusPill(opt)}`}>
                            {opt}
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      {/* List / Empty */}
      {isEmpty ? (
        <div className="flex flex-col items-center justify-center flex-1 py-20 pb-40">
          <div className="w-20 h-20 bg-[#FEF2F2] rounded-3xl flex items-center justify-center mb-6">
            <FileSearch size={32} className="text-[#C1200C]" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2 tracking-tight">
            {activeTab === 'attendance' ? 'No Attendance Found' : 'No Schedule Found'}
          </h3>
          <p className="text-sm text-gray-400 text-center max-w-sm leading-relaxed">
            {activeTab === 'attendance'
              ? 'No attendance match your search criteria.'
              : 'No schedule match your search or filter criteria.'}
          </p>
        </div>
      ) : activeTab === 'attendance' ? (
        // Attendance table
        <div className="w-full">
          <table className="w-full text-left border-separate border-spacing-0">
            <thead>
              <tr className="bg-[#F8F9FA]">
                <th className="px-6 py-4 text-sm font-semibold text-gray-900 rounded-tl-2xl rounded-bl-2xl w-[40%]">
                  Session
                </th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-900 w-[20%]">Date</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-900 w-[20%]">Time</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-900 rounded-tr-2xl rounded-br-2xl w-[20%]">
                  Status
                </th>
              </tr>
            </thead>

            <tbody>
              {attPageData.map((row) => (
                <tr key={row.id} className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-5 text-sm font-medium text-gray-900">{row.session}</td>
                  <td className="px-6 py-5 text-sm text-gray-500">{row.date}</td>
                  <td className="px-6 py-5 text-sm text-gray-500">{row.time}</td>
                  <td className="px-6 py-5">
                    <span className={`px-4 py-1.5 rounded-full text-xs font-medium inline-block whitespace-nowrap ${statusPill(row.status)}`}>
                      {row.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {schPageData.map((c) => (
            <div key={c.id} className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
              <div className="p-5 flex items-start justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="w-11 h-11 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center text-[#C1200C] shrink-0">
                    <CalendarDays size={18} />
                  </div>

                  <div className="flex flex-col">
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-semibold text-gray-900 leading-tight">{c.title}</span>
                      <span className={`px-4 py-1.5 rounded-full text-xs font-medium whitespace-nowrap ${statusPill(c.status)}`}>
                        {c.status}
                      </span>
                    </div>
                    <span className="text-xs text-gray-400 mt-1">{c.dateText}</span>
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-100 px-5 py-4 grid grid-cols-2 gap-4 text-sm text-gray-500">
                <div className="flex items-center gap-2">
                  <Clock3 size={16} className="text-gray-400" />
                  <span className="text-gray-400">Time:</span>
                  <span className="text-gray-900 font-medium">{c.time}</span>
                </div>

                <div className="flex items-center gap-2">
                  <MapPin size={16} className="text-gray-400" />
                  <span className="text-gray-400">Location:</span>
                  <span className="text-gray-900 font-medium">{c.location}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      <div className="flex items-center justify-between mt-auto text-sm text-gray-900 font-medium pb-8">
        <span>{showingText}</span>

        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              if (activeTab === 'attendance') setAttendancePage((p) => Math.max(p - 1, 1));
              else setSchedulePage((p) => Math.max(p - 1, 1));
            }}
            disabled={currentPage === 1}
            className={`w-8 h-8 flex items-center justify-center rounded-full border border-gray-200 transition-colors ${currentPage === 1 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:bg-gray-50 cursor-pointer'
              }`}
          >
            <ChevronLeft size={16} />
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1)
            .slice(0, 3)
            .map((page) => (
              <span
                key={page}
                onClick={() => {
                  if (activeTab === 'attendance') setAttendancePage(page);
                  else setSchedulePage(page);
                }}
                className={`px-1 cursor-pointer transition-colors ${currentPage === page ? 'text-gray-900 font-semibold' : 'text-gray-400 hover:text-gray-900'
                  }`}
              >
                {page}
              </span>
            ))}

          <button
            onClick={() => {
              if (activeTab === 'attendance') setAttendancePage((p) => Math.min(p + 1, attTotalPages));
              else setSchedulePage((p) => Math.min(p + 1, schTotalPages));
            }}
            disabled={currentPage === totalPages}
            className={`w-8 h-8 flex items-center justify-center rounded-full border border-gray-200 transition-colors ${currentPage === totalPages ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:bg-gray-50 cursor-pointer'
              }`}
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AttendanceSchedule;