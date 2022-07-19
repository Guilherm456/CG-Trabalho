import {
  ChoiceGroup,
  DefaultButton,
  Dropdown,
  IconButton,
  IDropdownOption,
  Slider,
  Stack,
  Text,
  TextField,
} from '@fluentui/react';
import { ObjectsProviderContext } from 'components/Provider';
import { useState, useEffect } from 'react';
import { ModalContent } from './Modal_Sphere';

const gapStack = { childrenGap: 5 };

export const PivotSphere = () => {
  const { objects, handleRemoveSphere } = ObjectsProviderContext();

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
  }, [objects]);

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

  const [modalOpen, setModalOpen] = useState(false);
  const handleOpen = () => setModalOpen(!modalOpen);

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
        object.translateSphere(Number(valueX), Number(valueY), Number(valueZ));

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

  const handleChageDropdown = (
    e: React.FormEvent<HTMLDivElement>,
    option?: any
  ) => {
    if (!option) return;
    if (option!.key === 'clean') setSelectedSphere('');
    else setSelectedSphere(option!.key as string);
  };

  const handleRemoveSphereOption = () => {
    if (selectedSphere === '') return;
    handleRemoveSphere(selectedSphere);
    setSelectedSphere('');
  };

  return (
    <Stack tokens={gapStack}>
      <Text variant='xLarge'>Editar esfera</Text>
      <Stack horizontal verticalAlign='end'>
        <Dropdown
          label='Selecione uma esfera'
          options={optionsSphere}
          selectedKey={selectedSphere}
          //Função que define o valor selecionado
          onChange={handleChageDropdown}
          disabled={objects.length === 0}
        />
        <IconButton
          split
          title='Deletar esfera'
          iconProps={{ iconName: 'Delete' }}
          disabled={selectedSphere === ''}
          onClick={handleRemoveSphereOption}
        />
        <IconButton
          split
          title='Editar esfera'
          iconProps={{ iconName: 'Edit' }}
          disabled={selectedSphere === ''}
          onClick={handleOpen}
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
      {modalOpen ? (
        <ModalContent
          handleOpen={handleOpen}
          open={modalOpen}
          sphere={selectedSphere}
        />
      ) : null}
    </Stack>
  );
};
