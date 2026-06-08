import React, { useState } from 'react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import MainPicture from '../assets/main-picture-landing.svg';
import { ClipboardList, Clock, FileText, Calendar, TrendingUp, Plus, Minus } from 'lucide-react';
import { motion } from 'framer-motion';

const FadeIn = ({ children, delay = 0, y = 40, className = "w-full" }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false, amount: 0.1 }}
      transition={{ duration: 0.7, delay: delay, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

const faqData = [
  {
    question: "Siapa saja yang dapat menggunakan sistem ini?",
    answer: "Sistem ini dapat digunakan oleh siswa, pembina ekstrakurikuler, koordinator ekskul, orang tua, serta pihak sekolah yang terlibat dalam pengelolaan kegiatan ekstrakurikuler."
  },
  {
    question: "Apakah pendaftaran ekskul dilakukan secara online?",
    answer: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
  },
  {
    question: "Bagaimana pembina melakukan absensi siswa?",
    answer: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
  },
  {
    question: "Apakah orang tua bisa memantau kegiatan siswa?",
    answer: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
  },
  {
    question: "Apakah laporan kegiatan dibuat otomatis?",
    answer: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
  }
];

const LandingPage = () => {
  const [openFaq, setOpenFaq] = useState(null);

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans">
      <Navbar />

      <main className="grow">
        
        {/* Section 1: Hero Text Area */}
        <FadeIn>
          <section className="w-full px-12 pt-16 pb-12 flex flex-col gap-2">
            <h1 className="text-[64px] font-bold leading-[1.1] tracking-tight text-gray-900 max-w-4xl">
              Manajemen <br /> Ekstrakurikuler Digital
            </h1>
            <p className="text-lg text-gray-500 max-w-2xl mt-4">
              Kelola pendaftaran, absensi, jadwal, hingga laporan ekstrakurikuler siswa dalam satu platform yang terintegrasi, cepat, dan transparan.
            </p>
          </section>
        </FadeIn>

        {/* Section 2: Red Box / Stats Bar */}
        <FadeIn delay={0.2} y={20}>
          <div className="w-full bg-[#C1200C] py-3 flex items-center justify-center gap-3">
             <p className="text-white text-sm font-medium">Ekstrakurikuler Aktif</p>
             <span className="text-white text-sm">•</span>
             <p className="text-white text-sm font-medium">Pantau Perkembangan Siswa</p>
          </div>
        </FadeIn>

        {/* Section 3: Main Image Section */}
        <FadeIn delay={0.3}>
          <section className="w-full px-6">
            <div className="w-full h-168">
              <img 
                src={MainPicture} 
                alt="SMP Telkom Purwokerto Students" 
                className="w-full h-full object-cover"
              />
            </div>
          </section>
        </FadeIn>

        {/* Section 4: Fitur Exkul */}
        <section id="fitur" className="w-full px-12 pt-25 pb-25 flex flex-col gap-18">
          
          <FadeIn>
            <div className="flex flex-col items-center text-center gap-5">
              <div className="inline-flex items-center justify-center rounded-full bg-[#C1200C] px-5 py-1.5 ring-1 ring-[#C1200C] ring-offset-2">
                <span className="text-white text-sm font-medium tracking-wide">Fitur Exkul</span>
              </div>
              <h2 className="text-5xl font-bold text-gray-900 leading-tight">
                Semua yang Dibutuhkan Ada <br /> dalam Satu Platform.
              </h2>
            </div>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            <div className="flex flex-col gap-6">
              <FadeIn delay={0.1}>
                <div className="bg-white border border-gray-200 rounded-3xl p-8 flex flex-col items-start shadow-sm hover:shadow-md transition-shadow min-h-75">
                  <div className="w-12 h-12 rounded-xl bg-[#C1200C] text-white flex items-center justify-center">
                    <ClipboardList size={24} />
                  </div>
                  <div className="mt-auto pt-10">
                    <h3 className="text-xl font-bold text-gray-900 mb-3">Pendaftaran Digital</h3>
                    <p className="text-gray-500 text-sm leading-relaxed">
                      Siswa daftar ekskul online. Status real-time, tanpa kertas, kapan saja.
                    </p>
                  </div>
                </div>
              </FadeIn>
              <FadeIn delay={0.2}>
                <div className="bg-white border border-gray-200 rounded-3xl p-8 flex flex-col items-start shadow-sm hover:shadow-md transition-shadow min-h-75">
                  <div className="w-12 h-12 rounded-xl bg-[#C1200C] text-white flex items-center justify-center">
                    <Calendar size={24} />
                  </div>
                  <div className="mt-auto pt-10">
                    <h3 className="text-xl font-bold text-gray-900 mb-3">Jadwal Terpusat</h3>
                    <p className="text-gray-500 text-sm leading-relaxed">
                      Semua jadwal ekskul dalam satu kalender yang bisa diakses semua pihak.
                    </p>
                  </div>
                </div>
              </FadeIn>
            </div>

            <div className="flex flex-col h-full">
              <FadeIn delay={0.3} className="h-full">
                <div className="bg-white border border-gray-200 rounded-3xl p-8 flex flex-col items-start shadow-sm hover:shadow-md transition-shadow h-full">
                  <div className="w-12 h-12 rounded-xl bg-[#C1200C] text-white flex items-center justify-center">
                    <Clock size={24} />
                  </div>
                  <div className="mt-auto pt-10">
                    <h3 className="text-xl font-bold text-gray-900 mb-3">Absensi Cepat</h3>
                    <p className="text-gray-500 text-sm leading-relaxed">
                      Pembina catat kehadiran per sesi dalam hitungan menit. Orang tua bisa pantau.
                    </p>
                  </div>
                </div>
              </FadeIn>
            </div>

            <div className="flex flex-col gap-6">
              <FadeIn delay={0.4}>
                <div className="bg-white border border-gray-200 rounded-3xl p-8 flex flex-col items-start shadow-sm hover:shadow-md transition-shadow min-h-75">
                  <div className="w-12 h-12 rounded-xl bg-[#C1200C] text-white flex items-center justify-center">
                    <FileText size={24} />
                  </div>
                  <div className="mt-auto pt-10">
                    <h3 className="text-xl font-bold text-gray-900 mb-3">Laporan Terstandar</h3>
                    <p className="text-gray-500 text-sm leading-relaxed">
                      Template laporan seragam untuk semua ekskul. Koordinator approve langsung.
                    </p>
                  </div>
                </div>
              </FadeIn>
              <FadeIn delay={0.5}>
                <div className="bg-white border border-gray-200 rounded-3xl p-8 flex flex-col items-start shadow-sm hover:shadow-md transition-shadow min-h-75">
                  <div className="w-12 h-12 rounded-xl bg-[#C1200C] text-white flex items-center justify-center">
                    <TrendingUp size={24} />
                  </div>
                  <div className="mt-auto pt-10">
                    <h3 className="text-xl font-bold text-gray-900 mb-3">Dashboard Analitik</h3>
                    <p className="text-gray-500 text-sm leading-relaxed">
                      Ringkasan data real-time: kehadiran, anggota, dan perkembangan per ekskul.
                    </p>
                  </div>
                </div>
              </FadeIn>
            </div>
          </div>
        </section>

        {/* Section 5: Cara Kerja */}
        <section id="cara-kerja" className="w-full px-12 pt-25 pb-25 flex flex-col md:flex-row items-start justify-between gap-12 relative">
          
          <div className="w-full md:w-5/12 sticky top-32 flex flex-col items-start gap-6">
            <FadeIn>
              <div className="inline-flex items-center justify-center rounded-full bg-[#C1200C] px-5 py-1.5 ring-1 ring-[#C1200C] ring-offset-2 mb-6">
                <span className="text-white text-sm font-medium tracking-wide">Bagaimana Cara Kerjanya?</span>
              </div>
              <h2 className="text-5xl font-bold text-gray-900 leading-tight">
                Dari Pendaftaran Hingga <br /> Laporan, Semua Terhubung.
              </h2>
            </FadeIn>
          </div>

          <div className="w-full md:w-6/12 flex flex-col gap-20 items-end">
            <FadeIn>
              <div className="w-full max-w-168.75 h-105.25 flex flex-col gap-3">
                <div className="w-full h-81 bg-gray-500 rounded-3xl shadow-sm shrink-0"></div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Pilih & Daftar Ekskul</h3>
                  <p className="text-gray-500 leading-relaxed">
                    Browse katalog ekskul, baca detail, dan daftar online. Status pendaftaran bisa dipantau real-time.
                  </p>
                </div>
              </div>
            </FadeIn>

            <FadeIn>
              <div className="w-full max-w-168.75 h-105.25 flex flex-col gap-3">
                <div className="w-full h-81 bg-gray-500 rounded-3xl shadow-sm shrink-0"></div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Ikuti Kegiatan</h3>
                  <p className="text-gray-500 leading-relaxed">
                    Jadwal tersedia di sistem. Kehadiran dicatat digital per sesi oleh pembina.
                  </p>
                </div>
              </div>
            </FadeIn>

            <FadeIn>
              <div className="w-full max-w-168.75 h-105.25 flex flex-col gap-3">
                <div className="w-full h-81 bg-gray-500 rounded-3xl shadow-sm shrink-0"></div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Laporan & Evaluasi</h3>
                  <p className="text-gray-500 leading-relaxed">
                    Pembina kirim laporan terstandarisasi setiap akhir semester. Koordinator review dan setujui dalam sistem.
                  </p>
                </div>
              </div>
            </FadeIn>
          </div>
        </section>

        {/* Section 6: FAQ */}
        <section id="faq" className="w-full px-12 pt-25 pb-25 flex flex-col gap-18 bg-white">
          
          <FadeIn>
            <div className="flex flex-col items-center text-center gap-4">
              <div className="inline-flex items-center justify-center rounded-full bg-[#C1200C] px-5 py-1.5 ring-1 ring-[#C1200C] ring-offset-2">
                <span className="text-white text-sm font-medium tracking-wide">FAQ</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
                Pertanyaan yang Sering <br /> Diajukan
              </h2>
              <p className="text-gray-500 text-sm max-w-md mx-auto">
                Temukan jawaban seputar penggunaan sistem manajemen ekstrakurikuler.
              </p>
            </div>
          </FadeIn>

          <div className="w-full max-w-238 mx-auto flex flex-col gap-4">
            {faqData.map((faq, index) => {
              const isOpen = openFaq === index;

              return (
                <FadeIn key={index} delay={index * 0.1}>
                  <div 
                    className={`w-full rounded-3xl transition-all duration-300 ${
                      isOpen ? 'bg-[#FAFAFA] p-2' : 'bg-transparent p-0'
                    }`}
                  >
                    <div 
                      className={`w-full rounded-2xl overflow-hidden transition-all duration-300 ${
                        isOpen 
                        ? 'bg-white border border-gray-200' 
                        : 'bg-[#FAFAFA] border border-transparent'
                      }`}
                    >
                      <button 
                        onClick={() => toggleFaq(index)}
                        className="w-full flex items-center justify-between px-6 py-7 text-left outline-none cursor-pointer bg-transparent"
                      >
                        <span className="text-xl font-medium text-gray-900 pr-8">{faq.question}</span>
                        
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-colors duration-300 ${isOpen ? 'bg-black text-white' : 'border border-gray-300 bg-white text-black'}`}>
                          {isOpen ? <Minus size={18} /> : <Plus size={18} />}
                        </div>
                      </button>

                      <div className={`grid transition-all duration-300 ease-in-out ${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
                        <div className="overflow-hidden">
                          <div className="px-6 pb-7 pt-0 text-gray-500 text-sm leading-relaxed pr-24">
                            {faq.answer}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </FadeIn>
              );
            })}
          </div>

        </section>

      </main>

      <Footer />
    </div>
  );
};

export default LandingPage;