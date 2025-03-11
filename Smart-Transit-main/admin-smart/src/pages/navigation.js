import React from 'react';
import { Link } from 'react-router-dom';

const NavigationBar = () => {
  return (
    <nav className="bg-green-500 text-white py-4 px-8 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-bold">
          <Link to="/" className="hover:text-green-200">Bus Management</Link>
        </h1>
        <ul className="flex space-x-6">
          <li>
            <Link to="/" className="hover:text-green-200">Add Bus</Link>
          </li>
          <li>
            <Link to="/view" className="hover:text-green-200">View Buses</Link>
          </li>
          <li>
            <Link to="/complaints" className="hover:text-green-200">View Complaints</Link>
          </li>
          <li>
            <Link to="/add-bus-stop" className="hover:text-green-200">Add Bus Stop</Link>
          </li>
          <li>
            <Link to="/view-bus-stops" className="hover:text-green-200">View Bus Stops</Link>
          </li>

        </ul>
      </div>
    </nav>
  );
};

export default NavigationBar;
