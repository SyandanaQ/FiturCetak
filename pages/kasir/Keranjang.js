

function Keranjang() {

    const containerMenu = {
        display: 'flex',
        flexWrap: 'wrap', // Allow content to wrap to the next row
        backgroundColor: '#fff',
        flexDirection:'column'
    };
    
    return(
        <div>
            <div style={containerMenu}>
                <div style={{ padding: '15px', fontSize:'20px', fontWeight:'bold' }}>
                    Keranjang
                </div>
            </div>
        </div>
    )
}

export default Keranjang;