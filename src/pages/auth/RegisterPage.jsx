import React, { useState } from 'react';
import { ArrowLeft, Eye, EyeOff } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom'; 
import { useAuthStore } from '../../store/authStore'; 
import PicAuth from '../../assets/pic-auth.svg';
import { motion } from 'framer-motion';

const RegisterPage = () => {
  const navigate = useNavigate();
  const register = useAuthStore((state) => state.register);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [errors, setErrors] = useState({ email: '', password: '', confirmPassword: '', general: '' });

  const handleRegister = (e) => {
    e.preventDefault();
    setErrors({ email: '', password: '', confirmPassword: '', general: '' });

    let hasError = false;
    const newErrors = { email: '', password: '', confirmPassword: '', general: '' };

    if (!email) {
      newErrors.email = 'Email tidak boleh kosong.';
      hasError = true;
    }
    if (!password) {
      newErrors.password = 'Kata sandi tidak boleh kosong.';
      hasError = true;
    }
    if (!confirmPassword) {
      newErrors.confirmPassword = 'Konfirmasi kata sandi tidak boleh kosong.';
      hasError = true;
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Kata sandi tidak cocok.';
      hasError = true;
    }

    if (hasError) {
      setErrors(newErrors);
      return;
    }

    const result = register({ email, password, role: 'siswa' });

    if (result.success) {
      alert(result.message);
      navigate('/login'); 
    } else {
      setErrors({ email: '', password: '', confirmPassword: '', general: result.message });
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex items-center justify-center p-4 md:p-6 overflow-hidden">
      
      <div className="flex flex-row items-center justify-center gap-12 w-full max-w-6xl">

        {/* Left Side - Image */}
        <motion.div 
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="relative hidden lg:block w-160 h-170 rounded-3xl overflow-hidden shrink-0 shadow-sm border border-gray-100"
        >
          <img 
            src={PicAuth} 
            alt="Gedung SMP Telkom Purwokerto" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-linear-to-t from-black/85 via-black/30 to-transparent"></div>
          <div className="absolute bottom-10 left-10 right-10 flex flex-col gap-2">
            <h1 className="text-white text-4xl font-bold leading-tight tracking-tight">
              Manajemen <br /> Ekstrakurikuler Digital
            </h1>
            <p className="text-gray-100 text-base leading-relaxed max-w-xl opacity-90">
              Platform terintegrasi untuk mengelola pendaftaran, absensi, dan perkembangan kegiatan ekstrakurikuler siswa secara efisien dan real-time di SMP Telkom Purwokerto.
            </p>
          </div>
        </motion.div>

        {/* Right Side - Registration Form */}
        <motion.div 
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 0.15, ease: "easeOut" }}
          className="w-full max-w-120 bg-white border border-gray-200 rounded-3xl p-8 md:p-10 shadow-[0_8px_30px_rgb(0,0,0,0.03)] flex flex-col shrink-0"
        >
          <Link to="/" className="flex items-center gap-2 text-gray-700 hover:text-gray-900 w-fit transition-colors mb-10">
            <ArrowLeft size={18} strokeWidth={1.5} />
            <span className="text-[14px] font-medium">Kembali ke Beranda</span>
          </Link>

          <div className="flex flex-col gap-2 mb-8">
            <h2 className="text-[32px] font-semibold text-gray-900 tracking-tight">Selamat Datang</h2>
            <p className="text-[15px] text-gray-500">
              Silakan Registrasi jika anda belum memiliki akun
            </p>
          </div>

          {errors.general && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 text-[14px] rounded-lg">
              {errors.general}
            </div>
          )}

          <form onSubmit={handleRegister} className="flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <label className="text-[14px] font-medium text-gray-800">Email</label>
              <input 
                type="email" 
                placeholder="Masukkan email anda"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (errors.email) setErrors({ ...errors, email: '' });
                }}
                className={`w-full h-14 px-5 border rounded-xl text-[15px] placeholder:text-gray-400 focus:outline-none focus:ring-1 transition-all ${
                  errors.email 
                    ? 'border-red-500 focus:ring-red-500/40 focus:border-red-500' 
                    : 'border-gray-200 focus:ring-[#C1200C]/40 focus:border-[#C1200C]'
                }`}
              />
              {errors.email && <span className="text-[13px] text-red-500 mt-1">{errors.email}</span>}
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[14px] font-medium text-gray-800">Buat Kata Sandi</label>
              <div className="relative">
                <input 
                  type={showPassword ? "text" : "password"} 
                  placeholder="Buat kata sandi anda"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errors.password) setErrors({ ...errors, password: '' });
                  }}
                  className={`w-full h-14 pl-5 pr-12 border rounded-xl text-[15px] placeholder:text-gray-400 focus:outline-none focus:ring-1 transition-all ${
                    errors.password 
                      ? 'border-red-500 focus:ring-red-500/40 focus:border-red-500' 
                      : 'border-gray-200 focus:ring-[#C1200C]/40 focus:border-[#C1200C]'
                  }`}
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none cursor-pointer"
                >
                  {showPassword ? <EyeOff size={20} strokeWidth={1.5} /> : <Eye size={20} strokeWidth={1.5} />}
                </button>
              </div>
              {errors.password && <span className="text-[13px] text-red-500 mt-1">{errors.password}</span>}
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[14px] font-medium text-gray-800">Konfirmasi Kata Sandi</label>
              <div className="relative">
                <input 
                  type={showConfirmPassword ? "text" : "password"} 
                  placeholder="Konfirmasi kata sandi anda"
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    if (errors.confirmPassword) setErrors({ ...errors, confirmPassword: '' });
                  }}
                  className={`w-full h-14 pl-5 pr-12 border rounded-xl text-[15px] placeholder:text-gray-400 focus:outline-none focus:ring-1 transition-all ${
                    errors.confirmPassword 
                      ? 'border-red-500 focus:ring-red-500/40 focus:border-red-500' 
                      : 'border-gray-200 focus:ring-[#C1200C]/40 focus:border-[#C1200C]'
                  }`}
                />
                <button 
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none cursor-pointer"
                >
                  {showConfirmPassword ? <EyeOff size={20} strokeWidth={1.5} /> : <Eye size={20} strokeWidth={1.5} />}
                </button>
              </div>
              {errors.confirmPassword && <span className="text-[13px] text-red-500 mt-1">{errors.confirmPassword}</span>}
            </div>

            <div className="mt-2">
              <button 
                type="submit"
                className="w-full h-14 bg-[#C1200C] hover:bg-[#A31B0A] text-white text-[16px] font-medium rounded-xl transition-colors flex items-center justify-center cursor-pointer shadow-[0_2px_10px_rgb(193,32,12,0.1)]"
              >
                Masuk ke Dashboard
              </button>
            </div>
          </form>

          <div className="mt-8 text-center text-[14px]">
            <span className="text-gray-500">Sudah ada akun? </span>
            <Link to="/login" className="font-medium text-gray-900 hover:text-[#C1200C] underline underline-offset-4 transition-colors">
              Login
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default RegisterPage;