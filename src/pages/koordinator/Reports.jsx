import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Search,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  MoreVertical,
  FileText,
  FileSignature,
  Eye,
  RefreshCcw,
  X,
  FileSearch,
} from 'lucide-react';
import NotificationModal from '../../components/ui/NotificationModal';
import { createPortal } from 'react-dom';

// Data Mocks
const initialProposalData = [
  { id: 'p1', title: 'Basketball Weekly Training Plan', academicPeriod: '2025/2026', extracurricular: 'Basketball', mentor: 'Budi Santoso', date: '15 March 2026', status: 'Approved' },
  { id: 'p2', title: 'Choir Performance Proposal – School E...', academicPeriod: '2024/2025', extracurricular: 'Choir', mentor: 'Rina Melati', date: '22 June 2026', status: 'Approved' },
  { id: 'p3', title: 'Coding Club Workshop Plan (Python Ba...', academicPeriod: '2023/2024', extracurricular: 'Coding Club', mentor: 'Galih Nugroho', date: '9 September 2026', status: 'Approved' },
  { id: 'p4', title: 'PMR First Aid Training Plan', academicPeriod: '2022/2023', extracurricular: 'PMR', mentor: 'Dewi Sartika', date: '30 November 2026', status: 'Ready to Review' },
  { id: 'p5', title: 'Futsal Friendly Match Proposal', academicPeriod: '2021/2022', extracurricular: 'Futsal', mentor: 'Ahmad Rizal', date: '5 October 2026', status: 'Ready to Review' },
  { id: 'p6', title: 'English Club Debate Session Plan', academicPeriod: '2020/2021', extracurricular: 'English Club', mentor: 'Sinta Maharani', date: '18 December 2026', status: 'Needs Revision' },
];

const initialReportData = [
  { id: 'r1', title: 'Basketball Weekly Training Report', academicPeriod: '2025/2026', extracurricular: 'Basketball', mentor: 'Budi Santoso', date: '15 March 2026', status: 'Approved' },
  { id: 'r2', title: 'Choir Performance Report – School Eve...', academicPeriod: '2024/2025', extracurricular: 'Choir', mentor: 'Rina Melati', date: '22 June 2026', status: 'Approved' },
  { id: 'r3', title: 'Coding Club Workshop Report (Python...', academicPeriod: '2023/2024', extracurricular: 'Coding Club', mentor: 'Galih Nugroho', date: '9 September 2026', status: 'Approved' },
  { id: 'r4', title: 'PMR First Aid Training Report', academicPeriod: '2022/2023', extracurricular: 'PMR', mentor: 'Dewi Sartika', date: '30 November 2026', status: 'Ready to Review' },
  { id: 'r5', title: 'Futsal Friendly Match Report', academicPeriod: '2021/2022', extracurricular: 'Futsal', mentor: 'Ahmad Rizal', date: '5 October 2026', status: 'Ready to Review' },
  { id: 'r6', title: 'English Club Debate Session Report', academicPeriod: '2020/2021', extracurricular: 'English Club', mentor: 'Sinta Maharani', date: '18 December 2026', status: 'Needs Revision' },
];

const statusStyle = (status) => {
  switch (status) {
    case 'Approved':
      return 'bg-[#ECFDF3] text-[#12B76A]';
    case 'Ready to Review':
      return 'bg-[#FFF7ED] text-[#FB6514]';
    case 'Needs Revision':
      return 'bg-[#FEF2F2] text-[#F04438]';
    default:
      return 'bg-gray-100 text-gray-500';
  }
};

const statusOptionsAll = ['Approved', 'Ready to Review', 'Needs Revision'];

const Reports = () => {
  const [activeTab, setActiveTab] = useState('proposal');
  const [searchQuery, setSearchQuery] = useState('');

  const [filterExtracurricular, setFilterExtracurricular] = useState('All Extracurricular');
  const [filterStatus, setFilterStatus] = useState('All Status');
  const [openFilter, setOpenFilter] = useState(null);

  const [openActionMenuId, setOpenActionMenuId] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 6;

  const [proposalData, setProposalData] = useState(initialProposalData);
  const [reportData, setReportData] = useState(initialReportData);

  // Change status modal
  const [isChangeStatusOpen, setIsChangeStatusOpen] = useState(false);
  const [changeStatusRow, setChangeStatusRow] = useState(null);
  const [changeStatusValue, setChangeStatusValue] = useState('Ready to Review');

  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);
  const [dropdownPos, setDropdownPos] = useState({ left: 0, top: 0, width: 0 });
  const dropdownWrapRef = useRef(null);
  const dropdownButtonRef = useRef(null);

  const [isSuccessOpen, setIsSuccessOpen] = useState(false);

  const dataSource = activeTab === 'proposal' ? proposalData : reportData;

  const tableFirstHeading = activeTab === 'proposal' ? 'Proposal Title' : 'Report Title';
  const changeStatusHeading = activeTab === 'proposal' ? 'Change Status Proposal' : 'Change Status Reports';

  const extracurricularOptions = useMemo(() => {
    const set = new Set(dataSource.map((d) => d.extracurricular));
    return ['All Extracurricular', ...Array.from(set)];
  }, [dataSource]);

  const statusOptions = useMemo(() => {
    const set = new Set(dataSource.map((d) => d.status));
    return ['All Status', ...Array.from(set)];
  }, [dataSource]);

  const filtered = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return dataSource.filter((row) => {
      const matchesSearch =
        q === '' ||
        row.title.toLowerCase().includes(q) ||
        row.extracurricular.toLowerCase().includes(q) ||
        row.mentor.toLowerCase().includes(q) ||
        (row.academicPeriod || '').toLowerCase().includes(q);

      const matchesExkul =
        filterExtracurricular === 'All Extracurricular' || row.extracurricular === filterExtracurricular;

      const matchesStatus =
        filterStatus === 'All Status' || row.status === filterStatus;

      return matchesSearch && matchesExkul && matchesStatus;
    });
  }, [dataSource, filterExtracurricular, filterStatus, searchQuery]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const currentTableData = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const handleTabChange = (tab) => {
    if (tab === activeTab) return;

    setActiveTab(tab);
    setSearchQuery('');
    setFilterExtracurricular('All Extracurricular');
    setFilterStatus('All Status');
    setOpenFilter(null);
    setOpenActionMenuId(null);
    setCurrentPage(1);
  };

  const handleFilterSelect = (type, value) => {
    if (type === 'exkul') setFilterExtracurricular(value);
    if (type === 'status') setFilterStatus(value);
    setOpenFilter(null);
    setOpenActionMenuId(null);
    setCurrentPage(1);
  };

  const openChangeStatusModal = (row) => {
    setOpenActionMenuId(null);
    setChangeStatusRow(row);
    setChangeStatusValue(row.status || 'Ready to Review');
    setIsStatusDropdownOpen(false);
    setIsChangeStatusOpen(true);
  };

  const closeChangeStatusModal = () => {
    setIsChangeStatusOpen(false);
    setChangeStatusRow(null);
    setIsStatusDropdownOpen(false);
  };

  const handleSubmitChangeStatus = () => {
    if (!changeStatusRow) return;

    if (activeTab === 'proposal') {
      setProposalData((prev) =>
        prev.map((d) => (d.id === changeStatusRow.id ? { ...d, status: changeStatusValue } : d))
      );
    } else {
      setReportData((prev) =>
        prev.map((d) => (d.id === changeStatusRow.id ? { ...d, status: changeStatusValue } : d))
      );
    }

    closeChangeStatusModal();
    setTimeout(() => setIsSuccessOpen(true), 150);
  };

  useEffect(() => {
    if (!isStatusDropdownOpen) return;

    const handlePointerDown = (e) => {
      const wrap = dropdownWrapRef.current;
      const btn = dropdownButtonRef.current;

      if (wrap && wrap.contains(e.target)) return;
      if (btn && btn.contains(e.target)) return;

      setIsStatusDropdownOpen(false);
    };

    document.addEventListener('pointerdown', handlePointerDown);
    return () => document.removeEventListener('pointerdown', handlePointerDown);
  }, [isStatusDropdownOpen]);

  useEffect(() => {
    if (!isStatusDropdownOpen) return;

    const updatePos = () => {
      const rect = dropdownButtonRef.current?.getBoundingClientRect();
      if (!rect) return;
      setDropdownPos({ left: rect.left, top: rect.bottom + 8, width: rect.width });
    };

    window.addEventListener('scroll', updatePos, true);
    window.addEventListener('resize', updatePos);
    return () => {
      window.removeEventListener('scroll', updatePos, true);
      window.removeEventListener('resize', updatePos);
    };
  }, [isStatusDropdownOpen]);

  const isEmpty = filtered.length === 0;
  const modalRoot = document.getElementById('modal-root') || document.body;

  return (
    <>
      {/* Tabs */}
      <div className="p-8 pt-4 flex flex-col flex-1 gap-6 relative z-0 min-h-screen bg-white font-sans">
        <div className="w-full bg-[#F3F4F6] rounded-2xl p-1.5 border border-gray-200 relative z-0 overflow-hidden">
          {/* sliding indicator */}
          <div
            className={`absolute top-1.5 bottom-1.5 w-1/2 bg-white border border-gray-200 rounded-xl shadow-sm transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${activeTab === 'proposal' ? 'translate-x-0' : 'translate-x-full'
              }`}
          />

          <div className="relative z-10 flex items-center">
            <button
              onClick={() => handleTabChange('proposal')}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-medium transition-colors cursor-pointer ${activeTab === 'proposal' ? 'text-gray-900' : 'text-gray-400'
                }`}
            >
              <FileText size={16} className={activeTab === 'proposal' ? 'text-gray-900' : 'text-gray-400'} />
              Activity Proposal
            </button>

            <button
              onClick={() => handleTabChange('report')}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-medium transition-colors cursor-pointer ${activeTab === 'report' ? 'text-gray-900' : 'text-gray-400'
                }`}
            >
              <FileSignature size={16} className={activeTab === 'report' ? 'text-gray-900' : 'text-gray-400'} />
              Activity Report
            </button>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="flex items-center justify-between">
          <div className="relative w-[320px]">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search reports or activities..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-11 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-[#C1200C] focus:border-[#C1200C] transition-all placeholder:text-gray-400"
            />
          </div>

          <div className="flex items-center">
            <div className="relative">
              <button
                onClick={() => setOpenFilter(openFilter === 'exkul' ? null : 'exkul')}
                className={`flex items-center gap-3 px-5 py-2.5 text-sm font-medium transition-colors cursor-pointer rounded-l-xl border bg-white ${openFilter === 'exkul'
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
                  <div className="absolute left-0 top-full mt-2 w-60 bg-white border border-gray-100 rounded-2xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] z-20 py-2 overflow-hidden">
                    {extracurricularOptions.map((opt, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleFilterSelect('exkul', opt)}
                        className={`w-full text-left px-5 py-2.5 text-sm transition-colors cursor-pointer ${filterExtracurricular === opt
                          ? 'text-[#C1200C] font-medium'
                          : 'text-gray-600 hover:bg-gray-50'
                          }`}
                      >
                        {opt}
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
                <span className="truncate max-w-32">{filterStatus}</span>
                <ChevronDown size={14} className="text-gray-400 shrink-0" />
              </button>

              {openFilter === 'status' && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setOpenFilter(null)} />
                  <div className="absolute right-0 top-full mt-2 w-56 bg-white border border-gray-100 rounded-2xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] z-20 overflow-hidden">
                    <div className="py-3 flex flex-col gap-3 px-4">
                      <button
                        onClick={() => handleFilterSelect('status', 'All Status')}
                        className={`w-full text-left text-sm transition-colors cursor-pointer px-1 py-1 rounded-lg hover:bg-gray-50 ${filterStatus === 'All Status'
                          ? 'text-[#C1200C] font-medium'
                          : 'text-gray-600 hover:text-gray-900'
                          }`}
                      >
                        All Status
                      </button>

                      {statusOptionsAll.map((s) => (
                        <button
                          key={s}
                          onClick={() => handleFilterSelect('status', s)}
                          className="w-full px-1 py-1 cursor-pointer text-left hover:bg-gray-50 transition-colors"
                        >
                          <span
                            className={`px-4 py-1.5 rounded-full text-xs font-medium inline-block whitespace-nowrap ${statusStyle(s)}`}
                          >
                            {s}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Empty State */}
        {isEmpty ? (
          <div className="flex flex-col items-center justify-center flex-1 py-20 pb-40">
            <div className="w-20 h-20 bg-[#FEF2F2] rounded-3xl flex items-center justify-center mb-6">
              <FileSearch size={32} className="text-[#C1200C]" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2 tracking-tight">
              {activeTab === 'proposal' ? 'No Proposals Found' : 'No Reports Found'}
            </h3>
            <p className="text-sm text-gray-400 text-center max-w-sm leading-relaxed">
              {activeTab === 'proposal'
                ? 'No proposals match your search or filter criteria.'
                : 'No reports match your search or filter criteria.'}
            </p>
          </div>
        ) : (
          <>
            {/* Table */}
            <div className="w-full overflow-x-visible flex-1">
              <table className="w-full text-left border-separate border-spacing-0">
                <thead>
                  <tr className="bg-[#F8F9FA]">
                    <th className="px-6 py-4 text-sm font-semibold text-gray-900 border-l border-t border-b border-gray-200 rounded-tl-2xl rounded-bl-2xl w-[22%]">
                      {tableFirstHeading}
                    </th>

                    <th className="px-6 py-4 text-sm font-semibold text-gray-900 border-t border-b border-gray-200 w-[14%]">
                      Academic Periods
                    </th>

                    <th className="px-6 py-4 text-sm font-semibold text-gray-900 border-t border-b border-gray-200 w-[14%]">
                      Extracurricular
                    </th>
                    <th className="px-6 py-4 text-sm font-semibold text-gray-900 border-t border-b border-gray-200 w-[16%]">
                      Mentor
                    </th>
                    <th className="px-6 py-4 text-sm font-semibold text-gray-900 border-t border-b border-gray-200 w-[14%]">
                      Date
                    </th>
                    <th className="px-6 py-4 text-sm font-semibold text-gray-900 border-t border-b border-gray-200 w-[16%]">
                      Status
                    </th>
                    <th className="px-6 py-4 text-sm font-semibold text-gray-900 border-r border-t border-b border-gray-200 rounded-tr-2xl rounded-br-2xl text-center w-[4%]">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {currentTableData.map((row) => (
                    <tr key={row.id} className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-5 text-sm font-medium text-gray-900">
                        <span className="block truncate max-w-105">{row.title}</span>
                      </td>

                      <td className="px-6 py-5 text-sm text-gray-500">
                        {row.academicPeriod || '-'}
                      </td>

                      <td className="px-6 py-5 text-sm text-gray-600">{row.extracurricular}</td>
                      <td className="px-6 py-5 text-sm text-gray-500">{row.mentor}</td>
                      <td className="px-6 py-5 text-sm text-gray-500">{row.date}</td>

                      <td className="px-6 py-5">
                        <span className={`px-4 py-1.5 rounded-full text-xs font-medium inline-block whitespace-nowrap ${statusStyle(row.status)}`}>
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
                                onClick={() => setOpenActionMenuId(null)}
                                className="w-full flex items-center gap-3 px-5 py-2.5 text-sm font-medium text-gray-800 hover:bg-gray-50 transition-colors cursor-pointer"
                              >
                                <Eye size={16} className="text-gray-800" /> View Detail
                              </button>

                              <button
                                onClick={() => openChangeStatusModal(row)}
                                className="w-full flex items-center gap-3 px-5 py-2.5 text-sm font-medium text-gray-800 hover:bg-gray-50 transition-colors cursor-pointer"
                              >
                                <RefreshCcw size={16} className="text-gray-800" /> Change status
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
          </>
        )}

        {/* Change Status Modal */}
        {isChangeStatusOpen &&
          createPortal(
            <>
              <div
                className="fixed inset-0 bg-black/40 z-9998"
                onClick={closeChangeStatusModal}
              />

              {/* modal wrapper */}
              <div className="fixed inset-0 z-9999 flex items-center justify-center p-4">
                <div className="w-full max-w-130 bg-white rounded-3xl overflow-hidden shadow-2xl">
                  {/* header */}
                  <div className="flex items-center justify-between px-7 py-5 border-b border-gray-100">
                    <h3 className="text-[16px] font-semibold text-gray-900">
                      {changeStatusHeading}
                    </h3>
                    <button
                      onClick={closeChangeStatusModal}
                      className="w-10 h-10 flex items-center justify-center rounded-xl text-gray-400 hover:bg-gray-50 transition-colors"
                      aria-label="Close"
                    >
                      <X size={18} />
                    </button>
                  </div>

                  {/* content */}
                  <div className="px-7 pt-6 pb-7">
                    <div className="mb-6">
                      <p className="text-[15px] font-semibold text-gray-900 leading-tight">
                        You are updating
                      </p>
                      <p className="text-sm text-gray-400 mt-1">{changeStatusRow?.title || '-'}</p>
                    </div>

                    {/* dropdown */}
                    <div className="relative">
                      <button
                        ref={dropdownButtonRef}
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();

                          const rect = dropdownButtonRef.current?.getBoundingClientRect();
                          if (rect) {
                            setDropdownPos({
                              left: rect.left,
                              top: rect.bottom + 8,
                              width: rect.width,
                            });
                          }

                          setIsStatusDropdownOpen((v) => !v);
                        }}
                        className="w-full px-5 py-3 rounded-2xl border border-gray-200 bg-white flex items-center justify-between text-sm"
                      >
                        <span
                          className={`px-4 py-1.5 rounded-full text-xs font-medium whitespace-nowrap ${statusStyle(changeStatusValue)}`}
                        >
                          {changeStatusValue}
                        </span>
                        <ChevronDown size={16} className="text-gray-400" />
                      </button>
                    </div>

                    {isStatusDropdownOpen &&
                      createPortal(
                        <>
                          <div
                            className="fixed inset-0 z-100000"
                            onClick={() => setIsStatusDropdownOpen(false)}
                          />

                          <div
                            ref={dropdownWrapRef}
                            style={{
                              position: 'fixed',
                              left: dropdownPos.left,
                              top: dropdownPos.top,
                              width: dropdownPos.width,
                            }}
                            className="bg-white border border-gray-100 rounded-2xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.12)] z-100001 overflow-hidden"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <div className="py-2 max-h-52 overflow-y-auto">
                              {statusOptionsAll.map((opt) => (
                                <button
                                  key={opt}
                                  type="button"
                                  onClick={() => {
                                    setChangeStatusValue(opt);
                                    setIsStatusDropdownOpen(false);
                                  }}
                                  className="w-full px-5 py-2.5 hover:bg-gray-50 text-left transition-colors cursor-pointer"
                                >
                                  <span
                                    className={`px-4 py-1.5 rounded-full text-xs font-medium inline-block whitespace-nowrap ${statusStyle(opt)}`}
                                  >
                                    {opt}
                                  </span>
                                </button>
                              ))}
                            </div>
                          </div>
                        </>,
                        modalRoot
                      )
                    }
                  </div>

                  {/* footer */}
                  <div className="border-t border-gray-100 px-7 py-5 bg-white">
                    <button
                      onClick={handleSubmitChangeStatus}
                      className="w-full py-3.5 rounded-2xl bg-[#C1200C] hover:bg-[#A31B0A] text-white text-sm font-medium transition-colors"
                    >
                      Change Status
                    </button>
                  </div>
                </div>
              </div>
            </>,
            document.body
          )}

        <NotificationModal
          isOpen={isSuccessOpen}
          type="success"
          title="Status Updated"
          message={
            activeTab === 'proposal'
              ? 'The proposal status has been successfully updated.'
              : 'The report status has been successfully updated.'
          }
          buttonText="Return to Reports"
          onButtonClick={() => setIsSuccessOpen(false)}
          onClose={() => setIsSuccessOpen(false)}
        />
      </div>
    </>
  );
};

export default Reports;