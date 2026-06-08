import React, { useMemo, useRef, useState } from 'react';
import {
  Search,
  ChevronLeft,
  ChevronRight,
  Upload,
  CalendarDays,
  Users,
  Percent,
  ClipboardList,
  CheckCircle2,
  TrendingUp,
  Clock3,
  MapPin,
  Pencil,
  Trash2,
  FileSearch,
  Plus,
  X,
  ChevronDown,
} from 'lucide-react';
import { createPortal } from 'react-dom';
import NotificationModal from '../../components/ui/NotificationModal';

// Data Mocks
const initialAttendanceRows = [
  { id: 'att-1', session: 'Basketball Offensive Training', date: 'April 26, 2025', time: '15:00', present: 28, excused: 1, absent: 1 },
  { id: 'att-2', session: 'Basic Dribbling Practice', date: 'April 22, 2025', time: '15:00', present: 28, excused: 1, absent: 1 },
  { id: 'att-3', session: 'Mini Match Simulation', date: 'April 19, 2025', time: '15:00', present: 28, excused: 1, absent: 1 },
  { id: 'att-4', session: 'Physical Conditioning', date: 'April 15, 2025', time: '15:00', present: 28, excused: 1, absent: 1 },
  { id: 'att-5', session: 'Shooting Accuracy Drill', date: 'April 12, 2025', time: '15:00', present: 28, excused: 1, absent: 1 },
  { id: 'att-6', session: 'Defense Rotation', date: 'April 08, 2025', time: '15:00', present: 27, excused: 2, absent: 1 },
];

// Schedule cards
const initialScheduleCards = [
  { id: 'sch-1', title: 'Basketball Offensive Training', dateText: 'Monday, 20 April 2026', status: 'Upcoming', time: '15:00', location: 'Basketball Court' },
  { id: 'sch-2', title: 'Basketball Offensive Training', dateText: 'Monday, 20 April 2026', status: 'Upcoming', time: '15:00', location: 'Basketball Court' },
  { id: 'sch-3', title: 'Basketball Offensive Training', dateText: 'Monday, 20 April 2026', status: 'Upcoming', time: '15:00', location: 'Basketball Court' },
  { id: 'sch-4', title: 'Basketball Offensive Training', dateText: 'Monday, 20 April 2026', status: 'Completed', time: '15:00', location: 'Basketball Court' },
];

const scheduleStatusPill = (status) => {
  switch (status) {
    case 'Upcoming':
      return 'bg-[#FFF7ED] text-[#FB6514]';
    case 'Completed':
      return 'bg-[#ECFDF3] text-[#12B76A]';
    default:
      return 'bg-gray-100 text-gray-500';
  }
};

// CSV Helper Functions
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

// Take Attendance Drawer - Dummy students
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

// Helper Calendar
const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const DAY_NAMES_SHORT = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

// Arrays for Time Picker
const hoursList = Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, '0'));
const minutesList = Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, '0'));

const generateCalendarDays = (monthStr, yearStr) => {
  const monthIndex = MONTH_NAMES.indexOf(monthStr);
  const year = parseInt(yearStr, 10);

  if (monthIndex === -1 || isNaN(year)) return [];

  const firstDay = new Date(year, monthIndex, 1);
  const lastDay = new Date(year, monthIndex + 1, 0);

  const daysInMonth = lastDay.getDate();
  const startingDayOfWeek = firstDay.getDay();

  const startOffset = startingDayOfWeek === 0 ? 6 : startingDayOfWeek - 1;
  const daysInPrevMonth = new Date(year, monthIndex, 0).getDate();

  const days = [];

  for (let i = 0; i < startOffset; i++) {
    days.push({ value: daysInPrevMonth - startOffset + 1 + i, type: 'prev' });
  }

  for (let i = 1; i <= daysInMonth; i++) {
    days.push({ value: i, type: 'current' });
  }

  const totalCells = Math.ceil(days.length / 7) * 7;
  const remainingCells = totalCells - days.length;
  for (let i = 1; i <= remainingCells; i++) {
    days.push({ value: i, type: 'next' });
  }

  return days;
};

// Right Drawer: Take Attendance
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


const ScheduleDrawer = ({ isOpen, onClose, onSave, mode, initialData }) => {
  const [session, setSession] = useState('');
  const [location, setLocation] = useState('Select Location');
  const [startSession, setStartSession] = useState('Select time');

  // Date Picker internal states
  const [dateText, setDateText] = useState('Select Date Session');
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [pickerMonth, setPickerMonth] = useState('April');
  const [pickerYear, setPickerYear] = useState('2026');
  const [pickerSelectedDay, setPickerSelectedDay] = useState(20);
  const [pickerDropdown, setPickerDropdown] = useState(null);

  // Time Picker internal states
  const [isTimeDropdownOpen, setIsTimeDropdownOpen] = useState(false);
  const [pickerHour, setPickerHour] = useState('15');
  const [pickerMinute, setPickerMinute] = useState('00');

  const [isLocationDropdownOpen, setIsLocationDropdownOpen] = useState(false);
  const locationOptions = ["Basketball Court", "Robotics Lab", "Computer Lab", "Library", "Room 201"];

  const calendarDays = useMemo(() =>
    generateCalendarDays(pickerMonth, pickerYear),
    [pickerMonth, pickerYear]);

  React.useEffect(() => {
    if (isOpen) {
      if (mode === 'edit' && initialData) {
        setSession(initialData.title);
        setLocation(initialData.location);
        setStartSession(initialData.time);
        setDateText(initialData.dateText);

        const parts = initialData.dateText.split(', ');
        if (parts.length === 2) {
          const dateParts = parts[1].split(' ');
          if (dateParts.length === 3) {
            setPickerSelectedDay(parseInt(dateParts[0], 10));
            setPickerMonth(dateParts[1]);
            setPickerYear(dateParts[2]);
          }
        }

        if (initialData.time) {
          const [h, m] = initialData.time.split(':');
          if (h) setPickerHour(h);
          if (m) setPickerMinute(m);
        }

      } else {
        setSession('');
        setLocation('Select Location');
        setStartSession('Select time');
        setDateText('Select Date Session');
        setPickerMonth('April');
        setPickerYear('2026');
        setPickerSelectedDay(20);
        setPickerHour('15');
        setPickerMinute('00');
      }
      setIsDatePickerOpen(false);
      setPickerDropdown(null);
      setIsLocationDropdownOpen(false);
      setIsTimeDropdownOpen(false);
    }
  }, [isOpen, mode, initialData]);

  const handleMonthChange = (m) => {
    setPickerMonth(m);
    setPickerDropdown(null);
    const maxDays = new Date(parseInt(pickerYear, 10), MONTH_NAMES.indexOf(m) + 1, 0).getDate();
    if (pickerSelectedDay > maxDays) setPickerSelectedDay(maxDays);
  };

  const handleYearChange = (y) => {
    setPickerYear(y);
    setPickerDropdown(null);
    const maxDays = new Date(parseInt(y, 10), MONTH_NAMES.indexOf(pickerMonth) + 1, 0).getDate();
    if (pickerSelectedDay > maxDays) setPickerSelectedDay(maxDays);
  };

  const applyPickerDate = () => {
    const monthIdx = MONTH_NAMES.indexOf(pickerMonth);
    const dayObj = new Date(parseInt(pickerYear, 10), monthIdx, pickerSelectedDay);
    const weekdayStr = DAY_NAMES_SHORT[dayObj.getDay()];
    setDateText(`${weekdayStr}, ${pickerSelectedDay} ${pickerMonth} ${pickerYear}`);
    setIsDatePickerOpen(false);
  };

  const isFormValid = session.trim() !== '' && !location.includes('Select') && !dateText.includes('Select') && !startSession.includes('Select');

  const handleSaveClick = () => {
    let calcStatus = 'Upcoming';

    if (!dateText.includes('Select') && !startSession.includes('Select')) {
      const parts = dateText.split(', ');
      if (parts.length === 2) {
        const dateParts = parts[1].split(' ');
        if (dateParts.length === 3) {
          const day = parseInt(dateParts[0], 10);
          const month = MONTH_NAMES.indexOf(dateParts[1]);
          const year = parseInt(dateParts[2], 10);
          const [hr, min] = startSession.split(':').map(Number);

          const selectedDate = new Date(year, month, day, hr, min);
          const currentDate = new Date();

          if (selectedDate < currentDate) {
            calcStatus = 'Completed';
          }
        }
      }
    }

    onSave({
      title: session,
      dateText,
      location,
      time: startSession,
      status: calcStatus
    });
  };

  return (
    <>
      <div
        className={`fixed inset-0 z-40 transition-opacity duration-300 ${isOpen ? 'opacity-100 bg-black/40 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />

      <div
        className={`fixed top-0 right-0 h-full w-180 bg-white z-50 shadow-2xl transform transition-transform duration-300 ease-in-out flex flex-col ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-7 py-5 border-b border-gray-100 bg-white shrink-0">
          <h3 className="text-[16px] font-semibold text-gray-900">
            {mode === 'edit' ? 'Edit Schedule' : 'Add Schedule'}
          </h3>
          <button type="button" onClick={onClose} className="w-10 h-10 flex items-center justify-center rounded-xl text-gray-400 hover:bg-gray-50 transition-colors cursor-pointer">
            <X size={18} />
          </button>
        </div>

        {/* Content Body */}
        <div className="px-7 pt-6 pb-6 overflow-y-visible flex-1 flex flex-col gap-6 relative">
          {/* Session Field */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-800">Session</label>
            <input
              type="text"
              value={session}
              onChange={(e) => setSession(e.target.value)}
              placeholder="Enter Session Today"
              className="w-full px-5 py-3 rounded-2xl border border-gray-200 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-[#C1200C] focus:border-[#C1200C] transition-colors bg-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-5 relative">
            {/* Date Session Field */}
            <div className="flex flex-col gap-2 relative">
              <label className="text-sm font-medium text-gray-800">Date Session</label>
              <button
                type="button"
                onClick={() => {
                  setIsLocationDropdownOpen(false);
                  setIsTimeDropdownOpen(false);
                  setIsDatePickerOpen(!isDatePickerOpen);
                }}
                className={`w-full px-5 py-3 rounded-2xl border bg-white flex items-center justify-between text-sm cursor-pointer transition-colors ${isDatePickerOpen ? 'border-[#C1200C]' : 'border-gray-200'} ${dateText.includes('Select') ? 'text-gray-400' : 'text-gray-900'}`}
              >
                <span className="truncate">{dateText}</span>
                <ChevronDown size={16} className="text-gray-400" />
              </button>

              {/* Date Picker */}
              {isDatePickerOpen && (
                <div className="absolute top-22 left-0 z-50 w-85 bg-white rounded-3xl shadow-[0_12px_40px_-12px_rgba(0,0,0,0.15)] border border-gray-100 p-6 pb-5 text-left">
                  <div className="flex items-center gap-3 mb-6">
                    {/* Month inside Picker */}
                    <div className="relative flex-1">
                      <button
                        type="button"
                        onClick={() => setPickerDropdown(pickerDropdown === 'month' ? null : 'month')}
                        className="w-full px-4 py-2.5 rounded-[14px] border border-gray-200 bg-white flex items-center justify-between text-sm text-gray-900 hover:bg-gray-50 transition-colors cursor-pointer"
                      >
                        <span className="font-medium">{pickerMonth}</span>
                        <ChevronDown size={16} className="text-gray-500" />
                      </button>

                      {pickerDropdown === 'month' && (
                        <>
                          <div className="fixed inset-0 z-10" onClick={() => setPickerDropdown(null)} />
                          <div className="absolute left-0 top-full mt-2 w-full bg-white border border-gray-100 rounded-[14px] shadow-lg z-20 py-2 max-h-48 overflow-y-auto">
                            {MONTH_NAMES.map((m) => (
                              <button key={m} type="button" onClick={() => handleMonthChange(m)} className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer">
                                {m}
                              </button>
                            ))}
                          </div>
                        </>
                      )}
                    </div>

                    {/* Year inside Picker */}
                    <div className="relative w-25">
                      <button
                        type="button"
                        onClick={() => setPickerDropdown(pickerDropdown === 'year' ? null : 'year')}
                        className="w-full px-4 py-2.5 rounded-[14px] border border-gray-200 bg-white flex items-center justify-between text-sm text-gray-900 hover:bg-gray-50 transition-colors cursor-pointer"
                      >
                        <span className="font-medium">{pickerYear}</span>
                        <ChevronDown size={16} className="text-gray-500" />
                      </button>

                      {pickerDropdown === 'year' && (
                        <>
                          <div className="fixed inset-0 z-10" onClick={() => setPickerDropdown(null)} />
                          <div className="absolute right-0 top-full mt-2 w-full bg-white border border-gray-100 rounded-[14px] shadow-lg z-20 py-2 max-h-48 overflow-y-auto">
                            {['2027', '2026', '2025', '2024', '2023'].map((y) => (
                              <button key={y} type="button" onClick={() => handleYearChange(y)} className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer">
                                {y}
                              </button>
                            ))}
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Day Names Grid */}
                  <div className="grid grid-cols-7 text-center text-[13px] font-medium text-gray-400 mb-4">
                    {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((d) => (
                      <div key={d}>{d}</div>
                    ))}
                  </div>

                  {/* Days Number Grid */}
                  <div className="grid grid-cols-7 text-center text-[14px] font-medium text-gray-900 gap-y-2 mb-4">
                    {calendarDays.map((day, idx) => {
                      const isCurrentMonth = day.type === 'current';
                      const isSelected = isCurrentMonth && day.value === pickerSelectedDay;

                      return (
                        <button
                          key={`day-${idx}`}
                          type="button"
                          onClick={() => { if (isCurrentMonth) setPickerSelectedDay(day.value); }}
                          className={`h-9 w-9 mx-auto rounded-full flex items-center justify-center transition-colors ${!isCurrentMonth ? 'text-gray-400 cursor-default hover:bg-transparent' : 'cursor-pointer'} ${isSelected ? 'bg-[#C1200C] text-white' : (isCurrentMonth ? 'hover:bg-gray-50' : '')}`}
                          disabled={!isCurrentMonth}
                        >
                          {day.value}
                        </button>
                      );
                    })}
                  </div>

                  {/* Action Buttons inside Picker */}
                  <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                    <button type="button" onClick={() => setIsDatePickerOpen(false)} className="px-4 py-2 rounded-xl border border-gray-200 text-xs font-medium text-gray-700 hover:bg-gray-50 bg-white cursor-pointer">
                      Cancel
                    </button>
                    <button type="button" onClick={applyPickerDate} className="px-4 py-2 rounded-xl bg-[#C1200C] text-white text-xs font-medium hover:bg-[#A31B0A] cursor-pointer">
                      Apply
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Location Field */}
            <div className="flex flex-col gap-2 relative">
              <label className="text-sm font-medium text-gray-800">Location</label>
              <button
                type="button"
                onClick={() => {
                  setIsDatePickerOpen(false);
                  setIsTimeDropdownOpen(false);
                  setIsLocationDropdownOpen(!isLocationDropdownOpen);
                }}
                className={`w-full px-5 py-3 rounded-2xl border bg-white flex items-center justify-between text-sm cursor-pointer transition-colors ${isLocationDropdownOpen ? 'border-[#C1200C]' : 'border-gray-200'} ${location.includes('Select') ? 'text-gray-400' : 'text-gray-900'}`}
              >
                <span className="truncate">{location}</span>
                <ChevronDown size={16} className="text-gray-400" />
              </button>

              {isLocationDropdownOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setIsLocationDropdownOpen(false)} />
                  <div className="absolute top-22 left-0 w-full bg-white border border-gray-100 rounded-2xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.12)] z-50 overflow-hidden py-2">
                    {locationOptions.map((loc) => (
                      <button
                        key={loc}
                        type="button"
                        onClick={() => {
                          setLocation(loc);
                          setIsLocationDropdownOpen(false);
                        }}
                        className="w-full text-left px-5 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
                      >
                        {loc}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Start Session Field */}
          <div className="grid grid-cols-2 gap-5 relative">
            <div className="flex flex-col gap-2 relative">
              <label className="text-sm font-medium text-gray-800">Start Session</label>
              <button
                type="button"
                onClick={() => {
                  setIsDatePickerOpen(false);
                  setIsLocationDropdownOpen(false);
                  setIsTimeDropdownOpen(!isTimeDropdownOpen);
                }}
                className={`w-full px-5 py-3 rounded-2xl border bg-white flex items-center justify-between text-sm cursor-pointer transition-colors ${isTimeDropdownOpen ? 'border-[#C1200C]' : 'border-gray-200'} ${startSession.includes('Select') ? 'text-gray-400' : 'text-gray-900'}`}
              >
                <span>{startSession}</span>
                <ChevronDown size={16} className="text-gray-400" />
              </button>

              {isTimeDropdownOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setIsTimeDropdownOpen(false)} />
                  <div className="absolute top-22 left-0 w-full bg-white border border-gray-100 rounded-2xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.12)] z-50 overflow-hidden py-2">
                    <div className="p-4 flex flex-col gap-4" onClick={(e) => e.stopPropagation()}>
                      <div className="flex justify-center items-center gap-4 h-40">
                        {/* Hours */}
                        <div className="flex flex-col overflow-y-auto h-full w-16 text-center no-scrollbar border-r border-gray-100 pr-2">
                          {hoursList.map(h => (
                            <div
                              key={h}
                              onClick={() => setPickerHour(h)}
                              className={`py-2 my-1 cursor-pointer rounded-lg transition-colors ${pickerHour === h ? 'bg-red-50 text-[#C1200C] font-bold text-lg' : 'text-gray-500 hover:bg-gray-50 text-sm'
                                }`}
                            >
                              {h}
                            </div>
                          ))}
                        </div>

                        <div className="text-xl font-bold text-gray-900">:</div>

                        {/* Minutes */}
                        <div className="flex flex-col overflow-y-auto h-full w-16 text-center no-scrollbar border-l border-gray-100 pl-2">
                          {minutesList.map(m => (
                            <div
                              key={m}
                              onClick={() => setPickerMinute(m)}
                              className={`py-2 my-1 cursor-pointer rounded-lg transition-colors ${pickerMinute === m ? 'bg-red-50 text-[#C1200C] font-bold text-lg' : 'text-gray-500 hover:bg-gray-50 text-sm'
                                }`}
                            >
                              {m}
                            </div>
                          ))}
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setStartSession(`${pickerHour}:${pickerMinute}`);
                          setIsTimeDropdownOpen(false);
                        }}
                        className="w-full py-2.5 bg-[#C1200C] text-white text-sm font-medium rounded-xl hover:bg-[#A31B0A] transition-colors cursor-pointer"
                      >
                        Set Time
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="flex-1 bg-white" />
        </div>

        {/* Footer Buttons */}
        <div className="border-t border-gray-100 px-7 py-5 bg-white grid grid-cols-2 gap-4 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="py-3.5 rounded-2xl border border-gray-200 text-sm font-medium text-gray-900 hover:bg-gray-50 transition-colors cursor-pointer bg-white"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={!isFormValid}
            onClick={handleSaveClick}
            className={`py-3.5 rounded-2xl text-sm font-medium transition-colors ${isFormValid ? 'bg-[#C1200C] text-white hover:bg-[#A31B0A] cursor-pointer' : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}
          >
            {mode === 'edit' ? 'Save Changes' : 'Add Schedule'}
          </button>
        </div>
      </div>
    </>
  );
};

const AttendanceSchedule = () => {
  const [activeTab, setActiveTab] = useState('attendance');
  const [searchQuery, setSearchQuery] = useState('');

  // Attendance pagination
  const [attendancePage, setAttendancePage] = useState(1);
  const ATT_ITEMS_PER_PAGE = 5;

  // Schedule pagination
  const [schedulePage, setSchedulePage] = useState(1);
  const SCH_ITEMS_PER_PAGE = 4;

  // Data states
  const [attendanceRows, setAttendanceRows] = useState(initialAttendanceRows);
  const [scheduleCards, setScheduleCards] = useState(initialScheduleCards);
  const ongoingAttendanceRowId = 'att-1';

  // State for Right Drawers
  const [isTakeOpen, setIsTakeOpen] = useState(false);
  const [isScheduleDrawerOpen, setIsScheduleDrawerOpen] = useState(false);
  const [scheduleDrawerMode, setScheduleDrawerMode] = useState('add'); // 'add' | 'edit'
  const [selectedScheduleData, setSelectedScheduleData] = useState(null);

  // State for Notification Modals
  const [isAddSuccessOpen, setIsAddSuccessOpen] = useState(false);
  const [isEditSuccessOpen, setIsEditSuccessOpen] = useState(false);
  const [isDeleteSuccessOpen, setIsDeleteSuccessOpen] = useState(false);
  const [isAttendanceSuccessOpen, setIsAttendanceSuccessOpen] = useState(false); // NEW STATE FOR ATTENDANCE NOTIFICATION

  // Attendance Filtering + Pagination
  const filteredAttendance = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return attendanceRows;

    return attendanceRows.filter((r) => {
      const haystack = `${r.session} ${r.date} ${r.time} ${r.present} ${r.excused} ${r.absent}`.toLowerCase();
      return haystack.includes(q);
    });
  }, [attendanceRows, searchQuery]);

  const attTotalPages = Math.max(1, Math.ceil(filteredAttendance.length / ATT_ITEMS_PER_PAGE));
  const attPageData = filteredAttendance.slice(
    (attendancePage - 1) * ATT_ITEMS_PER_PAGE,
    attendancePage * ATT_ITEMS_PER_PAGE
  );

  const attEmpty = filteredAttendance.length === 0;

  // Schedule Filtering + Pagination
  const filteredSchedule = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return scheduleCards;

    return scheduleCards.filter((c) => {
      const haystack = `${c.title} ${c.dateText} ${c.status} ${c.time} ${c.location}`.toLowerCase();
      return haystack.includes(q);
    });
  }, [scheduleCards, searchQuery]);

  const schTotalPages = Math.max(1, Math.ceil(filteredSchedule.length / SCH_ITEMS_PER_PAGE));
  const schPageData = filteredSchedule.slice(
    (schedulePage - 1) * SCH_ITEMS_PER_PAGE,
    schedulePage * SCH_ITEMS_PER_PAGE
  );

  const schEmpty = filteredSchedule.length === 0;

  // Attendance Action Handlers
  const handleOpenAddSchedule = () => {
    setScheduleDrawerMode('add');
    setSelectedScheduleData(null);
    setIsScheduleDrawerOpen(true);
  };

  const handleOpenEditSchedule = (card) => {
    setScheduleDrawerMode('edit');
    setSelectedScheduleData(card);
    setIsScheduleDrawerOpen(true);
  };

  const handleDeleteSchedule = (id) => {
    setScheduleCards((prev) => prev.filter((item) => item.id !== id));
    setTimeout(() => setIsDeleteSuccessOpen(true), 150);
  };

  const handleSaveScheduleSubmit = (formData) => {
    setIsScheduleDrawerOpen(false);
    if (scheduleDrawerMode === 'add') {
      const newCard = {
        id: `sch-${Date.now()}`,
        ...formData
      };
      setScheduleCards((prev) => [newCard, ...prev]);
      setTimeout(() => setIsAddSuccessOpen(true), 150);
    } else {
      setScheduleCards((prev) =>
        prev.map((item) => (item.id === selectedScheduleData.id ? { ...item, ...formData } : item))
      );
      setTimeout(() => setIsEditSuccessOpen(true), 150);
    }
  };

  // CSV Export Handler
  const handleExportCSV = () => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');

    if (activeTab === 'attendance') {
      const headers = [
        { key: 'session', label: 'Session' },
        { key: 'date', label: 'Date' },
        { key: 'time', label: 'Time' },
        { key: 'present', label: 'Present' },
        { key: 'excused', label: 'Excused' },
        { key: 'absent', label: 'Absent' },
      ];
      const csv = toCSV(filteredAttendance, headers);
      downloadCSV(csv, `mentor_attendance_${yyyy}-${mm}-${dd}.csv`);
      return;
    }

    const headers = [
      { key: 'title', label: 'Session' },
      { key: 'dateText', label: 'Date' },
      { key: 'status', label: 'Status' },
      { key: 'time', label: 'Time' },
      { key: 'location', label: 'Location' },
    ];
    const csv = toCSV(filteredSchedule, headers);
    downloadCSV(csv, `mentor_schedule_${yyyy}-${mm}-${dd}.csv`);
  };

  const attendanceSummary = {
    totalMeetings: 4,
    totalStudents: 1,
    avgPresent: '93.3%',
    notAttending: '6.6%',
  };

  const ongoingSession = {
    extracurricular: 'Basket',
    date: 'April 26, 2025',
    time: '15:00',
    location: 'Basketball Court',
  };

  const scheduleSummary = {
    thisWeeksSchedule: 2,
    monthsTotal: 8,
    completedSessions: 3,
    avgAttendance: '95%',
  };

  const emptyTitle = activeTab === 'attendance' ? 'No Attendance Found' : 'No Schedule Found';
  const emptyDesc =
    activeTab === 'attendance'
      ? 'No attendance match your search or filter criteria.'
      : 'No schedule match your search or filter criteria.';

  return (
    <>
      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
      <div className="p-8 pt-4 flex flex-col flex-1 gap-6 relative z-0 isolate min-h-screen bg-white font-sans">
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
              }}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-medium transition-colors cursor-pointer ${activeTab === 'schedule' ? 'text-gray-900' : 'text-gray-400'
                }`}
            >
              <CalendarDays size={16} className={activeTab === 'schedule' ? 'text-gray-900' : 'text-gray-400'} />
              Schedule
            </button>
          </div>
        </div>

        {/* Top Cards */}
        {activeTab === 'attendance' ? (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            <div className="bg-gray-50 border border-gray-200 rounded-2xl p-1.5">
              <h2 className="text-base font-semibold text-gray-900 mb-3 pl-4">Overview</h2>
              <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
                <div className="grid grid-cols-2">
                  <div className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl border border-gray-200 flex items-center justify-center text-gray-500 bg-white shrink-0">
                        <CalendarDays size={18} />
                      </div>
                      <span className="text-sm font-semibold text-gray-900">Total Meetings</span>
                    </div>
                    <div className="mt-6">
                      <div className="text-3xl font-semibold text-gray-900 leading-none">{attendanceSummary.totalMeetings}</div>
                      <div className="text-xs text-gray-400 mt-3">All scheduled meetings</div>
                    </div>
                  </div>
                  <div className="border-l border-gray-200 px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl border border-gray-200 flex items-center justify-center text-gray-500 bg-white shrink-0">
                        <Users size={18} />
                      </div>
                      <span className="text-sm font-semibold text-gray-900">Total Students</span>
                    </div>
                    <div className="mt-6">
                      <div className="text-3xl font-semibold text-gray-900 leading-none">{attendanceSummary.totalStudents}</div>
                      <div className="text-xs text-gray-400 mt-3">All registered students</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 border border-gray-200 rounded-2xl p-1.5">
              <h2 className="text-base font-semibold text-gray-900 mb-3 pl-4">Attendance Percentage</h2>
              <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
                <div className="grid grid-cols-2">
                  <div className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl border border-gray-200 flex items-center justify-center text-gray-500 bg-white shrink-0">
                        <Percent size={18} />
                      </div>
                      <span className="text-sm font-semibold text-gray-900">Average Present</span>
                    </div>
                    <div className="mt-6">
                      <div className="text-3xl font-semibold text-gray-900 leading-none">{attendanceSummary.avgPresent}</div>
                      <div className="text-xs text-gray-400 mt-3">Percentage of attendance</div>
                    </div>
                  </div>
                  <div className="border-l border-gray-200 px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl border border-gray-200 flex items-center justify-center text-gray-500 bg-white shrink-0">
                        <Percent size={18} />
                      </div>
                      <span className="text-sm font-semibold text-gray-900">Not Attending</span>
                    </div>
                    <div className="mt-6">
                      <div className="text-3xl font-semibold text-gray-900 leading-none">{attendanceSummary.notAttending}</div>
                      <div className="text-xs text-gray-400 mt-3">Excused and absent combined</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
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

        {/* Attendance tab: Ongoing Session */}
        {activeTab === 'attendance' && (
          <div className="w-full bg-white border border-gray-200 rounded-2xl overflow-hidden">
            <div className="flex items-center gap-3 px-6 py-4 border-b border-gray-200 bg-[#F8F9FA]">
              <CalendarDays size={18} className="text-gray-900" />
              <span className="text-sm font-semibold text-gray-900">Ongoing Session</span>
            </div>
            <div className="grid grid-cols-12">
              <div className="col-span-3 px-6 py-6 border-r border-gray-100 text-center">
                <p className="text-xs text-gray-400 mb-2">Extracurricular</p>
                <div className="text-base font-semibold text-gray-900">{ongoingSession.extracurricular}</div>
              </div>
              <div className="col-span-3 px-6 py-6 border-r border-gray-100 text-center">
                <p className="text-xs text-gray-400 mb-2">Date</p>
                <div className="text-base font-semibold text-gray-900">{ongoingSession.date}</div>
              </div>
              <div className="col-span-3 px-6 py-6 border-r border-gray-100 text-center">
                <p className="text-xs text-gray-400 mb-2">Time</p>
                <div className="text-base font-semibold text-gray-900">{ongoingSession.time}</div>
              </div>
              <div className="col-span-3 px-6 py-6 text-center">
                <p className="text-xs text-gray-400 mb-2">Location</p>
                <div className="text-base font-semibold text-gray-900">{ongoingSession.location}</div>
              </div>
            </div>
            <div className="px-6 py-5 flex justify-end border-t border-gray-100 bg-white">
              <button
                type="button"
                onClick={() => setIsTakeOpen(true)}
                className="px-6 py-2.5 rounded-xl bg-[#C1200C] hover:bg-[#A31B0A] text-sm font-medium text-white transition-colors cursor-pointer"
              >
                Take Attendance
              </button>
            </div>
          </div>
        )}

        {/* Search + Right action */}
        <div className="flex items-center justify-between gap-4">
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

          <div className="flex items-center gap-3 shrink-0">
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
              <>
                <button
                  type="button"
                  onClick={handleExportCSV}
                  className="h-11 px-5 rounded-xl border border-gray-200 text-sm text-gray-700 flex items-center gap-3 hover:bg-gray-50 transition bg-white cursor-pointer"
                >
                  <Upload size={16} className="text-gray-500" />
                  Export CSV
                </button>
                <button
                  type="button"
                  onClick={handleOpenAddSchedule}
                  className="h-11 px-5 rounded-xl bg-[#C1200C] hover:bg-[#A31B0A] text-sm text-white flex items-center gap-3 transition cursor-pointer"
                >
                  <Plus size={16} />
                  Add Schedule
                </button>
              </>
            )}
          </div>
        </div>

        {/* Main content area */}
        {activeTab === 'attendance' ? (
          attEmpty ? (
            <div className="flex flex-col items-center justify-center flex-1 py-20 pb-40">
              <div className="w-20 h-20 bg-[#FEF2F2] rounded-3xl flex items-center justify-center mb-6">
                <FileSearch size={32} className="text-[#C1200C]" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2 tracking-tight">{emptyTitle}</h3>
              <p className="text-sm text-gray-400 text-center max-w-sm leading-relaxed">{emptyDesc}</p>
            </div>
          ) : (
            <>
              <div className="w-full overflow-x-auto">
                <table className="w-full text-left border-separate border-spacing-0">
                  <thead>
                    <tr className="bg-[#F8F9FA]">
                      <th className="px-6 py-4 text-sm font-semibold text-gray-900 border-l border-t border-b border-gray-200 rounded-tl-2xl rounded-bl-2xl w-[34%]">
                        Session
                      </th>
                      <th className="px-6 py-4 text-sm font-semibold text-gray-900 border-t border-b border-gray-200 w-[18%]">
                        Date
                      </th>
                      <th className="px-6 py-4 text-sm font-semibold text-gray-900 border-t border-b border-gray-200 w-[12%]">
                        Time
                      </th>
                      <th className="px-6 py-4 text-sm font-semibold text-gray-900 border-t border-b border-gray-200 text-center w-[12%]">
                        Present
                      </th>
                      <th className="px-6 py-4 text-sm font-semibold text-gray-900 border-t border-b border-gray-200 text-center w-[12%]">
                        Excused
                      </th>
                      <th className="px-6 py-4 text-sm font-semibold text-gray-900 border-r border-t border-b border-gray-200 rounded-tr-2xl rounded-br-2xl text-center w-[12%]">
                        Absent
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {attPageData.map((row) => (
                      <tr key={row.id} className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors">
                        <td className="px-6 py-5 text-sm font-medium text-gray-900">{row.session}</td>
                        <td className="px-6 py-5 text-sm text-gray-500">{row.date}</td>
                        <td className="px-6 py-5 text-sm text-gray-500">{row.time}</td>
                        <td className="px-6 py-5 text-sm text-gray-500 text-center">{row.present} Student</td>
                        <td className="px-6 py-5 text-sm text-gray-500 text-center">{row.excused} Student</td>
                        <td className="px-6 py-5 text-sm text-gray-500 text-center">{row.absent} Student</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="flex items-center justify-between mt-2 text-sm text-gray-900 font-medium pb-8">
                <span>
                  Showing {filteredAttendance.length === 0 ? 0 : (attendancePage - 1) * ATT_ITEMS_PER_PAGE + 1}-
                  {Math.min(attendancePage * ATT_ITEMS_PER_PAGE, filteredAttendance.length)} of {filteredAttendance.length} Data
                </span>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setAttendancePage((p) => Math.max(p - 1, 1))}
                    disabled={attendancePage === 1}
                    className={`w-8 h-8 flex items-center justify-center rounded-full border border-gray-200 transition-colors ${attendancePage === 1 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:bg-gray-50 cursor-pointer'
                      }`}
                  >
                    <ChevronLeft size={16} />
                  </button>
                  {Array.from({ length: attTotalPages }, (_, i) => i + 1)
                    .slice(0, 3)
                    .map((page) => (
                      <span
                        key={page}
                        onClick={() => setAttendancePage(page)}
                        className={`px-1 cursor-pointer transition-colors ${attendancePage === page ? 'text-gray-900 font-semibold' : 'text-gray-400 hover:text-gray-900'
                          }`}
                      >
                        {page}
                      </span>
                    ))}
                  <button
                    onClick={() => setAttendancePage((p) => Math.min(p + 1, attTotalPages))}
                    disabled={attendancePage === attTotalPages}
                    className={`w-8 h-8 flex items-center justify-center rounded-full border border-gray-200 transition-colors ${attendancePage === attTotalPages ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:bg-gray-50 cursor-pointer'
                      }`}
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            </>
          )
        ) : schEmpty ? (
          <div className="flex flex-col items-center justify-center flex-1 py-20 pb-40">
            <div className="w-20 h-20 bg-[#FEF2F2] rounded-3xl flex items-center justify-center mb-6">
              <FileSearch size={32} className="text-[#C1200C]" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2 tracking-tight">{emptyTitle}</h3>
            <p className="text-sm text-gray-400 text-center max-w-sm leading-relaxed">{emptyDesc}</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              {schPageData.map((c) => (
                <div key={c.id} className="bg-white border border-gray-200 rounded-2xl p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <div className="w-11 h-11 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center text-[#C1200C] shrink-0">
                        <CalendarDays size={18} />
                      </div>
                      <div className="flex flex-col">
                        <div className="flex items-center gap-3">
                          <span className="text-sm font-semibold text-gray-900 leading-tight">{c.title}</span>
                          <span className={`px-4 py-1.5 rounded-full text-xs font-medium whitespace-nowrap ${scheduleStatusPill(c.status)}`}>
                            {c.status}
                          </span>
                        </div>
                        <span className="text-xs text-gray-400 mt-1">{c.dateText}</span>
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => handleOpenEditSchedule(c)}
                        className="w-10 h-10 rounded-xl border border-gray-200 flex items-center justify-center text-gray-700 hover:bg-gray-50 transition cursor-pointer"
                        aria-label="Edit"
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteSchedule(c.id)}
                        className="w-10 h-10 rounded-xl border border-gray-200 flex items-center justify-center text-[#C1200C] hover:bg-red-50 transition cursor-pointer"
                        aria-label="Delete"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-gray-100 grid grid-cols-2 gap-4 text-xs text-gray-500">
                    <div className="flex items-center gap-2">
                      <Clock3 size={14} className="text-gray-400" />
                      <span className="text-gray-400">Time:</span>
                      <span className="text-gray-900 font-medium">{c.time}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin size={14} className="text-gray-400" />
                      <span className="text-gray-400">Location:</span>
                      <span className="text-gray-900 font-medium">{c.location}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination Schedule */}
            <div className="flex items-center justify-between mt-auto text-sm text-gray-900 font-medium pb-8">
              <span>
                Showing {filteredSchedule.length === 0 ? 0 : (schedulePage - 1) * SCH_ITEMS_PER_PAGE + 1}-
                {Math.min(schedulePage * SCH_ITEMS_PER_PAGE, filteredSchedule.length)} of {filteredSchedule.length} Data
              </span>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setSchedulePage((p) => Math.max(p - 1, 1))}
                  disabled={schedulePage === 1}
                  className={`w-8 h-8 flex items-center justify-center rounded-full border border-gray-200 transition-colors ${schedulePage === 1 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:bg-gray-50 cursor-pointer'
                    }`}
                >
                  <ChevronLeft size={16} />
                </button>
                {Array.from({ length: schTotalPages }, (_, i) => i + 1)
                  .slice(0, 3)
                  .map((page) => (
                    <span
                      key={page}
                      onClick={() => setSchedulePage(page)}
                      className={`px-1 cursor-pointer transition-colors ${schedulePage === page ? 'text-gray-900 font-semibold' : 'text-gray-400 hover:text-gray-900'
                        }`}
                    >
                      {page}
                    </span>
                  ))}
                <button
                  onClick={() => setSchedulePage((p) => Math.min(p + 1, schTotalPages))}
                  disabled={schedulePage === schTotalPages}
                  className={`w-8 h-8 flex items-center justify-center rounded-full border border-gray-200 transition-colors ${schedulePage === schTotalPages ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:bg-gray-50 cursor-pointer'
                    }`}
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Take Attendance Drawer */}
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

          setAttendanceRows((prev) =>
            prev.map((row) =>
              row.id === ongoingAttendanceRowId
                ? {
                  ...row,
                  present: counts.present,
                  excused: counts.excused,
                  absent: counts.absent,
                }
                : row
            )
          );

          setTimeout(() => setIsAttendanceSuccessOpen(true), 150);
        }}
      />

      <ScheduleDrawer
        isOpen={isScheduleDrawerOpen}
        onClose={() => setIsScheduleDrawerOpen(false)}
        onSave={handleSaveScheduleSubmit}
        mode={scheduleDrawerMode}
        initialData={selectedScheduleData}
      />

      {/* Notification Modal for Attendance Success */}
      <NotificationModal
        isOpen={isAttendanceSuccessOpen}
        type="success"
        title="Attendance Saved"
        message="The student attendance has been successfully recorded."
        buttonText="Return to Attendance"
        onButtonClick={() => setIsAttendanceSuccessOpen(false)}
        onClose={() => setIsAttendanceSuccessOpen(false)}
      />

      <NotificationModal
        isOpen={isAddSuccessOpen}
        type="success"
        title="Schedule Created"
        message="The new extracurricular schedule has been added successfully."
        buttonText="Return to Attendance & Schedule"
        onButtonClick={() => setIsAddSuccessOpen(false)}
        onClose={() => setIsAddSuccessOpen(false)}
      />

      <NotificationModal
        isOpen={isEditSuccessOpen}
        type="success"
        title="Schedule Updated"
        message="The extracurricular schedule has been successfully updated."
        buttonText="Return to Attendance & Schedule"
        onButtonClick={() => setIsEditSuccessOpen(false)}
        onClose={() => setIsEditSuccessOpen(false)}
      />

      <NotificationModal
        isOpen={isDeleteSuccessOpen}
        type="delete"
        title="Schedule Deleted"
        message="The schedule has been successfully removed from the system."
        buttonText="Return to Attendance & Schedule"
        onButtonClick={() => setIsDeleteSuccessOpen(false)}
        onClose={() => setIsDeleteSuccessOpen(false)}
      />
    </>
  );
};

export default AttendanceSchedule;