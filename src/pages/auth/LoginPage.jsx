import React, { useState } from 'react';
import { ArrowLeft, Eye, EyeOff } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom'; 
import { useAuthStore } from '../../store/authStore'; 
import PicAuth from '../../assets/pic-auth.svg';
// 1. Import motion dari framer-motion
import { motion } from 'framer-motion'; 

const LoginPage = () => {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({ email: '', password: '', general: '' });

  const handleLogin = (e) => {
    e.preventDefault();
    setErrors({ email: '', password: '', general: '' });

    let hasError = false;
    const newErrors = { email: '', password: '', general: '' };

    if (!email) {
      newErrors.email = 'Email tidak boleh kosong.';
      hasError = true;
    }
    if (!password) {
      newErrors.password = 'Kata sandi tidak boleh kosong.';
      hasError = true;
    }

    if (hasError) {
      setErrors(newErrors);
      return;
    }

    const result = login(email, password);

    if (result.success) {
      alert(result.message);
      // navigate('/dashboard'); 
    } else {
      setErrors({ email: '', password: '', general: result.message });
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex items-center justify-center p-4 md:p-6 overflow-hidden">
      
      <div className="flex flex-row items-center justify-center gap-12 w-full max-w-6xl">

        {/* ================= BAGIAN KIRI (GAMBAR) DIANIMASIKAN DARI KIRI ================= */}
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

        {/* ================= BAGIAN KANAN (FORM LOGIN) DIANIMASIKAN DARI KANAN ================= */}
        <motion.div 
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          // Delay sedikit agar munculnya bergantian dengan gambar (stagger effect)
          transition={{ duration: 0.7, delay: 0.15, ease: "easeOut" }}
          className="w-full max-w-107.5 bg-white border border-gray-200 rounded-lg p-5 shadow-[0_8px_30px_rgb(0,0,0,0.03)] flex flex-col shrink-0"
        >
          <Link to="/" className="flex items-center gap-2 text-gray-500 hover:text-gray-800 w-fit transition-colors mb-8">
            <ArrowLeft size={16} />
            <span className="text-xs font-medium">Kembali ke Beranda</span>
          </Link>

          <div className="flex flex-col gap-1 mb-6">
            <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Selamat Datang</h2>
            <p className="text-xs text-gray-400">
              Silakan masuk dengan akun Anda untuk melanjutkan ke dashboard.
            </p>
          </div>

          {errors.general && (
            <div className="mb-4 p-2.5 bg-red-50 border border-red-200 text-red-600 text-xs rounded-md">
              {errors.general}
            </div>
          )}

          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-gray-900">Email</label>
              <input 
                type="email" 
                placeholder="Masukkan email anda"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (errors.email) setErrors({ ...errors, email: '' });
                }}
                className={`w-full h-11 px-4 border rounded-lg text-xs placeholder:text-gray-300 focus:outline-none focus:ring-1 transition-all ${
                  errors.email 
                    ? 'border-red-500 focus:ring-red-500/40 focus:border-red-500' 
                    : 'border-gray-300 focus:ring-[#C1200C]/40 focus:border-[#C1200C]'
                }`}
              />
              {errors.email && <span className="text-xs text-red-500">{errors.email}</span>}
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-gray-900">Kata Sandi</label>
              <div className="relative">
                <input 
                  type={showPassword ? "text" : "password"} 
                  placeholder="Masukkan kata sandi anda"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errors.password) setErrors({ ...errors, password: '' });
                  }}
                  className={`w-full h-11 pl-4 pr-11 border rounded-lg text-xs placeholder:text-gray-300 focus:outline-none focus:ring-1 transition-all ${
                    errors.password 
                      ? 'border-red-500 focus:ring-red-500/40 focus:border-red-500' 
                      : 'border-gray-300 focus:ring-[#C1200C]/40 focus:border-[#C1200C]'
                  }`}
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-500 focus:outline-none"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && <span className="text-xs text-red-500">{errors.password}</span>}
            </div>

            <div className="mt-2">
              <button 
                type="submit"
                className="w-full h-11 bg-[#C1200C] hover:bg-[#A31B0A] text-white text-sm font-medium rounded-lg transition-colors flex items-center justify-center cursor-pointer shadow-[0_2px_10px_rgb(193,32,12,0.1)]"
              >
                Masuk ke Dashboard
              </button>
            </div>
          </form>

          <div className="mt-6 text-center text-xs border-t border-gray-100 pt-5">
            <span className="text-gray-400">Belum ada akun? </span>
            <Link to="/register" className="font-semibold text-gray-900 hover:underline">
              Registrasi
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default LoginPage;