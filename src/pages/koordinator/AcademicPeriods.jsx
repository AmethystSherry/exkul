import React, { useMemo, useState } from 'react';
import {
  Search,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  MoreVertical,
  Plus,
  CalendarDays,
  X,
  Dot,
  Share,
  Trash2
} from 'lucide-react';
import NotificationModal from '../../components/ui/NotificationModal';
import { createPortal } from 'react-dom';

// Data Mocks
const initialAcademicPeriods = [
  { id: 'ap1', period: '2025/2026', semester: 'Odd Semester', status: 'Active' },
  { id: 'ap2', period: '2024/2025', semester: 'Even Semester', status: 'Inactive' },
  { id: 'ap3', period: '2023/2024', semester: 'Odd Semester', status: 'Inactive' },
  { id: 'ap4', period: '2022/2023', semester: 'Odd Semester', status: 'Inactive' },
  { id: 'ap5', period: '2021/2022', semester: 'Even Semester', status: 'Inactive' },
];

const semesterPillStyle = (semester) => {
  switch (semester) {
    case 'Odd Semester':
      return 'bg-[#EFF8FF] text-[#2E90FA]';
    case 'Even Semester':
      return 'bg-[#FFF7ED] text-[#FB6514]';
    default:
      return 'bg-gray-100 text-gray-500';
  }
};

const statusPillStyle = (status) => {
  switch (status) {
    case 'Active':
      return 'bg-[#ECFDF3] text-[#12B76A]';
    case 'Inactive':
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

const AcademicPeriods = () => {
  const [data, setData] = useState(initialAcademicPeriods);
  const [searchQuery, setSearchQuery] = useState('');

  const [filterSemester, setFilterSemester] = useState('All Semesters');
  const [filterStatus, setFilterStatus] = useState('All Status');
  const [openFilter, setOpenFilter] = useState(null); // 'semester' | 'status' | null

  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 5;

  const [openActionMenuId, setOpenActionMenuId] = useState(null);

  const [activeYear] = useState('2025/2026');
  const [activeSemester] = useState('Odd Semester');
  const [enrollmentStatus, setEnrollmentStatus] = useState('Open'); // Open | Closed (mock)
  
  const [deadline, setDeadline] = useState('January 31, 2025');

  // Drawer states
  const [isAddDrawerOpen, setIsAddDrawerOpen] = useState(false);
  const [drawerMode, setDrawerMode] = useState('add'); // 'add' | 'edit'
  const [editId, setEditId] = useState(null);
  
  const [newPeriod, setNewPeriod] = useState('');
  const [newSemester, setNewSemester] = useState('Select Semester');
  const [newStatus, setNewStatus] = useState('Select Status');
  const [addDropdown, setAddDropdown] = useState(null); 
  const [isAddSuccessOpen, setIsAddSuccessOpen] = useState(false);
  
  const [isDeleteSuccessOpen, setIsDeleteSuccessOpen] = useState(false);

  // Change Enrollment Status Modal
  const [isChangeEnrollOpen, setIsChangeEnrollOpen] = useState(false);
  const [enrollValue, setEnrollValue] = useState(enrollmentStatus);
  const [isEnrollDropdownOpen, setIsEnrollDropdownOpen] = useState(false);

  // Edit Deadline Modal
  const [isEditDeadlineOpen, setIsEditDeadlineOpen] = useState(false);
  const [deadlineMonth, setDeadlineMonth] = useState('January');
  const [deadlineYear, setDeadlineYear] = useState('2025');
  const [deadlineSelectedDay, setDeadlineSelectedDay] = useState(31);
  const [deadlineDropdown, setDeadlineDropdown] = useState(null);

  const calendarDays = useMemo(() => 
    generateCalendarDays(deadlineMonth, deadlineYear), 
  [deadlineMonth, deadlineYear]);

  const semesterOptions = ['All Semesters', 'Odd Semester', 'Even Semester'];
  const statusOptions = ['All Status', 'Active', 'Inactive'];

  const filtered = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return data.filter((row) => {
      const matchesSearch =
        q === '' ||
        row.period.toLowerCase().includes(q) ||
        row.semester.toLowerCase().includes(q) ||
        row.status.toLowerCase().includes(q);

      const matchesSemester = filterSemester === 'All Semesters' || row.semester === filterSemester;
      const matchesStatus = filterStatus === 'All Status' || row.status === filterStatus;

      return matchesSearch && matchesSemester && matchesStatus;
    });
  }, [data, searchQuery, filterSemester, filterStatus]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const currentTableData = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const handleFilterSelect = (type, value) => {
    if (type === 'semester') setFilterSemester(value);
    if (type === 'status') setFilterStatus(value);
    setOpenFilter(null);
    setOpenActionMenuId(null);
    setCurrentPage(1);
  };

  const closeAllOverlays = () => {
    setOpenFilter(null);
    setOpenActionMenuId(null);
    setAddDropdown(null);
    setIsEnrollDropdownOpen(false);
  };

  const isEmpty = filtered.length === 0;

  // Drawer Handlers
  const openAdd = () => {
    closeAllOverlays();
    setDrawerMode('add');
    setEditId(null);
    setNewPeriod('');
    setNewSemester('Select Semester');
    setNewStatus('Select Status');
    setIsAddDrawerOpen(true);
  };

  const openEdit = (row) => {
    closeAllOverlays();
    setDrawerMode('edit');
    setEditId(row.id);
    setNewPeriod(row.period);
    setNewSemester(row.semester);
    setNewStatus(row.status);
    setIsAddDrawerOpen(true);
  };

  const closeAdd = () => {
    setIsAddDrawerOpen(false);
    setAddDropdown(null);
  };

  const submitAdd = (e) => {
    e?.preventDefault?.();
    if (newPeriod.trim() === '' || newSemester.includes('Select') || newStatus.includes('Select')) return;

    if (drawerMode === 'add') {
      const newItem = {
        id: `ap-${Date.now()}`,
        period: newPeriod.trim(),
        semester: newSemester,
        status: newStatus,
      };
      setData((prev) => [newItem, ...prev]);
      closeAdd();
      setTimeout(() => setIsAddSuccessOpen(true), 150);
    } else {
      setData((prev) => prev.map(item => 
        item.id === editId 
          ? { ...item, period: newPeriod.trim(), semester: newSemester, status: newStatus }
          : item
      ));
      closeAdd();
      setTimeout(() => setIsSavedNotifOpen(true), 150);
    }
  };

  const handleDeletePeriod = (id) => {
    setData((prev) => prev.filter(item => item.id !== id));
    setOpenActionMenuId(null);
    setTimeout(() => setIsDeleteSuccessOpen(true), 150); // Menampilkan notifikasi delete
  };

  const isAddFormValid =
    newPeriod.trim() !== '' &&
    !newSemester.includes('Select') &&
    !newStatus.includes('Select');

  const openEnroll = () => {
    closeAllOverlays();
    setEnrollValue(enrollmentStatus);
    setIsEnrollDropdownOpen(false);
    setIsChangeEnrollOpen(true);
  };

  const closeEnroll = () => {
    setIsChangeEnrollOpen(false);
    setIsEnrollDropdownOpen(false);
  };

  const submitEnroll = () => {
    setEnrollmentStatus(enrollValue);
    closeEnroll();
  };

  const openDeadline = () => {
    closeAllOverlays();
    
    const parts = deadline.replace(',', '').split(' ');
    if (parts.length === 3) {
      setDeadlineMonth(parts[0]);
      setDeadlineSelectedDay(parseInt(parts[1], 10));
      setDeadlineYear(parts[2]);
    }
    
    setDeadlineDropdown(null);
    setIsEditDeadlineOpen(true);
  };

  const closeDeadline = () => {
    setIsEditDeadlineOpen(false);
    setDeadlineDropdown(null);
  };

  const applyDeadline = () => {
    setDeadline(`${deadlineMonth} ${deadlineSelectedDay}, ${deadlineYear}`);
    closeDeadline();
  };

  const handleMonthChange = (newMonth) => {
    setDeadlineMonth(newMonth);
    setDeadlineDropdown(null);
    const maxDays = new Date(parseInt(deadlineYear, 10), MONTH_NAMES.indexOf(newMonth) + 1, 0).getDate();
    if (deadlineSelectedDay > maxDays) setDeadlineSelectedDay(maxDays);
  };

  const handleYearChange = (newYear) => {
    setDeadlineYear(newYear);
    setDeadlineDropdown(null);
    const maxDays = new Date(parseInt(newYear, 10), MONTH_NAMES.indexOf(deadlineMonth) + 1, 0).getDate();
    if (deadlineSelectedDay > maxDays) setDeadlineSelectedDay(maxDays);
  };

  const [isSavedNotifOpen, setIsSavedNotifOpen] = useState(false);
  const saveChanges = () => {
    setTimeout(() => setIsSavedNotifOpen(true), 120);
  };

  const modalRoot = document.getElementById('modal-root') || document.body;

  return (
    <>
      <div className="p-8 pt-4 flex flex-col flex-1 gap-6 relative min-h-screen bg-white font-sans">
        <div className="flex items-center justify-between">
          <div className="relative w-80">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-11 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-[#C1200C] focus:border-[#C1200C] transition-all placeholder:text-gray-400"
            />
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center">
              <div className="relative">
                <button
                  onClick={() => setOpenFilter(openFilter === 'semester' ? null : 'semester')}
                  className={`flex items-center gap-3 px-5 py-2.5 text-sm font-medium transition-colors cursor-pointer rounded-l-xl border bg-white ${openFilter === 'semester'
                    ? 'border-[#C1200C] text-gray-500 z-10 relative'
                    : 'border-gray-200 text-gray-500 hover:bg-gray-50 relative z-0'
                    }`}
                >
                  <span className="truncate max-w-32">{filterSemester}</span>
                  <ChevronDown size={14} className="text-gray-400 shrink-0" />
                </button>

                {openFilter === 'semester' && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setOpenFilter(null)} />
                    <div className="absolute left-0 top-full mt-2 w-56 bg-white border border-gray-100 rounded-2xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] z-20 overflow-hidden py-2">
                      {semesterOptions.map((opt) => (
                        <button
                          key={opt}
                          onClick={() => handleFilterSelect('semester', opt)}
                          className={`w-full text-left px-5 py-3 transition-colors cursor-pointer hover:bg-gray-50 flex items-center`}
                        >
                          {opt === 'All Semesters' ? (
                            <span className={`text-sm ${filterSemester === opt ? 'text-[#C1200C] font-medium' : 'text-gray-700'}`}>{opt}</span>
                          ) : (
                            <span className={`px-4 py-1.5 rounded-full text-xs font-medium inline-block whitespace-nowrap ${semesterPillStyle(opt)}`}>
                              {opt}
                            </span>
                          )}
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>

              <div className="relative -ml-px">
                <button
                  onClick={() => setOpenFilter(openFilter === 'status' ? null : 'status')}
                  className={`flex items-center gap-3 px-5 py-2.5 text-sm font-medium transition-colors cursor-pointer rounded-r-xl border bg-white ${openFilter === 'status'
                    ? 'border-[#C1200C] text-gray-500 z-10 relative'
                    : 'border-gray-200 text-gray-500 hover:bg-gray-50 relative z-0'
                    }`}
                >
                  <span className="truncate max-w-28">{filterStatus}</span>
                  <ChevronDown size={14} className="text-gray-400 shrink-0" />
                </button>

                {openFilter === 'status' && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setOpenFilter(null)} />
                    <div className="absolute right-0 top-full mt-2 w-56 bg-white border border-gray-100 rounded-2xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] z-20 overflow-hidden py-2">
                      {statusOptions.map((opt) => (
                        <button
                          key={opt}
                          onClick={() => handleFilterSelect('status', opt)}
                          className={`w-full text-left px-5 py-3 transition-colors cursor-pointer hover:bg-gray-50 flex items-center`}
                        >
                          {opt === 'All Status' ? (
                            <span className={`text-sm ${filterStatus === opt ? 'text-[#C1200C] font-medium' : 'text-gray-700'}`}>{opt}</span>
                          ) : (
                            <span className={`px-4 py-1.5 rounded-full text-xs font-medium inline-block whitespace-nowrap ${statusPillStyle(opt)}`}>
                              {opt}
                            </span>
                          )}
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>

            <button
              onClick={openAdd}
              type="button"
              className="flex items-center gap-2 px-5 py-2.5 bg-[#C1200C] hover:bg-[#A31B0A] rounded-xl text-sm font-medium text-white transition-colors cursor-pointer"
            >
              <Plus size={16} /> Add Academic Periods
            </button>
          </div>
        </div>

        {/* Top card: Active Semester & Enrollment */}
        <div className="w-full bg-white border border-gray-200 rounded-2xl overflow-hidden">
          <div className="flex items-center gap-3 px-6 py-4 border-b border-gray-200 bg-[#F8F9FA]">
            <CalendarDays size={18} className="text-gray-900" />
            <span className="text-sm font-semibold text-gray-900">Active Semester &amp; Enrollment</span>
          </div>

          <div className="grid grid-cols-12">
            <div className="col-span-4 px-6 py-6 border-r border-gray-100">
              <p className="text-xs text-gray-400 mb-2">Active Academic Year</p>
              <div className="flex items-center gap-3">
                <span className="text-2xl font-bold text-gray-900 tracking-tight">{activeYear}</span>
                <span className={`px-4 py-1.5 rounded-full text-xs font-medium whitespace-nowrap ${semesterPillStyle(activeSemester)}`}>
                  {activeSemester}
                </span>
              </div>
            </div>

            <div className="col-span-4 px-6 py-6 border-r border-gray-100">
              <p className="text-xs text-gray-400 mb-2">Extracurricular Enrollment Status</p>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-3 px-5 py-2.5 rounded-full bg-[#F2F4F7] text-gray-900">
                  <span
                    className={`w-3 h-3 rounded-full ${enrollmentStatus === 'Open' ? 'bg-[#12B76A]' : 'bg-[#F04438]'
                      }`}
                  />
                  <span className="text-sm font-medium">{enrollmentStatus}</span>
                </div>

                <button
                  onClick={openEnroll}
                  type="button"
                  className="px-5 py-2 rounded-xl border border-gray-200 text-sm font-medium text-gray-900 hover:bg-gray-50 transition-colors cursor-pointer bg-white"
                >
                  Change
                </button>
              </div>
            </div>

            <div className="col-span-4 px-6 py-6">
              <p className="text-xs text-gray-400 mb-2">Extracurricular Registration Deadline</p>
              <div className="flex items-center justify-between gap-4">
                <span className="text-2xl font-bold text-gray-900 tracking-tight">{deadline}</span>

                <button
                  onClick={openDeadline}
                  type="button"
                  className="px-5 py-2 rounded-xl border border-gray-200 text-sm font-medium text-gray-900 hover:bg-gray-50 transition-colors cursor-pointer bg-white"
                >
                  Edit deadline
                </button>
              </div>
            </div>
          </div>

          <div className="px-6 py-5 flex justify-end border-t border-gray-100 bg-white">
            <button
              onClick={saveChanges}
              type="button"
              className="px-6 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-900 hover:bg-gray-50 transition-colors cursor-pointer bg-white"
            >
              Save Changes
            </button>
          </div>
        </div>

        {/* Table / Empty */}
        {isEmpty ? (
          <div className="flex flex-col items-center justify-center flex-1 py-20 pb-40">
            <div className="w-20 h-20 bg-[#FEF2F2] rounded-3xl flex items-center justify-center mb-6">
              <CalendarDays size={32} className="text-[#C1200C]" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2 tracking-tight">No Academic Periods Found</h3>
            <p className="text-sm text-gray-400 text-center max-w-sm leading-relaxed">
              No academic periods match your search or filter criteria.
            </p>
          </div>
        ) : (
          <>
            <div className="w-full overflow-x-visible flex-1">
              <table className="w-full text-left border-separate border-spacing-0">
                <thead>
                  <tr className="bg-[#F8F9FA]">
                    <th className="px-6 py-4 text-sm font-semibold text-gray-900 border-l border-t border-b border-gray-200 rounded-tl-2xl rounded-bl-2xl w-[40%]">
                      Academic Periods
                    </th>
                    <th className="px-6 py-4 text-sm font-semibold text-gray-900 border-t border-b border-gray-200 w-[26%]">
                      Active Semester
                    </th>
                    <th className="px-6 py-4 text-sm font-semibold text-gray-900 border-t border-b border-gray-200 w-[20%]">
                      Status
                    </th>
                    <th className="px-6 py-4 text-sm font-semibold text-gray-900 border-r border-t border-b border-gray-200 rounded-tr-2xl rounded-br-2xl text-center w-[14%]">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {currentTableData.map((row) => (
                    <tr key={row.id} className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-5 text-sm font-medium text-gray-900">{row.period}</td>
                      <td className="px-6 py-5">
                        <span className={`px-4 py-1.5 rounded-full text-xs font-medium inline-block whitespace-nowrap ${semesterPillStyle(row.semester)}`}>
                          {row.semester}
                        </span>
                      </td>
                      <td className="px-6 py-5">
                        <span className={`px-4 py-1.5 rounded-full text-xs font-medium inline-block whitespace-nowrap ${statusPillStyle(row.status)}`}>
                          {row.status}
                        </span>
                      </td>
                      <td className="px-6 py-5 flex justify-center relative">
                        <button
                          onClick={() => setOpenActionMenuId(openActionMenuId === row.id ? null : row.id)}
                          className={`w-10 h-10 flex items-center justify-center border rounded-xl transition-colors cursor-pointer ${openActionMenuId === row.id
                            ? 'border-[#C1200C] text-[#C1200C]'
                            : 'border-gray-200 text-gray-400 hover:text-gray-600 hover:bg-gray-50'
                            }`}
                          aria-label="Open action menu"
                        >
                          <MoreVertical size={18} />
                        </button>

                        {openActionMenuId === row.id && (
                          <>
                            <div className="fixed inset-0 z-10" onClick={() => setOpenActionMenuId(null)} />
                            <div className="absolute right-0 top-full mt-2 w-56 bg-white border border-gray-100 rounded-2xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] z-20 overflow-hidden py-2 text-left">
                              <button
                                type="button"
                                onClick={() => openEdit(row)}
                                className="w-full flex items-center gap-3 px-5 py-2.5 text-sm font-medium text-gray-800 hover:bg-gray-50 transition-colors cursor-pointer"
                              >
                                <Share size={16} className="text-gray-700" />
                                Edit Period
                              </button>

                              <button
                                type="button"
                                onClick={() => handleDeletePeriod(row.id)}
                                className="w-full flex items-center gap-3 px-5 py-2.5 text-sm font-medium text-gray-800 hover:bg-red-50 transition-colors cursor-pointer"
                              >
                                <Trash2 size={16} className="text-[#C1200C]" />
                                Delete Period
                              </button>
                            </div>
                          </>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between mt-auto text-sm text-gray-900 font-medium pb-8">
              <span>
                Showing {filtered.length === 0 ? 0 : (currentPage - 1) * ITEMS_PER_PAGE + 1}-
                {Math.min(currentPage * ITEMS_PER_PAGE, filtered.length)} of {filtered.length} Data
              </span>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                  disabled={currentPage === 1}
                  className={`w-8 h-8 flex items-center justify-center rounded-full border border-gray-200 transition-colors ${currentPage === 1 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:bg-gray-50 cursor-pointer'
                    }`}
                >
                  <ChevronLeft size={16} />
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).slice(0, 3).map((page) => (
                  <span
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-1 cursor-pointer transition-colors ${currentPage === page ? 'text-gray-900 font-semibold' : 'text-gray-400 hover:text-gray-900'
                      }`}
                  >
                    {page}
                  </span>
                ))}

                <button
                  onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className={`w-8 h-8 flex items-center justify-center rounded-full border border-gray-200 transition-colors ${currentPage === totalPages ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:bg-gray-50 cursor-pointer'
                    }`}
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>

            <NotificationModal
              isOpen={isAddSuccessOpen}
              type="success"
              title="Academic Period Added"
              message="The academic period has been successfully added."
              buttonText="Return to Academic Periods"
              onButtonClick={() => setIsAddSuccessOpen(false)}
              onClose={() => setIsAddSuccessOpen(false)}
            />

            <NotificationModal
              isOpen={isSavedNotifOpen}
              type="success"
              title="Changes Saved"
              message="Your changes have been saved."
              buttonText="Return"
              onButtonClick={() => setIsSavedNotifOpen(false)}
              onClose={() => setIsSavedNotifOpen(false)}
            />
            
            <NotificationModal
              isOpen={isDeleteSuccessOpen}
              type="delete"
              title="Academic Period Deleted"
              message="The academic period has been successfully removed from the system."
              buttonText="Return to Academic Periods"
              onButtonClick={() => setIsDeleteSuccessOpen(false)}
              onClose={() => setIsDeleteSuccessOpen(false)}
            />
          </>
        )}

        {/* Drawer */}
        {isAddDrawerOpen && (
          <div
            className="fixed inset-0 bg-black/40 z-40 transition-opacity duration-300 cursor-pointer"
            onClick={closeAdd}
          />
        )}

        <div
          className={`fixed top-0 right-0 h-full w-120 bg-white z-50 shadow-2xl transform transition-transform duration-300 ease-in-out flex flex-col ${isAddDrawerOpen ? 'translate-x-0' : 'translate-x-full'
            }`}
        >
          <div className="flex items-center justify-between px-6 py-5 bg-white border-b border-gray-200 shrink-0">
            <h2 className="text-[17px] font-semibold text-gray-900 tracking-tight">
              {drawerMode === 'add' ? 'Add New Academic Periods' : 'Edit Academic Periods'}
            </h2>
            <button onClick={closeAdd} className="text-gray-500 hover:text-gray-700 transition-colors cursor-pointer" type="button">
              <X size={20} strokeWidth={2} />
            </button>
          </div>

          <form onSubmit={submitAdd} className="flex flex-col flex-1 p-6 gap-6 bg-white">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-800">Academic Periods</label>
              <input
                type="text"
                placeholder="Enter Academic Periods"
                value={newPeriod}
                onChange={(e) => setNewPeriod(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-900 focus:outline-none focus:ring-1 focus:ring-[#C1200C] focus:border-[#C1200C] placeholder:text-gray-400 transition-colors"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="relative">
                <label className="text-sm font-medium text-gray-800 block mb-2">Semester</label>
                <button
                  type="button"
                  onClick={() => setAddDropdown(addDropdown === 'semester' ? null : 'semester')}
                  className={`w-full px-4 py-2.5 border rounded-xl text-sm bg-white cursor-pointer flex items-center justify-between transition-colors ${addDropdown === 'semester' ? 'border-[#C1200C]' : 'border-gray-200 hover:border-gray-300'
                    } ${newSemester.includes('Select') ? 'text-gray-400' : 'text-gray-900'}`}
                >
                  {newSemester.includes('Select') ? (
                    <span>Select Semester</span>
                  ) : (
                    <span className={`px-4 py-1.5 rounded-full text-xs font-medium inline-block whitespace-nowrap ${semesterPillStyle(newSemester)}`}>
                      {newSemester}
                    </span>
                  )}
                  <ChevronDown size={16} className="text-gray-400 shrink-0" />
                </button>

                {addDropdown === 'semester' && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setAddDropdown(null)} />
                    <div className="absolute left-0 top-full mt-2 w-full bg-white border border-gray-100 rounded-2xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] z-50 overflow-hidden py-2">
                      {['Odd Semester', 'Even Semester'].map((opt) => (
                        <button
                          key={opt}
                          type="button"
                          onClick={() => {
                            setNewSemester(opt);
                            setAddDropdown(null);
                          }}
                          className="w-full text-left px-4 py-2.5 hover:bg-gray-50 transition-colors cursor-pointer"
                        >
                          <span className={`px-4 py-1.5 rounded-full text-xs font-medium inline-block whitespace-nowrap ${semesterPillStyle(opt)}`}>
                            {opt}
                          </span>
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>

              <div className="relative">
                <label className="text-sm font-medium text-gray-800 block mb-2">Status</label>
                <button
                  type="button"
                  onClick={() => setAddDropdown(addDropdown === 'status' ? null : 'status')}
                  className={`w-full px-4 py-2.5 border rounded-xl text-sm bg-white cursor-pointer flex items-center justify-between transition-colors ${addDropdown === 'status' ? 'border-[#C1200C]' : 'border-gray-200 hover:border-gray-300'
                    } ${newStatus.includes('Select') ? 'text-gray-400' : 'text-gray-900'}`}
                >
                  {newStatus.includes('Select') ? (
                    <span>Select Status</span>
                  ) : (
                    <span className={`px-4 py-1.5 rounded-full text-xs font-medium inline-block whitespace-nowrap ${statusPillStyle(newStatus)}`}>
                      {newStatus}
                    </span>
                  )}
                  <ChevronDown size={16} className="text-gray-400 shrink-0" />
                </button>

                {addDropdown === 'status' && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setAddDropdown(null)} />
                    <div className="absolute left-0 top-full mt-2 w-full bg-white border border-gray-100 rounded-2xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] z-50 overflow-hidden py-2">
                      {['Active', 'Inactive'].map((opt) => (
                        <button
                          key={opt}
                          type="button"
                          onClick={() => {
                            setNewStatus(opt);
                            setAddDropdown(null);
                          }}
                          className="w-full text-left px-4 py-2.5 hover:bg-gray-50 transition-colors cursor-pointer"
                        >
                          <span className={`px-4 py-1.5 rounded-full text-xs font-medium inline-block whitespace-nowrap ${statusPillStyle(opt)}`}>
                            {opt}
                          </span>
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>
          </form>

          <div className="flex-1 bg-white" />

          <div className="px-6 py-5 bg-white border-t border-gray-200 grid grid-cols-2 gap-4 shrink-0">
            <button
              type="button"
              onClick={closeAdd}
              className="py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={submitAdd}
              disabled={!isAddFormValid}
              className={`py-2.5 rounded-xl text-sm font-medium transition-colors ${isAddFormValid
                ? 'bg-[#C1200C] text-white hover:bg-[#A31B0A] cursor-pointer'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
            >
              {drawerMode === 'add' ? 'Add Academic Periods' : 'Save Changes'}
            </button>
          </div>
        </div>

        {/* Change Enrollment Status Modal */}
        {isChangeEnrollOpen &&
          createPortal(
            <>
              <div
                className="fixed inset-0 bg-black/40 z-9998 cursor-pointer"
                onClick={closeEnroll}
              />

              <div className="fixed inset-0 z-9999 flex items-center justify-center p-4">
                <div className="w-full max-w-140 bg-white rounded-3xl overflow-hidden shadow-2xl">
                  <div className="flex items-center justify-between px-7 py-5 border-b border-gray-100 bg-white">
                    <h3 className="text-[16px] font-semibold text-gray-900">
                      Change Status Enrollment
                    </h3>
                    <button
                      type="button"
                      onClick={closeEnroll}
                      className="w-10 h-10 flex items-center justify-center rounded-xl text-gray-400 hover:bg-gray-50 transition-colors cursor-pointer"
                      aria-label="Close"
                    >
                      <X size={18} />
                    </button>
                  </div>

                  <div className="px-7 pt-6 pb-7">
                    <div className="mb-6">
                      <p className="text-[15px] font-semibold text-gray-900 leading-tight">
                        You are updating
                      </p>
                      <p className="text-sm text-gray-400 mt-1">
                        Extracurricular Enrollment Status
                      </p>
                    </div>

                    <div className="relative">
                      <button
                        type="button"
                        onClick={() => setIsEnrollDropdownOpen((v) => !v)}
                        className={`w-full px-5 py-3 rounded-2xl border bg-white flex items-center justify-between text-sm cursor-pointer transition-colors ${isEnrollDropdownOpen ? 'border-[#C1200C]' : 'border-gray-200'
                          }`}
                      >
                        <div className="flex items-center gap-2">
                          <span
                            className={`w-2.5 h-2.5 rounded-full ${enrollValue === 'Open' ? 'bg-[#12B76A]' : 'bg-[#F04438]'
                              }`}
                          />
                          <span className="text-sm font-medium text-gray-900">
                            {enrollValue}
                          </span>
                        </div>
                        <ChevronDown size={16} className="text-gray-400" />
                      </button>

                      {isEnrollDropdownOpen && (
                        <>
                          <div
                            className="fixed inset-0 z-10000"
                            onClick={() => setIsEnrollDropdownOpen(false)}
                          />
                          <div className="absolute left-0 top-full mt-2 w-full bg-white border border-gray-100 rounded-2xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] z-10001 overflow-hidden py-2">
                            {['Open', 'Close'].map((opt) => (
                              <button
                                key={opt}
                                type="button"
                                onClick={() => {
                                  setEnrollValue(opt);
                                  setIsEnrollDropdownOpen(false);
                                }}
                                className="w-full flex items-center gap-3 px-5 py-3 text-sm text-gray-800 hover:bg-gray-50 transition-colors cursor-pointer"
                              >
                                <span
                                  className={`w-2.5 h-2.5 rounded-full ${opt === 'Open' ? 'bg-[#12B76A]' : 'bg-[#F04438]'
                                    }`}
                                />
                                {opt}
                              </button>
                            ))}
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="border-t border-gray-100 px-7 py-5 bg-white">
                    <button
                      type="button"
                      onClick={submitEnroll}
                      className="w-full py-3.5 rounded-2xl bg-[#C1200C] hover:bg-[#A31B0A] text-white text-sm font-medium transition-colors cursor-pointer"
                    >
                      Change Status
                    </button>
                  </div>
                </div>
              </div>
            </>,
            modalRoot
          )}

        {/* Edit Deadline Date Picker (Popover) */}
        {isEditDeadlineOpen &&
          createPortal(
            <>
              <div
                className="fixed inset-0 z-9998 cursor-pointer"
                onClick={closeDeadline}
              />

              <div className="fixed top-62.5 right-12 z-9999 w-85 bg-white rounded-3xl overflow-hidden shadow-[0_12px_40px_-12px_rgba(0,0,0,0.15)] border border-gray-100">
                
                <div className="p-6 pb-5">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="relative flex-1">
                      <button
                        type="button"
                        onClick={() =>
                          setDeadlineDropdown((v) => (v === 'month' ? null : 'month'))
                        }
                        className="w-full px-4 py-2.5 rounded-[14px] border border-gray-200 bg-white flex items-center justify-between text-sm text-gray-900 hover:bg-gray-50 transition-colors cursor-pointer"
                      >
                        <span className="font-medium">{deadlineMonth}</span>
                        <ChevronDown size={16} className="text-gray-500" />
                      </button>

                      {deadlineDropdown === 'month' && (
                        <>
                          <div
                            className="fixed inset-0 z-10000"
                            onClick={() => setDeadlineDropdown(null)}
                          />
                          <div className="absolute left-0 top-full mt-2 w-full bg-white border border-gray-100 rounded-[14px] shadow-lg z-10001 py-2 max-h-56 overflow-y-auto">
                            {MONTH_NAMES.map((m) => (
                              <button
                                key={m}
                                type="button"
                                onClick={() => handleMonthChange(m)}
                                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
                              >
                                {m}
                              </button>
                            ))}
                          </div>
                        </>
                      )}
                    </div>

                    <div className="relative w-25">
                      <button
                        type="button"
                        onClick={() =>
                          setDeadlineDropdown((v) => (v === 'year' ? null : 'year'))
                        }
                        className="w-full px-4 py-2.5 rounded-[14px] border border-gray-200 bg-white flex items-center justify-between text-sm text-gray-900 hover:bg-gray-50 transition-colors cursor-pointer"
                      >
                        <span className="font-medium">{deadlineYear}</span>
                        <ChevronDown size={16} className="text-gray-500" />
                      </button>

                      {deadlineDropdown === 'year' && (
                        <>
                          <div
                            className="fixed inset-0 z-10000"
                            onClick={() => setDeadlineDropdown(null)}
                          />
                          <div className="absolute right-0 top-full mt-2 w-full bg-white border border-gray-100 rounded-[14px] shadow-lg z-10001 py-2 max-h-56 overflow-y-auto">
                            {['2027', '2026', '2025', '2024', '2023'].map((y) => (
                              <button
                                key={y}
                                type="button"
                                onClick={() => handleYearChange(y)}
                                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
                              >
                                {y}
                              </button>
                            ))}
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-7 text-center text-[13px] font-medium text-gray-400 mb-4">
                    {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((d) => (
                      <div key={d}>{d}</div>
                    ))}
                  </div>

                  <div className="grid grid-cols-7 text-center text-[14px] font-medium text-gray-900 gap-y-2">
                    {calendarDays.map((day, idx) => {
                      const isCurrentMonth = day.type === 'current';
                      const isSelected = isCurrentMonth && day.value === deadlineSelectedDay;

                      return (
                        <button
                          key={`day-${idx}`}
                          type="button"
                          onClick={() => {
                            if (isCurrentMonth) setDeadlineSelectedDay(day.value);
                          }}
                          className={`h-9 w-9 mx-auto rounded-full flex items-center justify-center transition-colors ${
                            !isCurrentMonth ? 'text-gray-400 cursor-default hover:bg-transparent' : 'cursor-pointer'
                          } ${isSelected ? 'bg-[#C1200C] text-white' : (isCurrentMonth ? 'hover:bg-gray-50' : '')}`}
                          disabled={!isCurrentMonth}
                        >
                          {day.value}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="px-6 py-5 border-t border-gray-100 bg-white flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={closeDeadline}
                    className="px-6 py-2.5 rounded-xl border border-gray-200 text-[13px] font-medium text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer bg-white"
                  >
                    Cancel
                  </button>

                  <button
                    type="button"
                    onClick={applyDeadline}
                    className="px-6 py-2.5 rounded-xl bg-[#C1200C] hover:bg-[#A31B0A] text-white text-[13px] font-medium transition-colors cursor-pointer"
                  >
                    Apply
                  </button>
                </div>
              </div>
            </>,
            modalRoot
          )}
      </div>
    </>
  );
};

export default AcademicPeriods;