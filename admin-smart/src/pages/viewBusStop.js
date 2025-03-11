import React, { useEffect, useState } from 'react';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from './firebase';

const ViewBusStops = () => {
  const [busStops, setBusStops] = useState([]);

  useEffect(() => {
    const fetchBusStops = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'busStops'));
        const stopsList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setBusStops(stopsList);
      } catch (error) {
        console.error('Error fetching bus stops:', error);
      }
    };

    fetchBusStops();
  }, []);

  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, 'busStops', id));
      setBusStops(busStops.filter((stop) => stop.id !== id));
      alert('Bus stop deleted successfully');
    } catch (error) {
      console.error('Error deleting bus stop:', error);
      alert('Failed to delete bus stop');
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-4xl">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">View Bus Stops</h2>
        {busStops.length === 0 ? (
          <p className="text-gray-700">No bus stops available</p>
        ) : (
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr>
                <th className="border border-gray-300 px-4 py-2">Bus Stop Name</th>
                <th className="border border-gray-300 px-4 py-2">City</th>
                <th className="border border-gray-300 px-4 py-2">District</th>
                <th className="border border-gray-300 px-4 py-2">Latitude</th>
                <th className="border border-gray-300 px-4 py-2">Longitude</th>
                <th className="border border-gray-300 px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {busStops.map((stop) => (
                <tr key={stop.id}>
                  <td className="border border-gray-300 px-4 py-2">{stop.name}</td>
                  <td className="border border-gray-300 px-4 py-2">{stop.city}</td>
                  <td className="border border-gray-300 px-4 py-2">{stop.district}</td>
                  <td className="border border-gray-300 px-4 py-2">{stop.latitude}</td>
                  <td className="border border-gray-300 px-4 py-2">{stop.longitude}</td>
                  <td className="border border-gray-300 px-4 py-2 space-x-4">
                    <button
                      onClick={() => handleDelete(stop.id)}
                      className="bg-red-500 text-white py-1 px-3 rounded-lg"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default ViewBusStops;
