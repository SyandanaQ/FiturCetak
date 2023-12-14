import React from 'react';

function ContentDashboard1() {
  const ContentDashboard1Style = {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    flexWrap: 'wrap', // Allow content to wrap to the next row
  };

  const flexItemStyle = {
    width: '100%',
    flex: '1', // Allow items to grow and shrink equally
    backgroundColor: '#fff',
    color: 'black',
    textAlign: 'left',
    borderRadius: '8px',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    padding: '25px',
    margin: '10px',
    minWidth: '230px',
  };

  const priceStyle = {
    color: 'black',
    fontWeight: 'bold',
    fontSize: '15px',
  };

  return (
    <div>
      <div style={ContentDashboard1Style}>
        <div style={flexItemStyle}>
          <div style={{ width: '50px', height: '50px', borderRadius: '18px', backgroundColor: '#E7F2F7', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: '10px', color: '#0F7AAE' }}>
            <i className="pi pi-fw pi-dollar"></i>
          </div>
          <div style={{ flexDirection: 'row' }}>
            Keuntungan
            <div style={priceStyle}>Rp. 55.000.000,-</div>
          </div>
        </div>
        <div style={flexItemStyle}>
          <div style={{ width: '50px', height: '50px', borderRadius: '18px', backgroundColor: '#EAF9F1', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: '10px', color: '#20BF6B' }}>
            <i className="pi pi-fw pi-arrow-up-right"></i>
          </div>
          <div style={{ flexDirection: 'row' }}>
            Penerimaan
            <div style={priceStyle}>Rp. 55.000.000,-</div>
          </div>
        </div>
        <div style={flexItemStyle}>
          <div style={{ width: '50px', height: '50px', borderRadius: '18px', backgroundColor: '#FDEDF0', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: '10px', color: '#EB3B5A' }}>
            <i className="pi pi-fw pi-arrow-down-right"></i>
          </div>
          <div style={{ flexDirection: 'row' }}>
            Pengeluaran
            <div style={priceStyle}>Rp. 55.000.000,-</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ContentDashboard1;
