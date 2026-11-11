// Status praktik dokter dihitung dari jadwal (zona waktu WIB). Jadwal diatur di CMS → Kelola Dokter.
export const calculateStatus = (scheduleDetails, at = Date.now()) => {
  const now = new Date(at);
  const options = { timeZone: 'Asia/Jakarta', weekday: 'long', hour: '2-digit', minute: '2-digit', hour12: false };
  const formatter = new Intl.DateTimeFormat('id-ID', options);
  const parts = formatter.formatToParts(now);
  
  let currentDay = '';
  let currentHour = 0;
  let currentMinute = 0;
  
  parts.forEach(part => {
    if (part.type === 'weekday') currentDay = part.value;
    if (part.type === 'hour') currentHour = parseInt(part.value, 10);
    if (part.type === 'minute') currentMinute = parseInt(part.value, 10);
  });
  
  const currentTimeStr = `${currentHour.toString().padStart(2, '0')}:${currentMinute.toString().padStart(2, '0')}`;
  
  const todaySchedule = scheduleDetails.find(s => s.day.toLowerCase() === currentDay.toLowerCase());
  
  if (todaySchedule) {
    const times = todaySchedule.time.split('-').map(t => t.trim().replace('.', ':'));
    if (times.length === 2) {
      const startTime = times[0];
      const endTime = times[1];
      
      if (currentTimeStr >= startTime && currentTimeStr <= endTime) {
        if (currentTimeStr >= "18:00" && currentTimeStr < "19:00") {
          return "Sedang Istirahat";
        }
        return "Aktif Praktik";
      }
    }
  }
  return "Libur Praktik";
};
