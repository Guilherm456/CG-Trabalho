import {
  Dropdown,
  PrimaryButton,
  Stack,
  Text,
  TextField,
  VerticalDivider,
} from '@fluentui/react';
import { useObjects } from 'components/Provider';
import { useState } from 'react';
import { vec3 } from 'utils/interfaces';

const gapStack = { childrenGap: 5 };

const optionsDropdownType = [
  { key: 0, text: 'Flat Shading', value: 0 },
  { key: 1, text: 'Phong Shading', value: 1 },
  // { key: 2, text: 'Gouraud Shading', value: 2 },
];
export const PivotLight = () => {
  const { light, handleChangeLight } = useObjects();
  const [typeShading, setTypeShading] = useState(light.lightType);

  const handleChangeTypeLight = () => {
    light.setType(typeShading);
    handleChangeLight(light);
  };

  const [intensityLight, setIntensityLight] = useState([
    light.lightIntensity[0].toString(),
    light.lightIntensity[1].toString(),
    light.lightIntensity[2].toString(),
  ]);

  const handleChangeInputIntensityLight = (
    e: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>,
    v: string,
    i: number
  ) => {
    const newIntensityLight = [...intensityLight];
    newIntensityLight[i] = v;
    setIntensityLight(newIntensityLight);
  };

  const [ambientLightIntensity, setAmbientLightIntensity] = useState([
    light.ambientLightIntensity[0].toString(),
    light.ambientLightIntensity[1].toString(),
    light.ambientLightIntensity[2].toString(),
  ]);
  const handleChangeInputAmbientLightIntensity = (
    e: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>,
    v: string,
    i: number
  ) => {
    const newAmbientLightIntensity = [...ambientLightIntensity];
    newAmbientLightIntensity[i] = v;
    setAmbientLightIntensity(newAmbientLightIntensity);
  };

  const [x, setX] = useState(light.position[0].toString());
  const [y, setY] = useState(light.position[1].toString());
  const [z, setZ] = useState(light.position[2].toString());

  const handleEditLight = () => {
    const ambientI: vec3 = [
      Number(ambientLightIntensity[0]),
      Number(ambientLightIntensity[1]),
      Number(ambientLightIntensity[2]),
    ];
    const lightI: vec3 = [
      Number(intensityLight[0]),
      Number(intensityLight[1]),
      Number(intensityLight[2]),
    ];
    light.setIntensity(ambientI, lightI);

    const position: vec3 = [Number(x), Number(y), Number(z)];
    light.setPosition(position);

    handleChangeLight(light);
  };

  return (
    <Stack tokens={gapStack}>
      <Dropdown
        label="Tipo de sombreamento"
        options={optionsDropdownType}
        selectedKey={typeShading}
        onChange={(e, o) => setTypeShading(o?.key as 0 | 1 | 2)}
      />
      <PrimaryButton
        text="Alterar tipo da luz"
        onClick={handleChangeTypeLight}
      />

      <VerticalDivider />
      <Text variant="xLarge">Posição</Text>
      <Stack horizontal tokens={gapStack}>
        <TextField label="X" value={x} onChange={(e, v) => setX(v!)} />
        <TextField label="Y" value={y} onChange={(e, v) => setY(v!)} />
        <TextField label="Z" value={z} onChange={(e, v) => setZ(v!)} />
      </Stack>

      <VerticalDivider />
      <Text variant="xLarge">Intensidade da iluminação</Text>
      <Stack horizontal tokens={gapStack}>
        <TextField
          label="R"
          value={intensityLight[0]}
          onChange={(e, v) => handleChangeInputIntensityLight(e, v!, 0)}
          min={0}
          max={255}
        />
        <TextField
          label="G"
          value={intensityLight[1]}
          onChange={(e, v) => handleChangeInputIntensityLight(e, v!, 1)}
          min={0}
          max={255}
        />
        <TextField
          label="B"
          value={intensityLight[2]}
          onChange={(e, v) => handleChangeInputIntensityLight(e, v!, 2)}
          min={0}
          max={255}
        />
      </Stack>
      <VerticalDivider />
      <Text variant="xLarge">Intensidade da iluminação do ambiente</Text>
      <Stack horizontal tokens={gapStack}>
        <TextField
          label="R"
          value={ambientLightIntensity[0]}
          onChange={(e, v) => handleChangeInputAmbientLightIntensity(e, v!, 0)}
          min={0}
          max={255}
        />
        <TextField
          label="G"
          value={ambientLightIntensity[1]}
          onChange={(e, v) => handleChangeInputAmbientLightIntensity(e, v!, 1)}
          min={0}
          max={255}
        />
        <TextField
          label="B"
          value={ambientLightIntensity[2]}
          onChange={(e, v) => handleChangeInputAmbientLightIntensity(e, v!, 2)}
          min={0}
          max={255}
        />
      </Stack>

      <PrimaryButton onClick={handleEditLight}>Editar</PrimaryButton>
    </Stack>
  );
};
