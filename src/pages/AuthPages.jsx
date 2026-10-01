import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useHospital } from '../context/HospitalContext';
import {
  HeartPulse,
  Mail,
  Lock,
  User,
  Phone,
  Calendar,
  MapPin,
  Droplet,
  Shield,
  Stethoscope,
  UserCheck,
  Pill,
  FlaskConical,
  CheckCircle2,
  ArrowLeft,
  AlertCircle
} from 'lucide-react';

export const LoginPage = () => {
  const { login, users } = useHospital();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState('');

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }

    // Find matching user in mock state or fallback to role by email domain
    const matchedUser = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    let role = matchedUser?.role;

    if (!role) {
      if (email.includes('admin')) role = 'Administrator';
      else if (email.includes('doctor') || email.includes('chen') || email.includes('elena') || email.includes('miller')) role = 'Doctor';
      else if (email.includes('reception')) role = 'Receptionist';
      else if (email.includes('pharm')) role = 'Pharmacist';
      else if (email.includes('lab')) role = 'Lab Technician';
      else role = 'Patient';
    }

    login(role, matchedUser);
    redirectToRole(role);
  };

  const handleQuickRoleSelect = (roleName) => {
    const roleUser = users.find(u => u.role === roleName);
    login(roleName, roleUser);
    redirectToRole(roleName);
  };

  const redirectToRole = (role) => {
    switch (role) {
      case 'Patient': navigate('/patient'); break;
      case 'Doctor': navigate('/doctor'); break;
      case 'Receptionist': navigate('/receptionist'); break;
      case 'Pharmacist': navigate('/pharmacist'); break;
      case 'Lab Technician': navigate('/lab'); break;
      case 'Administrator': navigate('/admin'); break;
      default: navigate('/admin'); break;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link to="/" className="inline-flex items-center gap-2.5 mb-3">
          <div className="w-10 h-10 rounded-xl bg-rose-600 flex items-center justify-center text-white shadow-xs">
            <HeartPulse className="w-6 h-6" />
          </div>
          <span className="text-2xl font-bold text-slate-900 tracking-tight">CarePoint</span>
        </Link>
        <h2 className="text-xl font-bold text-slate-900">Hospital Portal Sign In</h2>
        <p className="text-xs text-slate-500 mt-1">Access clinical, patient, and operational records</p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 shadow-sm sm:rounded-xl sm:px-10 border border-slate-200">
          {error && (
            <div className="mb-4 p-3 bg-rose-50 border border-rose-200 rounded-lg text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form className="space-y-4" onSubmit={handleLoginSubmit}>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setError(''); }}
                  placeholder="name@carepoint.com"
                  className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setError(''); }}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-xs">
              <label className="flex items-center gap-2 text-slate-600 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-slate-300 text-rose-600 focus:ring-rose-500"
                />
                Remember me
              </label>
              <Link to="/forgot-password" className="text-rose-600 hover:underline font-medium">
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 px-4 bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs rounded-lg transition shadow-xs"
            >
              Sign In to System
            </button>
          </form>

          {/* 1-Click Role Demo Switcher */}
          <div className="mt-6 pt-6 border-t border-slate-100">
            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider text-center mb-3">
              1-Click Demo Login by Role
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleQuickRoleSelect('Administrator')}
                className="p-2 text-xs border border-slate-200 rounded-lg hover:border-rose-400 hover:bg-rose-50 text-slate-700 flex flex-col items-center gap-1 transition"
              >
                <Shield className="w-4 h-4 text-slate-600" />
                <span className="font-semibold text-[11px]">Admin</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickRoleSelect('Doctor')}
                className="p-2 text-xs border border-slate-200 rounded-lg hover:border-rose-400 hover:bg-rose-50 text-slate-700 flex flex-col items-center gap-1 transition"
              >
                <Stethoscope className="w-4 h-4 text-rose-600" />
                <span className="font-semibold text-[11px]">Doctor</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickRoleSelect('Receptionist')}
                className="p-2 text-xs border border-slate-200 rounded-lg hover:border-rose-400 hover:bg-rose-50 text-slate-700 flex flex-col items-center gap-1 transition"
              >
                <UserCheck className="w-4 h-4 text-blue-600" />
                <span className="font-semibold text-[11px]">Receptionist</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickRoleSelect('Pharmacist')}
                className="p-2 text-xs border border-slate-200 rounded-lg hover:border-rose-400 hover:bg-rose-50 text-slate-700 flex flex-col items-center gap-1 transition"
              >
                <Pill className="w-4 h-4 text-amber-600" />
                <span className="font-semibold text-[11px]">Pharmacist</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickRoleSelect('Lab Technician')}
                className="p-2 text-xs border border-slate-200 rounded-lg hover:border-rose-400 hover:bg-rose-50 text-slate-700 flex flex-col items-center gap-1 transition"
              >
                <FlaskConical className="w-4 h-4 text-purple-600" />
                <span className="font-semibold text-[11px]">Lab Tech</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickRoleSelect('Patient')}
                className="p-2 text-xs border border-slate-200 rounded-lg hover:border-rose-400 hover:bg-rose-50 text-slate-700 flex flex-col items-center gap-1 transition"
              >
                <User className="w-4 h-4 text-emerald-600" />
                <span className="font-semibold text-[11px]">Patient</span>
              </button>
            </div>
          </div>

          <div className="mt-6 text-center text-xs text-slate-500">
            Are you a new patient?{' '}
            <Link to="/register" className="font-semibold text-rose-600 hover:underline">
              Create Patient Account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export const RegisterPage = () => {
  const { addPatient, login } = useHospital();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    dob: '',
    gender: 'Male',
    bloodGroup: 'O+',
    address: '',
    emergencyContact: '',
    allergies: '',
    password: ''
  });

  const [success, setSuccess] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    const createdPatient = addPatient({
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      dob: formData.dob,
      gender: formData.gender,
      bloodGroup: formData.bloodGroup,
      address: formData.address,
      emergencyContact: formData.emergencyContact,
      allergies: formData.allergies || 'None reported'
    });

    setSuccess(true);
    setTimeout(() => {
      login('Patient', {
        id: 'USR-' + Date.now().toString().slice(-3),
        name: formData.name,
        email: formData.email,
        role: 'Patient',
        patientId: createdPatient.id,
        phone: formData.phone
      });
      navigate('/patient');
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-6">
          <Link to="/" className="inline-flex items-center gap-2 mb-2">
            <div className="w-9 h-9 rounded-xl bg-rose-600 flex items-center justify-center text-white">
              <HeartPulse className="w-5 h-5" />
            </div>
            <span className="text-2xl font-bold text-slate-900 tracking-tight">CarePoint</span>
          </Link>
          <h2 className="text-xl font-bold text-slate-900">Patient Registration Portal</h2>
          <p className="text-xs text-slate-500">Create an account to book consultations and access digital reports</p>
        </div>

        <div className="bg-white p-6 sm:p-8 rounded-xl border border-slate-200 shadow-sm">
          {success ? (
            <div className="py-8 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Registration Successful!</h3>
              <p className="text-xs text-slate-600">Your patient profile and medical record ID have been generated. Redirecting to Patient Portal...</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Full Legal Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Johnathan Doe"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="johnathan@example.com"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Phone Number *</label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+1 (555) 019-1100"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Date of Birth *</label>
                  <input
                    type="date"
                    required
                    value={formData.dob}
                    onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Gender *</label>
                  <select
                    value={formData.gender}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Blood Group *</label>
                  <select
                    value={formData.bloodGroup}
                    onChange={(e) => setFormData({ ...formData, bloodGroup: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
                  >
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Residential Address *</label>
                <input
                  type="text"
                  required
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="45 Riverfront Lane, Suite 102, Medical City"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Emergency Contact (Name & Phone) *</label>
                  <input
                    type="text"
                    required
                    value={formData.emergencyContact}
                    onChange={(e) => setFormData({ ...formData, emergencyContact: e.target.value })}
                    placeholder="Jane Doe (Spouse) - +1 555-019-1105"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Known Drug Allergies</label>
                  <input
                    type="text"
                    value={formData.allergies}
                    onChange={(e) => setFormData({ ...formData, allergies: e.target.value })}
                    placeholder="e.g. Penicillin, Sulfa, None"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Account Password *</label>
                <input
                  type="password"
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="••••••••"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs rounded-lg transition shadow-xs"
                >
                  Register & Proceed to Portal
                </button>
              </div>

              <div className="text-center text-xs text-slate-500 pt-2">
                Already registered with CarePoint?{' '}
                <Link to="/login" className="font-semibold text-rose-600 hover:underline">
                  Sign In
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link to="/" className="inline-flex items-center gap-2 mb-3">
          <div className="w-9 h-9 rounded-xl bg-rose-600 flex items-center justify-center text-white">
            <HeartPulse className="w-5 h-5" />
          </div>
          <span className="text-2xl font-bold text-slate-900 tracking-tight">CarePoint</span>
        </Link>
        <h2 className="text-xl font-bold text-slate-900">Reset Hospital Account Password</h2>
        <p className="text-xs text-slate-500 mt-1">We will send you instructions to reset your password</p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 shadow-sm sm:rounded-xl sm:px-10 border border-slate-200 text-xs">
          {submitted ? (
            <div className="space-y-4 text-center">
              <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-sm text-slate-900">Reset Link Dispatched</h3>
              <p className="text-slate-600">
                If an account exists for <strong>{email}</strong>, a password reset authorization code has been generated.
              </p>
              <Link
                to="/reset-password"
                className="inline-block px-4 py-2 bg-rose-600 text-white font-semibold rounded-lg hover:bg-rose-700"
              >
                Proceed to Enter New Password
              </Link>
            </div>
          ) : (
            <form onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }} className="space-y-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Registered Email Address *</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@carepoint.com"
                    className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-semibold rounded-lg transition shadow-xs"
              >
                Send Password Reset Instructions
              </button>

              <div className="text-center pt-2">
                <Link to="/login" className="inline-flex items-center gap-1 text-slate-600 hover:text-slate-900 font-medium">
                  <ArrowLeft className="w-3.5 h-3.5" /> Back to Sign In
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export const ResetPasswordPage = () => {
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [done, setDone] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    setDone(true);
    setTimeout(() => {
      navigate('/login');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link to="/" className="inline-flex items-center gap-2 mb-3">
          <div className="w-9 h-9 rounded-xl bg-rose-600 flex items-center justify-center text-white">
            <HeartPulse className="w-5 h-5" />
          </div>
          <span className="text-2xl font-bold text-slate-900 tracking-tight">CarePoint</span>
        </Link>
        <h2 className="text-xl font-bold text-slate-900">Set New Password</h2>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 shadow-sm sm:rounded-xl sm:px-10 border border-slate-200 text-xs">
          {done ? (
            <div className="text-center space-y-3 py-4">
              <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
              <h3 className="font-bold text-sm text-slate-900">Password Successfully Updated!</h3>
              <p className="text-slate-600">Redirecting you to login screen...</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">New Password *</label>
                <input
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Confirm New Password *</label>
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-semibold rounded-lg transition shadow-xs"
              >
                Save New Password
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
