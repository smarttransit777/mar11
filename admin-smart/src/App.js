import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import NavigationBar from './pages/navigation';
import AddBusPage from './pages/addBus';
import ViewBusPage from './pages/viewBus';
import ViewComplaintsPage from './pages/viewComplaints';
import AddBusStop from './pages/addBusStop';
import ViewBusStops from './pages/viewBusStop';
import LoginPage from './pages/LoginPage';
;

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Track login state

  return (
    <Router>
      <NavigationBar />

      <Routes>
        {/* If not logged in, redirect to login page */}
        <Route
          path="/"
          element={isLoggedIn ? <AddBusPage /> : <Navigate to="/login" />}
        />
        <Route
          path="/view"
          element={isLoggedIn ? <ViewBusPage /> : <Navigate to="/login" />}
        />
        <Route
          path="/complaints"
          element={isLoggedIn ? <ViewComplaintsPage /> : <Navigate to="/login" />}
        />
        <Route
          path="/add-bus-stop"
          element={isLoggedIn ? <AddBusStop /> : <Navigate to="/login" />}
        />
        <Route
          path="/view-bus-stops"
          element={isLoggedIn ? <ViewBusStops /> : <Navigate to="/login" />}
        />
        <Route
          path="/login"
          element={<LoginPage setIsLoggedIn={setIsLoggedIn} />}
        />
      </Routes>
    </Router>
  );
};

export default App;
