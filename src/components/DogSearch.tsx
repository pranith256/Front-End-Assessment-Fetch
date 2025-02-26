import { useEffect, useState } from "react";
import { getBreeds, searchDogs, getDogsByIds } from "../api/dogs";
import ReactPaginate from "react-paginate";
import { Dog } from "../types/common.types";

interface DogSearchProps {
  favorites: string[];
  setFavorites: (dogs: string[]) => void;
  setIsAuthenticated: (auth: boolean) => void;
}

const DogSearch: React.FC<DogSearchProps> = ({ favorites, setFavorites, setIsAuthenticated }) => {
  const [dogs, setDogs] = useState<Dog[]>([]);
  const [breeds, setBreeds] = useState<string[]>([]);
  const [selectedBreed, setSelectedBreed] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [page, setPage] = useState(0);
  const [totalResults, setTotalResults] = useState(0);
  const pageSize = 10;
  const totalPages = Math.ceil(totalResults / pageSize);

  const BASE_URL = process.env.BASE_URL || "https://frontend-take-home-service.fetch.com";

  useEffect(() => {
    const fetchBreeds = async () => {
      const breedList = await getBreeds();
      setBreeds(breedList);
    };
    fetchBreeds();
  }, []);

  useEffect(() => {
    const fetchDogs = async () => {
      const searchResults = await searchDogs(
        selectedBreed,
        pageSize,
        page * pageSize,
        `breed:${sortOrder}`
      );

      if (searchResults.resultIds.length > 0) {
        const dogDetails = await getDogsByIds(searchResults.resultIds);
        setDogs(dogDetails);
        setTotalResults(searchResults.total);
      } else {
        setDogs([]);
      }
    };
    fetchDogs();
  }, [selectedBreed, page, sortOrder]);

  const handleLogout = async () => {
    try {
      await fetch(`${BASE_URL}/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
      setIsAuthenticated(false);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <div className="p-5 flex flex-col min-h-screen">
      
      <div className="flex items-center justify-between bg-white shadow-md p-4 mb-5">
        <h2 className="text-3xl font-bold text-blue-600">Dog Shop</h2>

        <div className="flex gap-6 items-center">
          <div className="relative w-72">
            <div className="flex items-center border rounded-md p-2 bg-white shadow-sm">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-5 h-5 text-gray-400 mr-2"
              >
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                type="text"
                placeholder="Search breed..."
                className="w-full focus:outline-none"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <select
              className="border p-2 w-full rounded-b-md focus:outline-none"
              onChange={(e) => setSelectedBreed(e.target.value)}
            >
              <option value="">All Breeds</option>
              {breeds
                .filter((breed) => breed.toLowerCase().includes(searchTerm.toLowerCase()))
                .map((breed) => (
                  <option key={breed} value={breed}>{breed}</option>
              ))}
            </select>
          </div>

          <button
            className="bg-gray-200 px-4 py-2 rounded-md flex items-center gap-2 hover:bg-gray-300 -ml-4"
            onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
          >
            Sort by Breed {sortOrder === "asc" ? "↑" : "↓"}
          </button>

          
          {/* <button
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition flex items-center gap-2"
            onClick={() => alert("Open Favorites List")}
          >
            {/* Heart Icon SVG */}
            {/* <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="w-5 h-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 21l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.18L12 21z"
              />
            </svg>
            Favorites ({favorites.length})
          </button> */} 
        </div>

        <button
          className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>


      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 flex-grow">
        {dogs.length === 0 ? (
          <p>No dogs found.</p>
        ) : (
          dogs.map((dog) => (
            <div key={dog.id} className="relative p-3 w-64 h-80 border rounded-lg shadow-lg flex flex-col items-center bg-white">

<span
  className={`absolute top-2 right-2 flex items-center px-2 py-1 rounded-full text-sm font-bold cursor-pointer ${
    favorites.includes(dog.id) ? "bg-red-500 text-white" : "bg-gray-200 text-gray-700"
  } hover:bg-red-400 hover:text-white transition`}
  onClick={() =>
    setFavorites(favorites.includes(dog.id) ? favorites.filter(id => id !== dog.id) : [...favorites, dog.id])
  }
>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill={favorites.includes(dog.id) ? "white" : "none"}
    viewBox="0 0 24 24"
    stroke="currentColor"
    className="w-5 h-5"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 21l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.18L12 21z"
    />
  </svg>
</span>


              <h3 className="text-lg font-bold mb-2">{dog.name}</h3>

              <img 
                src={dog.img} 
                alt={dog.name} 
                className="w-56 h-48 object-cover rounded-lg"
              />

              <div className="mt-2 text-center text-sm">
                <p><strong>Breed:</strong> {dog.breed}</p>
                <p><strong>Age:</strong> {dog.age} years</p>
                <p><strong>Location:</strong> {dog.zip_code}</p>
              </div>
            </div>
          ))
        )}
      </div>


      <ReactPaginate
        previousLabel={"Prev"}
        nextLabel={"Next"}
        breakLabel={"..."}
        pageCount={totalPages}
        marginPagesDisplayed={1}
        pageRangeDisplayed={3}
        onPageChange={(selected) => setPage(selected.selected)}
        containerClassName={"flex justify-center items-center gap-2 mt-5"}
        pageClassName={"px-3 py-2 rounded bg-gray-200 hover:bg-gray-300"}
        activeClassName={"bg-blue-500 text-white"}
        previousClassName={"px-4 py-2 bg-gray-500 text-white rounded"}
        nextClassName={"px-4 py-2 bg-gray-500 text-white rounded"}
        disabledClassName={"opacity-50 cursor-not-allowed"}
      />
    </div>
  );
};

export default DogSearch;
