import React, { useEffect, useRef } from 'react';
import Element from './element';

interface ElementListProps {
  elementsRef: React.RefObject<HTMLDivElement[]>;
  size: number; // Recebe o valor do size
}

const ElementList: React.FC<ElementListProps> = ({ elementsRef, size }) => {
  const localRefs = useRef<HTMLDivElement[]>([]);

  // Calcular o número de elementos com base no size
  const numberOfElements = Math.floor(size / 100); // Ajustar conforme necessário

  // Calcular largura e altura dos elementos
  const elementWidth = 100 / numberOfElements; // Largura proporcional
  const elementHeightFactor = 100 / numberOfElements; // Fator para a altura

  // Criar dados dos elementos com base no size
  const elements = Array.from({ length: numberOfElements }, (_, index) => {
    const height = Math.min((index + 1) * elementHeightFactor, 100); // Ajustar a altura
    return {
      left: `${index * elementWidth}%`, // Posição proporcional
      width: `${elementWidth}%`, // Largura proporcional
      height: `${height}%` // Altura proporcional em relação ao contêiner
    };
  });

  useEffect(() => {
    if (elementsRef.current) {
      elementsRef.current = localRefs.current;
    }
  }, [elementsRef]);

  return (
    <div className="element-container">
      {elements.map((props, index) => (
        <Element
          key={index}
          left={props.left}
          width={props.width}
          height={props.height}
          ref={el => {
            if (el) {
              localRefs.current[index] = el;
            }
          }}
        />
      ))}
    </div>
  );
};

export default ElementList;
