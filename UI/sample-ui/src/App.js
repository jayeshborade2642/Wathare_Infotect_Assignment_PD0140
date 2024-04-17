import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Plot from 'react-plotly.js';

function App() {
  const [start, setStart] = useState('');
  const [frequency, setFrequency] = useState('hour');
  const [filteredData, setFilteredData] = useState([]);
  const [summary, setSummary] = useState(null);

  useEffect(() => {
  }, [filteredData]);

  const handleFilter = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/data/'+start,
      );
      setFilteredData(response.data);
      generateSummary(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

 
  const generateSummary = (data) => {
    const ones = data.filter(item => item.vibration === 1).length;
    const zeros = data.filter(item => item.vibration === 0).length;

    let continuousOnes = 0;
    let continuousZeros = 0;
    let maxContinuousOnes = 0;
    let maxContinuousZeros = 0;

    for (let i = 0; i < data.length; i++) {
      if (data[i].value === 1) {
        continuousOnes++;
        maxContinuousZeros = Math.max(maxContinuousZeros, continuousZeros);
        continuousZeros = 0;
      } else if (data[i].value === 0) {
        continuousZeros++;
        maxContinuousOnes = Math.max(maxContinuousOnes, continuousOnes);
        continuousOnes = 0;
      }
    }

    setSummary({
      ones,
      zeros,
      maxContinuousOnes,
      maxContinuousZeros
    });
  };
  return (
    <div>
      <h1>Data Filter</h1>
      <div>
        <label htmlFor="start">Start Time:</label>
        <input
          type="datetime-local"
          id="start"
          value={start}
          onChange={(e) => setStart(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="frequency">Frequency:</label>
        <select
          id="frequency"
          value={frequency}
          onChange={(e) => setFrequency(e.target.value)}
        >
          <option value="hour">Hourly</option>
          <option value="day">Daily</option>
          <option value="week">Weekly</option>
          <option value="month">Monthly</option>
        </select>
      </div>
      <button onClick={handleFilter}>Filter Data</button>
      <div>
        <canvas id="myChart" width="800" height="400"></canvas>
      </div>
      {summary && (
        <div>
          <h2>Summary:</h2>
          <table>
            <tbody>
              <tr>
                <td>Number of 1s:</td>
                <td>{summary.ones}</td>
              </tr>
              <tr>
                <td>Number of 0s:</td>
                <td>{summary.zeros}</td>
              </tr>
              <tr>
                <td>Max Continuous 1s:</td>
                <td>{summary.maxContinuousOnes}</td>
              </tr>
              <tr>
                <td>Max Continuous 0s:</td>
                <td>{summary.maxContinuousZeros}</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
       <Plot
          data={[
            {
              x: filteredData.map(item => item.ts),
              y: filteredData.map(item => item.vibration),
              type: 'scatter',
              mode: 'lines+markers',
              marker: {
                color: filteredData.map(item => item.vibration === 0 ? 'yellow' : item.vibration === 1 ? 'green' : 'red')
              }
            }
          ]}
          layout={{
            title: 'Cycle Status Graph',
            xaxis: {
              type: 'date',
              title: 'Timestamp'
            },
            yaxis: {
              title: 'Vibration'
            }
          }}
        />

    </div>
    
  );
}

export default App;
