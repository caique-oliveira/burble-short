import React, { useState, useEffect, useRef } from 'react';
import * as d3 from 'd3';
import axios from 'axios';
import './Visualizer.css'; // Importando o CSS
import ElementList from './elementList.tsx'; // Importando o novo componente

const colors = ['red', 'green', 'blue', 'yellow', 'purple', 'orange', 'cyan', 'magenta', 'lime', 'pink'];

const bubbleSort = async (array: number[], updateArray: (array: number[]) => void, delay: number) => {
  const n = array.length;
  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      if (array[j] > array[j + 1]) {
        [array[j], array[j + 1]] = [array[j + 1], array[j]];
        updateArray([...array]);
        await new Promise(res => setTimeout(res, delay));
      }
    }
  }
};

const Visualizer: React.FC = () => {
  const [data, setData] = useState<number[]>([]);
  const [delay, setDelay] = useState<number>(500);
  const [size, setSize] = useState<number>(1000);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const svgRef = useRef<SVGSVGElement>(null);
  const elementsRef = useRef<HTMLDivElement[]>([]);

  const paintElements = async () => {
    setIsPlaying(true);
    for (let i = 0; i < elementsRef.current.length; i++) {
      const element = elementsRef.current[i];
      if (element) {
        element.style.backgroundColor = colors[i % colors.length]; // Atribui a cor do array
        await new Promise(res => setTimeout(res, 500)); // Aguarda 500ms entre cada alteração
      }
    }
    setIsPlaying(false);
  };

  useEffect(() => {
    const updateChart = () => {
      if (svgRef.current) {
        const svg = d3.select(svgRef.current);
        svg.selectAll("*").remove();
        
        const width = svgRef.current.clientWidth;
        const height = svgRef.current.clientHeight;
        const barWidth = width / data.length;
  
        console.log('Bar width:', barWidth);
  
        const yScale = d3.scaleLinear()
          .domain([0, d3.max(data) || 0])
          .range([height, 0]);
  
        console.log('Y scale domain:', [0, d3.max(data) || 0]);
        console.log('Y scale range:', [height, 0]);
  
        svg.selectAll("rect")
          .data(data)
          .enter()
          .append("rect")
          .attr("x", (_d: number, i: number) => i * barWidth)
          .attr("y", (d: number) => yScale(d))
          .attr("width", barWidth - 1)
          .attr("height", (d: number) => height - yScale(d))
          .attr("fill", "steelblue");
  
        console.log('Rectangles drawn');
      }
    };
  
    updateChart();
  }, [data]);

  const fetchData = async () => {
    try {
      const response = await axios.get(`/api/api/v1.0/random?min=0&max=1000&count=${size}`);
      setData(response.data);
      console.log(response.data,'response data')
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const startSorting = () => {
    if (isPlaying || data.length === 0) return;
  
    setIsPlaying(true);
    
    // Verifique o estado de isPlaying após um breve atraso
    setTimeout(() => {
      console.log('Estado após setIsPlaying:', isPlaying);
    }, 0);
  
    bubbleSort([...data], setData, delay).finally(() => {
      setIsPlaying(false);
    });
    console.log([...data], 'data aqui')

    if (isPlaying) return;
    paintElements();
  };
  useEffect(() => {
    if (isPlaying) {
      console.log('Ordenação em andamento...');
    }
  }, [isPlaying]);

  const reset = async () => {
    if (isPlaying) return;
    await fetchData();
  };

  useEffect(() => {
    fetchData();
  }, [size]);

  return (
    <div className="container">
      <div className="controls">
        <label className="range-label">Delay: {delay}ms</label>
        <input
          type="range"
          min="0"
          max="1000"
          value={delay}
          onChange={(e) => setDelay(Number(e.target.value))}
          disabled={isPlaying}
          className="range-input"
        />
        <label className="range-label">Size: {size}</label>
        <input
          type="range"
          min="100"
          max="10000"
          value={size}
          onChange={(e) => setSize(Number(e.target.value))}
          disabled={isPlaying}
          className="range-input"
        />
      </div>
      <div className="button-container">
        <button onClick={startSorting} disabled={isPlaying}>Start</button>
        <button onClick={reset} disabled={isPlaying}>Reset</button>
      </div>
      <div className="containerFil">
        <ElementList elementsRef={elementsRef} />
      </div>
    </div>
  );
};

export default Visualizer;
