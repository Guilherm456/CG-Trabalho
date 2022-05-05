import { useState } from 'react';
import {
  ColorPicker,
  ContextualMenu,
  DefaultButton,
  Dropdown,
  getTheme,
  IconButton,
  Modal,
  Panel,
  Slider,
  Stack,
  Text,
  TextField,
} from '@fluentui/react';
import { CancelIcon } from '@fluentui/react-icons-mdl2';

import Canva from './components/Canva';
import { ObjectsProviderContext } from 'components/Provider';

import Sphere from 'geometry/spheres';

function App() {
  const { objects, setObjects } = ObjectsProviderContext();
  const [modalOpen, setModalOpen] = useState(false);

  const handleOpen = () => setModalOpen(!modalOpen);
  const theme = getTheme();

  const ModalContent = () => {
    const [radius, setRadius] = useState(100);
    const [intM, setIntM] = useState(36);
    const [intP, setIntP] = useState(36);
    const [color, setColor] = useState('');

    const [x, setX] = useState('0');
    const [y, setY] = useState('0');
    const [z, setZ] = useState('0');

    const onCreate = () => {
      const [sX, sY, sZ] = [Number(x), Number(y), Number(z)];
      const newSphere = new Sphere({
        center: [sX, sY, sZ],
        radius: radius,
        color: '#' + color,
        intensityM: intM,
        intensityP: intP,
      });
      setObjects([...objects, newSphere]);
      setModalOpen(false);
    };

    return (
      <Modal isOpen={modalOpen} onDismiss={handleOpen}>
        <div style={{ padding: 8 }}>
          <Stack
            horizontal
            verticalAlign='center'
            horizontalAlign='space-between'
          >
            <h2>Opções da esfera</h2>
            <IconButton onClick={handleOpen}>
              <CancelIcon color={theme.palette.neutralLighter} />
            </IconButton>
          </Stack>
        </div>
        <div style={{ padding: 16 }}>
          <Stack tokens={{ childrenGap: 5 }}>
            <Slider
              label='Raio'
              min={20}
              max={200}
              value={radius}
              onChange={(e, v) => setRadius(e)}
            />
            <>
              <Text>Cor da esfera</Text>
              <ColorPicker
                color={color}
                onChange={(e, color) => setColor(color.hex)}
                alphaType='none'
              />
            </>
            <Slider
              min={3}
              max={50}
              label='Intensividade de meridianos'
              value={intM}
              onChange={(e, v) => setIntM(e)}
            />
            <Slider
              min={3}
              max={50}
              label='Intensividade de paralelos'
              value={intP}
              onChange={(e, v) => setIntP(e)}
            />
            <Stack horizontal tokens={{ childrenGap: 10 }}>
              <TextField
                label='X'
                type='number'
                value={x}
                onChange={(e, v) => setX(v!)}
              />
              <TextField
                label='Y'
                type='number'
                value={y}
                onChange={(e, v) => setY(v!)}
              />
              <TextField
                label='Z'
                type='number'
                value={z}
                onChange={(e, v) => setZ(v!)}
              />
            </Stack>

            <DefaultButton onClick={onCreate}>Criar esfera</DefaultButton>
          </Stack>
        </div>
      </Modal>
    );
  };

  const OptionsPanel = () => {
    return (
      <Stack>
        <Dropdown
          options={[
            {
              key: '1',
              text: 'Opções',
            },
            {
              key: '2',
              text: 'Sair',
            },
          ]}
          label='Selecione a esfera'
        />
      </Stack>
    );
  };
  return (
    <div style={{ display: 'flex', width: '100vw', height: '95vh' }}>
      <div className='canvaArea' style={{ flexGrow: 1 }}>
        <Canva />
      </div>
      <Panel isOpen={true} isBlocking={false} headerText='Opções'>
        <Stack>
          <DefaultButton text='Criar esfera' onClick={handleOpen} />
        </Stack>
        <OptionsPanel />
      </Panel>

      <ModalContent />
    </div>
  );
}

export default App;
