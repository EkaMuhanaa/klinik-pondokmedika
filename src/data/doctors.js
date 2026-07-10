export const doctorsData = [
  {
    name: "dr. ARYA PRATAMA",
    specialty: "Dokter Umum",
    specialtyBg: "bg-secondary/10",
    specialtyColor: "text-secondary",
    description: "Ahli dalam penanganan pasien dewasa dan manajemen penyakit kronis dengan pendekatan komprehensif.",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDWAeE6UbH7eEfo37iRiwwiPFhsw13GCE7YJjsKr9ix_XwD8mduLGnsVRLqTaxrJM7hW1oXg8h6_SRjV9GOHl7QnaF608xNWsUw7MKEqjriW-chQ72M-Lo8BaIhaYL7nVFcO4WdzKSH0HEP1t4ikUVDfS8-Kqje_LUx-rXBir9uGSq-z8MymWDhEIfggLjb4htvEcyxSeJ4mX46fR6OFtWSEFHLtVkWIN3qdj5D9Yaq7yVf1r5VSgZCvELH7zv91W5Hhw",
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
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCAh3TwvRg22wh3h_Y4ABYJbAEU4w8w1--chhfaQzBPUE99gs7Ot9ME75NqFPZdfQUUa2wo5Ma5juY3eLIl0KIWu5T2e8brUUCJWYO_UaBsPSv7oDhHTNwZ3SYJ_TpWnRebyLLWXm58tyE2XspqT6QlJJ2TrKurKJ7vnzqC1vt7-bnL1JrtMVJX-zOseehB3Pa7mt2nIDQ1nyZqv6L0pYRnL8Le7eumV2c930TT1fT7-3VDM5izIdnNMJwlcnpEoVQJDA",
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
