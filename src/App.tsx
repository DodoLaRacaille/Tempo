import React, { useState, useEffect  } from 'react';
import './App.css';
import data from './data.json';
import Header from './components/header/header'
import socketIOClient from 'socket.io-client';

interface YourData {
  ItemName: string;
  ItemImage: string;
  ItemCraft: string;
}

const ENDPOINT = 'http://localhost:5000'; // Mettez ici l'adresse de votre serveur Socket.io

function ItemLines() {

  const [items] = useState<YourData[]>(data);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [checkboxState, setCheckboxState] = useState<{ [key: string]: boolean }>({});
  const socket = socketIOClient(ENDPOINT);

  useEffect(() => {
    const socket = socketIOClient(ENDPOINT);
  
    socket.on('initialState', (data: { [key: string]: boolean }) => {
      setCheckboxState(data);
    });
  
    socket.on('updateState', (data: { [key: string]: boolean }) => {
      setCheckboxState(data);
    });
  
    return () => {
      socket.disconnect();
    };
  }, []);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };
  
  // Filtrer les éléments en fonction de la chaîne de recherche
  const filteredItems = items.filter(item =>
    item.ItemName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCheckboxChange = (itemName: string) => {
    const newState = { ...checkboxState, [itemName]: !checkboxState[itemName] };
    setCheckboxState(newState);
    socket.emit('updateState', newState);
  };

  return (
    <div className="container">
      <Header/>
      <SearchBar searchTerm={searchTerm} handleSearch={handleSearch} />
      {filteredItems.map((item, index) => (
        <ItemCard key={index} data={item} checked={checkboxState[item.ItemName]} onCheckboxChange={() => handleCheckboxChange(item.ItemName)} />      ))}
    </div>
  );
}
function ItemCard({ data, checked, onCheckboxChange }: { data: YourData, checked: boolean, onCheckboxChange: () => void }) {
  const [showCraftImage, setShowCraftImage] = useState(false);
  const [isChecked, setIsChecked] = useState(checked);

  const toggleCraftImage = () => {
    setShowCraftImage(!showCraftImage);
  };

  const toggleCheckbox = () => {
    setIsChecked(!isChecked);
    onCheckboxChange();
  };

  const imageCraft = `/crafts/${data.ItemCraft}`;

  return (
    <div className="item" >
      <img className="itemImage" onMouseEnter={toggleCraftImage} onMouseLeave={toggleCraftImage} src={`/items/${data.ItemImage}`} alt={data.ItemName} />
      <p className="itemName">{data.ItemName}</p>
    {isChecked ? (
      <img className="checkIcon" src="/check.png" alt="Check" onClick={toggleCheckbox} />
    ) : (
      <img className="crossIcon" src="/cross.png" alt="Cross" onClick={toggleCheckbox} />
    )}
    
    {showCraftImage && <img className="craftImage" src={imageCraft} alt={data.ItemCraft}/>}

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