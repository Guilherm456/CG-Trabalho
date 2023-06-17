import {
  Checkbox,
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
import React, { useCallback, useState } from 'react';

import { Port } from 'utils/interfaces';
import { arrayNumberToArrayString } from 'utils/others';

const gapStack = { childrenGap: 5 };

const optionsCamera = [
  { key: 'p', text: 'Perspectiva' },
  { key: 'a', text: 'Axométrica' },
];

export const PivotCamera = () => {
  const { camera, handleEditCamera } = useObjects();

  const cameraActual = camera[0];

  const [perspective, setPerspective] = useState(
    cameraActual.perspective ? 'p' : 'a'
  );

  const handleChangePerspectiveType = (
    event?: React.FormEvent,
    option?: IChoiceGroupOption
  ) => {
    setPerspective(option?.key as string);
    cameraActual.setTypePerspective((option?.key as string) === 'p');
    handleEditCamera(cameraActual);
  };

  const [near, setNear] = useState(cameraActual.near);
  const [far, setFar] = useState(cameraActual.far);

  const handleChangeDistance = useCallback(() => {
    cameraActual.setDistances(far, near);
    handleEditCamera(cameraActual);
  }, [cameraActual, far, near, camera]);

  const [distanceProjection, setDistanceProjection] = useState(
    cameraActual.projectionPlanDistance * 100
  );

  const handleChangeDistanceProjection = useCallback(() => {
    cameraActual.setPlanDistance(distanceProjection);
    handleEditCamera(cameraActual);
  }, [cameraActual, distanceProjection, camera]);

  const [xVRP, setXVRP] = useState(cameraActual.VRP[0].toString());
  const [yVRP, setYVRP] = useState(cameraActual.VRP[1].toString());
  const [zVRP, setZVRP] = useState(cameraActual.VRP[2].toString());

  const [xP, setXP] = useState(cameraActual.P[0].toString());
  const [yP, setYP] = useState(cameraActual.P[1].toString());
  const [zP, setZP] = useState(cameraActual.P[2].toString());

  const [xMin, setXMin] = useState(cameraActual.WindowPort.width[0].toString());
  const [yMin, setYMin] = useState(
    cameraActual.WindowPort.height[0].toString()
  );
  const [xMax, setXMax] = useState(cameraActual.WindowPort.width[1].toString());
  const [yMax, setYMax] = useState(
    cameraActual.WindowPort.height[1].toString()
  );

  const [uMin, setUMin] = useState(cameraActual.ViewPort.width[0].toString());
  const [vMin, setVMin] = useState(cameraActual.ViewPort.height[0].toString());
  const [uMax, setUMax] = useState(cameraActual.ViewPort.width[1].toString());
  const [vMax, setVMax] = useState(cameraActual.ViewPort.height[1].toString());

  const [ocultFaces, setOcultFaces] = useState(cameraActual.ocultFaces);

  const handleChangeWindowSize = useCallback(() => {
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
    cameraActual.setWindowSize(windowPort, viewport);
    handleEditCamera(cameraActual);
  }, [camera, cameraActual]);

  const [viewUp, setviewUp] = useState(
    arrayNumberToArrayString(cameraActual.viewUp)
  );

  const handleChangeviewUp = useCallback(() => {
    cameraActual.setviewUp([
      Number(viewUp[0]),
      Number(viewUp[1]),
      Number(viewUp[2]),
    ]);
    handleEditCamera(cameraActual);
  }, [camera, cameraActual]);

  const [sensitivity, setsensitivity] = useState(cameraActual.sensitivity);
  const handleChangesensitivity = useCallback(() => {
    cameraActual.setSenitivity(sensitivity);
    handleEditCamera(cameraActual);
  }, [camera, cameraActual]);

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
        max={cameraActual.far}
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
      <Checkbox
        label='Ocultar faces'
        checked={ocultFaces}
        onChange={(_, value) => {
          cameraActual.setOcultFaces(value!);
          setOcultFaces(value!);
          handleEditCamera(cameraActual);
        }}
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
        onClick={() => {
          cameraActual.setVRP(Number(xVRP), Number(yVRP), Number(zVRP));
          handleEditCamera(cameraActual);
        }}
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
        onClick={() => {
          cameraActual.setP(Number(xP), Number(yP), Number(zP));
          handleEditCamera(cameraActual);
        }}
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
