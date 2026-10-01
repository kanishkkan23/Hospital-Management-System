import React, { useState } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useHospital } from '../context/HospitalContext';
import {
  HeartPulse,
  Phone,
  Mail,
  MapPin,
  Clock,
  Shield,
  Stethoscope,
  FlaskConical,
  Pill,
  Ambulance,
  FileText,
  CreditCard,
  ChevronRight,
  Award,
  CheckCircle2,
  Calendar,
  ArrowRight,
  User,
  Activity,
  Brain,
  Bone,
  Baby,
  Sparkles,
  Scissors
} from 'lucide-react';

// Department Icon Map
const getDeptIcon = (name) => {
  switch (name) {
    case 'Cardiology': return HeartPulse;
    case 'Neurology': return Brain;
    case 'Orthopedics': return Bone;
    case 'Pediatrics': return Baby;
    case 'Dermatology': return Sparkles;
    case 'General Surgery': return Scissors;
    default: return Stethoscope;
  }
};

export const PublicHeader = () => {
  const { currentUser } = useHospital();
  const [mobileNav, setMobileNav] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      {/* Top emergency announcement bar */}
      <div className="bg-rose-600 text-white text-xs py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-2">
          <div className="flex items-center gap-2 font-medium">
            <Phone className="w-3.5 h-3.5" />
            <span>24/7 Emergency Hotline: <strong>+1 (800) 911-CARE</strong></span>
            <span className="hidden md:inline">| Ambulance Services Available 24x7</span>
          </div>
          <div className="flex items-center gap-4 text-[11px] text-rose-100">
            <span>OPD Hours: Mon - Sat (8:00 AM - 8:00 PM)</span>
            <span className="hidden sm:inline">License: MED-HOSP-2026</span>
          </div>
        </div>
      </div>

      {/* Main navigation header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-lg bg-rose-600 flex items-center justify-center text-white shadow-xs">
            <HeartPulse className="w-5 h-5" />
          </div>
          <div>
            <span className="font-bold text-slate-900 tracking-tight text-lg leading-none">CarePoint</span>
            <span className="text-[10px] block text-rose-600 font-semibold tracking-wider uppercase">Hospital System</span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
          <NavLink to="/" className={({ isActive }) => isActive ? 'text-rose-600 font-semibold' : 'hover:text-slate-900 transition'}>Home</NavLink>
          <a href="#about" className="hover:text-slate-900 transition">About</a>
          <a href="#departments" className="hover:text-slate-900 transition">Departments</a>
          <a href="#doctors" className="hover:text-slate-900 transition">Doctors</a>
          <a href="#services" className="hover:text-slate-900 transition">Services</a>
          <a href="#contact" className="hover:text-slate-900 transition">Contact</a>
        </nav>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          {currentUser ? (
            <Link
              to={`/${currentUser.role.toLowerCase().replace(' ', '-')}`}
              className="px-4 py-2 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-lg transition shadow-xs flex items-center gap-1.5"
            >
              <User className="w-3.5 h-3.5" />
              <span>Go to {currentUser.role} Portal</span>
            </Link>
          ) : (
            <>
              <Link
                to="/login"
                className="px-3.5 py-1.5 text-xs font-semibold text-slate-700 hover:text-rose-600 border border-slate-200 rounded-lg hover:bg-slate-50 transition"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="px-3.5 py-1.5 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-lg transition shadow-xs"
              >
                Patient Register
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export const PublicFooter = () => {
  const { settings } = useHospital();

  return (
    <footer className="bg-slate-900 text-slate-400 text-xs border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Hospital Information */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-white">
              <div className="w-7 h-7 rounded bg-rose-600 flex items-center justify-center">
                <HeartPulse className="w-4 h-4" />
              </div>
              <span className="font-bold text-base tracking-tight">{settings.hospitalName}</span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed">
              Providing compassionate, cutting-edge clinical healthcare and outpatient services with round-the-clock emergency support.
            </p>
            <div className="text-slate-400 space-y-1 pt-1">
              <p className="flex items-center gap-2"><MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" /> {settings.address}</p>
              <p className="flex items-center gap-2"><Phone className="w-3.5 h-3.5 text-rose-500 shrink-0" /> {settings.phone}</p>
              <p className="flex items-center gap-2"><Mail className="w-3.5 h-3.5 text-rose-500 shrink-0" /> {settings.email}</p>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-3">Quick Links</h4>
            <ul className="space-y-2 text-xs">
              <li><Link to="/login" className="hover:text-white transition">Staff & Patient Login</Link></li>
              <li><Link to="/register" className="hover:text-white transition">Register as New Patient</Link></li>
              <li><Link to="/patient/book" className="hover:text-white transition">Book Specialist Appointment</Link></li>
              <li><a href="#services" className="hover:text-white transition">Diagnostic & Lab Tests</a></li>
              <li><a href="#about" className="hover:text-white transition">Mission & Hospital Quality</a></li>
            </ul>
          </div>

          {/* Medical Departments */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-3">Clinical Specialties</h4>
            <ul className="space-y-2 text-xs">
              <li>Cardiology & Heart Center</li>
              <li>Neurology & Neurosurgery</li>
              <li>Orthopedics & Joint Care</li>
              <li>Pediatrics & Neonatal Care</li>
              <li>General Medicine & Surgery</li>
              <li>Dermatology & Skin Care</li>
            </ul>
          </div>

          {/* Emergency & Working Hours */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-3">Operating Hours</h4>
            <div className="space-y-2 text-xs">
              <div className="bg-slate-800 p-3 rounded-lg border border-slate-700">
                <p className="font-semibold text-white">Emergency & Casualty</p>
                <p className="text-rose-400 font-medium">Open 24 Hours / 7 Days</p>
              </div>
              <div className="bg-slate-800 p-3 rounded-lg border border-slate-700">
                <p className="font-semibold text-white">Outpatient Consultation (OPD)</p>
                <p className="text-slate-300">Mon - Sat: 08:00 AM - 08:00 PM</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-slate-800 flex flex-col sm:flex-row justify-between items-center gap-3 text-slate-500 text-[11px]">
          <div>
            &copy; {new Date().getFullYear()} CarePoint Super Specialty Hospital Management System. College Engineering Project.
          </div>
          <div className="flex gap-4">
            <Link to="/login" className="hover:text-slate-300">Staff Portal</Link>
            <span>&bull;</span>
            <Link to="/login" className="hover:text-slate-300">Doctor Portal</Link>
            <span>&bull;</span>
            <Link to="/login" className="hover:text-slate-300">Patient Portal</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export const PublicLandingPage = () => {
  const { departments, users, settings } = useHospital();
  const navigate = useNavigate();
  const doctors = users.filter(u => u.role === 'Doctor' && u.status === 'Active');

  const [contactSubmitted, setContactSubmitted] = useState(false);
  const [contactForm, setContactForm] = useState({ name: '', email: '', phone: '', message: '' });

  const handleContactSubmit = (e) => {
    e.preventDefault();
    setContactSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <PublicHeader />

      {/* Hero Section */}
      <section className="relative bg-white border-b border-slate-200 overflow-hidden py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold">
                <Activity className="w-3.5 h-3.5" />
                <span>Premier Healthcare & Multi-Specialty Medical Center</span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
                Compassionate Care, <br />
                <span className="text-rose-600">Advanced Medicine</span> for Every Life.
              </h1>

              <p className="text-base text-slate-600 leading-relaxed max-w-2xl">
                CarePoint Hospital provides state-of-the-art clinical consultations, accredited diagnostics, modern surgical facilities, and responsive emergency services. Connected seamlessly through our unified Hospital Management System.
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  onClick={() => navigate('/patient/book')}
                  className="px-5 py-3 text-sm font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-lg transition shadow-xs flex items-center gap-2"
                >
                  <Calendar className="w-4 h-4" /> Book Appointment
                </button>
                <button
                  onClick={() => navigate('/login')}
                  className="px-5 py-3 text-sm font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 rounded-lg transition flex items-center gap-2"
                >
                  <User className="w-4 h-4" /> Patient & Staff Login
                </button>
              </div>

              {/* Trust highlights */}
              <div className="grid grid-cols-3 gap-4 pt-6 border-t border-slate-100">
                <div>
                  <p className="text-xl font-bold text-slate-900">24/7</p>
                  <p className="text-xs text-slate-500">Emergency & Trauma</p>
                </div>
                <div>
                  <p className="text-xl font-bold text-slate-900">8+</p>
                  <p className="text-xs text-slate-500">Specialty Departments</p>
                </div>
                <div>
                  <p className="text-xl font-bold text-slate-900">100%</p>
                  <p className="text-xs text-slate-500">Digitized Health Records</p>
                </div>
              </div>
            </div>

            {/* Hero Image Card */}
            <div className="lg:col-span-5">
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 shadow-sm relative">
                <img
                  src="https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800&auto=format&fit=crop&q=80"
                  alt="Modern Hospital Facility"
                  className="w-full h-80 object-cover rounded-xl border border-slate-200"
                />
                <div className="mt-4 bg-white p-4 rounded-xl border border-slate-200 shadow-2xs flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                      <Shield className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">Accredited Clinical Quality</h4>
                      <p className="text-[11px] text-slate-500">NABH & ISO Healthcare Standards</p>
                    </div>
                  </div>
                  <span className="text-xs font-semibold text-rose-600">CarePoint</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-16 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-rose-600">About Our Institution</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1">
              Committed to Clinical Excellence & Patient Wellness
            </h2>
            <p className="text-sm text-slate-600 mt-3">
              Founded with the vision to deliver accessible, ethical, and high-quality medical services, CarePoint Super Specialty Hospital blends renowned clinical expertise with state-of-the-art diagnostic technologies.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
              <div className="w-10 h-10 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center mb-4">
                <HeartPulse className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">Our Mission</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                To improve community health by providing compassionate, patient-centric, and affordable medical care, fostering clinical innovation and continuous learning.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
              <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center mb-4">
                <Award className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">Our Vision</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                To be the region's benchmark healthcare center, recognized for exceptional patient outcomes, seamless digitized records, and leading clinical care standards.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
              <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
                <Shield className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">Core Principles</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Integrity, clinical safety, transparency, patient empathy, and rapid turnaround for laboratory and diagnostic assessments.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Departments Section */}
      <section id="departments" className="py-16 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-rose-600">Specialized Medicine</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1">Our Medical Departments</h2>
            <p className="text-sm text-slate-600 mt-3">
              CarePoint offers comprehensive care across major clinical domains with specialized doctors and advanced facilities.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {departments.map((dept) => {
              const Icon = getDeptIcon(dept.name);
              return (
                <div key={dept.id} className="bg-slate-50 hover:bg-white p-5 rounded-xl border border-slate-200 hover:border-rose-300 transition shadow-2xs hover:shadow-sm">
                  <div className="w-10 h-10 rounded-lg bg-rose-100 text-rose-700 flex items-center justify-center mb-3">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-sm font-bold text-slate-900">{dept.name}</h3>
                  <p className="text-[11px] text-rose-600 font-medium mt-0.5">Head: {dept.headDoctor}</p>
                  <p className="text-xs text-slate-600 mt-2 leading-relaxed">{dept.description}</p>
                  <div className="mt-4 pt-3 border-t border-slate-200/60 flex items-center justify-between text-xs text-slate-500">
                    <span>{dept.doctorsCount} Specialists</span>
                    <Link to="/patient/book" className="text-rose-600 font-semibold hover:underline">Book Slot</Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Doctors Section */}
      <section id="doctors" className="py-16 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-rose-600">Expert Physicians</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1">Meet Our Specialists</h2>
            <p className="text-sm text-slate-600 mt-3">
              Our experienced medical faculty provides dedicated clinical care and expert consultations.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {doctors.map((doc) => (
              <div key={doc.id} className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs hover:border-slate-300 transition">
                <img
                  src={doc.avatar}
                  alt={doc.name}
                  className="w-full h-48 object-cover border-b border-slate-100"
                />
                <div className="p-4 space-y-2">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">{doc.name}</h3>
                    <p className="text-xs font-medium text-rose-600">{doc.specialization || doc.department}</p>
                  </div>
                  <p className="text-[11px] text-slate-500">
                    <strong>Qual:</strong> {doc.qualification || 'MBBS, MD'} | {doc.experience || '10+ Yrs'}
                  </p>
                  <div className="text-[11px] bg-slate-50 p-2 rounded border border-slate-100 text-slate-600 space-y-0.5">
                    <div><strong>Hours:</strong> {doc.availableHours || '09:00 AM - 02:00 PM'}</div>
                    <div><strong>Days:</strong> {doc.availableDays?.slice(0, 3).join(', ') || 'Mon - Fri'}</div>
                  </div>
                  <Link
                    to="/patient/book"
                    className="block text-center w-full mt-3 py-1.5 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-lg transition"
                  >
                    Consult Doctor
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-16 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-rose-600">Hospital Services</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1">Complete Healthcare Facilities</h2>
            <p className="text-sm text-slate-600 mt-3">
              Comprehensive hospital support services designed for clinical safety, patient comfort, and smooth workflows.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
              <Stethoscope className="w-8 h-8 text-rose-600 mb-3" />
              <h3 className="text-base font-bold text-slate-900 mb-2">Doctor Consultations</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Scheduled and walk-in consultations across 8 medical departments with digitized prescription histories and clinical notes.
              </p>
            </div>

            <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
              <FlaskConical className="w-8 h-8 text-rose-600 mb-3" />
              <h3 className="text-base font-bold text-slate-900 mb-2">Accredited Laboratory Testing</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Automated hematology, biochemistry, lipid profiling, endocrine panels, and serological tests with fast digitized reports.
              </p>
            </div>

            <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
              <Pill className="w-8 h-8 text-rose-600 mb-3" />
              <h3 className="text-base font-bold text-slate-900 mb-2">Central In-House Pharmacy</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Direct integration with electronic doctor prescriptions for accurate, rapid medicine dispensing and stock verification.
              </p>
            </div>

            <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
              <Ambulance className="w-8 h-8 text-rose-600 mb-3" />
              <h3 className="text-base font-bold text-slate-900 mb-2">24/7 Emergency & Casualty</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Round-the-clock resuscitation trauma bays, cardiac monitoring, critical care ambulances, and on-call specialty surgeons.
              </p>
            </div>

            <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
              <FileText className="w-8 h-8 text-rose-600 mb-3" />
              <h3 className="text-base font-bold text-slate-900 mb-2">Digital Medical Records</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Secure electronic health record tracking for patient consultations, previous diagnoses, test findings, and treatment plans.
              </p>
            </div>

            <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
              <CreditCard className="w-8 h-8 text-rose-600 mb-3" />
              <h3 className="text-base font-bold text-slate-900 mb-2">Transparent Hospital Billing</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Itemized invoice generation, insurance desk coordination, printable receipts, and counter settlement tracking.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-16 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Details */}
            <div className="space-y-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-rose-600">Get In Touch</span>
                <h2 className="text-2xl font-bold text-slate-900 mt-1">Hospital Contact & Location</h2>
                <p className="text-xs text-slate-600 mt-2">
                  Have inquiries or require urgent assistance? Reach our 24/7 front desk team or visit our facility.
                </p>
              </div>

              <div className="space-y-4 text-xs">
                <div className="flex items-start gap-3 bg-white p-4 rounded-xl border border-slate-200">
                  <MapPin className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-slate-900 font-semibold">Hospital Location:</strong>
                    <span className="text-slate-600">{settings.address}</span>
                  </div>
                </div>

                <div className="flex items-start gap-3 bg-white p-4 rounded-xl border border-slate-200">
                  <Phone className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-slate-900 font-semibold">General Inquiries & Appointments:</strong>
                    <span className="text-slate-600">{settings.phone}</span>
                  </div>
                </div>

                <div className="flex items-start gap-3 bg-white p-4 rounded-xl border border-slate-200">
                  <Ambulance className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-slate-900 font-semibold">Emergency Ambulance Dispatch:</strong>
                    <span className="text-rose-600 font-bold">{settings.emergencyPhone} (24x7)</span>
                  </div>
                </div>

                <div className="flex items-start gap-3 bg-white p-4 rounded-xl border border-slate-200">
                  <Clock className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-slate-900 font-semibold">Working Hours:</strong>
                    <span className="text-slate-600">{settings.workingHours}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Contact Form */}
            <div className="bg-white p-6 sm:p-8 rounded-xl border border-slate-200 shadow-xs">
              <h3 className="text-base font-bold text-slate-900 mb-1">Send a Message to Front Desk</h3>
              <p className="text-xs text-slate-500 mb-6">We respond promptly during outpatient hours.</p>

              {contactSubmitted ? (
                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-800 text-xs space-y-2">
                  <div className="flex items-center gap-2 font-semibold text-sm">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Message Received!
                  </div>
                  <p>Thank you for reaching out to CarePoint Hospital. Our patient relationship desk will contact you shortly.</p>
                  <button
                    onClick={() => { setContactSubmitted(false); setContactForm({ name: '', email: '', phone: '', message: '' }); }}
                    className="text-xs font-semibold text-emerald-700 underline mt-2 block"
                  >
                    Send another query
                  </button>
                </div>
              ) : (
                <form onSubmit={handleContactSubmit} className="space-y-4 text-xs">
                  <div>
                    <label className="block font-medium text-slate-700 mb-1">Full Name *</label>
                    <input
                      type="text"
                      required
                      value={contactForm.name}
                      onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                      placeholder="e.g. Eleanor Vance"
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-medium text-slate-700 mb-1">Email Address *</label>
                      <input
                        type="email"
                        required
                        value={contactForm.email}
                        onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                        placeholder="you@example.com"
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
                      />
                    </div>
                    <div>
                      <label className="block font-medium text-slate-700 mb-1">Phone Number</label>
                      <input
                        type="tel"
                        value={contactForm.phone}
                        onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })}
                        placeholder="+1 (555) 000-0000"
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-medium text-slate-700 mb-1">Message / Inquiry *</label>
                    <textarea
                      rows={4}
                      required
                      value={contactForm.message}
                      onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                      placeholder="Please describe your consultation or service query..."
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs rounded-lg transition shadow-xs"
                  >
                    Submit Inquiry
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
};
