import React, { useState } from 'react';
import './App.css';
import data from './data.json';
import Header from './components/header/header'

interface YourData {
  ItemName: string;
  ItemImage: string;
  ItemCraft: string;
}

function ItemLines() {
  const [items, setItems] = useState<YourData[]>(data);
  const [searchTerm, setSearchTerm] = useState<string>('');

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  // Filtrer les éléments en fonction de la chaîne de recherche
  const filteredItems = items.filter(item =>
    item.ItemName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container">
      <Header/>
      <SearchBar searchTerm={searchTerm} handleSearch={handleSearch} />
      {filteredItems.map((item, index) => (
        <ItemCard key={index} data={item} />
      ))}
    </div>
  );
}

function ItemCard({ data }: { data: YourData }) {
  const [showCraftImage, setShowCraftImage] = useState(false);

  const toggleCraftImage = () => {
    setShowCraftImage(!showCraftImage);
  };

  const imagePath = `/items/${data.ItemImage}`;
  const imageCraft = `/crafts/${data.ItemCraft}`;
  return (
    <div className="item" onMouseEnter={toggleCraftImage} onMouseLeave={toggleCraftImage}>
      <img className="itemImage" src={imagePath} alt={data.ItemName} />
      <p className="itemName">{data.ItemName}</p>
      {showCraftImage && <img className="craftImage" src={imageCraft}/>}
    </div>
  );
}

// Composant SearchBar pour la recherche
function SearchBar({
  searchTerm,
  handleSearch
}: {
  searchTerm: string;
  handleSearch: (event: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <div className="searchBar">
      <input
        type="text"
        placeholder="Search..."
        value={searchTerm}
        onChange={handleSearch}
      />
    </div>
  );
}

export default ItemLines;
