import React, { useState } from 'react';
import {
  Search, ChevronDown, ChevronLeft, ChevronRight,
  MoreVertical, Plus, X, Check, Trash2, Share, Building
} from 'lucide-react';
import NotificationModal from '../../components/ui/NotificationModal';

// Data Mocks
const initialData = [
  {
    id: '1',
    name: 'Basketball',
    category: 'Sport',
    mentor: 'Budi Santoso',
    members: '30 Members',
    schedule1: { day: 'Monday', time: '15:00' },
    schedule2: { day: 'Thursday', time: '15:00' },
    location: 'Basketball Court',
  },
  {
    id: '2',
    name: 'Choir',
    category: 'Arts',
    mentor: 'Rina Melati',
    members: '25 Members',
    schedule1: { day: 'Wednesday', time: '14:30' },
    schedule2: null,
    location: 'Classroom 201',
  },
  {
    id: '3',
    name: 'Coding Club',
    category: 'Technology',
    mentor: 'Galih Nugroho',
    members: '28 Members',
    schedule1: { day: 'Friday', time: '15:00' },
    schedule2: null,
    location: 'Computer Lab',
  },
  {
    id: '4',
    name: 'PMR',
    category: 'Social',
    mentor: 'Dewi Sartika',
    members: '22 Members',
    schedule1: { day: 'Tuesday', time: '15:00' },
    schedule2: null,
    location: 'Classroom 201',
  },
  {
    id: '5',
    name: 'Futsal',
    category: 'Sport',
    mentor: 'Ahmad Rizal',
    members: '32 Members',
    schedule1: { day: 'Wednesday', time: '15:00' },
    schedule2: null,
    location: 'Basketball Court',
  },
  {
    id: '6',
    name: 'English Club',
    category: 'Academic',
    mentor: 'Sinta Maharani',
    members: '20 Members',
    schedule1: { day: 'Thursday', time: '13:30' },
    schedule2: null,
    location: 'Library',
  },
  {
    id: '7',
    name: 'Robotics',
    category: 'Technology',
    mentor: 'Dimas Prakoso',
    members: '18 Members',
    schedule1: { day: 'Saturday', time: '09:00' },
    schedule2: null,
    location: 'Robotics Lab',
  },
];

const categoryStyles = {
  Sport: 'bg-[#ECFDF3] text-[#12B76A]',
  Arts: 'bg-[#F2F4F7] text-[#667085]',
  Technology: 'bg-[#FEF2F2] text-[#F04438]',
  Social: 'bg-[#FFF7ED] text-[#FB6514]',
  Academic: 'bg-[#EFF8FF] text-[#2E90FA]',
};

// Helper for Time Picker
const hoursList = Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, '0'));
const minutesList = Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, '0'));

const toScheduleText = (schedule1, schedule2) => {
  if (!schedule1?.day || !schedule1?.time) return '-';
  const first = `${schedule1.day} - ${schedule1.time}`;
  if (schedule2?.day && schedule2?.time) {
    return `${first}, ${schedule2.day} - ${schedule2.time}`;
  }
  return first;
};

const ExtracurricularManagement = () => {
  const [data, setData] = useState(initialData);
  const [searchQuery, setSearchQuery] = useState('');

  // State for Filters and Pagination
  const [filterCategory, setFilterCategory] = useState('All Category');
  const [filterMentor, setFilterMentor] = useState('All Mentor');
  const [openFilter, setOpenFilter] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  // State for Drawer & Modals
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [isEditSuccessModalOpen, setIsEditSuccessModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // Form Inputs
  const [exkulName, setExkulName] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Select category');
  const [selectedMentor, setSelectedMentor] = useState('Select mentor');

  // Schedule 1 (required)
  const [selectedDay1, setSelectedDay1] = useState('Select day');
  const [selectedTime1, setSelectedTime1] = useState('Select time');

  // Schedule 2 (optional)
  const [selectedDay2, setSelectedDay2] = useState('Select day');
  const [selectedTime2, setSelectedTime2] = useState('Select time');

  const [selectedLocation, setSelectedLocation] = useState('Select location');

  // Time picker state
  const [pickerHour1, setPickerHour1] = useState('14');
  const [pickerMinute1, setPickerMinute1] = useState('30');

  const [pickerHour2, setPickerHour2] = useState('14');
  const [pickerMinute2, setPickerMinute2] = useState('30');

  const [activeDropdown, setActiveDropdown] = useState(null);

  // State for Edit and Delete Actions
  const [editingId, setEditingId] = useState(null);
  const [openActionMenuId, setOpenActionMenuId] = useState(null);

  // Logic for Filtering
  const filteredData = data.filter(row => {
    const matchesSearch = row.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = filterCategory === 'All Category' || row.category === filterCategory;
    const matchesMentor = filterMentor === 'All Mentor' || row.mentor === filterMentor;
    return matchesSearch && matchesCategory && matchesMentor;
  });

  // Logic for Pagination
  const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE) || 1;
  if (currentPage > totalPages && totalPages > 0) {
    setCurrentPage(totalPages);
  }
  const currentTableData = filteredData.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  // CRUD Functions
  const resetForm = () => {
    setExkulName('');
    setSelectedCategory('Select category');
    setSelectedMentor('Select mentor');

    setSelectedDay1('Select day');
    setSelectedTime1('Select time');

    setSelectedDay2('Select day');
    setSelectedTime2('Select time');

    setSelectedLocation('Select location');

    setPickerHour1('14');
    setPickerMinute1('30');
    setPickerHour2('14');
    setPickerMinute2('30');

    setActiveDropdown(null);
  };

  const handleOpenAddDrawer = () => {
    setEditingId(null);
    resetForm();
    setIsDrawerOpen(true);
  };

  const handleOpenEditDrawer = (id) => {
    setOpenActionMenuId(null);
    setEditingId(id);

    const itemToEdit = data.find(d => d.id === id);
    if (!itemToEdit) return;

    setExkulName(itemToEdit.name);
    setSelectedCategory(itemToEdit.category);
    setSelectedMentor(itemToEdit.mentor);

    setSelectedDay1(itemToEdit.schedule1?.day || 'Select day');
    setSelectedTime1(itemToEdit.schedule1?.time || 'Select time');
    if (itemToEdit.schedule1?.time) {
      const [h, m] = itemToEdit.schedule1.time.split(':');
      if (h) setPickerHour1(h);
      if (m) setPickerMinute1(m);
    }

    if (itemToEdit.schedule2?.day) setSelectedDay2(itemToEdit.schedule2.day);
    else setSelectedDay2('Select day');

    if (itemToEdit.schedule2?.time) {
      setSelectedTime2(itemToEdit.schedule2.time);
      const [h2, m2] = itemToEdit.schedule2.time.split(':');
      if (h2) setPickerHour2(h2);
      if (m2) setPickerMinute2(m2);
    } else {
      setSelectedTime2('Select time');
    }

    setSelectedLocation(itemToEdit.location || 'Select location');
    setIsDrawerOpen(true);
  };

  const handleDelete = (idToRemove) => {
    setOpenActionMenuId(null);
    setData(data.filter(d => d.id !== idToRemove));
    setTimeout(() => setIsDeleteModalOpen(true), 150);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    setIsDrawerOpen(false);

    const schedule1 = {
      day: selectedDay1,
      time: selectedTime1,
    };

    const schedule2 =
      !selectedDay2.includes('Select') && !selectedTime2.includes('Select')
        ? { day: selectedDay2, time: selectedTime2 }
        : null;

    if (editingId !== null) {
      setData(data.map(d => d.id === editingId ? {
        ...d,
        name: exkulName,
        category: selectedCategory,
        mentor: selectedMentor,
        schedule1,
        schedule2,
        location: selectedLocation,
      } : d));
      setTimeout(() => setIsEditSuccessModalOpen(true), 150);
    } else {
      const newItem = {
        id: Date.now().toString(),
        name: exkulName,
        category: selectedCategory,
        mentor: selectedMentor,
        members: '0 Members',
        schedule1,
        schedule2,
        location: selectedLocation,
      };
      setData([newItem, ...data]);
      setTimeout(() => setIsSuccessModalOpen(true), 150);
    }
  };

  const CustomSelect = ({ label, value, options, type, placeholder = '' }) => {
    const isActive = activeDropdown === type;
    const isPlaceholder = typeof value === 'string' ? value.includes('Select') : false;
    const displayValue = value || placeholder;

    return (
      <div className="flex flex-col gap-2 relative">
        <label className="text-sm font-medium text-gray-800">{label}</label>

        <div
          onClick={() => setActiveDropdown(isActive ? null : type)}
          className={`w-full px-4 py-2.5 border rounded-xl text-sm bg-white cursor-pointer flex items-center justify-between transition-colors ${isActive ? 'border-[#C1200C]' : 'border-gray-200 hover:border-gray-300'
            } ${isPlaceholder ? 'text-gray-400' : 'text-gray-900'}`}
        >
          {type === 'cat' && !isPlaceholder ? (
            <span className={`px-4 py-1.5 rounded-full text-xs font-medium inline-block whitespace-nowrap ${categoryStyles[value]}`}>
              {value}
            </span>
          ) : (
            <span className="truncate">{displayValue}</span>
          )}
          <ChevronDown size={16} className="text-gray-400 shrink-0" />
        </div>

        {isActive && (
          <>
            <div className="fixed inset-0 z-10" onClick={() => setActiveDropdown(null)} />
            <div className="absolute top-full mt-2 left-0 w-full bg-white border border-gray-100 rounded-2xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] z-50 py-2 overflow-hidden">
              {(type === 'day1' || type === 'day2') && options.map((opt, idx) => (
                <button
                  type="button"
                  key={idx}
                  onClick={() => {
                    if (type === 'day1') setSelectedDay1(opt);
                    if (type === 'day2') setSelectedDay2(opt);
                    setActiveDropdown(null);
                  }}
                  className="w-full text-left px-5 py-3 text-sm text-gray-700 hover:bg-gray-50 cursor-pointer transition-colors"
                >
                  {opt}
                </button>
              ))}

              {type === 'time1' && (
                <div className="p-4 flex flex-col gap-4" onClick={(e) => e.stopPropagation()}>
                  <div className="flex justify-center items-center gap-4 h-40">
                    <div className="flex flex-col overflow-y-auto h-full w-16 text-center no-scrollbar border-r border-gray-100 pr-2">
                      {hoursList.map(h => (
                        <div
                          key={h}
                          onClick={() => setPickerHour1(h)}
                          className={`py-2 my-1 cursor-pointer rounded-lg transition-colors ${pickerHour1 === h ? 'bg-red-50 text-[#C1200C] font-bold text-lg' : 'text-gray-500 hover:bg-gray-50 text-sm'
                            }`}
                        >
                          {h}
                        </div>
                      ))}
                    </div>

                    <div className="text-xl font-bold text-gray-900">:</div>

                    <div className="flex flex-col overflow-y-auto h-full w-16 text-center no-scrollbar border-l border-gray-100 pl-2">
                      {minutesList.map(m => (
                        <div
                          key={m}
                          onClick={() => setPickerMinute1(m)}
                          className={`py-2 my-1 cursor-pointer rounded-lg transition-colors ${pickerMinute1 === m ? 'bg-red-50 text-[#C1200C] font-bold text-lg' : 'text-gray-500 hover:bg-gray-50 text-sm'
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
                      setSelectedTime1(`${pickerHour1}:${pickerMinute1}`);
                      setActiveDropdown(null);
                    }}
                    className="w-full py-2.5 bg-[#C1200C] text-white text-sm font-medium rounded-xl hover:bg-[#A31B0A] transition-colors cursor-pointer"
                  >
                    Set Time
                  </button>
                </div>
              )}

              {type === 'time2' && (
                <div className="p-4 flex flex-col gap-4" onClick={(e) => e.stopPropagation()}>
                  <div className="flex justify-center items-center gap-4 h-40">
                    <div className="flex flex-col overflow-y-auto h-full w-16 text-center no-scrollbar border-r border-gray-100 pr-2">
                      {hoursList.map(h => (
                        <div
                          key={h}
                          onClick={() => setPickerHour2(h)}
                          className={`py-2 my-1 cursor-pointer rounded-lg transition-colors ${pickerHour2 === h ? 'bg-red-50 text-[#C1200C] font-bold text-lg' : 'text-gray-500 hover:bg-gray-50 text-sm'
                            }`}
                        >
                          {h}
                        </div>
                      ))}
                    </div>

                    <div className="text-xl font-bold text-gray-900">:</div>

                    <div className="flex flex-col overflow-y-auto h-full w-16 text-center no-scrollbar border-l border-gray-100 pl-2">
                      {minutesList.map(m => (
                        <div
                          key={m}
                          onClick={() => setPickerMinute2(m)}
                          className={`py-2 my-1 cursor-pointer rounded-lg transition-colors ${pickerMinute2 === m ? 'bg-red-50 text-[#C1200C] font-bold text-lg' : 'text-gray-500 hover:bg-gray-50 text-sm'
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
                      setSelectedTime2(`${pickerHour2}:${pickerMinute2}`);
                      setActiveDropdown(null);
                    }}
                    className="w-full py-2.5 bg-[#C1200C] text-white text-sm font-medium rounded-xl hover:bg-[#A31B0A] transition-colors cursor-pointer"
                  >
                    Set Time
                  </button>
                </div>
              )}

              {type !== 'day1' && type !== 'day2' && type !== 'time1' && type !== 'time2' && options.map((opt, idx) => (
                <div
                  key={idx}
                  onClick={() => {
                    if (type === 'cat') setSelectedCategory(opt);
                    if (type === 'mentor') setSelectedMentor(opt);
                    if (type === 'loc') setSelectedLocation(opt);
                    setActiveDropdown(null);
                  }}
                  className="px-5 py-3 text-sm text-gray-700 hover:bg-gray-50 cursor-pointer transition-colors"
                >
                  {type === 'cat' ? (
                    <span className={`px-4 py-1.5 rounded-full text-xs font-medium inline-block whitespace-nowrap ${categoryStyles[opt]}`}>
                      {opt}
                    </span>
                  ) : (opt)}
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    );
  };

  const uniqueMentors = Array.from(new Set(initialData.map(item => item.mentor)));

  // Validation
  const isFormValid =
    exkulName.trim() !== '' &&
    !selectedCategory.includes('Select') &&
    !selectedMentor.includes('Select') &&
    !selectedDay1.includes('Select') &&
    !selectedTime1.includes('Select') &&
    !selectedLocation.includes('Select');

  return (
    <>
      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      <div className="p-8 pt-4 flex flex-col flex-1 gap-6 relative min-h-screen bg-white">
        {/* Top Bar */}
        <div className="flex items-center justify-between">
          <div className="relative w-80">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
              className="w-full pl-11 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-[#C1200C] focus:border-[#C1200C] transition-all"
            />
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center">
              <div className="relative">
                <button
                  onClick={() => setOpenFilter(openFilter === 'cat' ? null : 'cat')}
                  className={`flex items-center gap-3 px-5 py-2.5 text-sm font-medium transition-colors cursor-pointer rounded-l-xl border bg-white ${openFilter === 'cat' ? 'border-[#C1200C] text-gray-500 z-10 relative' : 'border-gray-200 text-gray-500 hover:bg-gray-50 relative z-0'}`}
                >
                  <span className="truncate max-w-25">{filterCategory}</span>
                  <ChevronDown size={14} className="text-gray-400 shrink-0" />
                </button>

                {openFilter === 'cat' && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setOpenFilter(null)} />
                    <div className="absolute left-0 top-full mt-2 w-48 bg-white border border-gray-100 rounded-2xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] z-20 py-3 flex flex-col gap-1">
                      <div
                        onClick={() => { setFilterCategory('All Category'); setCurrentPage(1); setOpenFilter(null); }}
                        className={`px-5 py-2 text-sm cursor-pointer transition-colors ${filterCategory === 'All Category' ? 'text-[#C1200C] font-medium' : 'text-gray-600 hover:bg-gray-50'}`}
                      >
                        All Category
                      </div>
                      {["Sport", "Arts", "Technology", "Social", "Academic"].map((cat, idx) => (
                        <div
                          key={idx}
                          onClick={() => { setFilterCategory(cat); setCurrentPage(1); setOpenFilter(null); }}
                          className="px-5 py-2 text-sm cursor-pointer transition-colors hover:bg-gray-50"
                        >
                          <span className={`px-4 py-1.5 rounded-full text-xs font-medium inline-block whitespace-nowrap ${categoryStyles[cat]}`}>
                            {cat}
                          </span>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>

              <div className="relative -ml-px">
                <button
                  onClick={() => setOpenFilter(openFilter === 'mentor' ? null : 'mentor')}
                  className={`flex items-center gap-3 px-5 py-2.5 text-sm font-medium transition-colors cursor-pointer rounded-r-xl border bg-white ${openFilter === 'mentor' ? 'border-[#C1200C] text-gray-500 z-10 relative' : 'border-gray-200 text-gray-500 hover:bg-gray-50 relative z-0'}`}
                >
                  <span className="truncate max-w-25">{filterMentor}</span>
                  <ChevronDown size={14} className="text-gray-400 shrink-0" />
                </button>

                {openFilter === 'mentor' && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setOpenFilter(null)} />
                    <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-gray-100 rounded-2xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] z-20 py-3 flex flex-col gap-1">
                      <div
                        onClick={() => { setFilterMentor('All Mentor'); setCurrentPage(1); setOpenFilter(null); }}
                        className={`px-5 py-3 text-sm cursor-pointer transition-colors ${filterMentor === 'All Mentor' ? 'bg-gray-50 text-[#C1200C] font-medium' : 'text-gray-700 hover:bg-gray-50'}`}
                      >
                        All Mentor
                      </div>
                      {uniqueMentors.map((mentor, idx) => (
                        <div
                          key={idx}
                          onClick={() => { setFilterMentor(mentor); setCurrentPage(1); setOpenFilter(null); }}
                          className={`px-5 py-3 text-sm cursor-pointer transition-colors ${filterMentor === mentor ? 'bg-gray-50 text-[#C1200C] font-medium' : 'text-gray-700 hover:bg-gray-50'}`}
                        >
                          {mentor}
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>

            <button
              onClick={handleOpenAddDrawer}
              className="flex items-center gap-2 px-5 py-2.5 bg-[#C1200C] hover:bg-[#A31B0A] rounded-xl text-sm font-medium text-white transition-colors cursor-pointer"
            >
              <Plus size={16} /> Add Extracurricular
            </button>
          </div>
        </div>

        {/* Table */}
        {filteredData.length > 0 ? (
          <div className="flex flex-col gap-6 flex-1">
            <div className="w-full overflow-x-visible">
              <table className="w-full text-left border-separate border-spacing-0">
                <thead>
                  <tr className="bg-[#F8F9FA]">
                    <th className="px-6 py-4 text-sm font-semibold text-gray-900 border-l border-t border-b border-gray-200 rounded-tl-2xl rounded-bl-2xl w-[16%]">
                      Extracurricular
                    </th>
                    <th className="px-6 py-4 text-sm font-semibold text-gray-900 border-t border-b border-gray-200 w-[14%]">
                      Category
                    </th>
                    <th className="px-6 py-4 text-sm font-semibold text-gray-900 border-t border-b border-gray-200 w-[16%]">
                      Mentor
                    </th>
                    <th className="px-6 py-4 text-sm font-semibold text-gray-900 border-t border-b border-gray-200 w-[12%]">
                      Members
                    </th>
                    <th className="px-6 py-4 text-sm font-semibold text-gray-900 border-t border-b border-gray-200 w-[18%]">
                      Schedule
                    </th>

                    <th className="px-6 py-4 text-sm font-semibold text-gray-900 border-t border-b border-gray-200 w-[20%]">
                      Location
                    </th>

                    <th className="px-6 py-4 text-sm font-semibold text-gray-900 border-r border-t border-b border-gray-200 rounded-tr-2xl rounded-br-2xl text-center w-[4%]">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {currentTableData.map((row) => (
                    <tr key={row.id} className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-5 text-sm font-medium text-gray-900">{row.name}</td>
                      <td className="px-6 py-5">
                        <span className={`px-4 py-1.5 rounded-full text-xs font-medium inline-block whitespace-nowrap ${categoryStyles[row.category] || 'bg-gray-100 text-gray-600'}`}>
                          {row.category}
                        </span>
                      </td>
                      <td className="px-6 py-5 text-sm text-gray-600 font-normal">{row.mentor}</td>
                      <td className="px-6 py-5 text-sm text-gray-600 font-normal">{row.members}</td>
                      <td className="px-6 py-5 text-sm text-gray-600 font-normal">
                        {toScheduleText(row.schedule1, row.schedule2)}
                      </td>

                      <td className="px-6 py-5 text-sm text-gray-600 font-normal">
                        {row.location || '-'}
                      </td>

                      <td className="px-6 py-5 flex justify-center relative">
                        <button
                          onClick={() => setOpenActionMenuId(openActionMenuId === row.id ? null : row.id)}
                          className={`w-10 h-10 flex items-center justify-center border rounded-lg transition-colors cursor-pointer ${openActionMenuId === row.id ? 'border-[#C1200C] text-[#C1200C]' : 'border-gray-200 text-gray-400 hover:text-gray-600 hover:bg-gray-50'}`}
                        >
                          <MoreVertical size={18} />
                        </button>

                        {openActionMenuId === row.id && (
                          <>
                            <div className="fixed inset-0 z-10" onClick={() => setOpenActionMenuId(null)} />
                            <div className="absolute right-0 top-full mt-2 w-56 bg-white border border-gray-100 rounded-2xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] z-20 overflow-hidden py-2 text-left">
                              <button
                                onClick={() => handleOpenEditDrawer(row.id)}
                                className="w-full flex items-center gap-3 px-5 py-2.5 text-sm font-medium text-gray-800 hover:bg-gray-50 transition-colors cursor-pointer"
                              >
                                <Share size={16} className="text-gray-800" /> Edit Extracurricular
                              </button>
                              <button
                                onClick={() => handleDelete(row.id)}
                                className="w-full flex items-center gap-3 px-5 py-2.5 text-sm font-medium text-gray-800 hover:bg-red-50 transition-colors cursor-pointer"
                              >
                                <Trash2 size={16} className="text-[#C1200C]" /> Delete Extracurricular
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
                Showing {filteredData.length === 0 ? 0 : (currentPage - 1) * ITEMS_PER_PAGE + 1}-{Math.min(currentPage * ITEMS_PER_PAGE, filteredData.length)} of {data.length} Data
              </span>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className={`w-8 h-8 flex items-center justify-center rounded-full border border-gray-200 transition-colors ${currentPage === 1 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:bg-gray-50 cursor-pointer'}`}
                >
                  <ChevronLeft size={16} />
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <span
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-1 cursor-pointer transition-colors ${currentPage === page ? 'text-gray-900 font-semibold' : 'text-gray-400 hover:text-gray-900'}`}
                  >
                    {page}
                  </span>
                ))}

                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className={`w-8 h-8 flex items-center justify-center rounded-full border border-gray-200 transition-colors ${currentPage === totalPages ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:bg-gray-50 cursor-pointer'}`}
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center flex-1 py-20 pb-40">
            <div className="w-20 h-20 bg-[#FEF2F2] rounded-3xl flex items-center justify-center mb-6">
              <Building size={32} className="text-[#C1200C]" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2 tracking-tight">No Extracurriculars Found</h3>
            <p className="text-sm text-gray-400 text-center max-w-sm leading-relaxed">
              {searchQuery || filterCategory !== 'All Category' || filterMentor !== 'All Mentor'
                ? 'No extracurriculars match your filter criteria.'
                : 'There are no extracurriculars available yet. Start by adding a new extracurricular to the system.'}
            </p>
          </div>
        )}

        {/* Drawer overlay */}
        {isDrawerOpen && (
          <div className="fixed inset-0 bg-black/40 z-40 transition-opacity duration-300" onClick={() => setIsDrawerOpen(false)} />
        )}

        {/* Drawer */}
        <div className={`fixed top-0 right-0 h-full w-120 bg-white z-50 shadow-2xl transform transition-transform duration-300 ease-in-out flex flex-col ${isDrawerOpen ? 'translate-x-0' : 'translate-x-full'}`}>
          <div className="flex items-center justify-between px-6 py-5 bg-white border-b border-gray-200 shrink-0">
            <h2 className="text-[17px] font-semibold text-gray-900 tracking-tight">
              {editingId !== null ? 'Edit Extracurricular' : 'Create New Extracurricular'}
            </h2>
            <button
              onClick={() => setIsDrawerOpen(false)}
              className="text-gray-500 hover:text-gray-700 transition-colors cursor-pointer"
            >
              <X size={20} strokeWidth={2} />
            </button>
          </div>

          <form onSubmit={handleFormSubmit} className="flex flex-col flex-1 p-6 gap-6 bg-white">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-800">Extracurricular Name</label>
              <input
                type="text"
                placeholder="Enter extracurricular name"
                value={exkulName}
                onChange={(e) => setExkulName(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-900 focus:outline-none focus:ring-1 focus:ring-[#C1200C] focus:border-[#C1200C] placeholder:text-gray-400 transition-colors"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <CustomSelect
                label="Category"
                value={selectedCategory}
                type="cat"
                options={["Sport", "Arts", "Technology", "Social", "Academic"]}
              />
              <CustomSelect
                label="Mentor"
                value={selectedMentor}
                type="mentor"
                options={["Sinta Maharani", "Budi Santoso", "Rina Melati", "Galih Nugroho", "Dewi Sartika", "Ahmad Rizal", "Dimas Prakoso"]}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <CustomSelect
                label="Schedule Day"
                value={selectedDay1}
                type="day1"
                options={["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]}
              />

              <CustomSelect
                label="Schedule Time"
                value={selectedTime1}
                type="time1"
                options={[]}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <CustomSelect
                label="Schedule Day 2 (Optional)"
                value={selectedDay2}
                type="day2"
                options={["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]}
              />

              <CustomSelect
                label="Schedule Time (Optional)"
                value={selectedTime2}
                type="time2"
                options={[]}
              />
            </div>

            <CustomSelect
              label="Location"
              value={selectedLocation}
              type="loc"
              options={["Basketball Court", "Robotics Lab", "Computer Lab", "Library", "Room 201"]}
            />
          </form>

          <div className="flex-1 bg-white"></div>

          <div className="px-6 py-5 bg-white border-t border-gray-200 grid grid-cols-2 gap-4 shrink-0">
            <button
              type="button"
              onClick={() => setIsDrawerOpen(false)}
              className="py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="submit"
              onClick={handleFormSubmit}
              disabled={!isFormValid}
              className={`py-2.5 rounded-xl text-sm font-medium transition-colors ${isFormValid
                ? 'bg-[#C1200C] text-white hover:bg-[#A31B0A] cursor-pointer'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
            >
              {editingId !== null ? 'Save Changes' : 'Create Extracurricular'}
            </button>
          </div>
        </div>

        <NotificationModal
          isOpen={isSuccessModalOpen}
          type="success"
          title="Extracurricular Created"
          message="The extracurricular has been added successfully."
          buttonText="Return to Extracurricular"
          onButtonClick={() => setIsSuccessModalOpen(false)}
          onClose={() => setIsSuccessModalOpen(false)}
        />

        <NotificationModal
          isOpen={isEditSuccessModalOpen}
          type="success"
          title="Extracurricular Updated"
          message="The extracurricular has been successfully updated."
          buttonText="Return to Extracurricular"
          onButtonClick={() => setIsEditSuccessModalOpen(false)}
          onClose={() => setIsEditSuccessModalOpen(false)}
        />

        <NotificationModal
          isOpen={isDeleteModalOpen}
          type="delete"
          title="Extracurricular Deleted"
          message="The extracurricular has been successfully removed from the system."
          buttonText="Return to Extracurricular"
          onButtonClick={() => setIsDeleteModalOpen(false)}
          onClose={() => setIsDeleteModalOpen(false)}
        />
      </div>
    </>
  );
};

export default ExtracurricularManagement;