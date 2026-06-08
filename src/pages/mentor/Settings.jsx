import React, { useRef, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import NotificationModal from '../../components/ui/NotificationModal';

const Settings = () => {
  const { userProfile, setUserProfile } = useOutletContext();

  // Local state form inputs
  const [firstName, setFirstName] = useState(userProfile.firstName || '');
  const [lastName, setLastName] = useState(userProfile.lastName || '');
  const [email, setEmail] = useState(userProfile.email || '');

  // Modal Notification States
  const [modalState, setModalState] = useState({
    isOpen: false,
    type: 'success',
    title: '',
    message: ''
  });

  const fileInputRef = useRef(null);

  //Change Profile Picture Handler
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

  // Remove Profile Picture Handler
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

  // Save Changes for Text Data Handler (Full Name and Email)
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
    }));

    setModalState({
      isOpen: true,
      type: 'success',
      title: 'Profile Updated',
      message: 'Your profile information and account settings have been successfully updated.',
    });
  };

  const closeModal = () => setModalState((prev) => ({ ...prev, isOpen: false }));

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

        {/* Bottom Cards Grid */}
        <div className="grid grid-cols-2 gap-6">
          
          {/* Bottom Left Card: Full Name */}
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

          {/* Bottom Right Card: Email Address */}
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
              
              {/* Tombol "Change Profile" sebagai submit form Text Data sesuai arahan desain */}
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