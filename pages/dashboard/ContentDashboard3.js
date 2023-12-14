import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

function ContentDashboard3() {
  const data = [
    { name: 'A', value: 10 },
    { name: 'B', value: 5 },
    { name: 'C', value: 15 },
    { name: 'D', value: 25 },
    { name: 'E', value: 45 },
    { name: 'F', value: 5 },
    { name: 'G', value: 15 },
    { name: 'H', value: 10 },
  ];

  const cardStyle = {
    width: '100%',
    minWidth: '200px',
    flex: '1',
    height: '300px',
    backgroundColor: '#fff',
    color: 'black',
    textAlign: 'center',
    borderRadius: '8px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '10px',
    margin: '10px',
  };

  const chartStyle = {
    marginTop: '5%',
    width: '100%',
    height: '230px',
  };

  return (
    <div>
      <div style={{ display: 'flex', flexWrap: 'wrap' }}>
        <div style={cardStyle}>
          <div style={{ fontSize: '15px', fontWeight: 'bold' }}>
            Laporan Penjualan
          </div>
          <div style={{ borderBottom: '1px solid black', width: '100%', marginTop: '10px', opacity: 0.1 }}></div>
          <div style={chartStyle}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} style={{ marginLeft:'-4%' }}>
                <XAxis dataKey="name" />
                <YAxis />
                <CartesianGrid strokeDasharray="3 3" />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" fill="#D98484" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div style={cardStyle}>
          <div style={{ fontSize: '15px', fontWeight: 'bold' }}>
            Laporan Neraca
          </div>
          <div style={{ borderBottom: '1px solid black', width: '100%', marginTop: '10px', opacity: 0.1 }}></div>
          <div style={chartStyle}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} style={{ marginLeft:'-4%' }}>
                <XAxis dataKey="name" />
                <YAxis />
                <CartesianGrid strokeDasharray="3 3" />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ContentDashboard3;
