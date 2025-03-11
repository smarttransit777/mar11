import React, { useState } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from './firebase';

const AddBusStop = () => {
  const [busStop, setBusStop] = useState({
    name: '',
    city: '',
    district: '',
    latitude: '',
    longitude: '',
  });

  const handleInputChange = (field, value) => {
    setBusStop((prev) => ({ ...prev, [field]: value }));
  };

  const handleAddBusStop = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, 'busStops'), busStop);
      alert('Bus stop added successfully');
      setBusStop({
        name: '',
        city: '',
        district: '',
        latitude: '',
        longitude: '',
      });
    } catch (error) {
      console.error('Error adding bus stop:', error);
      alert('Failed to add bus stop');
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-lg">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Add Bus Stop</h2>
        <form onSubmit={handleAddBusStop} className="space-y-4">
          <input
            type="text"
            value={busStop.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            placeholder="Bus Stop Name"
            className="w-full p-3 border border-gray-300 rounded-lg"
            required
          />
          <input
            type="text"
            value={busStop.city}
            onChange={(e) => handleInputChange('city', e.target.value)}
            placeholder="City Name"
            className="w-full p-3 border border-gray-300 rounded-lg"
            required
          />
          <input
            type="text"
            value={busStop.district}
            onChange={(e) => handleInputChange('district', e.target.value)}
            placeholder="District"
            className="w-full p-3 border border-gray-300 rounded-lg"
            required
          />
          <input
            type="text"
            value={busStop.latitude}
            onChange={(e) => handleInputChange('latitude', e.target.value)}
            placeholder="Latitude"
            className="w-full p-3 border border-gray-300 rounded-lg"
            required
          />
          <input
            type="text"
            value={busStop.longitude}
            onChange={(e) => handleInputChange('longitude', e.target.value)}
            placeholder="Longitude"
            className="w-full p-3 border border-gray-300 rounded-lg"
            required
          />
          <button
            type="submit"
            className="bg-green-500 text-white py-2 px-4 rounded-lg w-full"
          >
            Add Bus Stop
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddBusStop;
