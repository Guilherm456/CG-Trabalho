import { Pivot, PivotItem } from '@fluentui/react';
import Canva from 'components/Canva';
import ZBuffer from 'components/zBuffer';

import { PivotCamera } from 'interface/pivot_camera';
import { PivotLetter } from 'interface/pivot_letter';
import { PivotLight } from 'interface/pivot_light';
import { PivotScene } from 'interface/pivot_scene';

function App() {
  const p: React.CSSProperties = {
    padding: 8,
    maxHeight: '85vh',
    overflowY: 'auto',
  };

  const isTest = true;
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
        {/* <CanvaOriginal /> */}
        {/* <Canva /> */}
        {/* <CanvaTeste /> */}
        {isTest ? <Canva /> : <ZBuffer />}
        {/* <Canva />

        <Canva />
        <Canva /> */}
      </div>
      <div style={{ width: '25vw', height: '100%', padding: 8 }}>
        <Pivot>
          <PivotItem headerText='Cena' style={p}>
            <PivotScene />
          </PivotItem>
          <PivotItem headerText='Letras' style={p}>
            <PivotLetter />
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
