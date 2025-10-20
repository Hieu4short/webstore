import { useState } from "react";
import { useNavigate } from "react-router-dom";

const SearchBox = () => {
  const [keyword, setKeyword] = useState("");
  const navigate = useNavigate();

  const submitHandler = (e) => {
    e.preventDefault();
    console.log("Search submitted:", keyword);
    if (keyword.trim()) {
      navigate(`/search/${keyword}`);
    } else {
      navigate("/");
    }
  };

  return (
    <form onSubmit={submitHandler} className="flex shadow-lg rounded-lg overflow-hidden">
      <input
        type="text"
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        placeholder="Search products"
        className="p-3 sm:p-4 border-0 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full text-gray-800 text-sm sm:text-base"
      />
      <button
        type="submit"
        className="bg-blue-500 text-white px-4 sm:px-6 py-3 hover:bg-blue-600 transition duration-200 font-medium whitespace-nowrap"
      >
        Search
      </button>
    </form>
  );
};

export default SearchBox;