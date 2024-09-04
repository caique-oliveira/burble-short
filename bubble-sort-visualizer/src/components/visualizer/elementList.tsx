import React, { useEffect, useRef } from 'react';
import Element from './element';

interface ElementListProps {
  elementsRef: React.RefObject<HTMLDivElement[]>;
}

const ElementList: React.FC<ElementListProps> = ({ elementsRef }) => {
  // Dados estáticos para os elementos
  const elements = [
    { left: '0%', width: '10%', height: '10%' },
    { left: '10%', width: '10%', height: '20%' },
    { left: '20%', width: '10%', height: '30%' },
    { left: '30%', width: '10%', height: '40%' },
    { left: '40%', width: '10%', height: '50%' },
    { left: '50%', width: '10%', height: '60%' },
    { left: '60%', width: '10%', height: '70%' },
    { left: '70%', width: '10%', height: '80%' },
    { left: '80%', width: '10%', height: '90%' },
    { left: '90%', width: '10%', height: '100%' }
  ];

  // Cria um array local de referências
  const localRefs = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    // Atualiza o array de referências global com o array local
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
