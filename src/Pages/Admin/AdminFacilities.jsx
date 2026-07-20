import React, { useState, useEffect } from 'react';
import { MdAdd, MdEdit, MdDelete, MdDomain } from 'react-icons/md';
import { Link } from 'react-router-dom';
import axios from 'axios';

const AdminFacilities = () => {
  const [facilities, setFacilities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFacilities();
  }, []);

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

  const handleDelete = async (id) => {
    if (window.confirm('Yakin ingin menghapus fasilitas ini?')) {
      try {
        await axios.delete(`/admin/facilities/${id}`);
        fetchFacilities();
      } catch (error) {
        console.error('Error deleting facility:', error);
        alert('Gagal menghapus fasilitas');
      }
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-on-surface-variant font-bold animate-pulse">Memuat data fasilitas...</div>;
  }

  return (
    <div className='animate-in fade-in slide-in-from-bottom-4 duration-500'>
      <div className='flex justify-between items-center mb-8'>
        <div>
          <h1 className='text-3xl font-headline-md font-bold text-on-surface'>Kelola Fasilitas</h1>
          <p className='text-on-surface-variant mt-2'>Kelola fasilitas klinik yang ditampilkan di Beranda.</p>
        </div>
        <Link 
          to='/admin/facilities/new'
          className='bg-primary text-on-primary px-6 py-3 rounded-full font-bold hover:scale-105 transition-transform flex items-center gap-2 shadow-md'
        >
          <MdAdd className='text-xl' /> Tambah Fasilitas
        </Link>
      </div>

      {facilities.length === 0 ? (
        <div className='bg-surface rounded-3xl p-12 text-center border border-outline-variant/30 shadow-sm'>
          <MdDomain className='text-6xl text-on-surface-variant/30 mx-auto mb-4' />
          <h3 className='text-xl font-bold text-on-surface mb-2'>Belum Ada Fasilitas</h3>
          <p className='text-on-surface-variant mb-6'>Anda belum menambahkan fasilitas apapun.</p>
          <Link 
            to='/admin/facilities/new'
            className='text-primary font-bold hover:underline inline-flex items-center gap-2'
          >
            <MdAdd /> Tambah Fasilitas Pertama
          </Link>
        </div>
      ) : (
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
          {facilities.map((facility) => (
            <div key={facility.id} className='bg-surface rounded-3xl overflow-hidden border border-outline-variant/30 shadow-sm group hover:shadow-md transition-shadow'>
              <div className='aspect-video bg-surface-container overflow-hidden relative'>
                {facility.image_path ? (
                  <img 
                    src={import.meta.env.VITE_API_BASE_URL + facility.image_path} 
                    alt={facility.title}
                    className='w-full h-full object-cover group-hover:scale-105 transition-transform duration-500'
                  />
                ) : (
                  <div className='w-full h-full flex items-center justify-center text-on-surface-variant/30'>
                    <MdDomain className='text-5xl' />
                  </div>
                )}
              </div>
              <div className='p-5'>
                <h3 className='font-bold text-lg text-on-surface mb-2'>{facility.title}</h3>
                <p className='text-on-surface-variant text-sm line-clamp-2 mb-4'>{facility.description}</p>
                <div className='flex justify-end gap-2'>
                  <Link 
                    to={`/admin/facilities/edit/${facility.id}`}
                    className='p-2 text-primary hover:bg-primary/10 rounded-full transition-colors'
                  >
                    <MdEdit className='text-xl' />
                  </Link>
                  <button 
                    onClick={() => handleDelete(facility.id)}
                    className='p-2 text-error hover:bg-error/10 rounded-full transition-colors'
                  >
                    <MdDelete className='text-xl' />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminFacilities;
