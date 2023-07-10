import {
  DefaultButton,
  PrimaryButton,
  Stack,
  Text,
  TextField,
  VerticalDivider,
} from '@fluentui/react';
import { Letter } from 'components/Letter';
import { useObjects } from 'components/Provider';
import { useState } from 'react';

const gapStack = { childrenGap: 5 };

export const PivotScene = () => {
  const { handleClear, handleClearObjects, setObjects, objects } = useObjects();
  const [text, setText] = useState('');

  const handleOpen = () => {};

  const downloadScene = () => {
    const scene = JSON.stringify(objects);

    const element = document.createElement('a');
    const file = new Blob([scene], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = 'scene.json';
    document.body.appendChild(element); // Required for this to work in FireFox
    element.click();
  };

  const createText = () => {
    const letters = text.toUpperCase().split('');

    setObjects(
      letters.map(
        (letter, index) =>
          new Letter([index * 300, 0, 0], 200, letter as any, [
            index * 600,
            0,
            0,
          ])
      )
    );
  };

  return (
    <Stack
      tokens={gapStack}
      style={{
        height: '100%',
      }}
    >
      <Stack
        tokens={{
          childrenGap: 5,
        }}
      >
        <TextField
          label="Texto a ser renderizado"
          onChange={(_, value) => setText(value || '')}
        />
        <PrimaryButton
          text="Criar texto"
          onClick={createText}
          iconProps={{ iconName: 'Add' }}
        />
      </Stack>
      <VerticalDivider />
      <DefaultButton
        text="Deletar objetos"
        onClick={handleClearObjects}
        iconProps={{ iconName: 'Delete' }}
      />
      <DefaultButton
        text="Limpar cena"
        onClick={handleClear}
        iconProps={{ iconName: 'ClearFormatting' }}
      />

      <VerticalDivider />
      <Text variant="xLarge">Arquivos</Text>
      <Stack
        style={{
          height: '100%',
          justifyContent: 'space-between',
        }}
        tokens={{
          childrenGap: 5,
        }}
        horizontal
      >
        <DefaultButton
          text="Salvar cena"
          onClick={downloadScene}
          iconProps={{ iconName: 'Save' }}
        />
        <DefaultButton
          text="Carregar cena"
          onClick={handleOpen}
          iconProps={{ iconName: 'OpenFile' }}
        >
          <input type="file" style={{ display: 'none' }} />
        </DefaultButton>
      </Stack>
    </Stack>
  );
};
