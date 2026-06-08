import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FileText, Clock, UserCheck, Flag, CheckCircle2, MinusCircle, ArrowLeft, ArrowRight,
  User, CalendarDays, MapPin, Music2, Code2, Plus, Globe
} from 'lucide-react';
import NotificationModal from '../../components/ui/NotificationModal';

// Custom SVG Icons matching RegisterExtracurricular
const PodiumIcon = ({ className, strokeWidth = 2, size = 24 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M10 9h4v11h-4z" />
    <path d="M14 13h4v7h-4z" />
    <path d="M6 16h4v4H6z" />
    <circle cx="12" cy="5" r="2" />
    <path d="M2 20h20" />
  </svg>
);

const BasketballIcon = ({ className, strokeWidth = 2, size = 24 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="12" cy="12" r="10" />
    <line x1="2" y1="12" x2="22" y2="12" />
    <line x1="12" y1="2" x2="12" y2="22" />
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10" />
    <path d="M12 2a15.3 15.3 0 0 0-4 10 15.3 15.3 0 0 0 4 10" />
  </svg>
);

const SoccerIcon = ({ className, strokeWidth = 2, size = 24 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="12" cy="12" r="10" />
    <path d="M12 7l4.76 3.45l-1.76 5.55h-6l-1.76 -5.55z" />
    <path d="M12 7v-5" />
    <path d="M16.76 10.45l4.74 -1.55" />
    <path d="M15 16l2.5 4.5" />
    <path d="M9 16l-2.5 4.5" />
    <path d="M7.24 10.45l-4.74 -1.55" />
  </svg>
);

// Quiz Questions
const questionsData = [
  {
    id: 1, text: "1. Saat memiliki waktu luang, kamu lebih suka...",
    options: [
      { text: "A. Bermain sepak bola, basket, atau olahraga lainnya", category: "Sport" },
      { text: "B. Menggambar, menyanyi, atau membuat karya seni", category: "Arts" },
      { text: "C. Mencoba aplikasi atau teknologi baru", category: "Technology" },
      { text: "D. Berkumpul dan mengobrol dengan teman-teman", category: "Social" },
      { text: "E. Membaca buku atau mempelajari hal baru", category: "Academic" }
    ]
  },
  {
    id: 2, text: "2. Kegiatan sekolah yang paling membuatmu antusias adalah...",
    options: [
      { text: "A. Olimpiade atau lomba akademik", category: "Academic" },
      { text: "B. Turnamen atau kompetisi olahraga", category: "Sport" },
      { text: "C. Pentas seni atau pertunjukan", category: "Arts" },
      { text: "D. Kompetisi robotik atau coding", category: "Technology" },
      { text: "E. Kegiatan organisasi atau acara sekolah", category: "Social" }
    ]
  },
  {
    id: 3, text: "3. Jika diberi proyek kelompok, kamu lebih tertarik untuk...",
    options: [
      { text: "A. Mengatur komunikasi dan koordinasi tim", category: "Social" },
      { text: "B. Menyusun materi dan analisis informasi", category: "Academic" },
      { text: "C. Menjadi bagian yang aktif dan energik di lapangan", category: "Sport" },
      { text: "D. Mendesain atau membuat tampilan yang menarik", category: "Arts" },
      { text: "E. Mengelola alat atau teknologi yang digunakan", category: "Technology" }
    ]
  },
  {
    id: 4, text: "4. Kamu paling bangga jika berhasil...",
    options: [
      { text: "A. Menampilkan karya yang diapresiasi banyak orang", category: "Arts" },
      { text: "B. Membuat program atau solusi teknologi", category: "Technology" },
      { text: "C. Membantu banyak orang dalam sebuah kegiatan", category: "Social" },
      { text: "D. Meraih prestasi akademik", category: "Academic" },
      { text: "E. Memenangkan pertandingan", category: "Sport" }
    ]
  },
  {
    id: 5, text: "5. Saat menghadapi tantangan, kamu biasanya...",
    options: [
      { text: "A. Menghadapinya dengan semangat dan aksi langsung", category: "Sport" },
      { text: "B. Menemukan cara kreatif untuk menyelesaikannya", category: "Arts" },
      { text: "C. Mencari solusi menggunakan logika dan teknologi", category: "Technology" },
      { text: "D. Berdiskusi dengan orang lain untuk mencari solusi", category: "Social" },
      { text: "E. Menganalisis masalah secara mendalam", category: "Academic" }
    ]
  },
  {
    id: 6, text: "6. Jenis konten yang paling sering kamu lihat adalah...",
    options: [
      { text: "A. Edukasi dan pengetahuan umum", category: "Academic" },
      { text: "B. Olahraga dan kebugaran", category: "Sport" },
      { text: "C. Musik, seni, atau desain", category: "Arts" },
      { text: "D. Teknologi, gadget, atau programming", category: "Technology" },
      { text: "E. Kehidupan sosial dan komunitas", category: "Social" }
    ]
  },
  {
    id: 7, text: "7. Jika sedang libur sekolah, kamu lebih memilih...",
    options: [
      { text: "A. Menghabiskan waktu bersama teman atau mengikuti kegiatan komunitas", category: "Social" },
      { text: "B. Membaca, belajar hal baru, atau mengerjakan teka-teki/logika", category: "Academic" },
      { text: "C. Bermain olahraga atau melakukan aktivitas fisik di luar rumah", category: "Sport" },
      { text: "D. Menggambar, bermain musik, atau membuat karya kreatif", category: "Arts" },
      { text: "E. Mencoba aplikasi, gadget, atau teknologi baru", category: "Technology" }
    ]
  },
  {
    id: 8, text: "8. Jika kamu bisa menjadi ahli dalam satu kemampuan, kamu ingin ahli dalam...",
    options: [
      { text: "A. Keterampilan fisik dan olahraga", category: "Sport" },
      { text: "B. Seni dan kreativitas", category: "Arts" },
      { text: "C. Komunikasi dan kepemimpinan", category: "Social" },
      { text: "D. Analisis dan pemecahan masalah", category: "Academic" },
      { text: "E. Teknologi dan inovasi", category: "Technology" }
    ]
  }
];

// Extracurricular Data
const EXTRACURRICULARS_DATA = [
  { id: "basketball", name: "Basketball", category: "Sport", description: "Develop teamwork, discipline, and basketball fundamentals through regular training sessions.", mentor: "Ahmad Sarifudin", scheduleDay: "Monday", scheduleTime: "15:00", location: "Basketball Court", iconType: "basketball" },
  { id: "futsal", name: "Futsal", category: "Sport", description: "Improve technical skills, teamwork, and sportsmanship through structured futsal training and competitions.", mentor: "Rizky Pratama", scheduleDay: "Wednesday", scheduleTime: "16:00", location: "Field", iconType: "futsal" },
  { id: "choir", name: "Choir", category: "Arts", description: "Enhance vocal technique and performance through regular practice and stage experience.", mentor: "Sinta Nabila", scheduleDay: "Tuesday", scheduleTime: "15:30", location: "Auditorium", iconType: "arts" },
  { id: "coding-club", name: "Coding Club", category: "Technology", description: "Learn programming fundamentals, problem-solving, and software development through hands-on projects.", mentor: "Galih Nugroho", scheduleDay: "Friday", scheduleTime: "15:00", location: "Computer Laboratory", iconType: "tech" },
  { id: "pmr", name: "PMR", category: "Social", description: "Develop first aid skills, health awareness, and social responsibility through practical training and community.", mentor: "Dewi Sartika", scheduleDay: "Thursday", scheduleTime: "16:00", location: "Room 201", iconType: "social" },
  { id: "english-club", name: "English Club", category: "Academic", description: "Build confidence in speaking, listening, and skills through discussions, debates, and presentations.", mentor: "Intan Lestari", scheduleDay: "Wednesday", scheduleTime: "15:30", location: "Language Laboratory", iconType: "academic" },
];

const categoryHeaders = {
  Sport: { title: 'Sport', description: 'You enjoy physical activities, teamwork, and competitive challenges.', icon: <BasketballIcon size={32} strokeWidth={1.5} />, colorPill: 'bg-[#ECFDF3] text-[#027A48]' },
  Arts: { title: 'Arts', description: 'You have a great sense of creativity and love expressing yourself through art.', icon: <Music2 size={32} strokeWidth={1.5} />, colorPill: 'bg-[#F2F4F7] text-[#344054]' },
  Technology: { title: 'Technology', description: 'You enjoy innovation, technology and problem solving.', icon: <Code2 size={32} strokeWidth={1.5} />, colorPill: 'bg-[#FEF3F2] text-[#C1200C]' },
  Social: { title: 'Social', description: 'You excel in communication, leadership, and community engagement.', icon: <Plus size={32} strokeWidth={1.5} />, colorPill: 'bg-[#FFF6ED] text-[#C4320A]' },
  Academic: { title: 'Academic', description: 'You have a thirst for knowledge, logic, and academic excellence.', icon: <Globe size={32} strokeWidth={1.5} />, colorPill: 'bg-[#EFF8FF] text-[#175CD3]' }
};

const formatDateLong = (d) => {
  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  return `${months[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
};

const CardIcon = ({ type }) => {
  const iconClass = "w-[18px] h-[18px] text-[#C1200C]";
  switch (type) {
    case "basketball": return <BasketballIcon className={iconClass} strokeWidth={2.5} size={18} />;
    case "futsal": return <SoccerIcon className={iconClass} strokeWidth={2.5} size={18} />;
    case "arts": return <Music2 className={iconClass} strokeWidth={2.5} />;
    case "tech": return <Code2 className={iconClass} strokeWidth={2.5} />;
    case "social": return <Plus className={iconClass} strokeWidth={3} />;
    case "academic": return <Globe className={iconClass} strokeWidth={2.5} />;
    default: return <FileText className={iconClass} strokeWidth={2.5} />;
  }
};

const TalentAssessment = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState('start');
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [answers, setAnswers] = useState(Array(8).fill(null));
  const [finalCategory, setFinalCategory] = useState(null);

  const [successOpen, setSuccessOpen] = useState(false);

  const handleStart = () => setStep('quiz');

  const handleSelectOption = (category) => {
    const newAnswers = [...answers];
    newAnswers[currentQIndex] = category;
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQIndex < questionsData.length - 1) setCurrentQIndex(currentQIndex + 1);
  };

  const handlePrev = () => {
    if (currentQIndex > 0) setCurrentQIndex(currentQIndex - 1);
  };

  const handleSubmit = () => {
    if (answers.includes(null)) return;

    const categoryCounts = answers.reduce((acc, cat) => {
      if (cat) acc[cat] = (acc[cat] || 0) + 1;
      return acc;
    }, {});

    let highestCat = 'Sport';
    let maxCount = 0;
    for (const [cat, count] of Object.entries(categoryCounts)) {
      if (count > maxCount) { maxCount = count; highestCat = cat; }
    }

    setFinalCategory(highestCat);
    setStep('result');
  };

  // Handler Registrasi - Save to Local Storage
  const handleRegister = (exkul) => {
    const now = new Date();
    const newRegistration = {
      extracurricularName: exkul.name,
      registrationDate: formatDateLong(now),
      status: "Pending Approval",
    };
    localStorage.setItem("activeRegistration", JSON.stringify(newRegistration));
    setSuccessOpen(true);
  };

  const isAllAnswered = answers.every(ans => ans !== null);

  // Start Screen
  if (step === 'start') {
    return (
      <div className="p-8 pt-6 flex flex-col items-center">
        <div className="w-16 h-16 bg-[#FEF2F2] rounded-2xl flex items-center justify-center text-[#C1200C] mt-4 mb-6">
          <PodiumIcon size={32} strokeWidth={1.5} />
        </div>
        <h2 className="text-[22px] font-bold text-gray-900 mb-2">Find Your Perfect Extracurricular</h2>
        <p className="text-[15px] text-gray-400 mb-10 text-center">
          Answer a few simple questions to discover activities that match your interests
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl mb-12">
          <div className="border border-gray-200 rounded-[20px] p-5 flex items-center gap-4 bg-white shadow-sm">
            <div className="w-10 h-10 bg-[#FEF2F2] rounded-full flex items-center justify-center text-[#C1200C] shrink-0">
              <FileText size={18} strokeWidth={2} />
            </div>
            <span className="text-[15px] font-medium text-gray-900">8 Questions</span>
          </div>
          <div className="border border-gray-200 rounded-[20px] p-5 flex items-center gap-4 bg-white shadow-sm">
            <div className="w-10 h-10 bg-[#FEF2F2] rounded-full flex items-center justify-center text-[#C1200C] shrink-0">
              <Clock size={18} strokeWidth={2} />
            </div>
            <span className="text-[15px] font-medium text-gray-900">3 Minutes</span>
          </div>
          <div className="border border-gray-200 rounded-[20px] p-5 flex items-center gap-4 bg-white shadow-sm">
            <div className="w-10 h-10 bg-[#FEF2F2] rounded-full flex items-center justify-center text-[#C1200C] shrink-0">
              <UserCheck size={18} strokeWidth={2} />
            </div>
            <span className="text-[15px] font-medium text-gray-900">Personalized</span>
          </div>
        </div>

        <button onClick={handleStart} className="px-8 py-3 bg-[#C1200C] text-white rounded-xl text-[15px] font-medium hover:bg-[#A31B0A] transition-colors cursor-pointer shadow-sm">
          Start Assessment
        </button>

        <div className="border border-gray-200 rounded-3xl p-6 pb-7 mt-12 bg-white w-full max-w-2xl text-center shadow-sm">
          <h3 className="text-[17px] font-semibold text-gray-900 mb-6 text-left">Categories You May Match:</h3>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <span className="px-5 py-2 rounded-full text-[13px] font-medium bg-[#ECFDF3] text-[#12B76A]">Sport</span>
            <span className="px-5 py-2 rounded-full text-[13px] font-medium bg-[#F3F4F6] text-gray-600">Arts</span>
            <span className="px-5 py-2 rounded-full text-[13px] font-medium bg-[#FEF2F2] text-[#EF4444]">Technology</span>
            <span className="px-5 py-2 rounded-full text-[13px] font-medium bg-[#FFF7ED] text-[#F97316]">Social</span>
            <span className="px-5 py-2 rounded-full text-[13px] font-medium bg-[#EFF6FF] text-[#3B82F6]">Academic</span>
          </div>
        </div>
      </div>
    );
  }

  // Quiz Screen
  if (step === 'quiz') {
    const currentQ = questionsData[currentQIndex];
    const isLastQ = currentQIndex === questionsData.length - 1;

    return (
      <div className="p-8 pt-4">
        <div className="flex flex-col lg:flex-row gap-6 items-start">
          <div className="flex-1 border border-gray-200 rounded-[20px] bg-white overflow-hidden shadow-sm flex flex-col">
            <div className="px-6 py-5 border-b border-gray-100 flex items-center gap-3 bg-white">
              <div className="w-10 h-10 rounded-xl bg-[#FEF2F2] flex items-center justify-center text-[#C1200C]">
                <FileText size={18} strokeWidth={2} />
              </div>
              <h3 className="text-[16px] font-semibold text-gray-900">Question {currentQIndex + 1}</h3>
            </div>

            <div className="p-8 flex-1">
              <h4 className="text-[16px] text-gray-900 mb-6">{currentQ.text}</h4>
              <div className="flex flex-col gap-5">
                {currentQ.options.map((option, idx) => {
                  const isSelected = answers[currentQIndex] === option.category;
                  return (
                    <label key={idx} onClick={() => handleSelectOption(option.category)} className="flex items-center gap-4 cursor-pointer group">
                      <div className={`w-5.5 h-5.5 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${isSelected ? 'border-[#C1200C]' : 'border-gray-300 group-hover:border-gray-400'}`}>
                        {isSelected && <div className="w-2.5 h-2.5 rounded-full bg-[#C1200C]" />}
                      </div>
                      <span className="text-[15px] text-gray-800">{option.text}</span>
                    </label>
                  );
                })}
              </div>
            </div>

            <div className="px-8 pb-8 pt-4 flex items-center justify-between mt-10">
              <button onClick={handlePrev} disabled={currentQIndex === 0} className={`flex items-center gap-2 px-5 py-2.5 rounded-xl border text-[14px] font-medium transition-colors ${currentQIndex === 0 ? 'border-gray-200 text-gray-300 cursor-not-allowed bg-white' : 'border-gray-200 text-gray-700 hover:bg-gray-50 cursor-pointer bg-white'}`}>
                <ArrowLeft size={16} /> Previous
              </button>

              {isLastQ ? (
                <button onClick={handleSubmit} disabled={!isAllAnswered} className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-[14px] font-medium transition-colors ${isAllAnswered ? 'bg-[#C1200C] text-white hover:bg-[#A31B0A] cursor-pointer' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}>
                  Submit
                </button>
              ) : (
                <button onClick={handleNext} className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#C1200C] text-white text-[14px] font-medium hover:bg-[#A31B0A] transition-colors cursor-pointer">
                  Next <ArrowRight size={16} />
                </button>
              )}
            </div>
          </div>

          <div className="w-full lg:w-90 border border-gray-200 rounded-[20px] bg-white overflow-hidden shadow-sm shrink-0">
            <div className="px-6 py-5 border-b border-gray-100 flex items-center gap-3 bg-[#F9FAFB]">
              <div className="w-10 h-10 rounded-xl bg-white border border-gray-200 flex items-center justify-center text-[#C1200C]">
                <Flag size={18} strokeWidth={2} />
              </div>
              <h3 className="text-[15px] font-semibold text-gray-900">Quiz Navigation</h3>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-5 gap-3">
                {questionsData.map((_, idx) => {
                  const isActive = idx === currentQIndex;
                  const isAnswered = answers[idx] !== null;

                  if (isActive) {
                    return (
                      <button key={idx} onClick={() => setCurrentQIndex(idx)} className="w-12 h-17 rounded-[14px] bg-[#C1200C] flex flex-col items-center justify-between p-1 cursor-pointer shadow-sm">
                        <div className="mt-1">
                          <MinusCircle size={16} className="text-white" strokeWidth={3} />
                        </div>
                        <div className="w-full h-8.5 bg-white rounded-[10px] flex items-center justify-center shadow-sm">
                          <span className="text-[15px] font-medium text-gray-900">{idx + 1}.</span>
                        </div>
                      </button>
                    );
                  }

                  if (isAnswered) {
                    return (
                      <button key={idx} onClick={() => setCurrentQIndex(idx)} className="w-13 h-17 rounded-[14px] bg-gray-100 border border-gray-200 flex flex-col items-center justify-between p-1 cursor-pointer hover:bg-gray-200 transition-colors">
                        <div className="mt-1">
                          <CheckCircle2 size={16} className="text-[#12B76A]" strokeWidth={3} />
                        </div>
                        <div className="w-full h-8.5 bg-white rounded-[10px] border border-gray-100 flex items-center justify-center shadow-sm">
                          <span className="text-[15px] font-medium text-gray-900">{idx + 1}.</span>
                        </div>
                      </button>
                    );
                  }

                  return (
                    <button key={idx} onClick={() => setCurrentQIndex(idx)} className="w-13 h-17 rounded-[14px] bg-gray-100 border border-gray-200 flex flex-col items-center justify-between p-1 cursor-pointer hover:bg-gray-200 transition-colors">
                      <div className="mt-1">
                        <MinusCircle size={16} className="text-gray-400" strokeWidth={3} />
                      </div>
                      <div className="w-full h-8.5 bg-white rounded-[10px] border border-gray-100 flex items-center justify-center shadow-sm">
                        <span className="text-[15px] font-medium text-gray-900">{idx + 1}.</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Result Screen
  if (step === 'result' && finalCategory) {
    const headerInfo = categoryHeaders[finalCategory];
    const recommendedExkuls = EXTRACURRICULARS_DATA.filter(exkul => exkul.category === finalCategory);

    return (
      <div className="p-8 pt-6 flex flex-col items-center min-h-screen">
        <h2 className="text-[20px] font-semibold text-gray-900 mb-8 mt-2">Your Interest Category</h2>

        <div className="flex flex-col items-center mb-10">
          <div className="w-18 h-18 bg-[#FEF2F2] rounded-[20px] flex items-center justify-center text-[#C1200C] mb-4">
            {headerInfo.icon}
          </div>
          <h3 className="text-[17px] font-semibold text-gray-900 mb-2">{headerInfo.title}</h3>
          <p className="text-[14px] text-gray-400 text-center max-w-sm">
            {headerInfo.description}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 w-full max-w-275 justify-center">
          {recommendedExkuls.map((exkul, i) => (
            <div key={i} className="bg-white border border-gray-200 rounded-[20px] overflow-hidden shadow-[0_1px_2px_rgba(16,24,40,0.06)] flex flex-col">
              <div className="px-6 pt-6 pb-4 flex-1 flex flex-col">
                <div className="flex items-center justify-between gap-4 mb-4">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-11 h-11 rounded-2xl border border-gray-200 bg-white flex items-center justify-center shrink-0">
                      <CardIcon type={exkul.iconType} />
                    </div>
                    <h4 className="text-[15px] font-semibold text-gray-900 truncate">{exkul.name}</h4>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${headerInfo.colorPill}`}>
                    {headerInfo.title}
                  </span>
                </div>

                <p className="text-sm text-gray-400 leading-relaxed mb-5 flex-1">
                  {exkul.description}
                </p>

                <div className="mt-auto space-y-3 text-sm">
                  <div className="flex items-center gap-2 text-gray-500">
                    <User size={16} className="text-gray-400" />
                    <span className="text-gray-400">Mentor:</span>
                    <span className="text-gray-900 font-medium">{exkul.mentor}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-500">
                    <CalendarDays size={16} className="text-gray-400" />
                    <span className="text-gray-400">Schedule:</span>
                    <span className="text-gray-900 font-medium">{exkul.scheduleDay}</span>
                    <span className="text-gray-400">•</span>
                    <span className="text-gray-900 font-medium">{exkul.scheduleTime}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-500">
                    <MapPin size={16} className="text-gray-400" />
                    <span className="text-gray-400">Location:</span>
                    <span className="text-gray-900 font-medium">{exkul.location}</span>
                  </div>
                </div>
              </div>

              <hr className="border-gray-100" />

              <div className="px-6 py-5">
                <button
                  onClick={() => handleRegister(exkul)}
                  className="w-full h-12 rounded-2xl bg-[#C1200C] text-white text-sm font-medium hover:brightness-95 active:brightness-90 transition cursor-pointer"
                >
                  Register Now
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Success Modal */}
        <NotificationModal
          isOpen={successOpen}
          type="success"
          title="Registration Success"
          message="Your extracurricular has been registered successfully."
          buttonText="See Active Registration"
          onButtonClick={() => {
            setSuccessOpen(false);
            navigate('/student/register-extracurricular');
          }}
          onClose={() => setSuccessOpen(false)}
        />
      </div>
    );
  }

  return null;
};

export default TalentAssessment;