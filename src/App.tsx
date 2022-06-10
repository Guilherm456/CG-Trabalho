import React, { useEffect, useState } from 'react';
import {
  ColorPicker,
  DefaultButton,
  Dropdown,
  IconButton,
  Modal,
  Panel,
  PrimaryButton,
  Slider,
  Stack,
  Text,
  TextField,
  initializeIcons,
  ChoiceGroup,
  VerticalDivider,
  IDropdownOption,
} from '@fluentui/react';

import Canva from './components/Canva';
import { ObjectsProviderContext } from 'components/Provider';

import Sphere from 'geometry/spheres';

const gapStack = { childrenGap: 5 };

function App() {
  const { objects, setObjects, handleClear, handleRemoveSphere } =
    ObjectsProviderContext();
  const [modalOpen, setModalOpen] = useState(false);

  const handleOpen = () => setModalOpen(!modalOpen);

  useEffect(() => {
    objects.forEach((object) => console.log(object));
    // if (objects.length > 0)
    //   concatMatrix(objects[0].extremes, 'RX', 10, objects[0].center);
  }, [objects]);

  useEffect(() => {
    initializeIcons();
  }, []);

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

    const [optionsSphere, setOptionsSphere] = useState<IDropdownOption[]>([]);
    const [selectedSphere, setSelectedSphere] = useState('');
    //Define as esferas selecionáveis
    useEffect(() => {
      if (objects.length === 0) return;
      const temp = objects.map((obj) => {
        return {
          key: obj.id,
          text: obj.name,
        };
      }) as IDropdownOption[];
      temp.push({ key: 'clean', text: 'Limpar' });
      setOptionsSphere(temp);
    }, [objects.length]);

    const optionsRotation = [
      { key: 'X', text: 'X' },
      { key: 'Y', text: 'Y' },
      { key: 'Z', text: 'Z' },
    ];
    const [optionRotation, setOptionRotation] = useState('X');

    const [valueX, setValueX] = useState('1');
    const [valueY, setValueY] = useState('1');
    const [valueZ, setValueZ] = useState('1');

    const [angle, setAngle] = useState(0);

    const handleChange = () => {
      if (option === '' || selectedSphere === '') return;
      //Vai selecionar o objeto que está sendo manipulado
      const object = objects.find((obj) => obj.id === selectedSphere);
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

      //Redifine todas opções
      setAngle(0);
      setValueX('1');
      setValueY('1');
      setValueZ('1');
      setOptionRotation('X');
      setOption('rotate');
      setSelectedSphere('');
    };

    return (
      <Stack tokens={gapStack}>
        <Text variant='xLarge'>Editar esfera</Text>
        <Stack horizontal verticalAlign='end'>
          <Dropdown
            label='Selecione uma esfera'
            options={optionsSphere}
            defaultValue={selectedSphere}
            //Função que define o valor selecionado
            onChange={(e, i) => {
              (i!.key as string) === 'clean'
                ? setSelectedSphere('')
                : setSelectedSphere(i!.key as string);
            }}
            disabled={optionsSphere.length === 0}
          />
          <IconButton
            split
            title='Deletar esfera'
            iconProps={{ iconName: 'Delete' }}
            disabled={selectedSphere === ''}
            onClick={() => handleRemoveSphere(selectedSphere)}
          />
          <IconButton
            split
            title='Editar esfera'
            iconProps={{ iconName: 'Edit' }}
            disabled={selectedSphere === ''}
          />
        </Stack>
        {selectedSphere !== '' ? (
          <>
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
              <Stack horizontal tokens={gapStack}>
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
          </>
        ) : null}
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
