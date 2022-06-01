import { useEffect, useState } from 'react';
import {
  ColorPicker,
  DefaultButton,
  Dropdown,
  IconButton,
  Modal,
  Panel,
  Slider,
  Stack,
  Text,
  TextField,
  initializeIcons,
  PrimaryButton,
  ChoiceGroup,
  VerticalDivider,
} from '@fluentui/react';

import Canva from './components/Canva';
import { ObjectsProviderContext } from 'components/Provider';

import Sphere from 'geometry/spheres';
import { concatMatrix } from 'utils/calculate';

initializeIcons();
function App() {
  const { objects, setObjects, handleClear } = ObjectsProviderContext();
  const [modalOpen, setModalOpen] = useState(false);

  const handleOpen = () => setModalOpen(!modalOpen);

  useEffect(() => {
    objects.forEach((object) => console.log(object));
    // if (objects.length > 0)
    //   concatMatrix(objects[0].extremes, 'RX', 10, objects[0].center);
  }, [objects]);

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
            <IconButton
              onClick={handleOpen}
              iconProps={{ iconName: 'Cancel' }}
            ></IconButton>
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
    const options = [
      {
        key: 'rotate',
        text: 'Rotacionar',
      },
      { key: 'scale', text: 'Escalar' },
      { key: 'translate', text: 'Transladar' },
    ];
    const [option, setOption] = useState('rotate');

    const optionsRotation = [
      { key: 'X', text: 'X' },
      { key: 'Y', text: 'Y' },
      { key: 'Z', text: 'Z' },
    ];
    const [optionRotation, setOptionRotation] = useState('X');

    const [valueX, setValueX] = useState('0');
    const [valueY, setValueY] = useState('0');
    const [valueZ, setValueZ] = useState('0');

    const [angle, setAngle] = useState(0);

    const handleChange = () => {
      if (option === '') return;
      const object = objects[0];
      if (!object) return;

      switch (option) {
        case 'rotate':
          object.rotateSphere(angle, optionRotation as 'X' | 'Y' | 'Z');
          break;
        case 'scale':
          object.scaleSphere(Number(valueX), Number(valueY), Number(valueZ));
          break;
        case 'translate':
          object.translateSphere(
            Number(valueX),
            Number(valueY),
            Number(valueZ)
          );
          break;
      }
      setAngle(0);
      setValueX('0');
      setValueY('0');
      setValueZ('0');
      setOptionRotation('X');
      setOption('rotate');
    };

    return (
      <Stack gap={5}>
        <Text variant='xLarge'>Editar esfera</Text>
        <Stack horizontal>
          <Dropdown
            label='Selecione uma esfera'
            options={[{ key: '1', text: 'Esfera 1' }]}
          />
          <IconButton
            split
            title='Deletar esfera'
            iconProps={{ iconName: 'Delete' }}
          />
        </Stack>
        <ChoiceGroup
          label='Selecione a opção desejada'
          options={options}
          selectedKey={option}
          onChange={(e, v) => setOption(v!.key)}
          required
        />
        {option === 'rotate' ? (
          <Stack>
            <Slider
              label='Angulo'
              min={0}
              max={360}
              value={angle}
              onChange={(v) => setAngle(v)}
            />
            <ChoiceGroup
              label='Selecione o eixo da rotação'
              options={optionsRotation}
              selectedKey={optionRotation}
              onChange={(e, v) => setOptionRotation(v!.key)}
            />
          </Stack>
        ) : (
          <Stack horizontal gap={2}>
            <TextField
              label='Valor X'
              type='number'
              value={valueX}
              onChange={(e, n) => setValueX(n!)}
            />
            <TextField
              label='Valor Y'
              type='number'
              value={valueY}
              onChange={(e, n) => setValueY(n!)}
            />
            <TextField
              label='Valor Z'
              type='number'
              value={valueZ}
              onChange={(e, n) => setValueZ(n!)}
            />
          </Stack>
        )}
        <DefaultButton text='Aplicar' onClick={handleChange} />
      </Stack>
    );
  };

  return (
    <div style={{ display: 'flex', width: '100vw', height: '95vh' }}>
      <div className='canvaArea' style={{ flexGrow: 1 }}>
        <Canva />
      </div>
      <Panel isOpen={true} isBlocking={false}>
        <Stack>
          <PrimaryButton
            text='Criar esfera'
            onClick={handleOpen}
            iconProps={{ iconName: 'Add' }}
          />
        </Stack>
        <VerticalDivider />
        <OptionsPanel />
        <VerticalDivider />
        <Stack>
          <DefaultButton
            text='Limpar cena'
            onClick={handleClear}
            iconProps={{ iconName: 'Delete' }}
          />
        </Stack>
      </Panel>

      <ModalContent />
    </div>
  );
}

export default App;
