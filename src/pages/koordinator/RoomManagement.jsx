import React, { useState } from 'react';
import {
  Search, ChevronDown, ChevronLeft, ChevronRight,
  MoreVertical, Plus, X, Check, Trash2, Share, DoorClosed
} from 'lucide-react';
import NotificationModal from '../../components/ui/NotificationModal';

// Data Mocks
const initialData = [
  { id: '1', name: 'Basketball Court', type: 'Outdoor', capacity: '50 People', assigned: 'Multiple', status: 'Available' },
  { id: '2', name: 'Auditorium', type: 'Indoor', capacity: '150 People', assigned: 'Choir', status: 'In Use' },
  { id: '3', name: 'Computer Lab', type: 'Indoor', capacity: '40 People', assigned: 'Coding Club', status: 'Available' },
  { id: '4', name: 'UKS Room', type: 'Indoor', capacity: '20 People', assigned: 'PMR', status: 'Unavailable' },
  { id: '5', name: 'Language Lab', type: 'Indoor', capacity: '35 People', assigned: 'English Club', status: 'Available' },
  { id: '6', name: 'Robotics Lab', type: 'Indoor', capacity: '25 People', assigned: 'Robotics Club', status: 'In Use' },
];

// Helper Styling Badge Type
const getTypeStyle = (type) => {
  return type === 'Indoor'
    ? 'bg-[#ECFDF3] text-[#12B76A]'
    : 'bg-[#FEF2F2] text-[#F04438]';
};

// Helper Styling Badge Status
const getStatusStyle = (status) => {
  switch (status) {
    case 'Available':
      return 'bg-[#ECFDF3] text-[#12B76A]';
    case 'In Use':
      return 'bg-gray-50 text-gray-500';
    case 'Unavailable':
      return 'bg-[#FEF2F2] text-[#F04438]';
    case 'Maintenance':
      return 'bg-[#FFF7ED] text-[#FB6514]';
    default:
      return 'bg-gray-100 text-gray-500';
  }
};

const RoomManagement = () => {
  const [data, setData] = useState(initialData);
  const [searchQuery, setSearchQuery] = useState('');

  // State for Filter and Pagination
  const [filterType, setFilterType] = useState('All Type');
  const [filterStatus, setFilterStatus] = useState('All Status');
  const [openFilter, setOpenFilter] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  // State for Drawer and Modals
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [isEditSuccessModalOpen, setIsEditSuccessModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // State for Edit and Delete Actions
  const [editingId, setEditingId] = useState(null);
  const [openActionMenuId, setOpenActionMenuId] = useState(null);

  // State for Form Fields
  const [roomName, setRoomName] = useState('');
  const [selectedType, setSelectedType] = useState('Select Type');
  const [roomCapacity, setRoomCapacity] = useState('');
  const [selectedAssigned, setSelectedAssigned] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState('Select Status');

  const [activeDropdown, setActiveDropdown] = useState(null);

  // Filtering Logic
  const filteredData = data.filter(row => {
    const matchesSearch = row.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === 'All Type' || row.type === filterType;
    const matchesStatus = filterStatus === 'All Status' || row.status === filterStatus;
    return matchesSearch && matchesType && matchesStatus;
  });

  // Pagination Logic
  const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE) || 1;
  if (currentPage > totalPages && totalPages > 0) {
    setCurrentPage(totalPages);
  }
  const currentTableData = filteredData.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const handleFilterChange = (filterTypeParam, value) => {
    if (filterTypeParam === 'type') setFilterType(value);
    if (filterTypeParam === 'status') setFilterStatus(value);
    setCurrentPage(1);
    setOpenFilter(null);
  };

  // CRUD Functions
  const handleOpenAddDrawer = () => {
    setEditingId(null);
    setRoomName('');
    setSelectedType('Select Type');
    setRoomCapacity('');
    setSelectedAssigned([]);
    setSelectedStatus('Select Status');
    setIsDrawerOpen(true);
  };

  const handleOpenEditDrawer = (id) => {
    setOpenActionMenuId(null);
    setEditingId(id);
    const itemToEdit = data.find(d => d.id === id);

    setRoomName(itemToEdit.name);
    setSelectedType(itemToEdit.type);
    setRoomCapacity(itemToEdit.capacity.replace(' People', ''));

    if (itemToEdit.assigned === 'Multiple' || itemToEdit.assigned === '-') {
      setSelectedAssigned([]);
    } else {
      setSelectedAssigned([itemToEdit.assigned]);
    }

    setSelectedStatus(itemToEdit.status);
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

    const assignedStr = selectedAssigned.length > 1
      ? 'Multiple'
      : (selectedAssigned[0] || '-');

    if (editingId !== null) {
      setData(data.map(d => d.id === editingId ? {
        ...d,
        name: roomName,
        type: selectedType,
        capacity: `${roomCapacity} People`,
        assigned: assignedStr,
        status: selectedStatus,
      } : d));
      setTimeout(() => setIsEditSuccessModalOpen(true), 150);
    } else {
      const newItem = {
        id: Date.now().toString(),
        name: roomName,
        type: selectedType,
        capacity: `${roomCapacity} People`,
        assigned: assignedStr,
        status: selectedStatus,
      };
      setData([newItem, ...data]);
      setTimeout(() => setIsSuccessModalOpen(true), 150);
    }
  };

  const CustomSelect = ({ label, value, options, type, placeholder }) => {
    const isActive = activeDropdown === type;
    const isPlaceholder = Array.isArray(value) ? value.length === 0 : value.includes('Select');
    const displayValue = Array.isArray(value) ? (value.length > 0 ? value.join(', ') : placeholder) : value;

    return (
      <div className="flex flex-col relative w-full">
        <div
          onClick={() => setActiveDropdown(isActive ? null : type)}
          className={`w-full px-4 py-2.5 border rounded-xl text-sm bg-white cursor-pointer flex items-center justify-between transition-colors ${isActive ? 'border-[#C1200C]' : 'border-gray-200 hover:border-gray-300'} ${isPlaceholder ? 'text-gray-400' : 'text-gray-900'}`}
        >
          {(type === 'type' || type === 'status') && !isPlaceholder ? (
            <span
              className={`px-4 py-1.5 rounded-full text-xs font-medium inline-block whitespace-nowrap ${type === 'type' ? getTypeStyle(value) : getStatusStyle(value)
                }`}
            >
              {value}
            </span>
          ) : (
            <span className="truncate pr-2">{displayValue}</span>
          )}
          <ChevronDown size={16} className="text-gray-400 shrink-0" />
        </div>

        {isActive && (
          <>
            <div className="fixed inset-0 z-10" onClick={() => setActiveDropdown(null)} />
            <div className="absolute top-full mt-2 left-0 w-full bg-white border border-gray-100 rounded-2xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] z-50 py-2 overflow-hidden">
              {type === 'assigned' && options.map((opt, idx) => {
                const isChecked = value.includes(opt);
                return (
                  <div
                    key={idx}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (isChecked) setSelectedAssigned(value.filter(d => d !== opt));
                      else setSelectedAssigned([...value, opt]);
                    }}
                    className="px-5 py-3 text-sm text-gray-700 hover:bg-gray-50 cursor-pointer flex items-center gap-3 transition-colors"
                  >
                    <div className={`w-4 h-4 rounded flex items-center justify-center border transition-colors ${isChecked ? 'bg-[#C1200C] border-[#C1200C]' : 'border-gray-300'}`}>
                      {isChecked && <Check size={12} className="text-white" strokeWidth={3} />}
                    </div>
                    <span className={isChecked ? 'text-gray-900 font-medium' : 'text-gray-700'}>{opt}</span>
                  </div>
                );
              })}

              {(type === 'type' || type === 'status') && options.map((opt, idx) => (
                <div
                  key={idx}
                  onClick={() => {
                    if (type === 'type') setSelectedType(opt);
                    if (type === 'status') setSelectedStatus(opt);
                    setActiveDropdown(null);
                  }}
                  className="px-5 py-3 text-sm hover:bg-gray-50 cursor-pointer transition-colors"
                >
                  <span
                    className={`px-4 py-1.5 rounded-full text-xs font-medium inline-block whitespace-nowrap ${type === 'type' ? getTypeStyle(opt) : getStatusStyle(opt)
                      }`}
                  >
                    {opt}
                  </span>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    );
  };

  const isFormValid = roomName.trim() !== '' && !selectedType.includes('Select') && roomCapacity.trim() !== '' && !selectedStatus.includes('Select');

  return (
    <div className="p-8 pt-4 flex flex-col flex-1 gap-6 relative min-h-screen bg-white font-sans">
      <div className="flex items-center justify-between">

        <div className="relative w-80">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search room or location..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="w-full pl-11 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-[#C1200C] focus:border-[#C1200C] transition-all placeholder:text-gray-400"
          />
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center">

            <div className="relative">
              <button
                onClick={() => setOpenFilter(openFilter === 'type' ? null : 'type')}
                className={`flex items-center gap-3 px-5 py-2.5 text-sm font-medium transition-colors cursor-pointer rounded-l-xl border bg-white ${openFilter === 'type' ? 'border-[#C1200C] text-gray-500 z-10 relative' : 'border-gray-200 text-gray-500 hover:bg-gray-50 relative z-0'}`}
              >
                <span className="truncate max-w-25">{filterType}</span>
                <ChevronDown size={14} className="text-gray-400 shrink-0" />
              </button>

              {openFilter === 'type' && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setOpenFilter(null)} />
                  <div className="absolute left-0 top-full mt-2 w-48 bg-white border border-gray-100 rounded-2xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] z-20 py-3 flex flex-col gap-1">
                    <div
                      onClick={() => handleFilterChange('type', 'All Type')}
                      className={`px-5 py-2 text-sm cursor-pointer transition-colors ${filterType === 'All Type' ? 'text-[#C1200C] font-medium' : 'text-gray-600 hover:bg-gray-50'}`}
                    >
                      All Type
                    </div>
                    {["Outdoor", "Indoor"].map((type, idx) => (
                      <div
                        key={idx}
                        onClick={() => handleFilterChange('type', type)}
                        className="px-5 py-2 text-sm cursor-pointer transition-colors hover:bg-gray-50"
                      >
                        <span className={`px-4 py-1.5 rounded-lg text-xs font-semibold inline-block ${getTypeStyle(type)}`}>
                          {type}
                        </span>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>

            <div className="relative -ml-px">
              <button
                onClick={() => setOpenFilter(openFilter === 'status' ? null : 'status')}
                className={`flex items-center gap-3 px-5 py-2.5 text-sm font-medium transition-colors cursor-pointer rounded-r-xl border bg-white ${openFilter === 'status' ? 'border-[#C1200C] text-gray-500 z-10 relative' : 'border-gray-200 text-gray-500 hover:bg-gray-50 relative z-0'}`}
              >
                <span className="truncate max-w-25">{filterStatus}</span>
                <ChevronDown size={14} className="text-gray-400 shrink-0" />
              </button>

              {openFilter === 'status' && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setOpenFilter(null)} />
                  <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-gray-100 rounded-2xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] z-20 py-3 flex flex-col gap-1">
                    <div
                      onClick={() => handleFilterChange('status', 'All Status')}
                      className={`px-5 py-2 text-sm cursor-pointer transition-colors ${filterStatus === 'All Status' ? 'text-[#C1200C] font-medium' : 'text-gray-600 hover:bg-gray-50'}`}
                    >
                      All Status
                    </div>
                    {["Available", "In Use", "Unavailable", "Maintenance"].map((status, idx) => (
                      <div
                        key={idx}
                        onClick={() => handleFilterChange('status', status)}
                        className="px-5 py-2 text-sm cursor-pointer transition-colors hover:bg-gray-50"
                      >
                        <span className={`px-4 py-1.5 rounded-lg text-xs font-semibold inline-block ${getStatusStyle(status)}`}>
                          {status}
                        </span>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>

          <button
            onClick={handleOpenAddDrawer}
            className="flex items-center gap-2 px-5 py-2.5 bg-[#C1200C] hover:bg-[#A31B0A] rounded-xl text-sm font-medium text-white transition-colors cursor-pointer shadow-sm"
          >
            <Plus size={16} /> Add Room
          </button>
        </div>
      </div>

      {filteredData.length > 0 ? (
        <div className="flex flex-col gap-6 flex-1">
          <div className="w-full overflow-x-visible">
            <table className="w-full text-left border-separate border-spacing-0">
              <thead>
                <tr className="bg-[#F9FAFB]">
                  <th className="px-6 py-4 text-sm font-semibold text-gray-900 border-l border-t border-b border-gray-200 rounded-tl-2xl rounded-bl-2xl w-[25%]">
                    Room Name
                  </th>
                  <th className="px-6 py-4 text-sm font-semibold text-gray-900 border-t border-b border-gray-200 w-[15%]">
                    Type
                  </th>
                  <th className="px-6 py-4 text-sm font-semibold text-gray-900 border-t border-b border-gray-200 w-[15%]">
                    Capacity
                  </th>
                  <th className="px-6 py-4 text-sm font-semibold text-gray-900 border-r border-t border-b border-gray-200 rounded-tr-2xl rounded-br-2xl text-center w-[5%]">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {currentTableData.map((room) => (
                  <tr key={room.id} className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors group">
                    <td className="px-6 py-5 text-sm font-medium text-gray-900">{room.name}</td>
                    <td className="px-6 py-5">
                      <span
                        className={`px-4 py-1.5 rounded-full text-xs font-medium inline-block whitespace-nowrap ${getTypeStyle(room.type)}`}
                      >
                        {room.type}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-sm text-gray-500 font-normal">{room.capacity}</td>
                    <td className="px-6 py-5 flex justify-center relative">
                      <button
                        onClick={() => setOpenActionMenuId(openActionMenuId === room.id ? null : room.id)}
                        className={`w-10 h-10 flex items-center justify-center border rounded-lg transition-colors cursor-pointer ${openActionMenuId === room.id ? 'border-[#C1200C] text-[#C1200C]' : 'border-gray-200 text-gray-400 hover:text-gray-600 hover:bg-gray-50'}`}
                      >
                        <MoreVertical size={18} />
                      </button>

                      {openActionMenuId === room.id && (
                        <>
                          <div className="fixed inset-0 z-10" onClick={() => setOpenActionMenuId(null)} />
                          <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-gray-100 rounded-2xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] z-20 overflow-hidden py-2 text-left">
                            <button
                              onClick={() => handleOpenEditDrawer(room.id)}
                              className="w-full flex items-center gap-3 px-5 py-2.5 text-sm font-medium text-gray-800 hover:bg-gray-50 transition-colors cursor-pointer"
                            >
                              <Share size={16} className="text-gray-800" /> Edit Room
                            </button>
                            <button
                              onClick={() => handleDelete(room.id)}
                              className="w-full flex items-center gap-3 px-5 py-2.5 text-sm font-medium text-gray-800 hover:bg-red-50 transition-colors cursor-pointer"
                            >
                              <Trash2 size={16} className="text-[#C1200C]" /> Delete Room
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

          <div className="flex items-center justify-between mt-auto text-sm text-gray-900 font-medium pb-8">
            <span>
              Showing {filteredData.length === 0 ? 0 : (currentPage - 1) * ITEMS_PER_PAGE + 1}-{Math.min(currentPage * ITEMS_PER_PAGE, filteredData.length)} of {filteredData.length} Data
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
            <DoorClosed size={32} className="text-[#C1200C]" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2 tracking-tight">No Rooms Found</h3>
          <p className="text-sm text-gray-400 text-center max-w-sm leading-relaxed">
            {searchQuery || filterType !== 'All Type' || filterStatus !== 'All Status'
              ? 'No rooms match your filter criteria.'
              : 'There are no rooms available yet. Start by adding a new room to the system.'}
          </p>
        </div>
      )}

      {isDrawerOpen && (
        <div className="fixed inset-0 bg-black/40 z-40 transition-opacity duration-300" onClick={() => setIsDrawerOpen(false)} />
      )}

      <div className={`fixed top-0 right-0 h-full w-120 bg-white z-50 shadow-2xl transform transition-transform duration-300 ease-in-out flex flex-col ${isDrawerOpen ? 'translate-x-0' : 'translate-x-full'}`}>

        <div className="flex items-center justify-between px-6 py-5 bg-[#F9FAFB] border-b border-gray-200 shrink-0">
          <h2 className="text-[17px] font-semibold text-gray-900 tracking-tight">
            {editingId !== null ? 'Edit Room' : 'Add New Room'}
          </h2>
          <button
            onClick={() => setIsDrawerOpen(false)}
            className="text-gray-500 hover:text-gray-700 transition-colors cursor-pointer"
          >
            <X size={20} strokeWidth={2} />
          </button>
        </div>

        <form onSubmit={handleFormSubmit} className="flex flex-col flex-1 p-6 gap-6 bg-white overflow-y-auto">

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-800">Room Name</label>
            <input
              type="text"
              placeholder="Enter room name"
              value={roomName}
              onChange={(e) => setRoomName(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-900 focus:outline-none focus:ring-1 focus:ring-[#C1200C] focus:border-[#C1200C] placeholder:text-gray-400 transition-colors"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-800">Type</label>
              <CustomSelect
                value={selectedType}
                type="type"
                placeholder="Select Type"
                options={["Indoor", "Outdoor"]}
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-800">Capacity</label>
              <input
                type="text"
                placeholder="Enter capacity"
                value={roomCapacity}
                onChange={(e) => setRoomCapacity(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-900 focus:outline-none focus:ring-1 focus:ring-[#C1200C] focus:border-[#C1200C] placeholder:text-gray-400 transition-colors"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-800">Assigned To</label>
              <CustomSelect
                value={selectedAssigned}
                type="assigned"
                placeholder="Assigned to"
                options={["Basketball", "Choir", "Coding Club", "PMR", "Futsal", "English Club", "Robotics"]}
              />
              <span className="text-[13px] text-gray-400">Optional</span>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-800">Status</label>
              <CustomSelect
                value={selectedStatus}
                type="status"
                placeholder="Select Status"
                options={["Available", "In Use", "Unavailable", "Maintenance"]}
              />
            </div>
          </div>

        </form>

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
              : 'bg-gray-50 border border-gray-100 text-gray-400 cursor-not-allowed'
              }`}
          >
            {editingId !== null ? 'Save Changes' : 'Add Room'}
          </button>
        </div>

      </div>

      <NotificationModal
        isOpen={isSuccessModalOpen}
        type="success"
        title="Room Created"
        message="The new room has been added successfully."
        buttonText="Return to Room Management"
        onButtonClick={() => setIsSuccessModalOpen(false)}
        onClose={() => setIsSuccessModalOpen(false)}
      />

      <NotificationModal
        isOpen={isEditSuccessModalOpen}
        type="success"
        title="Room Updated"
        message="The room details have been successfully updated."
        buttonText="Return to Room Management"
        onButtonClick={() => setIsEditSuccessModalOpen(false)}
        onClose={() => setIsEditSuccessModalOpen(false)}
      />

      <NotificationModal
        isOpen={isDeleteModalOpen}
        type="delete"
        title="Room Deleted"
        message="The room has been successfully removed from the system."
        buttonText="Return to Room Management"
        onButtonClick={() => setIsDeleteModalOpen(false)}
        onClose={() => setIsDeleteModalOpen(false)}
      />

    </div>
  );
};

export default RoomManagement;