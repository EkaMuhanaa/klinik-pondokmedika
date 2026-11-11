import React, { useState } from 'react';

const DoctorCard = ({ doctor }) => {
  const [showSchedule, setShowSchedule] = useState(false);

  // Dapatkan hari ini dalam zona waktu WIB
  const now = new Date();
  const options = { timeZone: 'Asia/Jakarta', weekday: 'long' };
  const currentDayWIB = new Intl.DateTimeFormat('id-ID', options).format(now).toLowerCase();

  const isDoctorActiveNow = doctor.status === "Aktif Praktik" || doctor.status === "Sedang Istirahat";

  return (
    <div className="flex flex-col md:flex-row bg-white rounded-xl overflow-hidden border border-outline-variant/40">
      <div className="w-full md:w-1/2 aspect-[4/5] overflow-hidden">
        <img
          alt={doctor.photoPending ? '' : `Foto ${doctor.name}`}
          width="400"
          height="500"
          loading="lazy"
          className="w-full h-full object-cover"
          src={doctor.image}
        />
        {doctor.photoPending && (
          <p className="-mt-10 relative text-center text-sm font-medium text-on-surface-variant">Foto segera diperbarui</p>
        )}
      </div>
      <div className="p-8 flex flex-col justify-between w-full md:w-1/2">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            {doctor.specialty ? (
              <span className="bg-primary/10 text-primary font-label-sm px-3 py-1 rounded-md">{doctor.specialty}</span>
            ) : <span />}
            <div className="flex items-center gap-2">
              <span aria-hidden="true" className={`w-3 h-3 rounded-full ${doctor.status === 'Aktif Praktik' ? 'bg-[#22C55E]' : doctor.status === 'Sedang Istirahat' ? 'bg-[#F59E0B]' : 'bg-gray-400'}`}></span>
              <span className={`font-label-sm text-label-sm ${doctor.status === 'Aktif Praktik' ? 'text-secondary' : doctor.status === 'Sedang Istirahat' ? 'text-[#92400e]' : 'text-text-muted'}`}>
                {doctor.status}
              </span>
            </div>
          </div>
          <h3 className="font-headline-md text-headline-md text-on-surface">{doctor.name}</h3>
          <p className="font-body-md text-body-md text-text-muted">{doctor.description}</p>
          
          {/* Expanded Schedule Details */}
          {showSchedule && doctor.scheduleDetails?.length > 0 && (
            <div className="mt-4 p-4 bg-surface-container-low rounded-xl border border-outline-variant/30">
              <p className="font-label-md text-on-surface mb-3 border-b border-outline-variant/30 pb-2">Jadwal Praktik</p>
              <ul className="space-y-2">
                {doctor.scheduleDetails.map((sched, idx) => {
                  const isToday = sched.day.toLowerCase() === currentDayWIB;
                  const isHighlighted = isToday && isDoctorActiveNow;

                  return (
                    <li key={idx} className={`flex justify-between items-center text-sm font-body-sm px-3 py-2 rounded-lg transition-colors ${
                      isHighlighted ? 'bg-primary/10 border border-primary/20 text-primary font-bold' : 'text-on-surface-variant'
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
        
        {doctor.scheduleDetails?.length > 0 ? (
        <div className="mt-8">
          <button
            type="button"
            onClick={() => setShowSchedule(!showSchedule)}
            aria-expanded={showSchedule}
            className="w-full bg-surface-container hover:bg-primary/10 active:bg-primary/20 text-on-surface font-label-md py-3 min-h-[44px] rounded-lg transition-colors"
          >
            {showSchedule ? 'Tutup jadwal' : `Jadwal praktik ${doctor.name}`}
          </button>
        </div>
        ) : (
          <p className="mt-8 text-sm text-on-surface-variant">Jadwal praktik belum tersedia.</p>
        )}
      </div>
    </div>
  );
};

export default DoctorCard;
