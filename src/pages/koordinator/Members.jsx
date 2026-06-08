import React, { useMemo, useState } from 'react';
import {
  Search,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Upload,
  UsersRound,
} from 'lucide-react';

// Data Mocks
const initialMembers = [
  { id: '1', name: 'Ayu Rahmawati', nis: '2023001', className: 'VIII A', extracurricular: 'Basketball, Coding Club', status: 'Active' },
  { id: '2', name: 'Dian Pertiwi', nis: '2023002', className: 'VII B', extracurricular: 'Choir', status: 'Inactive' },
  { id: '3', name: 'Farah Amelia', nis: '2023003', className: 'VIII B', extracurricular: 'PMR, English Club, Futsal', status: 'Active' },
  { id: '4', name: 'Hendra Kusuma', nis: '2023004', className: 'IX A', extracurricular: 'Futsal', status: 'Active' },
  { id: '5', name: 'Intan Permata', nis: '2023005', className: 'VII A', extracurricular: 'English Club, Futsal', status: 'Active' },
  { id: '6', name: 'Hendra Kusuma', nis: '2023006', className: 'VII B', extracurricular: 'PMR, Basketball', status: 'Active' },
  { id: '7', name: 'Intan Permata', nis: '2023007', className: 'VIII B', extracurricular: 'PMR', status: 'Active' },
];

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

// CSV Helper functions
const escapeCSV = (value) => {
  const s = String(value ?? '');
  const escaped = s.replace(/"/g, '""');
  if (/[",\n]/.test(escaped)) return `"${escaped}"`;
  return escaped;
};

const toCSV = (rows, headers) => {
  const headLine = headers.map((h) => escapeCSV(h.label)).join(',');
  const lines = rows.map((row) =>
    headers.map((h) => escapeCSV(row[h.key])).join(',')
  );
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

const Members = () => {
  const [data] = useState(initialMembers);
  const [searchQuery, setSearchQuery] = useState('');

  // filters
  const [filterExtracurricular, setFilterExtracurricular] = useState('All Extracurricular');
  const [filterClass, setFilterClass] = useState('All Class');
  const [filterStatus, setFilterStatus] = useState('All Status');
  const [openFilter, setOpenFilter] = useState(null);

  // pagination
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 7;

  const extracurricularOptions = useMemo(() => {
    const set = new Set();
    data.forEach((row) => {
      row.extracurricular.split(',').map((s) => s.trim()).filter(Boolean).forEach((v) => set.add(v));
    });
    return ['All Extracurricular', ...Array.from(set)];
  }, [data]);

  const classOptions = useMemo(() => {
    const set = new Set(data.map((d) => d.className));
    return ['All Class', ...Array.from(set)];
  }, [data]);

  const statusOptions = ['All Status', 'Active', 'Inactive'];

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

  const isEmpty = filtered.length === 0;

  const handleExportCSV = () => {
    const headers = [
      { key: 'name', label: 'Student Name' },
      { key: 'nis', label: 'NIS' },
      { key: 'className', label: 'Class' },
      { key: 'extracurricular', label: 'Extracurricular' },
      { key: 'status', label: 'Status' },
    ];

    const csv = toCSV(filtered, headers);

    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');

    downloadCSV(csv, `members_${yyyy}-${mm}-${dd}.csv`);
  };

  return (
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
                  <div className="absolute right-0 top-full mt-2 w-64 bg-white border border-gray-100 rounded-2xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] z-20 overflow-hidden py-3 px-4">
                    <div className="flex flex-col gap-3">
                      <button
                        onClick={() => handleFilterSelect('status', 'All Status')}
                        className={`w-full text-left text-sm transition-colors cursor-pointer ${
                          filterStatus === 'All Status'
                            ? 'text-[#C1200C] font-medium'
                            : 'text-gray-600 hover:text-gray-900'
                        }`}
                      >
                        All Status
                      </button>

                      <button
                        onClick={() => handleFilterSelect('status', 'Active')}
                        className="w-full text-left cursor-pointer hover:bg-gray-50 rounded-xl px-1 py-1 transition-colors"
                      >
                        <span className={`px-4 py-1.5 rounded-full text-xs font-medium inline-block ${statusPillStyle('Active')}`}>
                          Active
                        </span>
                      </button>

                      <button
                        onClick={() => handleFilterSelect('status', 'Inactive')}
                        className="w-full text-left cursor-pointer hover:bg-gray-50 rounded-xl px-1 py-1 transition-colors"
                      >
                        <span className={`px-4 py-1.5 rounded-full text-xs font-medium inline-block ${statusPillStyle('Inactive')}`}>
                          Inactive
                        </span>
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          <button
            type="button"
            onClick={handleExportCSV}
            className="flex items-center gap-2 px-5 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer bg-white"
          >
            <Upload size={16} className="text-gray-700" />
            Export CSV
          </button>
        </div>
      </div>

      {/* Table / Empty */}
      {isEmpty ? (
        <div className="flex flex-col items-center justify-center flex-1 py-20 pb-40">
          <div className="w-20 h-20 bg-[#FEF2F2] rounded-3xl flex items-center justify-center mb-6">
            <UsersRound size={32} className="text-[#C1200C]" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2 tracking-tight">No Members Found</h3>
          <p className="text-sm text-gray-400 text-center max-w-sm leading-relaxed">
            No members match your search or filter criteria.
          </p>
        </div>
      ) : (
        <>
          <div className="w-full overflow-x-visible flex-1">
            <table className="w-full text-left border-separate border-spacing-0">
              <thead>
                <tr className="bg-[#F8F9FA]">
                  <th className="px-6 py-4 text-sm font-semibold text-gray-900 border-l border-t border-b border-gray-200 rounded-tl-2xl rounded-bl-2xl w-[28%]">
                    Student Name
                  </th>
                  <th className="px-6 py-4 text-sm font-semibold text-gray-900 border-t border-b border-gray-200 w-[16%]">
                    NIS
                  </th>
                  <th className="px-6 py-4 text-sm font-semibold text-gray-900 border-t border-b border-gray-200 w-[16%]">
                    Class
                  </th>
                  <th className="px-6 py-4 text-sm font-semibold text-gray-900 border-t border-b border-gray-200 w-[28%]">
                    Extracurricular
                  </th>
                  <th className="px-6 py-4 text-sm font-semibold text-gray-900 border-r border-t border-b border-gray-200 rounded-tr-2xl rounded-br-2xl w-[12%]">
                    Status
                  </th>
                </tr>
              </thead>

              <tbody>
                {currentTableData.map((row) => (
                  <tr key={row.id} className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-5 text-sm font-medium text-gray-900">{row.name}</td>
                    <td className="px-6 py-5 text-sm text-gray-500">{row.nis}</td>
                    <td className="px-6 py-5 text-sm text-gray-500">{row.className}</td>
                    <td className="px-6 py-5 text-sm text-gray-500">{row.extracurricular}</td>
                    <td className="px-6 py-5">
                      <span className={`px-4 py-1.5 rounded-full text-xs font-medium inline-block whitespace-nowrap ${statusPillStyle(row.status)}`}>
                        {row.status}
                      </span>
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
                className={`w-8 h-8 flex items-center justify-center rounded-full border border-gray-200 transition-colors ${
                  currentPage === 1 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:bg-gray-50 cursor-pointer'
                }`}
              >
                <ChevronLeft size={16} />
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).slice(0, 3).map((page) => (
                <span
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-1 cursor-pointer transition-colors ${
                    currentPage === page ? 'text-gray-900 font-semibold' : 'text-gray-400 hover:text-gray-900'
                  }`}
                >
                  {page}
                </span>
              ))}

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
      )}
    </div>
  );
};

export default Members;