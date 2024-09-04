import React, { forwardRef } from 'react';
import './element.css'; // Opcional: Se você tiver estilos específicos para o componente

interface ElementProps {
  left: string;
  width: string;
  height: string;
}

const Element = forwardRef<HTMLDivElement, ElementProps>(({ left, width, height }, ref) => {
  return (
    <div
      className="element"
      style={{ left, width, height }}
      ref={ref}
    ></div>
  );
});

export default Element;
