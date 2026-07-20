import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { MdDomain } from 'react-icons/md';

const FacilitiesSection = () => {
  const [facilities, setFacilities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFacilities = async () => {
      try {
        const response = await axios.get('/facilities');
        setFacilities(response.data);
      } catch (error) {
        console.error('Error fetching facilities:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFacilities();
  }, []);

  useEffect(() => {
    if (!loading) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('opacity-100', 'translate-y-0');
            entry.target.classList.remove('opacity-0', 'translate-y-8');
          }
        });
      }, { threshold: 0.1 });

      const elements = document.querySelectorAll('.facilities-animate-on-scroll');
      elements.forEach(el => observer.observe(el));
      
      return () => observer.disconnect();
    }
  }, [loading, facilities]);

  return (
    <section className="py-20 bg-surface">
      <div className="container mx-auto px-4 md:px-8 max-w-7xl">
        <div className="text-center mb-16 facilities-animate-on-scroll opacity-0 translate-y-8 transition-all duration-700">
          <h2 className="text-3xl md:text-5xl font-headline-md font-bold text-on-surface mb-6">Fasilitas Kami</h2>
          <div className="w-24 h-1.5 bg-primary mx-auto rounded-full mb-6"></div>
          <p className="text-on-surface-variant max-w-2xl mx-auto text-lg">
            Klinik Pondok Medika dilengkapi dengan berbagai fasilitas modern dan memadai untuk memastikan kenyamanan dan kualitas pelayanan terbaik bagi pasien.
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : facilities.length === 0 ? (
          <div className="bg-surface-container rounded-3xl p-12 text-center border border-outline-variant/30 shadow-sm max-w-3xl mx-auto facilities-animate-on-scroll opacity-0 translate-y-8 transition-all duration-700 delay-100">
            <MdDomain className="text-6xl text-on-surface-variant/40 mx-auto mb-4" />
            <p className="text-on-surface-variant text-lg">
              Mohon maaf, informasi fasilitas saat ini belum dapat ditampilkan. Silakan periksa kembali beberapa saat lagi.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {facilities.map((facility, index) => (
              <div 
                key={facility.id} 
                className={`bg-surface rounded-3xl overflow-hidden outline outline-1 outline-outline-variant/30 hover:outline-primary/50 transition-all duration-500 group facilities-animate-on-scroll opacity-0 translate-y-8`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div className="aspect-video bg-surface-container overflow-hidden relative">
                  {facility.image_path ? (
                    <img 
                      src={import.meta.env.VITE_API_BASE_URL + facility.image_path} 
                      alt={facility.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-on-surface-variant/30">
                      <MdDomain className="text-6xl" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                </div>
                <div className="p-6 relative bg-surface">
                  <h3 className="font-bold text-xl text-on-surface mb-3 group-hover:text-primary transition-colors">{facility.title}</h3>
                  {facility.description && (
                    <p className="text-on-surface-variant line-clamp-3 leading-relaxed">
                      {facility.description}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default FacilitiesSection;
