import React, { useState, useEffect, useRef } from 'react';
import * as d3 from 'd3';
import axios from 'axios';
import './Visualizer.css';
import ElementList from './elementList';

const colors = ['red', 'green', 'blue', 'yellow', 'purple', 'orange', 'cyan', 'magenta', 'lime', 'pink'];

const bubbleSort = async (array: number[], updateArray: (array: number[]) => void, delay: number) => {
  const n = array.length;
  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      if (array[j] > array[j + 1]) {
        [array[j], array[j + 1]] = [array[j + 1], array[j]];
        updateArray([...array]);
        await new Promise(res => setTimeout(res, delay)); // Usa o atraso configurado
      }
    }
  }
};

const Visualizer: React.FC = () => {
  const [data, setData] = useState<number[]>([]);
  const [delay, setDelay] = useState<number>(500); // Atraso inicial
  const [size, setSize] = useState<number>(1000);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const svgRef = useRef<SVGSVGElement>(null);
  const elementsRef = useRef<HTMLDivElement[]>([]);

  const paintElements = async () => {
    setIsPlaying(true);
    for (let i = 0; i < elementsRef.current.length; i++) {
      const element = elementsRef.current[i];
      if (element) {
        element.style.backgroundColor = colors[i % colors.length];
        await new Promise(res => setTimeout(res, delay)); // Usa o atraso configurado
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

        const yScale = d3.scaleLinear()
          .domain([0, d3.max(data) || 0])
          .range([height, 0]);

        svg.selectAll("rect")
          .data(data)
          .enter()
          .append("rect")
          .attr("x", (_d: number, i: number) => i * barWidth)
          .attr("y", (d: number) => yScale(d))
          .attr("width", barWidth - 1)
          .attr("height", (d: number) => height - yScale(d))
          .attr("fill", "steelblue");
      }
    };

    updateChart();
  }, [data]);

  const fetchData = async () => {
    try {
      const response = await axios.get(`/api/api/v1.0/random?min=0&max=1000&count=${size}`);
      setData(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const startSorting = () => {
    if (isPlaying || data.length === 0) return;

    setIsPlaying(true);

    bubbleSort([...data], setData, delay).finally(() => {
      setIsPlaying(false);
    });

    // Chama paintElements após a ordenação começar
    paintElements();
  };

  useEffect(() => {
    if (isPlaying) {
      console.log('Ordenação em andamento...');
    }
  }, [isPlaying]);

  const reset = async () => {
    if (isPlaying) return;

    setSize(1000); // Valor inicial desejado
    await fetchData();

    requestAnimationFrame(() => {
      if (elementsRef.current) {
        elementsRef.current.forEach(element => {
          if (element) {
            element.style.backgroundColor = 'silver';
          }
        });
      }
    });
  };

  useEffect(() => {
    fetchData();
  }, [size]);

  const handleSizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newSize = Math.max(600, Number(e.target.value));
    setSize(newSize);
  };

  const handleDelayChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDelay(Number(e.target.value));
  };

  return (
    <div className="container">
      <div className="controls">
        <div className="range-container">
          <label className="range-label">Size: {size}</label>
          <input
            type="range"
            min="600"
            max="10000"
            step="100"
            value={size}
            onChange={handleSizeChange}
            disabled={isPlaying}
            className="range-input"
          />
          <span className="range-value">{size}</span>
        </div>
        <div className="range-container">
          <label className="range-label">Delay: {delay}ms</label>
          <input
            type="range"
            min="0"
            max="1000"
            step="10"
            value={delay}
            onChange={handleDelayChange}
            disabled={isPlaying}
            className="range-input"
          />
          <span className="range-value">{delay} ms</span>
        </div>
      </div>
      <div className="button-container">
        <button onClick={startSorting} disabled={isPlaying}>Start</button>
        <button onClick={reset} disabled={isPlaying}>Reset</button>
      </div>
      <div className="containerFil">
        <ElementList elementsRef={elementsRef} size={size} />
      </div>
    </div>
  );
};

export default Visualizer;
