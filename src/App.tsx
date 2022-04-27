import React from 'react';

import Canva from './components/Canva';
function App() {
  return (
    <div style={{ display: 'flex', width: '100vw', height: '100vh' }}>
      <div className='canvaArea' style={{ flexGrow: 1 }}>
        <Canva />
      </div>
      <div style={{ width: '25%' }}></div>
    </div>
  );
}

export default App;
