import { Pivot, PivotItem } from '@fluentui/react';
import Canva from 'components/Canva';
import { useObjects } from 'components/Provider';

import { PivotCamera } from 'interface/pivot_camera';
import { PivotLight } from 'interface/pivot_light';
import { PivotScene } from 'interface/pivot_scene';
import { PivotSphere } from 'interface/pivot_sphere';
import { useEffect } from 'react';

function App() {
  const p: React.CSSProperties = {
    padding: 8,
    maxHeight: '85vh',
    overflowY: 'auto',
  };

  const { camera } = useObjects();

  useEffect(() => console.debug('mudy123', camera), [camera]);
  return (
    <div style={{ display: 'flex', height: '95vh' }}>
      <div
        className='canvaArea'
        style={{
          display: 'grid',
          gridTemplate: '1fr 1fr / 1fr 1fr',
          width: '75%',
        }}
      >
        <Canva indexCamera={0} />
        <Canva indexCamera={1} />
        <Canva indexCamera={2} />
        <Canva indexCamera={3} />
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
