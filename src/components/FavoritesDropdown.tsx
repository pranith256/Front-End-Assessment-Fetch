import { useState, useEffect } from "react";
import { getDogsByIds } from "../api/dogs";
import { Dog } from "../types/common.types";


interface FavoritesDropdownProps {
  favorites: string[];
  setFavorites: (dogs: string[]) => void;
  setShowMatchPopup: (show: boolean) => void;
}

const FavoritesDropdown: React.FC<FavoritesDropdownProps> = ({ favorites, setFavorites, setShowMatchPopup }) => {
  const [favoriteDogs, setFavoriteDogs] = useState<Dog[]>([]);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const fetchFavoriteDogs = async () => {
      if (favorites.length === 0) {
        setFavoriteDogs([]);
        return;
      }
      const dogs = await getDogsByIds(favorites);
      setFavoriteDogs(dogs);
    };
    fetchFavoriteDogs();
  }, [favorites]);

  return (
    <div 
  className="absolute top-14 left-2/3 z-50"
  onMouseEnter={() => setIsHovered(true)}
  onMouseLeave={() => setIsHovered(false)}
>
  <div className="relative cursor-pointer flex items-center gap-2 p-2 bg-white shadow-md rounded-lg hover:bg-gray-100 transition">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      className="w-6 h-6 text-red-500"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 21l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.18L12 21z"
      />
    </svg>
    <span className="text-gray-700 font-medium">Favorites</span>

    {favorites.length > 0 && (
      <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
        {favorites.length}
      </span>
    )}
  </div>

  {isHovered && (
    <div className="absolute right-0 mt-2 w-72 bg-white shadow-lg rounded-lg p-4 border border-gray-200">
      <h3 className="text-lg font-bold text-gray-700 mb-2">Favorite Dogs</h3>
      
      {favoriteDogs.length === 0 ? (
        <p className="text-gray-500 text-sm">No favorites selected.</p>
      ) : (
        <ul className="max-h-40 overflow-y-auto">
          {favoriteDogs.map((dog) => (
            <li key={dog.id} className="flex justify-between items-center p-2 border-b last:border-none">
              <div className="flex items-center">
                <img src={dog.img} alt={dog.name} className="w-8 h-8 rounded-full object-cover mr-2" />
                <span className="text-sm text-gray-700">{dog.name}</span>
              </div>

              <button 
                className="text-red-500 text-xs hover:text-red-700 transition"
                onClick={() => setFavorites(favorites.filter(id => id !== dog.id))}
              >
                <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-4 h-4"
        >
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>

              </button>
            </li>
          ))}
        </ul>
      )}
      {favorites.length > 0 && (
        <button 
          className="mt-3 w-full bg-green-500 text-white py-2 rounded-md hover:bg-green-600 transition"
          onClick={() => setShowMatchPopup(true)}
        >
          Find Match
        </button>
      )}
    </div>
  )}
</div>

  );
};

export default FavoritesDropdown;
