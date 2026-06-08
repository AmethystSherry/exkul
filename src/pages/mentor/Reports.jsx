import React, { useMemo, useRef, useState } from 'react';
import {
  Search,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  FileText,
  FileSignature,
  Download,
  Plus,
  Eye,
  X,
  FileSearch,
} from 'lucide-react';
import NotificationModal from '../../components/ui/NotificationModal';

// Data Mocks
const initialProposalItems = [
  {
    id: 'prop-1',
    title: 'Basketball Weekly Training Proposal',
    approvedText: 'Approved on April 21, 2026',
    academicPeriod: '2025/2026',
    createdDate: '01 April, 2026',
    status: 'Approved',
    fileUrl: '/files/proposals/prop-1.pdf',
  },
  {
    id: 'prop-2',
    title: 'Choir Performance Proposal',
    approvedText: 'Awaiting review',
    academicPeriod: '2024/2025',
    createdDate: '12 March, 2026',
    status: 'Ready to Review',
    fileUrl: '/files/proposals/prop-2.pdf',
  },
  {
    id: 'prop-3',
    title: 'Coding Club Workshop Proposal',
    approvedText: 'Awaiting review',
    academicPeriod: '2023/2024',
    createdDate: '05 February, 2026',
    status: 'Ready to Review',
    fileUrl: '/files/proposals/prop-3.pdf',
  },
  {
    id: 'prop-4',
    title: 'PMR First Aid Training Proposal',
    approvedText: 'Needs revision',
    academicPeriod: '2022/2023',
    createdDate: '18 January, 2026',
    status: 'Needs Revision',
    fileUrl: '/files/proposals/prop-4.pdf',
  },
];

const initialReportItems = [
  {
    id: 'rep-1',
    title: 'Basketball Weekly Training Report',
    approvedText: 'Approved on April 21, 2026',
    academicPeriod: '2025/2026',
    createdDate: '01 April, 2026',
    status: 'Approved',
    fileUrl: '/files/reports/rep-1.pdf',
  },
  {
    id: 'rep-2',
    title: 'Basketball Weekly Training Report',
    approvedText: 'Awaiting review',
    academicPeriod: '2025/2026',
    createdDate: '01 April, 2026',
    status: 'Ready to Review',
    fileUrl: '/files/reports/rep-2.pdf',
  },
  {
    id: 'rep-3',
    title: 'Futsal Friendly Match Report',
    approvedText: 'Saved as draft',
    academicPeriod: '2024/2025',
    createdDate: '22 March, 2026',
    status: 'Draft',
    fileUrl: '/files/reports/rep-3.pdf',
  },
  {
    id: 'rep-4',
    title: 'English Club Debate Session Report',
    approvedText: 'Needs revision',
    academicPeriod: '2023/2024',
    createdDate: '10 February, 2026',
    status: 'Needs Revision',
    fileUrl: '/files/reports/rep-4.pdf',
  },
];

const STATUS_OPTIONS = ['All Status', 'Approved', 'Ready to Review', 'Needs Revision', 'Draft'];

const statusPillStyle = (status) => {
  switch (status) {
    case 'Approved':
      return 'bg-[#ECFDF3] text-[#12B76A]';
    case 'Ready to Review':
      return 'bg-[#FFF7ED] text-[#FB6514]';
    case 'Needs Revision':
      return 'bg-[#FEF2F2] text-[#F04438]';
    case 'Draft':
      return 'bg-[#F2F4F7] text-[#667085]';
    default:
      return 'bg-gray-100 text-gray-500';
  }
};

// Right Drawer for Add Proposal/Report
const AddDrawer = ({
  isOpen,
  onClose,
  onSubmit,
  periodOptions,
  mode,
}) => {
  const [title, setTitle] = useState('');
  const [period, setPeriod] = useState('Select Periods');
  const [status, setStatus] = useState('Select Status');
  const [openDropdown, setOpenDropdown] = useState(null);
  const [file, setFile] = useState(null);
  const fileInputRef = useRef(null);

  const closeAll = () => setOpenDropdown(null);

  const drawerTitle = mode === 'proposal' ? 'Add New Proposal' : 'Add New Reports';
  const titleLabel = mode === 'proposal' ? 'Proposal Title' : 'Report Title';
  const titlePlaceholder = mode === 'proposal' ? 'Enter Proposal Title' : 'Enter Report Title';
  const uploadLabel = mode === 'proposal' ? 'Upload Proposal File' : 'Upload Report File';
  const submitText = mode === 'proposal' ? 'Add Proposal' : 'Add Reports';

  const isValid =
    title.trim() !== '' &&
    !period.includes('Select') &&
    !status.includes('Select') &&
    !!file;

  return (
    <>
      {/* overlay */}
      <div
        className={`fixed inset-0 z-40 transition-opacity duration-300 ${isOpen ? 'opacity-100 bg-black/40 pointer-events-auto' : 'opacity-0 pointer-events-none'
          }`}
        onClick={() => {
          closeAll();
          onClose();
        }}
      />

      {/* drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-180 bg-white z-50 shadow-2xl transform transition-transform duration-300 ease-in-out flex flex-col ${isOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* header */}
        <div className="flex items-center justify-between px-7 py-5 border-b border-gray-100 bg-white shrink-0">
          <h3 className="text-[16px] font-semibold text-gray-900">{drawerTitle}</h3>
          <button
            type="button"
            onClick={() => {
              closeAll();
              onClose();
            }}
            className="w-10 h-10 flex items-center justify-center rounded-xl text-gray-400 hover:bg-gray-50 transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>


        {/* content */}
        <div className="px-7 pt-6 pb-6 overflow-y-auto">
          <div className="flex flex-col gap-6">
            {/* title */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-800">{titleLabel}</label>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={titlePlaceholder}
                className="w-full px-5 py-3 rounded-2xl border border-gray-200 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-[#C1200C] focus:border-[#C1200C] transition-colors"
              />
            </div>

            {/* period + status */}
            <div className="grid grid-cols-2 gap-5">
              <div className="relative">
                <label className="text-sm font-medium text-gray-800 block mb-2">Academic Periods</label>
                <button
                  type="button"
                  onClick={() => setOpenDropdown(openDropdown === 'period' ? null : 'period')}
                  className={`w-full px-5 py-3 rounded-2xl border bg-white flex items-center justify-between text-sm cursor-pointer transition-colors ${openDropdown === 'period' ? 'border-[#C1200C]' : 'border-gray-200'
                    } ${period.includes('Select') ? 'text-gray-400' : 'text-gray-900'}`}
                >
                  <span className="truncate">{period}</span>
                  <ChevronDown size={16} className="text-gray-400" />
                </button>

                {openDropdown === 'period' && (
                  <>
                    <div className="fixed inset-0 z-50" onClick={() => setOpenDropdown(null)} />
                    <div className="absolute left-0 top-full mt-2 w-full bg-white border border-gray-100 rounded-2xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.12)] z-60 overflow-hidden py-2">
                      {periodOptions.map((p) => (
                        <button
                          key={p}
                          type="button"
                          onClick={() => {
                            setPeriod(p);
                            setOpenDropdown(null);
                          }}
                          className="w-full text-left px-5 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
                        >
                          {p}
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>

              {/* status */}
              <div className="relative">
                <label className="text-sm font-medium text-gray-800 block mb-2">Status</label>
                <button
                  type="button"
                  onClick={() => setOpenDropdown(openDropdown === 'status' ? null : 'status')}
                  className={`w-full px-5 py-3 rounded-2xl border bg-white flex items-center justify-between text-sm cursor-pointer transition-colors ${openDropdown === 'status' ? 'border-[#C1200C]' : 'border-gray-200'
                    } ${status.includes('Select') ? 'text-gray-400' : 'text-gray-900'}`}
                >
                  <span className="truncate">{status}</span>
                  <ChevronDown size={16} className="text-gray-400" />
                </button>

                {openDropdown === 'status' && (
                  <>
                    <div className="fixed inset-0 z-50" onClick={() => setOpenDropdown(null)} />
                    <div className="absolute left-0 top-full mt-2 w-full bg-white border border-gray-100 rounded-2xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.12)] z-60 overflow-hidden py-2">
                      {['Ready to Review', 'Draft'].map((s) => (
                        <button
                          key={s}
                          type="button"
                          onClick={() => {
                            setStatus(s);
                            setOpenDropdown(null);
                          }}
                          className="w-full text-left px-5 py-3 hover:bg-gray-50 transition-colors cursor-pointer"
                        >
                          <span className={`px-4 py-1.5 rounded-full text-xs font-medium inline-block whitespace-nowrap ${statusPillStyle(s)}`}>
                            {s}
                          </span>
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* upload */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-800">{uploadLabel}</label>

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-full rounded-2xl border border-dashed border-gray-200 bg-white hover:bg-gray-50/30 transition-colors cursor-pointer"
              >
                <div className="py-12 flex flex-col items-center justify-center gap-3">
                  <div className="w-14 h-14 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-600">
                    <FileText size={22} />
                  </div>

                  <div className="text-sm font-semibold text-gray-900">
                    Drag &amp; drop your file here, or click to upload
                  </div>
                  <div className="text-xs text-gray-400">PDF format only, max 5MB</div>

                  {file && (
                    <div className="mt-2 text-xs text-gray-600">
                      Selected: <span className="font-medium">{file.name}</span>
                    </div>
                  )}
                </div>
              </button>

              <input
                ref={fileInputRef}
                type="file"
                accept="application/pdf"
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) setFile(f);
                }}
              />
            </div>
          </div>
        </div>

        {/* footer */}
        <div className="mt-auto border-t border-gray-100 px-7 py-5 bg-white grid grid-cols-2 gap-4 shrink-0">
          <button
            type="button"
            onClick={() => {
              closeAll();
              onClose();
            }}
            className="py-3.5 rounded-2xl border border-gray-200 text-sm font-medium text-gray-900 hover:bg-gray-50 transition-colors cursor-pointer bg-white"
          >
            Cancel
          </button>

          <button
            type="button"
            disabled={!isValid}
            onClick={() => {
              if (!isValid) return;
              onSubmit({
                title: title.trim(),
                academicPeriod: period,
                status,
                file,
              });
              onClose();
            }}
            className={`py-3.5 rounded-2xl text-sm font-medium transition-colors ${isValid
              ? 'bg-[#C1200C] text-white hover:bg-[#A31B0A] cursor-pointer'
              : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              }`}
          >
            {submitText}
          </button>
        </div>
      </div>
    </>
  );
};

const Reports = () => {
  const [activeTab, setActiveTab] = useState('proposal');

  const [proposalItems, setProposalItems] = useState(initialProposalItems);
  const [reportItems, setReportItems] = useState(initialReportItems);

  // Search + filter
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('All Status');
  const [statusDropdownOpen, setStatusDropdownOpen] = useState(false);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 4;

  // Drawer add
  const [isAddOpen, setIsAddOpen] = useState(false);

  // State Succes Modal
  const [isAddSuccessOpen, setIsAddSuccessOpen] = useState(false);

  const periodOptions = ['2025/2026', '2024/2025', '2023/2024', '2022/2023', '2021/2022', '2020/2021'];

  const items = activeTab === 'proposal' ? proposalItems : reportItems;

  const filtered = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return items.filter((it) => {
      const matchesSearch =
        q === '' ||
        it.title.toLowerCase().includes(q) ||
        (it.academicPeriod || '').toLowerCase().includes(q) ||
        (it.createdDate || '').toLowerCase().includes(q);

      const matchesStatus = filterStatus === 'All Status' || it.status === filterStatus;

      return matchesSearch && matchesStatus;
    });
  }, [items, searchQuery, filterStatus]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const pageData = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const isEmpty = filtered.length === 0;

  const combined = [...proposalItems, ...reportItems];
  const totalReports = combined.length;
  const draftReports = combined.filter((i) => i.status === 'Draft').length;
  const readyToReview = combined.filter((i) => i.status === 'Ready to Review').length;
  const approved = combined.filter((i) => i.status === 'Approved').length;

  // Download Template Handler
  const handleDownloadTemplate = () => {
    const url = activeTab === 'proposal' ? '/template_proposal_kegiatan.docx' : '/template_laporan_kegiatan.docx';
    const fileName = activeTab === 'proposal' ? 'template_proposal_kegiatan.docx' : 'template_laporan_kegiatan.docx';

    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  // View Card Handler (using Microsoft Office Online Viewer)
  const handleViewFile = () => {
    const url = activeTab === 'proposal' ? '/template_proposal_kegiatan.docx' : '/template_laporan_kegiatan.docx';

    const absoluteUrl = window.location.origin + url;
    const viewerUrl = `https://view.officeapps.live.com/op/view.aspx?src=${encodeURIComponent(absoluteUrl)}`;

    window.open(viewerUrl, '_blank', 'noopener,noreferrer');
  };

  // Download File Handler
  const handleDownloadFile = () => {
    const url = activeTab === 'proposal' ? '/template_proposal_kegiatan.docx' : '/template_laporan_kegiatan.docx';
    const fileName = activeTab === 'proposal' ? 'template_proposal_kegiatan.docx' : 'template_laporan_kegiatan.docx';

    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  const handleSubmitAdd = ({ title, academicPeriod, status, file }) => {
    const id = `${activeTab}-${Date.now()}`;
    const newItem = {
      id,
      title,
      approvedText: status === 'Approved' ? 'Approved on April 21, 2026' : status === 'Draft' ? 'Saved as draft' : 'Awaiting review',
      academicPeriod,
      createdDate: '01 April, 2026',
      status,
      fileUrl: '',
      _localFile: file,
    };

    if (activeTab === 'proposal') setProposalItems((prev) => [newItem, ...prev]);
    else setReportItems((prev) => [newItem, ...prev]);

    setCurrentPage(1);

    setTimeout(() => setIsAddSuccessOpen(true), 150);
  };

  const addButtonText = activeTab === 'proposal' ? 'Add New Proposal' : 'Add New Reports';

  return (
    <>
      <div className="p-8 pt-4 flex flex-col flex-1 gap-6 relative z-0 isolate min-h-screen bg-white font-sans">
        {/* Top summary cards */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {/* Reports */}
          <div className="bg-gray-50 border border-gray-200 rounded-2xl p-1.5">
            <h2 className="text-base font-semibold text-gray-900 mb-3 pl-4">Reports</h2>

            <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
              <div className="grid grid-cols-2">
                <div className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl border border-gray-200 flex items-center justify-center text-gray-500 bg-white shrink-0">
                      <FileText size={18} />
                    </div>
                    <span className="text-sm font-semibold text-gray-900">Total Reports</span>
                  </div>

                  <div className="mt-6">
                    <div className="text-3xl font-semibold text-gray-900 leading-none">{totalReports}</div>
                    <div className="text-xs text-gray-400 mt-3">All submitted reports</div>
                  </div>
                </div>

                <div className="border-l border-gray-200 px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl border border-gray-200 flex items-center justify-center text-gray-500 bg-white shrink-0">
                      <FileSignature size={18} />
                    </div>
                    <span className="text-sm font-semibold text-gray-900">Draft Reports</span>
                  </div>

                  <div className="mt-6">
                    <div className="text-3xl font-semibold text-gray-900 leading-none">{draftReports}</div>
                    <div className="text-xs text-gray-400 mt-3">Saved as draft</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Review Status */}
          <div className="bg-gray-50 border border-gray-200 rounded-2xl p-1.5">
            <h2 className="text-base font-semibold text-gray-900 mb-3 pl-4">Review Status</h2>

            <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
              <div className="grid grid-cols-2">
                <div className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl border border-gray-200 flex items-center justify-center text-gray-500 bg-white shrink-0">
                      <FileSignature size={18} />
                    </div>
                    <span className="text-sm font-semibold text-gray-900">Ready to Review</span>
                  </div>

                  <div className="mt-6">
                    <div className="text-3xl font-semibold text-gray-900 leading-none">{readyToReview}</div>
                    <div className="text-xs text-gray-400 mt-3">Awaiting review</div>
                  </div>
                </div>

                <div className="border-l border-gray-200 px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl border border-gray-200 flex items-center justify-center text-gray-500 bg-white shrink-0">
                      <FileText size={18} />
                    </div>
                    <span className="text-sm font-semibold text-gray-900">Approved Reports</span>
                  </div>

                  <div className="mt-6">
                    <div className="text-3xl font-semibold text-gray-900 leading-none">{approved}</div>
                    <div className="text-xs text-gray-400 mt-3">Approved submissions</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="w-full bg-[#F3F4F6] rounded-2xl p-1.5 border border-gray-200 relative z-0 overflow-hidden">
          <div
            className={`absolute z-0 top-1.5 bottom-1.5 w-1/2 bg-white border border-gray-200 rounded-xl shadow-sm transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${activeTab === 'proposal' ? 'translate-x-0' : 'translate-x-full'
              }`}
          />

          <div className="relative z-10 flex items-center">
            <button
              type="button"
              onClick={() => {
                setActiveTab('proposal');
                setCurrentPage(1);
                setSearchQuery('');
                setFilterStatus('All Status');
                setStatusDropdownOpen(false);
              }}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-medium transition-colors cursor-pointer ${activeTab === 'proposal' ? 'text-gray-900' : 'text-gray-400'
                }`}
            >
              <FileText size={16} className={activeTab === 'proposal' ? 'text-gray-900' : 'text-gray-400'} />
              Activity Proposal
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveTab('report');
                setCurrentPage(1);
                setSearchQuery('');
                setFilterStatus('All Status');
                setStatusDropdownOpen(false);
              }}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-medium transition-colors cursor-pointer ${activeTab === 'report' ? 'text-gray-900' : 'text-gray-400'
                }`}
            >
              <FileSignature size={16} className={activeTab === 'report' ? 'text-gray-900' : 'text-gray-400'} />
              Activity Report
            </button>
          </div>
        </div>

        {/* Search + Actions */}
        <div className="flex items-center justify-between gap-4">
          {/* Search */}
          <div className="w-full max-w-xs">
            <div className="h-11 w-full rounded-xl border border-gray-200 flex items-center gap-3 px-4 text-gray-400 bg-white">
              <Search size={16} />
              <input
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full outline-none text-sm text-gray-700 placeholder:text-gray-400 bg-transparent"
                placeholder="Search..."
              />
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            {/* Status filter */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setStatusDropdownOpen((v) => !v)}
                className={`h-11 flex items-center gap-3 px-5 rounded-xl border bg-white text-sm font-medium transition-colors cursor-pointer ${statusDropdownOpen ? 'border-[#C1200C] text-gray-700' : 'border-gray-200 text-gray-500 hover:bg-gray-50'
                  }`}
              >
                <span className="truncate max-w-28">{filterStatus}</span>
                <ChevronDown size={14} className="text-gray-400 shrink-0" />
              </button>

              {statusDropdownOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setStatusDropdownOpen(false)} />
                  <div className="absolute right-0 top-full mt-2 w-56 bg-white border border-gray-100 rounded-2xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.12)] z-20 overflow-hidden py-2">
                    {STATUS_OPTIONS.map((opt) => (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => {
                          setFilterStatus(opt);
                          setStatusDropdownOpen(false);
                          setCurrentPage(1);
                        }}
                        className="w-full text-left px-5 py-3 hover:bg-gray-50 transition-colors cursor-pointer"
                      >
                        {opt === 'All Status' ? (
                          <span className={`text-sm ${filterStatus === opt ? 'text-[#C1200C] font-medium' : 'text-gray-700'}`}>
                            {opt}
                          </span>
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

            {/* Download template */}
            <button
              type="button"
              onClick={handleDownloadTemplate}
              className="h-11 px-5 rounded-xl border border-gray-200 text-sm text-gray-700 flex items-center gap-3 hover:bg-gray-50 transition bg-white cursor-pointer"
            >
              <Download size={16} className="text-gray-500" />
              Download Template
            </button>

            {/* Add new */}
            <button
              type="button"
              onClick={() => setIsAddOpen(true)}
              className="h-11 px-5 rounded-xl bg-[#C1200C] hover:bg-[#A31B0A] text-sm text-white flex items-center gap-3 transition cursor-pointer"
            >
              <Plus size={16} />
              {addButtonText}
            </button>
          </div>
        </div>

        {/* List / Empty */}
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
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            {pageData.map((it) => (
              <div key={it.id} className="bg-white border border-gray-200 rounded-2xl p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="w-11 h-11 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center text-[#C1200C] shrink-0">
                      <FileText size={18} />
                    </div>

                    <div className="flex flex-col">
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-semibold text-gray-900 leading-tight">{it.title}</span>
                        <span className={`px-4 py-1.5 rounded-full text-xs font-medium whitespace-nowrap ${statusPillStyle(it.status)}`}>
                          {it.status}
                        </span>
                      </div>

                      <span className="text-xs text-gray-400 mt-1">{it.approvedText}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => handleViewFile()}
                      className="w-10 h-10 rounded-xl border border-gray-200 flex items-center justify-center text-gray-700 hover:bg-gray-50 transition cursor-pointer"
                      aria-label="View"
                    >
                      <Eye size={16} />
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDownloadFile()}
                      className="w-10 h-10 rounded-xl border border-gray-200 flex items-center justify-center text-gray-700 hover:bg-gray-50 transition cursor-pointer"
                      aria-label="Download"
                    >
                      <Download size={16} />
                    </button>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-100 grid grid-cols-2 gap-4 text-xs text-gray-500">
                  <div className="flex items-center gap-2">
                    <FileSignature size={14} className="text-gray-400" />
                    <span className="text-gray-400">Academic Periods:</span>
                    <span className="text-gray-900 font-medium">{it.academicPeriod}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <FileSignature size={14} className="text-gray-400" />
                    <span className="text-gray-400">Tanggal dibuat:</span>
                    <span className="text-gray-900 font-medium">{it.createdDate}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

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

            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .slice(0, 3)
              .map((page) => (
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

        {/* Notification Modal */}
        <NotificationModal
          isOpen={isAddSuccessOpen}
          type="success"
          title={activeTab === 'proposal' ? 'Proposal Created' : 'Report Created'}
          message={activeTab === 'proposal' ? 'The new activity proposal has been added successfully.' : 'The new activity report has been added successfully.'}
          buttonText={activeTab === 'proposal' ? 'Return to Proposals' : 'Return to Reports'}
          onButtonClick={() => setIsAddSuccessOpen(false)}
          onClose={() => setIsAddSuccessOpen(false)}
        />
      </div>

      {/* Right drawer add */}
      <AddDrawer
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        onSubmit={handleSubmitAdd}
        periodOptions={periodOptions}
        mode={activeTab}
      />
    </>
  );
};

export default Reports;