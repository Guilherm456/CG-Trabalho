import {
  Checkbox,
  Dropdown,
  PrimaryButton,
  Stack,
  Text,
  TextField,
  VerticalDivider,
} from '@fluentui/react';
import { ObjectsProviderContext } from 'components/Provider';
import { useState } from 'react';
import { Coord } from 'utils/interfaces';

const gapStack = { childrenGap: 5 };

const optionsDropdown = [
  { key: 'X', text: 'X' },
  { key: 'Y', text: 'Y' },
  { key: 'Z', text: 'Z' },
];

const optionsDropdownType = [
  { key: 'flat', text: 'Flat Shading' },
  { key: 'phong', text: 'Phong Shading' },
  { key: 'gouraud', text: 'Gouraud Shading' },
];
export const PivotLight = () => {
  const { light } = ObjectsProviderContext();

  const [typeShading, setTypeShading] = useState('flat');

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

  const [rotate, setRotate] = useState(light.rotate);
  const [angle, setAngle] = useState(light.angle.toString());
  const [direction, setDirection] = useState<'X' | 'Y' | 'Z'>(light.direction);

  const handleEditLight = () => {
    const ambientI: Coord = [
      parseFloat(ambientLightIntensity[0]),
      parseFloat(ambientLightIntensity[1]),
      parseFloat(ambientLightIntensity[2]),
    ];
    const lightI: Coord = [
      parseFloat(intensityLight[0]),
      parseFloat(intensityLight[1]),
      parseFloat(intensityLight[2]),
    ];
    light.setIntensity(ambientI, lightI);

    light.setRotate(rotate, Number(angle), direction);

    const position: Coord = [Number(x), Number(y), Number(z)];
    light.setPosition(position);
  };

  return (
    <Stack tokens={gapStack}>
      <Dropdown
        label='Tipo de sombreamento'
        options={optionsDropdownType}
        selectedKey={typeShading}
        onChange={(e, o) => setTypeShading(o?.key as string)}
      />
      <Text variant='xLarge'>Intensidade da iluminação</Text>

      <Stack horizontal tokens={gapStack}>
        <TextField
          label='R'
          value={intensityLight[0]}
          onChange={(e, v) => handleChangeInputIntensityLight(e, v!, 0)}
          min={0}
          max={255}
        />
        <TextField
          label='G'
          value={intensityLight[1]}
          onChange={(e, v) => handleChangeInputIntensityLight(e, v!, 1)}
          min={0}
          max={255}
        />
        <TextField
          label='B'
          value={intensityLight[2]}
          onChange={(e, v) => handleChangeInputIntensityLight(e, v!, 2)}
          min={0}
          max={255}
        />
      </Stack>
      <VerticalDivider />
      <Text variant='xLarge'>Intensidade da iluminação do ambiente</Text>
      <Stack horizontal tokens={gapStack}>
        <TextField
          label='R'
          value={ambientLightIntensity[0]}
          onChange={(e, v) => handleChangeInputAmbientLightIntensity(e, v!, 0)}
          min={0}
          max={255}
        />
        <TextField
          label='G'
          value={ambientLightIntensity[1]}
          onChange={(e, v) => handleChangeInputAmbientLightIntensity(e, v!, 1)}
          min={0}
          max={255}
        />
        <TextField
          label='B'
          value={ambientLightIntensity[2]}
          onChange={(e, v) => handleChangeInputAmbientLightIntensity(e, v!, 2)}
          min={0}
          max={255}
        />
      </Stack>
      <Stack horizontal tokens={gapStack}>
        <TextField label='X' value={x} onChange={(e, v) => setX(v!)} />
        <TextField label='Y' value={y} onChange={(e, v) => setY(v!)} />
        <TextField label='Z' value={z} onChange={(e, v) => setZ(v!)} />
      </Stack>
      <VerticalDivider />

      <Text variant='xLarge'>Rotação</Text>
      <Checkbox
        label='Rotacionar'
        checked={rotate}
        onChange={(e, c) => setRotate(c!)}
      />

      <TextField
        label='Angulo da rotação'
        disabled={!rotate}
        value={angle}
        onChange={(e, n) => setAngle(n!)}
      />
      <Dropdown
        selectedKey={direction}
        disabled={!rotate}
        onChange={(e, o) => setDirection(o?.key as 'X' | 'Y' | 'Z')}
        options={optionsDropdown}
      />
      <PrimaryButton onClick={handleEditLight}>Editar</PrimaryButton>
    </Stack>
  );
};
