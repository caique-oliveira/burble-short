import React, { forwardRef } from 'react';
import './element.css';

interface ElementProps {
  left: string;
  width: string;
  height: string; // Use string para aceitar unidades
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
