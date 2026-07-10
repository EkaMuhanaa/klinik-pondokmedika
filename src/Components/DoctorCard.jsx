import React, { useState } from 'react';

const DoctorCard = ({ doctor }) => {
  const [showSchedule, setShowSchedule] = useState(false);

  // Dapatkan hari ini dalam zona waktu WIB
  const now = new Date();
  const options = { timeZone: 'Asia/Jakarta', weekday: 'long' };
  const currentDayWIB = new Intl.DateTimeFormat('id-ID', options).format(now).toLowerCase();

  const isDoctorActiveNow = doctor.status === "Aktif Praktik" || doctor.status === "Sedang Istirahat";

  return (
    <div className="doctor-card group flex flex-col md:flex-row bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300">
      <div className="w-full md:w-1/2 aspect-[4/5] overflow-hidden">
        <img 
          alt={doctor.name} 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
          src={doctor.image} 
        />
      </div>
      <div className="p-8 flex flex-col justify-between w-full md:w-1/2">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className={`${doctor.specialtyBg} ${doctor.specialtyColor} font-label-sm px-3 py-1 rounded-full`}>
              {doctor.specialty}
            </span>
            <div className="flex items-center gap-2">
              <span className={`w-3 h-3 rounded-full ${doctor.status === 'Aktif Praktik' ? 'bg-[#22C55E] animate-pulse' : doctor.status === 'Sedang Istirahat' ? 'bg-[#F59E0B]' : 'bg-gray-400'}`}></span>
              <span className={`font-label-sm text-label-sm ${doctor.status === 'Aktif Praktik' ? 'text-[#22C55E]' : doctor.status === 'Sedang Istirahat' ? 'text-[#F59E0B]' : 'text-gray-500'}`}>
                {doctor.status}
              </span>
            </div>
          </div>
          <h3 className="font-headline-lg text-headline-lg text-on-surface">{doctor.name}</h3>
          <p className="font-body-md text-body-md text-text-muted">{doctor.description}</p>
          
          {/* Expanded Schedule Details */}
          {showSchedule && doctor.scheduleDetails && (
            <div className="mt-4 p-4 bg-surface-container-low rounded-xl border border-outline-variant/30 animate-fade-in-up">
              <p className="font-label-md text-on-surface mb-3 border-b border-outline-variant/30 pb-2">Jadwal Praktik</p>
              <ul className="space-y-2">
                {doctor.scheduleDetails.map((sched, idx) => {
                  const isToday = sched.day.toLowerCase() === currentDayWIB;
                  const isHighlighted = isToday && isDoctorActiveNow;

                  return (
                    <li key={idx} className={`flex justify-between items-center text-sm font-body-sm px-3 py-2 rounded-lg transition-colors ${
                      isHighlighted ? 'bg-primary/10 border border-primary/20 text-primary font-bold shadow-sm' : 'text-on-surface-variant'
                    }`}>
                      <span>{sched.day}</span>
                      <span className={isHighlighted ? '' : 'font-medium text-primary'}>{sched.time}</span>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
        </div>
        
        <div className="mt-8">
          <button 
            onClick={() => setShowSchedule(!showSchedule)}
            className="w-full bg-surface-container hover:bg-primary-container/20 text-on-surface font-label-md py-4 rounded-xl transition-colors"
          >
            {showSchedule ? 'Tutup Jadwal' : 'Lihat Jadwal Praktik'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DoctorCard;
