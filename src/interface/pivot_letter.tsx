import {
  ChoiceGroup,
  DefaultButton,
  Dropdown,
  IconButton,
  IDropdownOption,
  Slider,
  Stack,
  Text,
} from '@fluentui/react';
import { Letter } from 'components/Letter';
import { useObjects } from 'components/Provider';
import { FC, useEffect, useState } from 'react';

const gapStack = { childrenGap: 5 };

export const PivotLetter: FC = ({}) => {
  const { objects, handleRemoveLetter, handleChangeLetter } = useObjects();

  const options = [
    {
      key: 'rotate',
      text: 'Rotacionar',
    },
    { key: 'scale', text: 'Escalar' },
    { key: 'translate', text: 'Transladar' },
  ];
  const [option, setOption] = useState('rotate');

  const [selectedLetter, setSelectedLetter] = useState('');

  const [optionsSphere, setOptionsSphere] = useState<IDropdownOption[]>([]);
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
  }, [objects]);

  const optionsRotation = [
    { key: 'X', text: 'X' },
    { key: 'Y', text: 'Y' },
    { key: 'Z', text: 'Z' },
  ];
  const [optionRotation, setOptionRotation] = useState('X');

  const [valueX, setValueX] = useState(0);
  const [valueY, setValueY] = useState(0);
  const [valueZ, setValueZ] = useState(0);

  const [angle, setAngle] = useState(0);

  const [modalOpen, setModalOpen] = useState(false);
  const handleOpen = () => setModalOpen(!modalOpen);

  const handleChange = () => {
    if (option === '' || selectedLetter === '') return;

    //Vai selecionar o objeto que está sendo manipulado
    const selectedObjects =
      selectedLetter === 'all'
        ? objects
        : [objects.find((obj: Letter) => obj.id === selectedLetter)];
    if (!selectedObjects.length) return;

    switch (option) {
      case 'rotate':
        selectedObjects.forEach((object) =>
          object?.rotate(angle, optionRotation as 'X' | 'Y' | 'Z')
        );
        break;
      case 'scale':
        selectedObjects.forEach((object) =>
          object?.scale(Number(valueX), Number(valueY), Number(valueZ))
        );
        break;
      case 'translate':
        selectedObjects.forEach((object) =>
          object?.translate(Number(valueX), -Number(valueY), Number(valueZ))
        );

        break;
    }

    handleChangeLetter(selectedObjects as Letter[]);

    //Redifine todas opções
    setAngle(0);
    setValueX(0);
    setValueY(0);
    setValueZ(0);
    setOptionRotation('X');
    setOption('rotate');
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
    if (selectedLetter === 'all') {
      objects.forEach((obj) => handleRemoveLetter(obj.id));
    } else handleRemoveLetter(selectedLetter);
    setSelectedLetter('');
  };

  return (
    <Stack tokens={gapStack}>
      <Text variant="xLarge">Editar letra</Text>
      <Stack horizontal verticalAlign="end">
        <Dropdown
          label="Selecione uma letra"
          options={optionsSphere}
          selectedKey={selectedLetter}
          //Função que define o valor selecionado
          onChange={handleChageDropdown}
          disabled={objects.length === 0}
        />
        <IconButton
          split
          title="Deletar letra"
          iconProps={{ iconName: 'Delete' }}
          disabled={selectedLetter === ''}
          onClick={handleRemoveSphereOption}
        />
        <IconButton
          split
          title="Editar letra"
          iconProps={{ iconName: 'Edit' }}
          disabled={selectedLetter === ''}
          onClick={handleOpen}
        />
      </Stack>
      {selectedLetter !== '' ? (
        <>
          <ChoiceGroup
            label="Selecione a opção desejada"
            options={options}
            selectedKey={option}
            onChange={(e, v) => {
              setOption(v!.key);
              if (v!.key === 'scale') {
                setValueX(1);
                setValueY(1);
                setValueZ(1);
              }
            }}
            required
          />
          {option === 'rotate' ? (
            <Stack>
              <Slider
                label="Angulo"
                min={0}
                max={360}
                value={angle}
                onChange={(v) => setAngle(v)}
              />
              <ChoiceGroup
                label="Selecione o eixo da rotação"
                options={optionsRotation}
                selectedKey={optionRotation}
                onChange={(e, v) => setOptionRotation(v!.key)}
              />
            </Stack>
          ) : (
            <Stack tokens={gapStack}>
              <Slider
                label="Valor X"
                min={option === 'scale' ? 1 : -1000}
                step={option === 'scale' ? 0.1 : 1}
                max={option === 'scale' ? 10 : 1000}
                value={valueX}
                onChange={(v) => setValueX(v)}
                showValue
              />
              <Slider
                label="Valor Y"
                min={option === 'scale' ? 1 : -1000}
                step={option === 'scale' ? 0.1 : 1}
                // max={10}
                max={option === 'scale' ? 10 : 1000}
                value={valueY}
                onChange={(v) => setValueY(v)}
                showValue
              />
              <Slider
                label="Valor Z"
                min={option === 'scale' ? 1 : -1000}
                max={option === 'scale' ? 10 : 1000}
                step={option === 'scale' ? 0.1 : 1}
                value={valueZ}
                onChange={(v) => setValueZ(v)}
                showValue
              />
            </Stack>
          )}
          <DefaultButton text="Aplicar" onClick={handleChange} />
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
