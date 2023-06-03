import { Pivot, PivotItem } from '@fluentui/react';
import { CanvaOriginal } from './components/CanvaOri';

import { PivotCamera } from 'interface/pivot_camera';
import { PivotLight } from 'interface/pivot_light';
import { PivotScene } from 'interface/pivot_scene';
import { PivotSphere } from 'interface/pivot_sphere';

function App() {
  const p: React.CSSProperties = {
    padding: 8,
    maxHeight: '85vh',
    overflowY: 'auto',
  };
  return (
    <div style={{ display: 'flex', height: '95vh' }}>
      {/* <Modal_Letter /> */}
      <div
        className='canvaArea'
        style={{
          display: 'grid',
          gridTemplate: '1fr 1fr / 1fr 1fr',
          width: '75%',
        }}
      >
        <CanvaOriginal />
        {/* <Canva />
        <Canva />

        <Canva />
        <Canva /> */}
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
