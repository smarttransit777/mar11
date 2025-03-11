import React, { useEffect, useState } from 'react';
import { collection, getDocs, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from './firebase';

const ViewBusPage = () => {
  const [buses, setBuses] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [currentBus, setCurrentBus] = useState(null);

  // Fetch buses from Firestore
  useEffect(() => {
    const fetchBuses = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'buses'));
        const busesList = querySnapshot.docs.map((doc) => {
          const data = doc.data();
          // Ensure major_cities is always an array
          return {
            id: doc.id,
            ...data,
            major_cities: Array.isArray(data.major_cities) ? data.major_cities : []
          };
        });
        setBuses(busesList);
      } catch (error) {
        console.error('Error fetching buses:', error);
      }
    };

    fetchBuses();
  }, []);

  // Handle delete action
  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, 'buses', id));
      setBuses(buses.filter((bus) => bus.id !== id));
      alert('Bus deleted successfully');
    } catch (error) {
      console.error('Error deleting bus:', error);
      alert('Failed to delete bus');
    }
  };

  // Handle edit action
  const handleEdit = (bus) => {
    // Ensure major_cities is an array before editing
    const busToEdit = {
      ...bus,
      major_cities: Array.isArray(bus.major_cities) ? bus.major_cities : []
    };
    setEditMode(true);
    setCurrentBus(busToEdit);
  };

  // Handle update action
  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const busRef = doc(db, 'buses', currentBus.id);
      await updateDoc(busRef, currentBus);
      setBuses((prevBuses) =>
        prevBuses.map((bus) => (bus.id === currentBus.id ? currentBus : bus))
      );
      setEditMode(false);
      setCurrentBus(null);
      alert('Bus updated successfully');
    } catch (error) {
      console.error('Error updating bus:', error);
      alert('Failed to update bus');
    }
  };

  // Handle input changes
  const handleInputChange = (field, value) => {
    setCurrentBus({ ...currentBus, [field]: value });
  };

  return (
    <div className="flex">
      <div className="flex-1 p-8 bg-gray-50 min-h-screen">
        <h2 className="text-3xl font-bold text-gray-800 mb-8">View Buses</h2>
        <div className="bg-white p-6 rounded-lg shadow-md">
          {buses.length === 0 ? (
            <p className="text-gray-700">No buses available</p>
          ) : editMode ? (
            <form onSubmit={handleUpdate} className="space-y-4">
              <h3 className="text-2xl font-semibold">Edit Bus</h3>
              <input
                type="text"
                value={currentBus.bus_name || ''}
                onChange={(e) => handleInputChange('bus_name', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg"
                placeholder="Bus Name"
                required
              />
              <input
                type="text"
                value={currentBus.bus_number || ''}
                onChange={(e) => handleInputChange('bus_number', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg"
                placeholder="Bus Number"
                required
              />
              <input
                type="text"
                value={currentBus.staff_name || ''}
                onChange={(e) => handleInputChange('staff_name', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg"
                placeholder="Staff Name"
                required
              />
              <input
                type="time"
                value={currentBus.departure_time || ''}
                onChange={(e) => handleInputChange('departure_time', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg"
                required
              />
              <input
                type="text"
                value={currentBus.route || ''}
                onChange={(e) => handleInputChange('route', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg"
                placeholder="Route"
                required
              />
              <input
                type="text"
                value={currentBus.starting_point || ''}
                onChange={(e) => handleInputChange('starting_point', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg"
                placeholder="Starting Point"
                required
              />
              <input
                type="text"
                value={currentBus.ending_point || ''}
                onChange={(e) => handleInputChange('ending_point', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg"
                placeholder="Ending Point"
                required
              />
              <textarea
                value={Array.isArray(currentBus.major_cities) ? currentBus.major_cities.join('\n') : ''}
                onChange={(e) =>
                  handleInputChange(
                    'major_cities',
                    e.target.value.split('\n').map((city) => city.trim()).filter(city => city !== '')
                  )
                }
                className="w-full p-3 border border-gray-300 rounded-lg"
                placeholder="Major Cities (one per line)"
                rows="4"
                required
              ></textarea>
              <button
                type="submit"
                className="bg-green-500 text-white py-2 px-4 rounded-lg"
              >
                Update Bus
              </button>
              <button
                type="button"
                onClick={() => setEditMode(false)}
                className="bg-gray-500 text-white py-2 px-4 rounded-lg ml-4"
              >
                Cancel
              </button>
            </form>
          ) : (
            <table className="w-full table-auto border-collapse border border-gray-300">
              <thead>
                <tr>
                  <th className="border border-gray-300 px-4 py-2">Bus Name</th>
                  <th className="border border-gray-300 px-4 py-2">Bus Number</th>
                  <th className="border border-gray-300 px-4 py-2">Staff Name</th>
                  <th className="border border-gray-300 px-4 py-2">Departure Time</th>
                  <th className="border border-gray-300 px-4 py-2">Route</th>
                  <th className="border border-gray-300 px-4 py-2">Starting Point</th>
                  <th className="border border-gray-300 px-4 py-2">Ending Point</th>
                  <th className="border border-gray-300 px-4 py-2">Major Cities</th>
                  <th className="border border-gray-300 px-4 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {buses.map((bus) => (
                  <tr key={bus.id}>
                    <td className="border border-gray-300 px-4 py-2">{bus.bus_name || ''}</td>
                    <td className="border border-gray-300 px-4 py-2">{bus.bus_number || ''}</td>
                    <td className="border border-gray-300 px-4 py-2">{bus.staff_name || ''}</td>
                    <td className="border border-gray-300 px-4 py-2">{bus.departure_time || ''}</td>
                    <td className="border border-gray-300 px-4 py-2">{bus.route || ''}</td>
                    <td className="border border-gray-300 px-4 py-2">{bus.starting_point || ''}</td>
                    <td className="border border-gray-300 px-4 py-2">{bus.ending_point || ''}</td>
                    <td className="border border-gray-300 px-4 py-2">
                      {Array.isArray(bus.major_cities) ? bus.major_cities.join(', ') : ''}
                    </td>
                    <td className="border border-gray-300 px-4 py-2 space-x-4">
                      <button
                        onClick={() => handleEdit(bus)}
                        className="bg-blue-500 text-white py-1 px-3 rounded-lg"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(bus.id)}
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
    </div>
  );
};

export default ViewBusPage;