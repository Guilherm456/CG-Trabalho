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
  const { handleClear, handleClearObjects, objects, setObjects } = useObjects();

  const [text, setText] = useState<string>('');

  const createText = () => {
    if (text === '') return;
    const letters: Letter[] = [];

    const char = text.toUpperCase().split('');
    const length = char.length;

    //Para cada letra, vai criar uma nova Letter, porém o centro da letra vai se dar pela posição da letra
    //Onde a letra do meio da frase vai ter o centro em 0,0,0. As posteriores vao aumentar o x em 300, e as anteriores diminuir o x em 300 cada
    char.forEach((letter, index) => {
      const distanceFromCenter = index - (length - 1) / 2;
      const x = distanceFromCenter * 6; // Aumenta o espaçamento em 300 unidades a cada letra

      letters.push(new Letter([x, 0, 0], 100, letter as any));
    });
    setObjects(letters);
  };

  const downloadScene = () => {
    const scene = JSON.stringify(objects);

    const element = document.createElement('a');
    const file = new Blob([scene], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = 'scene.json';
    document.body.appendChild(element); // Required for this to work in FireFox
    element.click();
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
          value={text}
          onChange={(_, v) => setText(v || '')}
          label='Texto a ser renderizado'
        />
        <PrimaryButton
          text='Criar texto'
          onClick={createText}
          iconProps={{ iconName: 'Add' }}
        />
      </Stack>
      <VerticalDivider />
      <DefaultButton
        text='Deletar objetos'
        onClick={handleClearObjects}
        iconProps={{ iconName: 'Delete' }}
      />
      <DefaultButton
        text='Limpar cena'
        onClick={handleClear}
        iconProps={{ iconName: 'ClearFormatting' }}
      />

      <VerticalDivider />
      <Text variant='xLarge'>Arquivos</Text>
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
          text='Salvar cena'
          onClick={downloadScene}
          iconProps={{ iconName: 'Save' }}
        />
        <DefaultButton
          text='Carregar cena'
          onClick={createText}
          iconProps={{ iconName: 'OpenFile' }}
        >
          <input type='file' style={{ display: 'none' }} />
        </DefaultButton>
      </Stack>
    </Stack>
  );
};
