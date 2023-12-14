    import React, { useEffect, useState } from 'react';
    import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

    function ContentDashboard6() {
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
        color: 'black',
        borderRadius: '8px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center', // Center items horizontally
        justifyContent: 'center',
        // padding: '10px',
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
                <div style={NeracaStyle}>
                    <div style={{ backgroundColor: '#fff', width: '100%', height: '31%', borderRadius: '8px' }}>
                        <div style={{ padding: '25px' }}>
                            Saldo Keseluruhan
                            <div style={{ color: '#0F7AAE', fontSize: '18px', marginTop: '5px' }}>Rp. 55.000.000,-</div>
                        </div>
                    </div>
                    <div style={{ marginTop: '6%', backgroundColor: '#fff', width: '100%', height: '31%', borderRadius: '8px' }}>
                        <div style={{ padding: '25px' }}>
                            Total Pemasukan
                            <div style={{ color: '#20BF6B', fontSize: '18px', marginTop: '5px' }}>Rp. 55.000.000,-</div>
                            <div style={{ color: '#A9A8A8', fontSize: '12px' }}>0% dari Data Keseluruhan</div>
                        </div>
                    </div>
                    <div style={{ marginTop: '6%', backgroundColor: '#fff', width: '100%', height: '31%', borderRadius: '8px' }}>
                        <div style={{ padding: '25px' }}>
                            Total Pengeluaran
                            <div style={{ color: '#EB3B5A', fontSize: '18px', marginTop: '5px' }}>Rp. 55.000.000,-</div>
                            <div style={{ color: '#A9A8A8', fontSize: '12px' }}>0% dari Data Keseluruhan</div>
                        </div>
                    </div>
                </div>
                <div style={PenjualanStyle} id="PenjualanChart">
                    <div style={{ fontSize: '15px', fontWeight: 'bold' }}>
                        Pembelian
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
            </div>
        </div>
    );
    }

    export default ContentDashboard6;
