import React, { useEffect, useState } from 'react';
import { collection, getDocs, updateDoc, doc } from 'firebase/firestore';
import { db } from './firebase';

const ViewComplaintsPage = () => {
  const [complaints, setComplaints] = useState([]);

  // Fetch complaints from Firestore
  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'complaint'));
        const complaintsList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        // Sort complaints by timestamp (latest first)
        complaintsList.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        setComplaints(complaintsList);
      } catch (error) {
        console.error('Error fetching complaints:', error);
      }
    };

    fetchComplaints();
  }, []);

  // Handle resolve action
  const handleResolve = async (id) => {
    try {
      const complaintRef = doc(db, 'complaint', id);
      await updateDoc(complaintRef, { status: 'resolved' });

      setComplaints((prevComplaints) => {
        const updatedComplaints = prevComplaints.map((complaint) =>
          complaint.id === id ? { ...complaint, status: 'resolved' } : complaint
        );

        // Sort complaints: unresolved first, then resolved
        return updatedComplaints.sort((a, b) => {
          if (a.status === 'resolved' && b.status !== 'resolved') return 1;
          if (a.status !== 'resolved' && b.status === 'resolved') return -1;
          return new Date(b.timestamp) - new Date(a.timestamp);
        });
      });

      alert('Complaint resolved successfully');
    } catch (error) {
      console.error('Error resolving complaint:', error);
      alert('Failed to resolve complaint');
    }
  };

  return (
    <div className="flex">
      <div className="flex-1 p-8 bg-gray-50 min-h-screen">
        <h2 className="text-3xl font-bold text-gray-800 mb-8">View Complaints</h2>
        <div className="bg-white p-6 rounded-lg shadow-md">
          {complaints.length === 0 ? (
            <p className="text-gray-700">No complaints available</p>
          ) : (
            <table className="w-full table-auto border-collapse border border-gray-300">
              <thead>
                <tr>
                  <th className="border border-gray-300 px-4 py-2">Name</th>
                  <th className="border border-gray-300 px-4 py-2">Mobile</th>
                  <th className="border border-gray-300 px-4 py-2">Vehicle Number</th>
                  <th className="border border-gray-300 px-4 py-2">Complaint</th>
                  <th className="border border-gray-300 px-4 py-2">Timestamp</th>
                  <th className="border border-gray-300 px-4 py-2">Status</th>
                  <th className="border border-gray-300 px-4 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {complaints.map((complaint) => (
                  <tr key={complaint.id}>
                    <td className="border border-gray-300 px-4 py-2">{complaint.name}</td>
                    <td className="border border-gray-300 px-4 py-2">{complaint.mobile}</td>
                    <td className="border border-gray-300 px-4 py-2">{complaint.vehicleNumber}</td>
                    <td className="border border-gray-300 px-4 py-2">{complaint.complaintText}</td>
                    <td className="border border-gray-300 px-4 py-2">
                      {new Date(complaint.timestamp).toLocaleString()}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {complaint.status || 'unresolved'}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {complaint.status !== 'resolved' && (
                        <button
                          onClick={() => handleResolve(complaint.id)}
                          className="bg-green-500 text-white py-1 px-3 rounded-lg"
                        >
                          Resolve
                        </button>
                      )}
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

export default ViewComplaintsPage;
