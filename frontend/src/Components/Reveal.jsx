import React from 'react';
import { motion, useReducedMotion } from 'motion/react';

/**
 * Animasi muncul sederhana: naik 16px sambil memudar, sekali saja saat masuk layar.
 * Tidak dipakai di hero (konten utama harus langsung tampil).
 * Jika perangkat memakai "kurangi gerakan", konten tampil langsung tanpa animasi.
 */
const Reveal = ({ children, delay = 0, className = '', as = 'div', ...rest }) => {
  const reduced = useReducedMotion();
  const Tag = motion[as] || motion.div;

  if (reduced) {
    const Plain = as;
    return <Plain className={className} {...rest}>{children}</Plain>;
  }

  return (
    <Tag
      {...rest}
      className={className}
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </Tag>
  );
};

export default Reveal;
