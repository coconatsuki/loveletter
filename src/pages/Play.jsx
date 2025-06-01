import React from 'react';
import { useParams } from 'react-router-dom';

export default function Play() {
  const { id } = useParams();
  return (
    <div>
      <h2>Game Board for Room {id}</h2>
      {/* TODO: Render game interface */}
    </div>
  );
}