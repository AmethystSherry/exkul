import React, { useState } from 'react';
import { 
  Search, ChevronDown, ChevronLeft, ChevronRight, 
  MoreVertical, Upload, Plus, UserPlus, X, Save,
  Edit, Trash2, Share
} from 'lucide-react';
import NotificationModal from '../../components/ui/NotificationModal'; 

// Data Mocks
const initialUsers = [
  { id: '1', name: 'Rizky Aditya', email: '@Rizkyaditya@gmail.com', role: 'Student', lastLogin: '2 hours ago' },
  { id: '2', name: 'Budi Santoso', email: 'budi.santoso@gmail.com', role: 'Mentor', lastLogin: '1 day ago' },
  { id: '3', name: 'Siti Aminah', email: 'siti.aminah@gmail.com', role: 'Coordinator', lastLogin: '5 hours ago' },
  { id: '4', name: 'Ahmad Faisal', email: 'ahmad.faisal@gmail.com', role: 'Student', lastLogin: 'Just now' },
  { id: '5', name: 'Dina Lestari', email: 'dina.lestari@gmail.com', role: 'Parents', lastLogin: '3 days ago' },
];

const UserManagement = () => {
  const [users, setUsers] = useState(initialUsers);
  
  // State for filters, search, pagination
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRole, setFilterRole] = useState('All Role');
  const [filterStatus, setFilterStatus] = useState('All Status'); 
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);
  const roleOptions = ["Mentor", "Student", "Parents", "Coordinator", "Admin"];
  const [nameInput, setNameInput] = useState('');
  const [emailInput, setEmailInput] = useState('');
  const [selectedRole, setSelectedRole] = useState("Select user role");
  const [editingId, setEditingId] = useState(null);
  const [openActionMenuId, setOpenActionMenuId] = useState(null);
  const [openRoleMenuId, setOpenRoleMenuId] = useState(null);
  const [openFilter, setOpenFilter] = useState(null); 
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [isEditSuccessModalOpen, setIsEditSuccessModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false); 

  // Filter and Search Logic
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          user.email.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesRole = filterRole === 'All Role' || 
                        user.role === filterRole || 
                        (filterRole === 'Mentors' && user.role === 'Mentor');

    return matchesSearch && matchesRole;
  });

  // Pagination Logic
  const totalPages = Math.ceil(filteredUsers.length / ITEMS_PER_PAGE) || 1;
  if (currentPage > totalPages && totalPages > 0) {
    setCurrentPage(totalPages);
  }
  const currentTableData = filteredUsers.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const handleExportCSV = () => {
    const headers = ['Name', 'Email', 'Role', 'Last Login'];
    const csvData = filteredUsers.map(u => `"${u.name}","${u.email}","${u.role}","${u.lastLogin}"`);
    const csvContent = [headers.join(','), ...csvData].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'user_management_export.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleOpenAddDrawer = () => {
    setEditingId(null); 
    setNameInput('');
    setEmailInput('');
    setSelectedRole("Select user role");
    setIsDrawerOpen(true);
  };

  const handleOpenEditDrawer = (id) => {
    setOpenActionMenuId(null); 
    setEditingId(id); 
    
    const userToEdit = users.find(u => u.id === id);
    setNameInput(userToEdit.name);
    setEmailInput(userToEdit.email);
    setSelectedRole(userToEdit.role);
    
    setIsDrawerOpen(true);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault(); 
    
    if (selectedRole === "Select user role") {
      alert("Please select a role for the user.");
      return;
    }

    setIsDrawerOpen(false); 

    if (editingId !== null) {
      setUsers(users.map(u => u.id === editingId ? {
        ...u, name: nameInput, email: emailInput, role: selectedRole
      } : u));
      
      setTimeout(() => setIsEditSuccessModalOpen(true), 150); 
    } else {
      const newUser = {
        id: Date.now().toString(), 
        name: nameInput,
        email: emailInput,
        role: selectedRole,
        lastLogin: 'Just now' 
      };
      setUsers([newUser, ...users]); 
      
      setTimeout(() => setIsSuccessModalOpen(true), 150); 
    }
  };

  const handleDeleteUser = (idToRemove) => {
    setOpenActionMenuId(null);
    setUsers(users.filter(u => u.id !== idToRemove));
    setTimeout(() => setIsDeleteModalOpen(true), 150);
  };

  const toggleEmptyState = () => {
    if (users.length > 0) setUsers([]);
    else setUsers(initialUsers);
  };

  const isFormValid = nameInput.trim() !== '' && emailInput.trim() !== '' && !selectedRole.includes('Select');

  return (
    <div className="p-8 pt-4 flex flex-col flex-1 gap-6 relative min-h-screen">
      
      <div 
        className="flex items-center justify-between"
        onDoubleClick={toggleEmptyState}
        title=" "
      >
        <div className="relative w-80">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
            placeholder="Search user..." 
            className="w-full pl-11 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-[#C1200C] focus:border-[#C1200C] transition-all"
          />
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center">
            
            <div className="relative">
              <button 
                onClick={() => setOpenFilter(openFilter === 'role' ? null : 'role')}
                className={`flex items-center gap-3 px-5 py-2.5 text-sm font-medium transition-colors cursor-pointer rounded-l-xl border bg-white ${openFilter === 'role' ? 'border-[#C1200C] text-gray-500 z-10 relative' : 'border-gray-200 text-gray-500 hover:bg-gray-50 relative z-0'}`}
              >
                <span className="truncate max-w-20">{filterRole}</span> 
                <ChevronDown size={14} className="text-gray-400 shrink-0" />
              </button>
              {openFilter === 'role' && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setOpenFilter(null)} />
                  <div className="absolute left-0 top-full mt-2 w-44 bg-white border border-gray-100 rounded-2xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] z-20 py-2">
                    {["All Role", "Admin", "Coordinator", "Mentors", "Student"].map((opt, idx) => (
                      <div 
                        key={idx} 
                        onClick={() => { setFilterRole(opt); setCurrentPage(1); setOpenFilter(null); }} 
                        className={`px-5 py-3 text-sm cursor-pointer transition-colors ${filterRole === opt ? 'bg-gray-50 text-[#C1200C] font-medium' : 'text-gray-900 hover:bg-gray-50'}`}
                      >
                        {opt}
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
                <span className="truncate max-w-20">{filterStatus}</span>
                <ChevronDown size={14} className="text-gray-400 shrink-0" />
              </button>
              {openFilter === 'status' && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setOpenFilter(null)} />
                  <div className="absolute left-0 top-full mt-2 w-44 bg-white border border-gray-100 rounded-2xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] z-20 py-2">
                    {["All Status", "Admin", "Coordinator", "Mentors", "Student"].map((opt, idx) => (
                      <div 
                        key={idx} 
                        onClick={() => { setFilterStatus(opt); setCurrentPage(1); setOpenFilter(null); }} 
                        className={`px-5 py-3 text-sm cursor-pointer transition-colors ${filterStatus === opt ? 'bg-gray-50 text-[#C1200C] font-medium' : 'text-gray-900 hover:bg-gray-50'}`}
                      >
                        {opt}
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>

          <button 
            onClick={handleExportCSV}
            className="flex items-center gap-2 px-5 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors bg-white cursor-pointer"
          >
            <Upload size={16} className="text-gray-500" /> Export CSV
          </button>

          <button 
            onClick={handleOpenAddDrawer}
            className="flex items-center gap-2 px-5 py-2.5 bg-[#C1200C] hover:bg-[#A31B0A] rounded-xl text-sm font-medium text-white transition-colors cursor-pointer"
          >
            <Plus size={16} /> Add User
          </button>
        </div>
      </div>

      {filteredUsers.length > 0 ? (
        <div className="flex flex-col gap-6 flex-1">
          <div className="w-full overflow-x-visible">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#F9FAFB]">
                  <th className="px-6 py-4 text-sm font-semibold text-gray-900 rounded-l-2xl">Name</th>
                  <th className="px-6 py-4 text-sm font-semibold text-gray-900">Email</th>
                  <th className="px-6 py-4 text-sm font-semibold text-gray-900">Role</th>
                  <th className="px-6 py-4 text-sm font-semibold text-gray-900">Last login</th>
                  <th className="px-6 py-4 text-sm font-semibold text-gray-900 rounded-r-2xl text-center w-24">Action</th>
                </tr>
              </thead>
              <tbody>
                {currentTableData.map((row) => (
                  <tr key={row.id} className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-5 text-sm font-medium text-gray-900">{row.name}</td>
                    <td className="px-6 py-5 text-sm text-gray-400">{row.email}</td>
                    <td className="px-6 py-5">
                      <div className="relative inline-block w-36">
                        <button 
                          onClick={() => setOpenRoleMenuId(openRoleMenuId === row.id ? null : row.id)}
                          className={`w-full flex items-center justify-between gap-3 px-4 py-2 border rounded-lg text-sm font-medium bg-white transition-colors cursor-pointer ${openRoleMenuId === row.id ? 'border-[#C1200C] text-[#C1200C]' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}
                        >
                          {row.role} 
                          <ChevronDown size={14} className={openRoleMenuId === row.id ? 'text-[#C1200C]' : 'text-gray-400'} />
                        </button>

                        {openRoleMenuId === row.id && (
                          <>
                            <div className="fixed inset-0 z-10" onClick={() => setOpenRoleMenuId(null)} />
                            <div className="absolute left-0 top-full mt-2 w-full bg-white border border-gray-100 rounded-2xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] z-20 py-2">
                              {roleOptions.map((roleOpt, idx) => (
                                <div 
                                  key={idx}
                                  onClick={() => {
                                    setUsers(users.map(u => u.id === row.id ? { ...u, role: roleOpt } : u));
                                    setOpenRoleMenuId(null);
                                  }}
                                  className="px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 cursor-pointer transition-colors"
                                >
                                  {roleOpt}
                                </div>
                              ))}
                            </div>
                          </>
                        )}
                      </div>
                    </td>

                    <td className="px-6 py-5 text-sm font-medium text-gray-900">{row.lastLogin}</td>
                    
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
                          <div className="absolute right-0 top-full mt-2 w-40 bg-white border border-gray-100 rounded-2xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] z-20 overflow-hidden py-2 text-left">
                            <button 
                              onClick={() => handleOpenEditDrawer(row.id)}
                              className="w-full flex items-center gap-3 px-5 py-2.5 text-sm font-medium text-gray-800 hover:bg-gray-50 transition-colors cursor-pointer"
                            >
                              <Share size={16} className="text-gray-800" /> Edit User
                            </button>
                            <button 
                              onClick={() => handleDeleteUser(row.id)}
                              className="w-full flex items-center gap-3 px-5 py-2.5 text-sm font-medium text-gray-800 hover:bg-red-50 transition-colors cursor-pointer"
                            >
                              <Trash2 size={16} className="text-[#C1200C]" /> Delete User
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
              Showing {filteredUsers.length === 0 ? 0 : (currentPage - 1) * ITEMS_PER_PAGE + 1}-{Math.min(currentPage * ITEMS_PER_PAGE, filteredUsers.length)} of {users.length} Data
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
            <UserPlus size={32} className="text-[#C1200C]" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2 tracking-tight">No Users Found</h3>
          <p className="text-sm text-gray-400 text-center max-w-sm leading-relaxed">
            {searchQuery || filterRole !== 'All Role' ? 'No users match your filter criteria.' : 'There are no user accounts available yet. Start by adding a new user to the system.'}
          </p>
        </div>
      )}

      {isDrawerOpen && (
        <div 
          className="fixed inset-0 bg-black/40 z-40 transition-opacity duration-300" 
          onClick={() => setIsDrawerOpen(false)} 
        />
      )}

      <div className={`fixed top-0 right-0 h-full w-120 bg-[#FBFBFB] z-50 shadow-2xl transform transition-transform duration-300 ease-in-out flex flex-col ${isDrawerOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex items-center justify-between px-6 py-5 bg-white border-b border-gray-200 shrink-0">
          <h2 className="text-[17px] font-semibold text-gray-900 tracking-tight">
            {editingId !== null ? 'Edit User' : 'Create New User'}
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
            <label className="text-sm font-medium text-gray-800">Name</label>
            <input 
              type="text" 
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              placeholder="Enter full name" 
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-900 focus:outline-none focus:ring-1 focus:ring-[#C1200C] focus:border-[#C1200C] placeholder:text-gray-400" 
            />
          </div>

          <div className="grid grid-cols-5 gap-4">
            <div className="col-span-3 flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-800">Email</label>
              <input 
                type="email" 
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                placeholder="Enter email address" 
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-900 focus:outline-none focus:ring-1 focus:ring-[#C1200C] focus:border-[#C1200C] placeholder:text-gray-400" 
              />
            </div>

            <div className="col-span-2 flex flex-col gap-2 relative">
              <label className="text-sm font-medium text-gray-800">Role</label>
              <div 
                onClick={() => setIsRoleDropdownOpen(!isRoleDropdownOpen)}
                className={`w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm bg-white cursor-pointer flex items-center justify-between hover:border-gray-300 transition-colors ${selectedRole === "Select user role" ? "text-gray-400" : "text-gray-900"}`}
              >
                <span className="truncate">{selectedRole}</span>
                <ChevronDown size={16} className="text-gray-400 shrink-0" />
              </div>

              {isRoleDropdownOpen && (
                <div className="absolute top-17.5 left-0 w-full bg-white border border-gray-100 rounded-2xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] z-10 py-2">
                  {roleOptions.map((role, idx) => (
                    <div 
                      key={idx}
                      onClick={() => {
                        setSelectedRole(role);
                        setIsRoleDropdownOpen(false);
                      }}
                      className="px-5 py-3 text-sm text-gray-700 hover:bg-gray-50 cursor-pointer transition-colors"
                    >
                      {role}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          
          <div className="flex-1 bg-white"></div>

          <div className="bg-white border-t border-gray-200 flex items-center gap-4 shrink-0 pt-6">
            <button 
              type="button"
              onClick={() => setIsDrawerOpen(false)}
              className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button 
              type="submit"
              disabled={!isFormValid}
              className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                isFormValid 
                  ? 'bg-[#C1200C] text-white hover:bg-[#A31B0A] cursor-pointer' 
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              {editingId !== null ? 'Save Changes' : 'Create User'}
            </button>
          </div>
        </form>
      </div>

      <NotificationModal 
        isOpen={isSuccessModalOpen}
        type="success"
        title="User Created"
        message="The new user has been added successfully."
        buttonText="Return to User Management"
        onButtonClick={() => setIsSuccessModalOpen(false)}
        onClose={() => setIsSuccessModalOpen(false)}
      />

      <NotificationModal 
        isOpen={isEditSuccessModalOpen}
        type="success"
        title="User Updated"
        message="The user account has been successfully updated."
        buttonText="Return to User Management"
        onButtonClick={() => setIsEditSuccessModalOpen(false)}
        onClose={() => setIsEditSuccessModalOpen(false)}
      />

      <NotificationModal 
        isOpen={isDeleteModalOpen}
        type="delete"
        title="User Deleted"
        message="The user account has been successfully removed from the system."
        buttonText="Return to User Management"
        onButtonClick={() => setIsDeleteModalOpen(false)}
        onClose={() => setIsDeleteModalOpen(false)}
      />

    </div>
  );
};

export default UserManagement;