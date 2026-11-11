import React, { useState, useEffect } from 'react';

const HeroSliderBackground = ({ images, overlayClassName = "" }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    if (images.length < 2) return undefined;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % images.length);
    }, 3000);
    return () => clearInterval(timer);
  }, [images.length]);

  return (
    <div className="absolute inset-0 z-0 overflow-hidden bg-gradient-to-br from-primary via-primary-container to-secondary">
      {images.map((img, idx) => (
        <div
          key={idx}
          className={`absolute inset-0 w-full h-full bg-cover bg-center transition-opacity duration-1000 ease-in-out ${
            idx === currentSlide ? 'opacity-100' : 'opacity-0'
          }`}
          style={{ backgroundImage: `url('${img}')` }}
        ></div>
      ))}
      <div className={`absolute inset-0 ${overlayClassName}`}></div>
    </div>
  );
};

export default HeroSliderBackground;
