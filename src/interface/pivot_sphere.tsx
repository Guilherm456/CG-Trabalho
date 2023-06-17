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
import { Letter } from 'components/Letter';
import { useObjects } from 'components/Provider';
import { useEffect, useState } from 'react';

const gapStack = { childrenGap: 5 };

export const PivotSphere = () => {
  const { objects, handleRemoveSphere } = useObjects();

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
  const [selectedLetter, setSelectedLetter] = useState('');
  //Define as letras selecionáveis
  useEffect(() => {
    if (objects.length === 0) return;
    const temp = objects.map((obj) => {
      return {
        key: obj.id,
        text: obj.typeLetter,
      };
    }) as IDropdownOption[];
    temp.push({ key: 'all', text: 'Todas as letras' });
    temp.push({ key: 'clean', text: 'Limpar' });
    setOptionsSphere(temp);
    if (selectedLetter !== '') setSelectedLetter('');
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
    if (option === '' || selectedLetter === '') return;
    //Vai selecionar o objeto que está sendo manipulado
    const object = objects.find((obj: Letter) => obj.id === selectedLetter);
    if (!object) return;

    switch (option) {
      case 'rotate':
        // object.rotateLetter(angle, optionRotation as 'X' | 'Y' | 'Z');
        break;
      case 'scale':
        // object.scaleLetter(Number(valueX), Number(valueY), Number(valueZ));
        break;
      case 'translate':
        // object.translateLetter(Number(valueX), -Number(valueY), Number(valueZ));

        break;
    }

    //Redifine todas opções
    setAngle(0);
    setValueX('1');
    setValueY('1');
    setValueZ('1');
    setOptionRotation('X');
    setOption('rotate');
    setSelectedLetter('');
  };

  const handleChageDropdown = (
    e: React.FormEvent<HTMLDivElement>,
    option?: any
  ) => {
    if (!option) return;
    if (option!.key === 'clean') setSelectedLetter('');
    else setSelectedLetter(option!.key as string);
  };

  const handleRemoveSphereOption = () => {
    if (selectedLetter === '') return;
    handleRemoveSphere(selectedLetter);
    setSelectedLetter('');
  };

  return (
    <Stack tokens={gapStack}>
      <Text variant='xLarge'>Editar letra</Text>
      <Stack horizontal verticalAlign='end'>
        <Dropdown
          label='Selecione uma letra'
          options={optionsSphere}
          selectedKey={selectedLetter}
          //Função que define o valor selecionado
          onChange={handleChageDropdown}
          disabled={objects.length === 0}
        />
        <IconButton
          split
          title='Deletar letra'
          iconProps={{ iconName: 'Delete' }}
          disabled={selectedLetter === ''}
          onClick={handleRemoveSphereOption}
        />
        <IconButton
          split
          title='Editar letra'
          iconProps={{ iconName: 'Edit' }}
          disabled={selectedLetter === ''}
          onClick={handleOpen}
        />
      </Stack>
      {selectedLetter !== '' ? (
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
      {/* {modalOpen ? (
        <ModalContent
          handleOpen={handleOpen}
          open={modalOpen}
          sphere={selectedLetter}
        />
      ) : null} */}
    </Stack>
  );
};
