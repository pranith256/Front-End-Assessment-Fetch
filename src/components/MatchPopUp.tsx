import { useEffect, useState } from "react";
import { getMatch, getDogsByIds } from "../api/dogs";
import { Dog } from "../types/common.types";

interface MatchPopupProps {
  favorites: string[];
  setShowMatchPopup: (show: boolean) => void;
}


const MatchPopup: React.FC<MatchPopupProps> = ({ favorites, setShowMatchPopup }) => {
  const [matchedDog, setMatchedDog] = useState<Dog>();

  useEffect(() => {
    const fetchMatch = async () => {
      if (favorites.length === 0) return;
      const matchedDogId = await getMatch(favorites);
      if (matchedDogId) {
        const dogDetails = await getDogsByIds([matchedDogId]);
        setMatchedDog(dogDetails[0]);
      }
    };

    fetchMatch();
  }, [favorites]);

  return (
    <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-80 relative">
        <button 
          className="absolute top-2 right-3 text-lg font-bold text-gray-700"
          onClick={() => setShowMatchPopup(false)}
        >
          ✖
        </button>

        <h2 className="text-xl font-bold">Your Matched Dog</h2>

        {!matchedDog ? (
          <p className="text-gray-500 mt-2">Finding your perfect match...</p>
        ) : (
          <div className="text-center mt-4">
            <img src={matchedDog.img} alt={matchedDog.name} className="w-full h-40 object-cover rounded" />
            <h3 className="text-lg font-bold mt-2">{matchedDog.name}</h3>
            <p><strong>Breed:</strong> {matchedDog.breed}</p>
            <p><strong>Age:</strong> {matchedDog.age} years</p>
            <p><strong>Location:</strong> {matchedDog.zip_code}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MatchPopup;
