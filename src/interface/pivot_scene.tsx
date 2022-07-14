import {
  ColorPicker,
  DefaultButton,
  IconButton,
  Modal,
  PivotItem,
  PrimaryButton,
  Slider,
  Stack,
  Text,
  TextField,
} from '@fluentui/react';
import { ObjectsProviderContext } from 'components/Provider';
import Sphere from 'geometry/spheres';
import { useState } from 'react';

const gapStack = { childrenGap: 5 };

export const PivotScene = () => {
  const { handleClear, setObjects, objects } = ObjectsProviderContext();
  const [modalOpen, setModalOpen] = useState(false);

  const ModalContent = () => {
    const [radius, setRadius] = useState(100);
    const [intM, setIntM] = useState(9);
    const [intP, setIntP] = useState(9);
    const [color, setColor] = useState('');

    const [name, setName] = useState('Esfera X');

    const [x, setX] = useState('0');
    const [y, setY] = useState('0');
    const [z, setZ] = useState('0');

    const onCreate = () => {
      if (name === '') setName('Esfera X');
      const [sX, sY, sZ] = [Number(x), Number(y), Number(z)];
      const newSphere = new Sphere({
        center: [sX, sY, sZ],
        radius: radius,
        color: '#' + color,
        intensityM: intM,
        intensityP: intP,
        name: name,
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
            <IconButton
              onClick={handleOpen}
              iconProps={{ iconName: 'Cancel' }}
            ></IconButton>
          </Stack>
          <Stack tokens={gapStack}>
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
            <TextField
              label='Nome da esfera'
              value={name}
              onChange={(e, v) => setName(v!)}
            />

            <Slider
              min={3}
              max={50}
              label='Intensidade de meridianos'
              value={intM}
              onChange={(e, v) => setIntM(e)}
            />
            <Slider
              min={3}
              max={50}
              label='Intensidade de paralelos'
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

  const handleOpen = () => setModalOpen(!modalOpen);

  return (
    <div>
      <Stack>
        <PrimaryButton
          text='Criar esfera'
          onClick={handleOpen}
          iconProps={{ iconName: 'Add' }}
        />
        <DefaultButton
          text='Limpar cena'
          onClick={handleClear}
          iconProps={{ iconName: 'Delete' }}
        />
      </Stack>
      <ModalContent />
    </div>
  );
};
