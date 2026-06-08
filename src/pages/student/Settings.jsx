import React, { useRef, useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Info, Copy, ChevronDown } from 'lucide-react';
import NotificationModal from '../../components/ui/NotificationModal';

const Settings = () => {
  const { userProfile, setUserProfile } = useOutletContext();

  // Local state form inputs
  const [firstName, setFirstName] = useState(userProfile.firstName || '');
  const [lastName, setLastName] = useState(userProfile.lastName || '');
  const [email, setEmail] = useState(userProfile.email || '');
  const [nis, setNis] = useState(userProfile.nis || '');
  const [studentClass, setStudentClass] = useState(userProfile.studentClass || '');

  // State for Custom Dropdown Class
  const [isClassDropdownOpen, setIsClassDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Modal Notification States
  const [modalState, setModalState] = useState({
    isOpen: false,
    type: 'success',
    title: '',
    message: ''
  });

  const fileInputRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsClassDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setUserProfile((prev) => ({ ...prev, avatar: url }));

      setModalState({
        isOpen: true,
        type: 'success',
        title: 'Profile Picture Updated',
        message: 'Your new profile picture has been successfully uploaded and saved.',
      });
    }
  };

  const handleRemoveProfile = () => {
    const fallbackAvatar = `https://ui-avatars.com/api/?name=${userProfile.firstName}+${userProfile.lastName}&background=111827&color=fff`;
    setUserProfile((prev) => ({ ...prev, avatar: fallbackAvatar }));

    setModalState({
      isOpen: true,
      type: 'success',
      title: 'Profile Picture Removed',
      message: 'Your profile picture has been removed and reset to default.',
    });
  };

  const handleSaveTextData = () => {
    if (!firstName.trim() || !lastName.trim() || !email.trim()) {
      setModalState({
        isOpen: true,
        type: 'error',
        title: 'Update Failed',
        message: 'Please fill in all the required fields before saving.',
      });
      return;
    }

    setUserProfile((prev) => ({
      ...prev,
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.trim(),
      nis: nis.trim(),
      studentClass: studentClass,
    }));

    setModalState({
      isOpen: true,
      type: 'success',
      title: 'Profile Updated',
      message: 'Your personal information, including NIS and Class, has been successfully updated.',
    });
  };

  const handleCopyCredentials = (text, fieldName) => {
    navigator.clipboard.writeText(text);
    setModalState({
      isOpen: true,
      type: 'success',
      title: 'Copied to Clipboard',
      message: `${fieldName} has been copied to your clipboard.`,
    });
  };

  const closeModal = () => setModalState((prev) => ({ ...prev, isOpen: false }));

  const classOptions = ['VII A', 'VII B', 'VIII A', 'VIII B', 'IX A', 'IX B'];

  return (
    <div className="p-8 pt-4 flex flex-col flex-1 relative min-h-screen bg-white font-sans">
      <div className="flex flex-col gap-6">

        {/* Top Card: Profile Picture */}
        <div className="bg-white border border-gray-200 rounded-[20px] p-6 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 rounded-full overflow-hidden shrink-0 border border-gray-100 bg-gray-50">
              <img src={userProfile.avatar} alt="Profile" className="w-full h-full object-cover" />
            </div>
            <div className="flex flex-col">
              <span className="text-base font-semibold text-gray-900">Profile Picture</span>
              <span className="text-sm text-gray-400 mt-1">Only PNG/JPG file Accepted</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-5 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors bg-white cursor-pointer"
            >
              Change Profile
            </button>
            <button
              type="button"
              onClick={handleRemoveProfile}
              className="px-5 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors bg-white cursor-pointer"
            >
              Remove Profile
            </button>
            <input
              type="file"
              accept="image/png, image/jpeg"
              ref={fileInputRef}
              className="hidden"
              onChange={handleFileChange}
            />
          </div>
        </div>

        {/* Row 2: Full Name & Email Address */}
        <div className="grid grid-cols-2 gap-6">
          {/* Full Name */}
          <div className="bg-white border border-gray-200 rounded-[20px] p-6 flex flex-col">
            <h3 className="text-[17px] font-semibold text-gray-900 mb-6">Full Name</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <label className="text-[13px] font-medium text-gray-800">First Name</label>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="Enter your first name"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-[#C1200C] focus:border-[#C1200C] transition-colors bg-white"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[13px] font-medium text-gray-800">Last Name</label>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Enter your last name"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-[#C1200C] focus:border-[#C1200C] transition-colors bg-white"
                />
              </div>
            </div>
          </div>

          {/* Email Address */}
          <div className="bg-white border border-gray-200 rounded-[20px] p-6 flex flex-col">
            <h3 className="text-[17px] font-semibold text-gray-900 mb-6">Email Address</h3>
            <div className="flex items-end gap-4">
              <div className="flex flex-col gap-2 flex-1">
                <label className="text-[13px] font-medium text-gray-800">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="kimjiwon@gmail.com"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-[#C1200C] focus:border-[#C1200C] transition-colors bg-white"
                />
              </div>
              <button
                type="button"
                onClick={handleSaveTextData}
                className="h-11.5 px-5 rounded-xl border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors bg-white shrink-0 cursor-pointer"
              >
                Change Profile
              </button>
            </div>
          </div>
        </div>

        {/* Row 3: More Info */}
        <div className="bg-white border border-gray-200 rounded-[20px] p-6 flex flex-col">
          <h3 className="text-[17px] font-semibold text-gray-900 mb-6">More Info</h3>
          <div className="grid grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-[13px] font-medium text-gray-800">NIS</label>
              <input
                type="text"
                value={nis}
                onChange={(e) => setNis(e.target.value)}
                placeholder="Enter your NIS"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-[#C1200C] focus:border-[#C1200C] transition-colors bg-white"
              />
            </div>

            {/* Custom Dropdown Class */}
            <div className="flex flex-col gap-2">
              <label className="text-[13px] font-medium text-gray-800">Class</label>
              <div className="relative" ref={dropdownRef}>
                <div
                  onClick={() => setIsClassDropdownOpen(!isClassDropdownOpen)}
                  className={`w-full px-4 py-3 rounded-xl border ${isClassDropdownOpen ? 'border-[#C1200C] ring-1 ring-[#C1200C]' : 'border-gray-200'
                    } text-sm bg-white cursor-pointer flex justify-between items-center transition-colors`}
                >
                  <span className={studentClass ? "text-gray-900" : "text-gray-400"}>
                    {studentClass || "Select your class"}
                  </span>
                  <ChevronDown
                    size={16}
                    className={`text-gray-400 transition-transform duration-200 ${isClassDropdownOpen ? 'rotate-180' : ''}`}
                  />
                </div>

                {isClassDropdownOpen && (
                  <div className="absolute z-10 w-full mt-1.5 bg-white border border-gray-100 rounded-xl shadow-lg py-1.5 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                    {classOptions.map((cls) => (
                      <div
                        key={cls}
                        onClick={() => {
                          setStudentClass(cls);
                          setIsClassDropdownOpen(false);
                        }}
                        className={`px-4 py-2.5 text-sm cursor-pointer transition-colors ${studentClass === cls
                            ? 'bg-red-50 text-[#C1200C] font-medium'
                            : 'text-gray-700 hover:bg-gray-50'
                          }`}
                      >
                        {cls}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>

        {/* Row 4: Parent Account Access */}
        <div className="bg-white border border-gray-200 rounded-[20px] p-6 flex flex-col">
          <h3 className="text-[17px] font-semibold text-gray-900 mb-6">Parent Account Access</h3>

          <div className="flex items-center gap-3 px-5 py-3.5 rounded-full border border-gray-200 bg-gray-50 mb-6 w-full">
            <Info size={16} className="text-gray-500 shrink-0" />
            <span className="text-sm text-gray-600">Parent account credentials are generated automatically for account access.</span>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="flex flex-col gap-2 relative">
              <label className="text-[13px] font-medium text-gray-800">Username</label>
              <div className="relative">
                <input
                  type="text"
                  readOnly
                  value="parent.ayurahmawati"
                  className="w-full px-4 py-3 pr-10 rounded-xl border border-gray-200 text-sm text-gray-900 bg-white focus:outline-none"
                />
                <button
                  onClick={() => handleCopyCredentials('parent.ayurahmawati', 'Username')}
                  className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
                  title="Copy Username"
                >
                  <Copy size={16} />
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-2 relative">
              <label className="text-[13px] font-medium text-gray-800">Password</label>
              <div className="relative">
                <input
                  type="text"
                  readOnly
                  value="EXKUL-PRT-2026"
                  className="w-full px-4 py-3 pr-10 rounded-xl border border-gray-200 text-sm text-gray-900 bg-white focus:outline-none"
                />
                <button
                  onClick={() => handleCopyCredentials('EXKUL-PRT-2026', 'Password')}
                  className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
                  title="Copy Password"
                >
                  <Copy size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>

      </div>

      <NotificationModal
        isOpen={modalState.isOpen}
        onClose={closeModal}
        type={modalState.type}
        title={modalState.title}
        message={modalState.message}
        buttonText="Return to Settings"
      />
    </div>
  );
};

export default Settings;