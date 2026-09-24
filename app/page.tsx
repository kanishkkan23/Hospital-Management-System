"use client";

import React, { useState } from 'react';
import { Navbar } from '@/components/landing/Navbar';
import { HeroSection } from '@/components/landing/HeroSection';
import { QuickActionCards } from '@/components/landing/QuickActionCards';
import { ServicesSection } from '@/components/landing/ServicesSection';
import { DepartmentsSection } from '@/components/landing/DepartmentsSection';
import { DoctorsSection } from '@/components/landing/DoctorsSection';
import { WhyChooseUs } from '@/components/landing/WhyChooseUs';
import { FacilitiesSection } from '@/components/landing/FacilitiesSection';
import { TestimonialsSection } from '@/components/landing/TestimonialsSection';
import { ContactSection } from '@/components/landing/ContactSection';
import { Footer } from '@/components/landing/Footer';
import { AppointmentBookingModal } from '@/components/landing/AppointmentBookingModal';
import { Doctor } from '@/types';

export default function LandingPage() {
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [selectedDoctorForBooking, setSelectedDoctorForBooking] = useState<Doctor | null>(null);

  const handleOpenBooking = () => {
    setSelectedDoctorForBooking(null);
    setIsBookingModalOpen(true);
  };

  const handleSelectDoctorForBooking = (doctor: Doctor) => {
    setSelectedDoctorForBooking(doctor);
    setIsBookingModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col selection:bg-hospital-100 selection:text-hospital-900">
      {/* Navigation Header */}
      <Navbar onOpenBookingModal={handleOpenBooking} />

      {/* Main Public Content */}
      <main className="flex-1">
        <HeroSection onOpenBookingModal={handleOpenBooking} />
        <QuickActionCards onOpenBookingModal={handleOpenBooking} />
        <ServicesSection />
        <DepartmentsSection onOpenBookingModal={handleOpenBooking} />
        <DoctorsSection onSelectDoctorForBooking={handleSelectDoctorForBooking} />
        <WhyChooseUs />
        <FacilitiesSection />
        <TestimonialsSection />
        <ContactSection />
      </main>

      {/* Footer */}
      <Footer />

      {/* Universal Patient Appointment Booking Modal */}
      <AppointmentBookingModal
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        preselectedDoctor={selectedDoctorForBooking}
      />
    </div>
  );
}
