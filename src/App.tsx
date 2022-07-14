import { useEffect } from 'react';
import { Pivot, PivotItem, initializeIcons } from '@fluentui/react';

import Canva from './components/Canva';
import { ObjectsProviderContext } from 'components/Provider';

import { PivotSphere } from 'interface/pivot_sphere';
import { PivotScene } from 'interface/pivot_scene';
import { PivotCamera } from 'interface/pivot_camera';

function App() {
  useEffect(() => {
    initializeIcons();
  }, []);

  const p: React.CSSProperties = { padding: 8 };
  return (
    <div style={{ display: 'flex', height: '95vh' }}>
      <div className='canvaArea' style={{ flexGrow: 1 }}>
        <Canva />
      </div>
      <div style={{ width: '25vw', height: '100%', padding: 8 }}>
        <Pivot>
          <PivotItem headerText='Cena' style={p}>
            <PivotScene />
          </PivotItem>
          <PivotItem headerText='Cena' style={p}>
            <PivotSphere />
          </PivotItem>
          <PivotItem headerText='Câmera' style={p}>
            <PivotCamera />
          </PivotItem>
        </Pivot>
      </div>
    </div>
  );
}

export default App;
