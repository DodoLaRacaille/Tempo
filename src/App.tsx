// App.tsx
import React, { useState, useEffect } from 'react';
import './App.css';
import socketIOClient from 'socket.io-client';

interface YourData {
  ItemName: string;
  ItemImage: string;
  ItemCraft: string;
  isChecked: boolean; // Champ pour stocker l'état de la case à cocher
}

const ENDPOINT = 'http://localhost:5000'; // Adresse du serveur Socket.io

function ItemLines() {
  const [items, setItems] = useState<YourData[]>([]);
  const socket = socketIOClient(ENDPOINT);

  useEffect(() => {
    socket.on('updateState', (updatedItems: YourData[]) => {
      setItems(updatedItems);
    });

        // Récupérer les données initiales du serveur
        fetchItems();

    return () => {
      socket.off('updateState');
    };
  }, [socket]);

  const handleCheckboxChange = (itemName: string, isChecked: boolean) => {
    const updatedItems = items.map(item =>
      item.ItemName === itemName ? { ...item, isChecked } : item
    );
    setItems(updatedItems);
    socket.emit('updateState', updatedItems);
  };

  const fetchItems = async () => {
    try {
      const response = await fetch('http://localhost:5000/items');
      if (!response.ok) {
        throw new Error('Failed to fetch items');
      }
      const data = await response.json();
      setItems(data);
    } catch (error) {
      console.error('Error fetching items:', error);
    }
  };

  return (
    <div className="container">
      <Header />
      {items.map((item, index) => (
        <ItemCard key={index} data={item} onCheckboxChange={handleCheckboxChange} />
      ))}
    </div>
  );
}

function ItemCard({ data, onCheckboxChange }: { data: YourData; onCheckboxChange: (itemName: string, isChecked: boolean) => void }) {
  const { ItemName, ItemImage, isChecked } = data;

  const toggleCheckbox = () => {
    onCheckboxChange(ItemName, !isChecked);
  };

  return (
    <div className="item">
      <img className="itemImage" src={`/items/${ItemImage}`} alt={ItemName} />
      <p className="itemName">{ItemName}</p>
      <img className="crossIcon" src="/cross.png" alt="Cross" style={{ display: isChecked ? 'inline' : 'none' }} onClick={toggleCheckbox} />
      <img className="checkIcon" src="/check.png" alt="Check" style={{ display: isChecked ? 'none' : 'inline' }} onClick={toggleCheckbox} />
    
    </div>
  );
}

function Header() {
  return (
    <div className="header">
      <h1>Items List</h1>
    </div>
  );
}

export default ItemLines;
