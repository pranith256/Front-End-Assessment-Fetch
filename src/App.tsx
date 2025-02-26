import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/Login";
import DogSearch from "./components/DogSearch";
import FavoritesDropdown from "./components/FavoritesDropdown";
import MatchPopup from "./components/MatchPopUp";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [showMatchPopup, setShowMatchPopup] = useState(false);

  useEffect(() => {
    const token = document.cookie.includes("fetch-access-token");
    setIsAuthenticated(token);
  }, []);

  return (
    <Router>
      <div className="relative">
        {isAuthenticated && (
          <FavoritesDropdown favorites={favorites} setFavorites={setFavorites} setShowMatchPopup={setShowMatchPopup} />
        )}

        <Routes>
          <Route path="/" element={!isAuthenticated ? <Login setIsAuthenticated={setIsAuthenticated} /> : <Navigate to="/search" />} />
          <Route 
                path="/search" 
                element={
                  isAuthenticated ? 
                  <DogSearch 
                    favorites={favorites} 
                    setFavorites={setFavorites} 
                    setIsAuthenticated={setIsAuthenticated} 
                  /> 
                  : <Navigate to="/" />
                } 
              />


        </Routes>
        {isAuthenticated && showMatchPopup && <MatchPopup favorites={favorites} setShowMatchPopup={setShowMatchPopup} />}
      </div>
    </Router>
  );
}

export default App;
