// GifPopup.js
import React, { useState } from "react";
import axios from "axios";

export default function GifPopup({ onSelectGif }) {
  const [searchQuery, setSearchQuery] = useState("Espresso");
  const [gifList, setGifList] = useState([]);

  React.useEffect(() => {
    const handleSearch = async () => {
      try {
        const apiKey = "R5MXMu2lJaVl6RE7bEpFCESGL7FRA8hc"; 
        const limit = 10; 

        const response = await axios.get(
          `https://api.giphy.com/v1/gifs/search?q=${searchQuery}&api_key=${apiKey}&limit=${limit}`
        );

        setGifList(response.data.data);
      } catch (error) {
        console.error("Error fetching GIFs:", error);
      }
    };
    handleSearch();
  }, [searchQuery]);

  const handleGifClick = (gif) => {
    onSelectGif(gif.images.fixed_height.url);
  };

  return (
    <div className="gifPopupOverlay">
      <div className="gifPopupContainer">
        <div className="flexContainerRow">
          <input
            type="text"
            placeholder="Search for GIFs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button className="gifCloseBtn" onClick={() => onSelectGif("")}>
            X
          </button>
        </div>

        <div className="gifList">
          {gifList.map((gif) => (
            <img
              key={gif.id}
              src={gif.images.fixed_height.url}
              alt={gif.title}
              onClick={() => handleGifClick(gif)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
