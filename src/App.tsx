import { Pivot, PivotItem } from '@fluentui/react';

import Canva from './components/Canva';

import { PivotSphere } from 'interface/pivot_sphere';
import { PivotScene } from 'interface/pivot_scene';
import { PivotCamera } from 'interface/pivot_camera';
import { PivotLight } from 'interface/pivot_light';

function App() {
  const p: React.CSSProperties = {
    padding: 8,
    maxHeight: '85vh',
    overflowY: 'auto',
  };
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
          <PivotItem headerText='Esfera' style={p}>
            <PivotSphere />
          </PivotItem>
          <PivotItem headerText='Câmera' style={p}>
            <PivotCamera />
          </PivotItem>
          <PivotItem headerText='Luz' style={p}>
            <PivotLight />
          </PivotItem>
        </Pivot>
      </div>
    </div>
  );
}

export default App;
