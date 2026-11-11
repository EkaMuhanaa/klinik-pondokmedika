import React from 'react';
import {
  MdLocalHospital, MdOutlineHealthAndSafety, MdChildCare, MdScience, MdLocalPharmacy, MdEmergency,
  MdMedicalServices, MdAir, MdHomeWork, MdVaccines, MdMonitorHeart, MdVisibility,
} from 'react-icons/md';

// Pilihan ikon layanan di CMS. Kunci harus sama dengan Service::ICONS di backend.
// eslint-disable-next-line react-refresh/only-export-components
export const SERVICE_ICONS = {
  umum: { label: 'Pemeriksaan umum', Icon: MdLocalHospital },
  gigi: { label: 'Gigi & mulut', Icon: MdOutlineHealthAndSafety },
  'ibu-anak': { label: 'Ibu & anak', Icon: MdChildCare },
  lab: { label: 'Laboratorium', Icon: MdScience },
  apotek: { label: 'Apotek', Icon: MdLocalPharmacy },
  darurat: { label: 'Gawat darurat', Icon: MdEmergency },
  bedah: { label: 'Tindakan / bedah minor', Icon: MdMedicalServices },
  nebulizer: { label: 'Pernapasan / nebulizer', Icon: MdAir },
  'home-visit': { label: 'Kunjungan rumah', Icon: MdHomeWork },
  vaksin: { label: 'Vaksinasi', Icon: MdVaccines },
  jantung: { label: 'Jantung / EKG', Icon: MdMonitorHeart },
  mata: { label: 'Mata', Icon: MdVisibility },
};

const ServiceIcon = ({ name, className = 'text-4xl' }) => {
  const { Icon } = SERVICE_ICONS[name] || SERVICE_ICONS.umum;
  return <Icon className={className} aria-hidden="true" />;
};

export default ServiceIcon;
