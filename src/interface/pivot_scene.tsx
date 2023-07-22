import {
  DefaultButton,
  PrimaryButton,
  Slider,
  Stack,
  Text,
  TextField,
  VerticalDivider,
} from '@fluentui/react';
import { Camera } from 'components/Camera';
import { Letter } from 'components/Letter';
import { Light } from 'components/Light';
import { useObjects } from 'components/Provider';
import { useRef, useState } from 'react';

const gapStack = { childrenGap: 5 };

export const PivotScene = () => {
  const {
    handleClear,
    handleClearObjects,
    setObjects,
    objects,
    camera,
    light,
    setLight,
    setCamera,
  } = useObjects();
  const [text, setText] = useState(
    objects.map((letter) => letter.typeLetter).join('')
  );
  const ref = useRef<HTMLInputElement>(null);

  const [ZDepth, setZDepth] = useState(100);
  const handleOpenScene = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) {
      return;
    } else if (file.type !== 'application/json') {
      alert('O arquivo deve ser do tipo JSON.');
      return;
    }

    try {
      const fileContent = await file.text();
      const parsedScene = JSON.parse(fileContent);

      // Verifique se o arquivo JSON possui a estrutura correta
      if (
        !parsedScene ||
        !Array.isArray(parsedScene.objects) ||
        !parsedScene.camera ||
        !parsedScene.light
      ) {
        alert('Arquivo JSON inválido. Verifique a estrutura do arquivo.');
        return;
      }

      const cameraLocal = new Camera(
        parsedScene.camera.VRP,
        parsedScene.camera.target,
        parsedScene.camera.ViewPort,
        parsedScene.camera.WindowPort,
        parsedScene.camera.far,
        parsedScene.camera.near
      );
      setCamera(cameraLocal);

      const lightLocal = new Light(
        parsedScene.light.position.slice(0, 3),
        parsedScene.light.ambientLightIntensity,
        parsedScene.light.lightIntensity
      );
      setLight(lightLocal);

      // Atualize o estado com os objetos, câmera e iluminação lidos do arquivo JSON
      const objectsLocal: Letter[] = [];
      for (let object of parsedScene.objects) {
        const newObject = new Letter(
          object.center,
          object.zDepth,
          object.typeLetter,
          object.Ka,
          object.Kd,
          object.Ks,
          object.n,
          object.faces
        );
        objectsLocal.push(newObject);
      }

      setObjects(objectsLocal);
    } catch (error) {
      console.error('Erro ao ler o arquivo JSON:', error);
      alert(
        'Ocorreu um erro ao ler o arquivo JSON. Verifique o console para mais detalhes.'
      );
    }
  };

  const downloadScene = () => {
    const scene = JSON.stringify({ objects, light, camera });

    const element = document.createElement('a');
    const file = new Blob([scene], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = 'scene.json';
    document.body.appendChild(element); // Required for this to work in FireFox
    element.click();
  };

  const createText = () => {
    if (text === '') return;
    const letters: Letter[] = [];

    //Remove caracteres especiais e transforma em maiúsculo
    const textWithoutSpecialCharacters = text
      .replaceAll(/[^a-zA-Z0-9 ]/g, '')
      .toUpperCase();

    setText(textWithoutSpecialCharacters);
    const char = textWithoutSpecialCharacters.split('');
    const length = char.length;

    //Para cada letra, vai criar uma nova Letter, porém o centro da letra vai se dar pela posição da letra
    //Onde a letra do meio da frase vai ter o centro em 0,0,0. As posteriores vao aumentar o x em 300, e as anteriores diminuir o x em 300 cada
    char.forEach((letter, index) => {
      if (letter === ' ') return;
      const distanceFromCenter = index - (length - 1) / 2;
      const x = distanceFromCenter * 6; // Aumenta o espaçamento a cada letra

      letters.push(new Letter([x, 0, 0], ZDepth, letter as any));
    });
    setObjects(letters);
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
          value={text}
          onChange={(_, value) => setText(value || '')}
        />
        <Slider
          label="Profundidade do texto"
          min={50}
          max={1000}
          step={50}
          defaultValue={ZDepth}
          showValue
          onChange={(value) => setZDepth(value || 100)}
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
          iconProps={{ iconName: 'OpenFile' }}
          onClick={() => {
            ref.current?.click();
          }}
        >
          <input
            type="file"
            accept="application/json"
            onChange={handleOpenScene}
            id="file"
            ref={ref}
            style={{
              display: 'none',
            }}
          />
        </DefaultButton>
      </Stack>
    </Stack>
  );
};
