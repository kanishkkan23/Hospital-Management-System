import type { Metadata } from "next";
import "./globals.css";
import { HospitalDataProvider } from "@/context/HospitalDataContext";
import { ToastProvider } from "@/components/ui/Toast";

export const metadata: Metadata = {
  title: "Apex Memorial Hospital & Research Center | Leading Healthcare Excellence",
  description: "NABH & JCI Accredited Multi-Specialty Tertiary Care Hospital providing advanced clinical diagnostics, 24/7 emergency trauma, and world-class surgical care.",
  keywords: "Hospital, Hospital Management System, Doctors, OPD Appointment, Cardiology, Neurology, Emergency Care",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="font-sans min-h-screen bg-slate-50 text-slate-900 antialiased selection:bg-hospital-100 selection:text-hospital-900">
        <HospitalDataProvider>
          <ToastProvider>
            {children}
          </ToastProvider>
        </HospitalDataProvider>
      </body>
    </html>
  );
}
