// import React from 'react';
import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
// import 'recharts';

function ContentDashboard2() {
  const containerStyle = {
    display: 'flex',
    flexWrap: 'wrap', // Allow content to wrap to the next row
  };

  const PenjualanStyle = {
    flex: '3', // Width ratio of 3
    minWidth: '200px', // Set a minimum width to prevent excessive narrowing
    height: '400px',
    backgroundColor: '#fff',
    color: 'black',
    borderRadius: '8px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start', // Center items horizontally
    padding: '10px',
    margin: '10px',
  };

  const NeracaStyle = {
    flex: '1', // Width ratio of 1
    minWidth: '200px', // Set a minimum width to prevent excessive narrowing
    height: '400px',
    backgroundColor: '#fff',
    color: 'black',
    borderRadius: '8px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start', // Center items horizontally
    padding: '10px',
    margin: '10px',
  };

  const data = [
    { name: 'Jan', sales: 1000 },
    { name: 'Feb', sales: 500 },
    { name: 'Mar', sales: 100 },
    { name: 'Apr', sales: 400 },
    { name: 'May', sales: 435 },
    { name: 'June', sales: 987 },
    { name: 'July', sales: 456 },
    { name: 'Aug', sales: 870 },
    { name: 'Sept', sales: 1000 },
    { name: 'Oct', sales: 870 },
    { name: 'Nov', sales: 456 },
    { name: 'Dec', sales: 1000 },
  ];

  const [chartWidth, setChartWidth] = useState(700); // Set initial width

  useEffect(() => {
    function handleResize() {
      // Update chart width based on the container's width
      const width = document.getElementById('PenjualanChart')?.clientWidth;
      if (width) {
        setChartWidth(width);
      }
    }

    handleResize(); // Set initial width
    window.addEventListener('resize', handleResize); // Listen to window resize events
    return () => {
      window.removeEventListener('resize', handleResize); // Clean up the event listener
    };
  }, []);

  return (
    <div>
      <div style={containerStyle}>
        <div style={PenjualanStyle} id="PenjualanChart">
          <div style={{ fontSize: '15px', fontWeight: 'bold' }}>
            Penjualan
          </div>
          <div style={{ alignItems: 'center', marginTop: '3%', width: '100%', height: 'calc(100% - 40px)' }}>
            {/* <LineChart width="100%" height="100%" data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}> */}
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data} style={{ marginLeft:'-2%' }}>
                <XAxis dataKey="name" />
                <YAxis />
                <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="sales" stroke="#8884d8" activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div style={NeracaStyle}>
          <div style={{ fontSize: '15px', fontWeight: 'bold' }}>
            Neraca
          </div>
          <div style={{ borderBottom: '1px solid black', width: '100%', marginTop: '10px', opacity: 0.1 }}></div>
          <div style={{ marginTop: '5%', backgroundColor: '#E7F2F7', width: '100%', height: '30%', borderRadius: '30px' }}>
            <div style={{ padding: '25px' }}>
              <i className="pi pi-fw pi-credit-card" style={{ color: '#0F7AAE' }}></i> Asset
              <div style={{ fontWeight: 'bold', fontSize: '15px', color: '#0F7AAE' }}>
                Rp. 55.000.000,-
              </div>
            </div>
          </div>
          <div style={{ marginTop: '5%', backgroundColor: '#FEF8EC', width: '100%', height: '30%', borderRadius: '30px' }}>
            <div style={{ padding: '25px' }}>
              <i className="pi pi-fw pi-bookmark-fill" style={{ color: '#F7B731' }}></i> Kewajiban
              <div style={{ fontWeight: 'bold', fontSize: '15px', color: '#F7B731' }}>
                Rp. 55.000.000,-
              </div>
            </div>
          </div>
          <div style={{ marginTop: '5%', backgroundColor: '#F3ECF5', width: '100%', height: '30%', borderRadius: '30px' }}>
            <div style={{ padding: '25px' }}>
              <i className="pi pi-fw pi-chart-bar" style={{ color: '#833294' }}></i> Modal
              <div style={{ fontWeight: 'bold', fontSize: '15px', color: '#833294' }}>
                Rp. 55.000.000,-
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ContentDashboard2;
