import React, { useState } from 'react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import MainPicture from '../assets/main-picture-landing.svg';
import { ClipboardList, Clock, FileText, Calendar, TrendingUp, Plus, Minus } from 'lucide-react';
import { motion } from 'framer-motion';
import HowItWork1 from '../assets/how-it-work-1-pictures.svg';
import HowItWork2 from '../assets/how-it-work-2-pictures.svg';
import HowItWork3 from '../assets/how-it-work-3-pictures.svg';

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
    question: "Who Can Use This System?",
    answer: "This system can be used by students, extracurricular instructors, coordinators, parents, and school staff involved in managing extracurricular activities."
  },
  {
    question: "Is extracurricular registration done online?",
    answer: "Yes. Students can browse available extracurricular activities and submit their registrations directly through the system during the registration period opened by the coordinator."
  },
  {
    question: "How do instructors take student attendance?",
    answer: "Mentors can record student attendance digitally during each session by marking students as Present, Excused, or Absent through the attendance management feature."
  },
  {
    question: "Can parents monitor their child's activities?",
    answer: "Yes. Parents can access their account to view their child's attendance records, extracurricular schedules, activity reports, and participation status."
  },
  {
    question: "Are activity reports generated automatically?",
    answer: "No. Activity reports are submitted by mentors after extracurricular activities are completed. Coordinators can then review, approve, or request revisions to the submitted reports."
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
              Digital <br /> Extracurricular Management
            </h1>
            <p className="text-lg text-gray-500 max-w-2xl mt-4">
              Manage registrations, attendance, schedules, and student extracurricular reports all in one integrated, fast, and transparent platform.
            </p>
          </section>
        </FadeIn>

        {/* Section 2: Red Box / Stats Bar */}
        <FadeIn delay={0.2} y={20}>
          <div className="w-full bg-[#C1200C] py-3 flex items-center justify-center gap-3">
            <p className="text-white text-sm font-medium">Active Extracurriculars</p>
            <span className="text-white text-sm">•</span>
            <p className="text-white text-sm font-medium">Track Student Progress</p>
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
                <span className="text-white text-sm font-medium tracking-wide">Exkul Features</span>
              </div>
              <h2 className="text-5xl font-bold text-gray-900 leading-tight">
                Everything You Need <br /> in One Platform.
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
                    <h3 className="text-xl font-bold text-gray-900 mb-3">Digital Registration</h3>
                    <p className="text-gray-500 text-sm leading-relaxed">
                      Students can register for extracurriculars online. Real-time status updates, paperless, anytime.
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
                    <h3 className="text-xl font-bold text-gray-900 mb-3">Centralized Schedules</h3>
                    <p className="text-gray-500 text-sm leading-relaxed">
                      All extracurricular schedules in one calendar accessible to all parties.
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
                    <h3 className="text-xl font-bold text-gray-900 mb-3">Quick Attendance</h3>
                    <p className="text-gray-500 text-sm leading-relaxed">
                      Instructors can record attendance per session in minutes. Parents can monitor.
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
                    <h3 className="text-xl font-bold text-gray-900 mb-3">Standardized Reports</h3>
                    <p className="text-gray-500 text-sm leading-relaxed">
                      Uniform report templates for all extracurriculars. Coordinators approve directly.
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
                    <h3 className="text-xl font-bold text-gray-900 mb-3">Analytics Dashboard</h3>
                    <p className="text-gray-500 text-sm leading-relaxed">
                      Real-time data summary: attendance, members, and progress per extracurricular.
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
                <span className="text-white text-sm font-medium tracking-wide">How Does It Works?</span>
              </div>
              <h2 className="text-5xl font-bold text-gray-900 leading-tight">
                From Registration to <br /> Reporting, Everything is Connected.
              </h2>
            </FadeIn>
          </div>

          <div className="w-full md:w-6/12 flex flex-col gap-20 items-end">
            <FadeIn>
              <div className="w-full max-w-168.75 h-105.25 flex flex-col gap-3">
                <img
                  src={HowItWork1}
                  alt="Pilih & Daftar Ekskul"
                  className="w-full h-81 object-cover rounded-3xl shadow-sm shrink-0 bg-gray-50"
                />
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Select & Register for Extracurriculars</h3>
                  <p className="text-gray-500 leading-relaxed">
                    Browse the extracurricular catalog, read details, and register online. Registration status can be monitored in real-time.
                  </p>
                </div>
              </div>
            </FadeIn>

            <FadeIn>
              <div className="w-full max-w-168.75 h-105.25 flex flex-col gap-3">
                <img
                  src={HowItWork2}
                  alt="Ikuti Kegiatan"
                  className="w-full h-81 object-cover rounded-3xl shadow-sm shrink-0 bg-gray-50"
                />
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Participate in Activities</h3>
                  <p className="text-gray-500 leading-relaxed">
                    Schedules are available in the system. Attendance is recorded digitally per session by the instructor.
                  </p>
                </div>
              </div>
            </FadeIn>

            <FadeIn>
              <div className="w-full max-w-168.75 h-105.25 flex flex-col gap-3">
                <img
                  src={HowItWork3}
                  alt="Laporan & Evaluasi"
                  className="w-full h-81 object-cover rounded-3xl shadow-sm shrink-0 bg-gray-50"
                />
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Reports & Evaluations</h3>
                  <p className="text-gray-500 leading-relaxed">
                    Instructors submit standardized reports at the end of each semester. Coordinators review and approve within the system.
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
                Frequently <br /> Asked Questions
              </h2>
              <p className="text-gray-500 text-sm max-w-md mx-auto">
                Find answers about using the extracurricular management system.
              </p>
            </div>
          </FadeIn>

          <div className="w-full max-w-238 mx-auto flex flex-col gap-4">
            {faqData.map((faq, index) => {
              const isOpen = openFaq === index;

              return (
                <FadeIn key={index} delay={index * 0.1}>
                  <div
                    className={`w-full rounded-3xl transition-all duration-300 ${isOpen ? 'bg-[#FAFAFA] p-2' : 'bg-transparent p-0'
                      }`}
                  >
                    <div
                      className={`w-full rounded-2xl overflow-hidden transition-all duration-300 ${isOpen
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