import {
  ChoiceGroup,
  IChoiceGroupOption,
  Label,
  PrimaryButton,
  Slider,
  Stack,
  Text,
  TextField,
  VerticalDivider,
} from '@fluentui/react';
import { useObjects } from 'components/Provider';
import React, { useState } from 'react';

import { Port } from 'utils/interfaces';
import { arrayNumberToArrayString } from 'utils/others';

const gapStack = { childrenGap: 5 };

const optionsCamera = [
  { key: 'p', text: 'Perspectiva' },
  { key: 'a', text: 'Axométrica' },
];

export const PivotCamera = () => {
  const { camera } = useObjects();

  const [perspective, setPerspective] = useState(
    camera.perspective ? 'p' : 'a'
  );

  const handleChangePerspectiveType = (
    event?: React.FormEvent,
    option?: IChoiceGroupOption
  ) => {
    setPerspective(option?.key as string);
    camera.setTypePerspective((option?.key as string) === 'p');
  };

  const [near, setNear] = useState(camera.near);
  const [far, setFar] = useState(camera.far);

  const handleChangeDistance = () => {
    camera.setDistances(far, near);
  };

  const [distanceProjection, setDistanceProjection] = useState(
    camera.projectionPlanDistance * 100
  );

  const handleChangeDistanceProjection = () => {
    camera.setPlanDistance(distanceProjection);
  };

  const [xVRP, setXVRP] = useState(camera.VRP[0].toString());
  const [yVRP, setYVRP] = useState(camera.VRP[1].toString());
  const [zVRP, setZVRP] = useState(camera.VRP[2].toString());

  const [xP, setXP] = useState(camera.P[0].toString());
  const [yP, setYP] = useState(camera.P[1].toString());
  const [zP, setZP] = useState(camera.P[2].toString());

  const [xMin, setXMin] = useState(camera.WindowPort.width[0].toString());
  const [yMin, setYMin] = useState(camera.WindowPort.height[0].toString());
  const [xMax, setXMax] = useState(camera.WindowPort.width[1].toString());
  const [yMax, setYMax] = useState(camera.WindowPort.height[1].toString());

  const [uMin, setUMin] = useState(camera.ViewPort.width[0].toString());
  const [vMin, setVMin] = useState(camera.ViewPort.height[0].toString());
  const [uMax, setUMax] = useState(camera.ViewPort.width[1].toString());
  const [vMax, setVMax] = useState(camera.ViewPort.height[1].toString());

  const handleChangeWindowSize = () => {
    const [uMinV, uMaxV, vMinV, vMaxV, xMinV, xMaxV, yMinV, yMaxV] = [
      Number(uMin),
      Number(uMax),
      Number(vMin),
      Number(vMax),
      Number(xMin),
      Number(xMax),
      Number(yMin),
      Number(yMax),
    ];
    const viewport: Port = {
      width: [uMinV, uMaxV],
      height: [vMinV, vMaxV],
    };
    const windowPort: Port = {
      width: [xMinV, xMaxV],
      height: [yMinV, yMaxV],
    };
    camera.setWindowSize(windowPort, viewport);
  };

  const [viewUp, setviewUp] = useState(arrayNumberToArrayString(camera.viewUp));
  const handleChangeviewUp = () => {
    camera.setviewUp([Number(viewUp[0]), Number(viewUp[1]), Number(viewUp[2])]);
  };

  const [sensitivity, setsensitivity] = useState(camera.sensitivity);
  const handleChangesensitivity = () => {
    camera.setSenitivity(sensitivity);
  };

  return (
    <Stack tokens={{ childrenGap: 5 }}>
      <Slider
        label='Distância máxima'
        max={10000}
        step={100}
        value={far}
        onChange={(e) => setFar(e)}
        snapToStep
      />
      <Slider
        label='Distância mínima'
        max={camera.far}
        value={near}
        onChange={(e) => setNear(e)}
      />
      <PrimaryButton text='Mudar distâncias' onClick={handleChangeDistance} />
      <VerticalDivider />
      <ChoiceGroup
        label='Selecione o tipo de visualização'
        selectedKey={perspective}
        onChange={handleChangePerspectiveType}
        options={optionsCamera}
      />
      <VerticalDivider />
      <Slider
        label='Distância do centro do plano de projeção'
        min={0}
        max={100}
        value={distanceProjection}
        onChange={(v) => setDistanceProjection(v)}
      />
      <PrimaryButton
        text='Mudar distância'
        onClick={handleChangeDistanceProjection}
      />
      <VerticalDivider />
      <Label>VRP</Label>
      <Stack horizontal tokens={gapStack}>
        <TextField
          label='X'
          type='number'
          value={xVRP}
          onChange={(e, n) => setXVRP(n!)}
        />
        <TextField
          label='Y'
          type='number'
          value={yVRP}
          onChange={(e, n) => setYVRP(n!)}
        />
        <TextField
          label='Z'
          type='number'
          value={zVRP}
          onChange={(e, n) => setZVRP(n!)}
        />
      </Stack>
      <PrimaryButton
        text='Alterar VRP'
        onClick={() => camera.setVRP(Number(xVRP), Number(yVRP), Number(zVRP))}
      />
      <Label>P</Label>
      <Stack horizontal tokens={gapStack}>
        <TextField
          label='X'
          type='number'
          value={xP}
          onChange={(e, n) => setXP(n!)}
        />
        <TextField
          label='Y'
          type='number'
          value={yP}
          onChange={(e, n) => setYP(n!)}
        />
        <TextField
          label='Z'
          type='number'
          value={zP}
          onChange={(e, n) => setZP(n!)}
        />
      </Stack>
      <PrimaryButton
        text='Alterar P'
        onClick={() => camera.setP(Number(xP), Number(yP), Number(zP))}
      />
      <VerticalDivider />
      <Text variant='mediumPlus'>WindowSize</Text>
      <Stack horizontal tokens={gapStack}>
        <TextField
          label='X minimo'
          type='number'
          value={xMin}
          onChange={(e, n) => setXMin(n!)}
        />
        <TextField
          label='X maximo'
          type='number'
          value={xMax}
          onChange={(e, n) => setXMax(n!)}
        />
      </Stack>
      <Stack horizontal tokens={gapStack}>
        <TextField
          label='Y minimo'
          type='number'
          value={yMin}
          onChange={(e, n) => setYMin(n!)}
        />
        <TextField
          label='Y maximo'
          type='number'
          value={yMax}
          onChange={(e, n) => setYMax(n!)}
        />
      </Stack>
      <Stack horizontal tokens={gapStack}>
        <TextField
          label='U minimo'
          type='number'
          value={uMin}
          onChange={(e, n) => setUMin(n!)}
        />
        <TextField
          label='U máximo'
          type='number'
          value={uMax}
          onChange={(e, n) => setUMax(n!)}
        />
      </Stack>
      <Stack horizontal tokens={gapStack}>
        <TextField
          label='V minimo'
          type='number'
          value={vMin}
          onChange={(e, n) => setVMin(n!)}
        />
        <TextField
          label='V máximo'
          type='number'
          value={vMax}
          onChange={(e, n) => setVMax(n!)}
        />
      </Stack>
      <PrimaryButton
        text='Salvar WindowSize'
        onClick={handleChangeWindowSize}
      />
      <VerticalDivider />
      <Text variant='mediumPlus'>View Up</Text>
      <Stack horizontal tokens={gapStack}>
        <TextField
          label='X'
          value={viewUp[0]}
          onChange={(e, n) => setviewUp([n!, viewUp[1], viewUp[2]])}
          type='number'
        />
        <TextField
          label='Y'
          value={viewUp[1]}
          onChange={(e, n) => setviewUp([viewUp[0], n!, viewUp[2]])}
          type='number'
        />
        <TextField
          label='Z'
          value={viewUp[2]}
          onChange={(e, n) => setviewUp([viewUp[0], viewUp[1], n!])}
          type='number'
        />
      </Stack>
      <PrimaryButton text='Salvar View Up' onClick={handleChangeviewUp} />
      <VerticalDivider />
      <Slider
        label='Sensibilidade'
        min={1}
        max={100}
        value={sensitivity}
        onChange={(e) => setsensitivity(e)}
      />
      <PrimaryButton
        text='Mudar sensibilidade'
        onClick={handleChangesensitivity}
      />
    </Stack>
  );
};
