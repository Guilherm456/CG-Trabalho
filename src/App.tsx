import { Pivot, PivotItem } from '@fluentui/react';
import { Canva } from 'components/Canva';
import ZBuffer from 'components/zBuffer';

import { PivotCamera } from 'interface/pivot_camera';
import { PivotLetter } from 'interface/pivot_letter';
import { PivotLight } from 'interface/pivot_light';
import { PivotScene } from 'interface/pivot_scene';
import { CSSProperties, useState } from 'react';

function App() {
  const p: CSSProperties = {
    padding: 8,
    maxHeight: '85vh',
    overflowY: 'auto',
  };
  const [selectedLetter, setSelectedLetter] = useState<string>('');
  const [selectedCamera, setSelectedCamera] = useState<string>('');

  const [step, setStep] = useState('0');

  const isTest = true;
  return (
    <div style={{ display: 'flex', height: '95vh' }}>
      <div
        className="canvaArea"
        style={{
          display: 'grid',
          gridTemplate: '1fr 1fr / 1fr 1fr',
          width: '75%',
        }}
      >
        {/* <CanvaOriginal /> */}
        {/* <Canva /> */}
        {/* <CanvaTeste /> */}
        {isTest ? (
          <Canva
            selectedLetter={selectedLetter}
            setSelectedLetter={setSelectedLetter}
            setStep={setStep}
          />
        ) : (
          <ZBuffer />
        )}
        {/* <Canva />

        <Canva />
        <Canva /> */}
      </div>
      <div style={{ width: '25vw', height: '100%', padding: 8 }}>
        <Pivot
          selectedKey={step}
          onLinkClick={(e) => setStep(e?.props?.itemKey ?? '0')}
        >
          <PivotItem headerText="Cena" style={p} itemKey="0">
            <PivotScene />
          </PivotItem>
          <PivotItem headerText="Letras" style={p} itemKey="1">
            <PivotLetter
              selectedLetter={selectedLetter}
              setSelectedLetter={setSelectedLetter}
            />
          </PivotItem>
          <PivotItem headerText="Câmera" style={p} itemKey="2">
            <PivotCamera />
          </PivotItem>
          <PivotItem headerText="Luz" style={p} itemKey="3">
            <PivotLight />
          </PivotItem>
        </Pivot>
      </div>
    </div>
  );
}

export default App;
