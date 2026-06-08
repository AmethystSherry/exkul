import React, { useMemo, useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import {
  Search,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  UserX
} from 'lucide-react';

// Data Mocks
const initialData = [
  { id: 'std-1', name: 'Ayu Rahmawati', regDate: 'Jun 2, 2026', nis: '2023001', className: 'VIIIA', extracurricular: 'Basketball, Coding Club', status: 'Pending' },
  { id: 'std-2', name: 'Dian Pertiwi', regDate: 'Jun 2, 2026', nis: '2023002', className: 'VIIB', extracurricular: 'Choir', status: 'Rejected' },
  { id: 'std-3', name: 'Farah Amelia', regDate: 'Jun 2, 2026', nis: '2023003', className: 'VIIIB', extracurricular: 'PMR, English Club, Futsal', status: 'Pending' },
  { id: 'std-4', name: 'Hendra Kusuma', regDate: 'Jun 2, 2026', nis: '2023004', className: 'IXA', extracurricular: 'Futsal', status: 'Approved' },
  { id: 'std-5', name: 'Intan Permata', regDate: 'Jun 2, 2026', nis: '2023005', className: 'VIIA', extracurricular: 'English Club, Futsal', status: 'Rejected' },
  { id: 'std-6', name: 'Budi Santoso', regDate: 'Jun 3, 2026', nis: '2023006', className: 'VIIB', extracurricular: 'PMR, Basketball', status: 'Pending' },
  { id: 'std-7', name: 'Citra Kirana', regDate: 'Jun 3, 2026', nis: '2023007', className: 'VIIIB', extracurricular: 'PMR', status: 'Approved' },
  { id: 'std-8', name: 'Dimas Anggara', regDate: 'Jun 4, 2026', nis: '2023008', className: 'IXB', extracurricular: 'Basketball', status: 'Pending' },
  { id: 'std-9', name: 'Eka Putra', regDate: 'Jun 4, 2026', nis: '2023009', className: 'VIIIA', extracurricular: 'Coding Club', status: 'Approved' },
  { id: 'std-10', name: 'Fitriani', regDate: 'Jun 5, 2026', nis: '2023010', className: 'VIIA', extracurricular: 'Choir', status: 'Pending' },
  { id: 'std-11', name: 'Gilang Ramadhan', regDate: 'Jun 5, 2026', nis: '2023011', className: 'IXA', extracurricular: 'English Club', status: 'Rejected' },
  { id: 'std-12', name: 'Hani Susanti', regDate: 'Jun 6, 2026', nis: '2023012', className: 'VIIB', extracurricular: 'Futsal', status: 'Approved' },
];

const RegisterExtracurricular = () => {
  const [data, setData] = useState(initialData);
  const [searchQuery, setSearchQuery] = useState('');

  // filters
  const [filterExtracurricular, setFilterExtracurricular] = useState('All Extracurricular');
  const [filterClass, setFilterClass] = useState('All Class');
  const [filterStatus, setFilterStatus] = useState('All Status');
  const [openFilter, setOpenFilter] = useState(null);
  
  // table row status dropdown
  const [openStatusDropdownId, setOpenStatusDropdownId] = useState(null);
  const actionBtnRefs = useRef({});
  const [dropdownPos, setDropdownPos] = useState({ top: 0, left: 0, width: 0 });

  // pagination
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 5;

  const extracurricularOptions = useMemo(() => {
    const set = new Set();
    data.forEach((row) => {
      row.extracurricular.split(',').map((s) => s.trim()).filter(Boolean).forEach((v) => set.add(v));
    });
    return ['All Extracurricular', ...Array.from(set)];
  }, [data]);

  const classOptions = ['All Class', 'VIIA', 'VIIB', 'VIIIA', 'VIIIB', 'IXA', 'IXB'];
  const statusOptions = ['All Status', 'Approved', 'Pending', 'Rejected'];

  const filtered = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();

    return data.filter((row) => {
      const matchesSearch =
        q === '' ||
        row.name.toLowerCase().includes(q) ||
        row.nis.toLowerCase().includes(q) ||
        row.className.toLowerCase().includes(q) ||
        row.extracurricular.toLowerCase().includes(q);

      const matchesExkul =
        filterExtracurricular === 'All Extracurricular' ||
        row.extracurricular
          .split(',')
          .map((s) => s.trim())
          .includes(filterExtracurricular);

      const matchesClass = filterClass === 'All Class' || row.className === filterClass;
      const matchesStatus = filterStatus === 'All Status' || row.status === filterStatus;

      return matchesSearch && matchesExkul && matchesClass && matchesStatus;
    });
  }, [data, searchQuery, filterExtracurricular, filterClass, filterStatus]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const currentTableData = filtered.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleFilterSelect = (type, value) => {
    if (type === 'exkul') setFilterExtracurricular(value);
    if (type === 'class') setFilterClass(value);
    if (type === 'status') setFilterStatus(value);

    setOpenFilter(null);
    setCurrentPage(1);
  };

  const handleStatusChange = (id, newStatus) => {
    setData((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: newStatus } : item))
    );
    setOpenStatusDropdownId(null);
  };

  const getStatusPillConfig = (status) => {
    switch (status) {
      case 'Approved':
        return 'bg-[#ECFDF3] text-[#12B76A]';
      case 'Pending':
        return 'bg-[#FFF7ED] text-[#E05018]';
      case 'Rejected':
        return 'bg-[#FEF2F2] text-[#F04438]';
      default:
        return 'bg-gray-100 text-gray-500';
    }
  };

  return (
    <div className="p-8 pt-4 flex flex-col flex-1 gap-6 relative min-h-screen bg-white font-sans">
      {/* Top Controls */}
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

        <div className="flex items-center">
          {/* Dropdown Extracurricular */}
          <div className="relative">
            <button
              onClick={() => setOpenFilter(openFilter === 'exkul' ? null : 'exkul')}
              className={`flex items-center gap-3 px-5 py-2.5 text-sm font-medium transition-colors cursor-pointer rounded-l-xl border bg-white ${
                openFilter === 'exkul'
                  ? 'border-[#C1200C] text-gray-500 z-10 relative'
                  : 'border-gray-200 text-gray-500 hover:bg-gray-50 relative z-0'
              }`}
            >
              <span className="truncate max-w-40">{filterExtracurricular}</span>
              <ChevronDown size={14} className="text-gray-400 shrink-0" />
            </button>

            {openFilter === 'exkul' && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setOpenFilter(null)} />
                <div className="absolute left-0 top-full mt-2 w-72 bg-white border border-gray-100 rounded-2xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] z-20 overflow-hidden py-2">
                  {extracurricularOptions.map((opt) => (
                    <button
                      key={opt}
                      onClick={() => handleFilterSelect('exkul', opt)}
                      className={`w-full text-left px-5 py-3 text-sm transition-colors cursor-pointer ${
                        filterExtracurricular === opt
                          ? 'text-[#C1200C] font-medium'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Dropdown Class */}
          <div className="relative -ml-px">
            <button
              onClick={() => setOpenFilter(openFilter === 'class' ? null : 'class')}
              className={`flex items-center gap-3 px-5 py-2.5 text-sm font-medium transition-colors cursor-pointer border bg-white ${
                openFilter === 'class'
                  ? 'border-[#C1200C] text-gray-500 z-10 relative'
                  : 'border-gray-200 text-gray-500 hover:bg-gray-50 relative z-0'
              }`}
            >
              <span className="truncate max-w-28">{filterClass}</span>
              <ChevronDown size={14} className="text-gray-400 shrink-0" />
            </button>

            {openFilter === 'class' && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setOpenFilter(null)} />
                <div className="absolute left-0 top-full mt-2 w-56 bg-white border border-gray-100 rounded-2xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] z-20 overflow-hidden py-2">
                  {classOptions.map((opt) => (
                    <button
                      key={opt}
                      onClick={() => handleFilterSelect('class', opt)}
                      className={`w-full text-left px-5 py-3 text-sm transition-colors cursor-pointer ${
                        filterClass === opt
                          ? 'text-[#C1200C] font-medium'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Dropdown Status Filter */}
          <div className="relative -ml-px">
            <button
              onClick={() => setOpenFilter(openFilter === 'status' ? null : 'status')}
              className={`flex items-center gap-3 px-5 py-2.5 text-sm font-medium transition-colors cursor-pointer rounded-r-xl border bg-white ${
                openFilter === 'status'
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
                <div className="absolute right-0 top-full mt-2 w-56 bg-white border border-gray-100 rounded-2xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] z-20 overflow-hidden py-2 px-3">
                  <div className="flex flex-col gap-2">
                    {statusOptions.map((opt) => (
                      <button
                        key={opt}
                        onClick={() => handleFilterSelect('status', opt)}
                        className={`w-full text-left text-sm transition-colors cursor-pointer px-3 py-2 rounded-lg ${
                          filterStatus === opt
                            ? 'text-[#C1200C] font-medium bg-gray-50'
                            : 'text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Main Content Area: Table or Empty State */}
      {filtered.length > 0 ? (
        <>
          {/* Table Section */}
          <div className="w-full overflow-x-visible flex-1 mt-2">
            <table className="w-full text-left border-separate border-spacing-0">
              <thead>
                <tr className="bg-[#F8F9FA]">
                  <th className="px-6 py-4 text-sm font-semibold text-gray-900 border-l border-t border-b border-gray-200 rounded-tl-2xl rounded-bl-2xl w-[20%]">
                    Student Name
                  </th>
                  <th className="px-6 py-4 text-sm font-semibold text-gray-900 border-t border-b border-gray-200 w-[15%]">
                    Registration Date
                  </th>
                  <th className="px-6 py-4 text-sm font-semibold text-gray-900 border-t border-b border-gray-200 w-[10%]">
                    NIS
                  </th>
                  <th className="px-6 py-4 text-sm font-semibold text-gray-900 border-t border-b border-gray-200 w-[10%]">
                    Class
                  </th>
                  <th className="px-6 py-4 text-sm font-semibold text-gray-900 border-t border-b border-gray-200 w-[25%]">
                    Extracurricular
                  </th>
                  <th className="px-6 py-4 text-sm font-semibold text-gray-900 border-r border-t border-b border-gray-200 rounded-tr-2xl rounded-br-2xl w-[20%]">
                    Status
                  </th>
                </tr>
              </thead>

              <tbody>
                {currentTableData.map((row) => {
                  const isDropdownOpen = openStatusDropdownId === row.id;

                  return (
                    <tr key={row.id} className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-5 text-sm font-medium text-gray-900">{row.name}</td>
                      <td className="px-6 py-5 text-sm text-gray-500">{row.regDate}</td>
                      <td className="px-6 py-5 text-sm text-gray-500">{row.nis}</td>
                      <td className="px-6 py-5 text-sm text-gray-500">{row.className}</td>
                      <td className="px-6 py-5 text-sm text-gray-500">{row.extracurricular}</td>
                      <td className="px-6 py-5 relative">
                        
                        {/* Trigger Button */}
                        <button
                          ref={(el) => { if (el) actionBtnRefs.current[row.id] = el; }}
                          type="button"
                          onClick={() => {
                            const next = isDropdownOpen ? null : row.id;
                            setOpenStatusDropdownId(next);
                            if (!isDropdownOpen) {
                              const rect = actionBtnRefs.current[row.id]?.getBoundingClientRect();
                              if (rect) {
                                setDropdownPos({
                                  top: rect.bottom + 8,
                                  left: rect.left,
                                  width: rect.width,
                                });
                              }
                            }
                          }}
                          className={`h-11 min-w-33.75 inline-flex items-center justify-between gap-2 px-3 rounded-xl border text-sm font-medium transition-colors cursor-pointer bg-white ${
                            isDropdownOpen ? 'border-[#C1200C]' : 'border-gray-200 hover:bg-gray-50'
                          }`}
                        >
                          <span className={`px-3 py-1 rounded-full text-[13px] font-medium inline-block whitespace-nowrap ${getStatusPillConfig(row.status)}`}>
                            {row.status}
                          </span>
                          <ChevronDown size={16} className="text-gray-500 shrink-0" />
                        </button>

                        {isDropdownOpen && createPortal(
                          <>
                            <div className="fixed inset-0 z-9998" onClick={() => setOpenStatusDropdownId(null)} />
                            <div
                              className="fixed z-9999 w-40 bg-white border border-gray-100 rounded-[20px] shadow-[0_10px_40px_-10px_rgba(0,0,0,0.12)] overflow-hidden py-3 px-3 flex flex-col gap-2"
                              style={{ top: dropdownPos.top, left: dropdownPos.left }}
                            >
                              {['Approved', 'Pending', 'Rejected'].map((opt) => (
                                <button
                                  key={opt}
                                  type="button"
                                  onClick={() => handleStatusChange(row.id, opt)}
                                  className="w-full text-left cursor-pointer hover:opacity-80 transition-opacity"
                                >
                                  <span className={`px-4 py-1.5 rounded-full text-sm font-medium inline-block whitespace-nowrap ${getStatusPillConfig(opt)}`}>
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

          {/* Pagination */}
          <div className="flex items-center justify-between mt-auto text-sm text-gray-900 font-medium pb-8">
            <span>
              Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1}-
              {Math.min(currentPage * ITEMS_PER_PAGE, filtered.length)} of {filtered.length} Data
            </span>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                disabled={currentPage === 1}
                className={`w-8 h-8 flex items-center justify-center rounded-full border border-gray-200 transition-colors ${
                  currentPage === 1 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:bg-gray-50 cursor-pointer'
                }`}
              >
                <ChevronLeft size={16} />
              </button>

              {Array.from({ length: Math.min(3, totalPages) }, (_, i) => {
                let pageNum = i + 1; 
                return (
                  <span
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`px-1 cursor-pointer transition-colors ${
                      currentPage === pageNum ? 'text-gray-900 font-semibold' : 'text-gray-400 hover:text-gray-900'
                    }`}
                  >
                    {pageNum}
                  </span>
                );
              })}

              <button
                onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                disabled={currentPage === totalPages}
                className={`w-8 h-8 flex items-center justify-center rounded-full border border-gray-200 transition-colors ${
                  currentPage === totalPages ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:bg-gray-50 cursor-pointer'
                }`}
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </>
      ) : (
        /* Empty State */
        <div className="flex flex-col items-center justify-center flex-1 h-full min-h-100">
          <div className="w-16 h-16 bg-[#FEF2F2] rounded-2xl flex items-center justify-center mb-4">
            <UserX size={28} className="text-[#C1200C]" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">No Registrations Found</h3>
          <p className="text-sm text-gray-500">No registrations match your filter criteria.</p>
        </div>
      )}
    </div>
  );
};

export default RegisterExtracurricular;