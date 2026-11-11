export const doctorsData = [
  {
    name: "dr. ARYA PRATAMA",
    specialty: "Dokter Umum",
    specialtyBg: "bg-secondary/10",
    specialtyColor: "text-secondary",
    description: "Ahli dalam penanganan pasien dewasa dan manajemen penyakit kronis dengan pendekatan komprehensif.",
    image: "/images/dr-arya.jpg",
    scheduleDetails: [
      { day: "Senin", time: "13.00 - 21.00" },
      { day: "Selasa", time: "13.00 - 21.00" },
      { day: "Sabtu", time: "13.00 - 21.00" }
    ]
  },
  {
    name: "dr. HARFIYANI",
    specialty: "Dokter Anak",
    specialtyBg: "bg-primary/10",
    specialtyColor: "text-primary",
    description: "Ramah dan berpengalaman dalam menangani pertumbuhan serta kesehatan balita dan anak-anak.",
    image: "/images/placeholder-dokter.svg", // TODO: ganti dengan foto asli dokter,
    scheduleDetails: [
      { day: "Rabu", time: "13.00 - 21.00" },
      { day: "Kamis", time: "13.00 - 21.00" },
      { day: "Jumat", time: "13.00 - 21.00" }
    ]
  }
];

export const calculateStatus = (scheduleDetails) => {
  const now = new Date();
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
