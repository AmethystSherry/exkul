import React, { useMemo, useState } from 'react';
import {
  Search,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Upload,
  UsersRound,
  ArrowUpRight,
  Users,
  Percent,
} from 'lucide-react';

// Data Mocks
const initialMembers = [
  { id: '1', name: 'Ayu Rahmawati', nis: '2023001', className: 'VIII A', attendance: 95, status: 'Active' },
  { id: '2', name: 'Dian Pertiwi', nis: '2023002', className: 'VII B', attendance: 95, status: 'Inactive' },
  { id: '3', name: 'Farah Amelia', nis: '2023003', className: 'VIII B', attendance: 95, status: 'Active' },
  { id: '4', name: 'Hendra Kusuma', nis: '2023004', className: 'IX A', attendance: 95, status: 'Active' },
  { id: '5', name: 'Intan Permata', nis: '2023005', className: 'VII A', attendance: 95, status: 'Active' },
  { id: '6', name: 'Hendra Kusuma', nis: '2023006', className: 'VII B', attendance: 95, status: 'Active' },
  { id: '7', name: 'Intan Permata', nis: '2023007', className: 'VIII B', attendance: 95, status: 'Active' },
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

const Members = () => {
  const [data] = useState(initialMembers);

  // search + filter class
  const [searchQuery, setSearchQuery] = useState('');
  const [filterClass, setFilterClass] = useState('All Class');
  const [openFilter, setOpenFilter] = useState(null);

  // pagination
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 7;

  const classOptions = useMemo(() => {
    const set = new Set(data.map((d) => d.className));
    return ['All Class', ...Array.from(set)];
  }, [data]);

  const filtered = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();

    return data.filter((row) => {
      const matchesSearch =
        q === '' ||
        row.name.toLowerCase().includes(q) ||
        row.nis.toLowerCase().includes(q);

      const matchesClass = filterClass === 'All Class' || row.className === filterClass;

      return matchesSearch && matchesClass;
    });
  }, [data, searchQuery, filterClass]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const currentTableData = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const isEmpty = filtered.length === 0;

  const handleExportCSV = () => {
    const headers = [
      { key: 'name', label: 'Student Name' },
      { key: 'nis', label: 'NIS' },
      { key: 'className', label: 'Class' },
      { key: 'attendance', label: 'Attendance' },
      { key: 'status', label: 'Status' },
    ];

    const csv = toCSV(filtered, headers);

    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');

    downloadCSV(csv, `mentor_members_${yyyy}-${mm}-${dd}.csv`);
  };

  return (
    <div className="px-8 py-8 flex flex-col flex-1 gap-6 relative min-h-screen bg-white font-sans">
      {/* Top Card */}
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

            {/* Attendance Rate */}
            <div className="border-l border-gray-200 px-5 py-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl border border-gray-200 flex items-center justify-center text-gray-500 bg-white shrink-0">
                  <Percent size={18} />
                </div>
                <span className="text-sm font-semibold text-gray-900">Attendance Rate</span>
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

      {/* Search + Filter + Export */}
      <div className="flex items-center justify-between gap-4">
        <div className="w-80">
          <div className="h-11 w-full rounded-xl border border-gray-200 flex items-center gap-3 px-4 text-gray-400 bg-white">
            <Search size={16} />
            <input
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full outline-none text-sm text-gray-700 placeholder:text-gray-400 bg-transparent"
              placeholder="Search member or student ID..."
            />
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <div className="relative">
            <button
              type="button"
              onClick={() => setOpenFilter(openFilter === 'class' ? null : 'class')}
              className={`h-11 flex items-center gap-3 px-5 rounded-xl border bg-white text-sm font-medium transition-colors cursor-pointer ${
                openFilter === 'class'
                  ? 'border-[#C1200C] text-gray-700'
                  : 'border-gray-200 text-gray-500 hover:bg-gray-50'
              }`}
            >
              <span className="truncate max-w-28">{filterClass}</span>
              <ChevronDown size={14} className="text-gray-400 shrink-0" />
            </button>

            {openFilter === 'class' && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setOpenFilter(null)} />
                <div className="absolute right-0 top-full mt-2 w-56 bg-white border border-gray-100 rounded-2xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] z-20 overflow-hidden py-2">
                  {classOptions.map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => {
                        setFilterClass(opt);
                        setOpenFilter(null);
                        setCurrentPage(1);
                      }}
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

          <button
            type="button"
            onClick={handleExportCSV}
            className="h-11 px-5 rounded-xl border border-gray-200 text-sm text-gray-700 flex items-center gap-3 hover:bg-gray-50 transition bg-white cursor-pointer"
          >
            <Upload size={16} className="text-gray-500" />
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
            No members match your search criteria.
          </p>
        </div>
      ) : (
        <>
          <div className="w-full overflow-x-auto flex-1">
            <table className="w-full text-left border-separate border-spacing-0">
              <thead>
                <tr className="bg-[#F8F9FA]">
                  <th className="px-6 py-4 text-sm font-semibold text-gray-900 border-l border-t border-b border-gray-200 rounded-tl-2xl rounded-bl-2xl w-[34%]">
                    Student Name
                  </th>
                  <th className="px-6 py-4 text-sm font-semibold text-gray-900 border-t border-b border-gray-200 w-[16%]">
                    NIS
                  </th>
                  <th className="px-6 py-4 text-sm font-semibold text-gray-900 border-t border-b border-gray-200 w-[16%]">
                    Class
                  </th>
                  <th className="px-6 py-4 text-sm font-semibold text-gray-900 border-t border-b border-gray-200 text-center w-[20%]">
                    Attendance
                  </th>
                  <th className="px-6 py-4 text-sm font-semibold text-gray-900 border-r border-t border-b border-gray-200 rounded-tr-2xl rounded-br-2xl w-[14%]">
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

                    <td className="px-6 py-5 text-sm text-gray-500">
                      <div className="flex items-center justify-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-[#12B76A]" />
                        <span>{row.attendance}%</span>
                      </div>
                    </td>

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