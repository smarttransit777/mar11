import React, { useState } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from './firebase';

const AddBusPage = () => {
  const [busName, setBusName] = useState('');
  const [busNumber, setBusNumber] = useState('');
  const [staffName, setStaffName] = useState('');
  const [departureTime, setDepartureTime] = useState('');
  const [route, setRoute] = useState('');
  const [startingPoint, setStartingPoint] = useState('');
  const [endingPoint, setEndingPoint] = useState('');
  const [majorCities, setMajorCities] = useState('');

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Convert major cities into an array
    const majorCitiesArray = majorCities.split('\n').map((city) => city.trim()).filter(Boolean);

    const busData = {
      bus_name: busName,
      bus_number: busNumber,
      staff_name: staffName,
      departure_time: departureTime,
      route: route,
      starting_point: startingPoint,
      ending_point: endingPoint,
      major_cities: majorCitiesArray,
      current_location: {
        latitude: 0, // Default latitude
        longitude: 0, // Default longitude
      },
      bus_status: 'running', // Default bus status
      occupancy: '', // Default occupancy (empty)
    };

    try {
      // Add bus data to Firestore
      await addDoc(collection(db, 'buses'), busData);

      alert('Bus added successfully');
      setBusName('');
      setBusNumber('');
      setStaffName('');
      setDepartureTime('');
      setRoute('');
      setStartingPoint('');
      setEndingPoint('');
      setMajorCities('');
    } catch (error) {
      console.error('Error adding bus:', error);
      alert('Failed to add bus');
    }
  };

  return (
    <div className="flex">
      {/* Main Content */}
      <div className="flex-1 p-8 bg-gray-50 min-h-screen">
        <h2 className="text-3xl font-bold text-gray-800 mb-8">Add Bus</h2>
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-700 font-semibold">Bus Name</label>
              <input
                type="text"
                value={busName}
                onChange={(e) => setBusName(e.target.value)}
                className="w-full mt-2 p-3 border border-gray-300 rounded-lg focus:ring focus:ring-green-200"
                placeholder="Enter bus name"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 font-semibold">Bus Number</label>
              <input
                type="text"
                value={busNumber}
                onChange={(e) => setBusNumber(e.target.value)}
                className="w-full mt-2 p-3 border border-gray-300 rounded-lg focus:ring focus:ring-green-200"
                placeholder="Enter bus number"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 font-semibold">Staff Name</label>
              <input
                type="text"
                value={staffName}
                onChange={(e) => setStaffName(e.target.value)}
                className="w-full mt-2 p-3 border border-gray-300 rounded-lg focus:ring focus:ring-green-200"
                placeholder="Enter staff name"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 font-semibold">Time of Departure</label>
              <input
                type="time"
                value={departureTime}
                onChange={(e) => setDepartureTime(e.target.value)}
                className="w-full mt-2 p-3 border border-gray-300 rounded-lg focus:ring focus:ring-green-200"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 font-semibold">Route</label>
              <input
                type="text"
                value={route}
                onChange={(e) => setRoute(e.target.value)}
                className="w-full mt-2 p-3 border border-gray-300 rounded-lg focus:ring focus:ring-green-200"
                placeholder="Enter route (e.g., 'Highway 7')"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 font-semibold">Starting Point</label>
              <input
                type="text"
                value={startingPoint}
                onChange={(e) => setStartingPoint(e.target.value)}
                className="w-full mt-2 p-3 border border-gray-300 rounded-lg focus:ring focus:ring-green-200"
                placeholder="Enter starting point"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 font-semibold">Ending Point</label>
              <input
                type="text"
                value={endingPoint}
                onChange={(e) => setEndingPoint(e.target.value)}
                className="w-full mt-2 p-3 border border-gray-300 rounded-lg focus:ring focus:ring-green-200"
                placeholder="Enter ending point"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 font-semibold">Major Cities Covered</label>
              <textarea
                value={majorCities}
                onChange={(e) => setMajorCities(e.target.value)}
                className="w-full mt-2 p-3 border border-gray-300 rounded-lg focus:ring focus:ring-green-200"
                placeholder="Enter major cities (one per line)"
                rows="4"
              ></textarea>
              <small className="text-gray-500">Separate cities with new lines (e.g., "City 1", "City 2")</small>
            </div>
          </div>
          <button
            type="submit"
            className="w-full mt-6 bg-green-500 hover:bg-green-600 text-white font-bold py-3 rounded-lg transition"
          >
            Add Bus
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddBusPage;
