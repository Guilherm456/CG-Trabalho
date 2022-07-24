import {
  Modal,
  Stack,
  IconButton,
  Text,
  Slider,
  TextField,
  PrimaryButton,
} from '@fluentui/react';
import { ObjectsProviderContext } from 'components/Provider';
import Sphere from 'geometry/spheres';
import { useState } from 'react';
import { arrayNumberToArrayString } from 'utils/others';

const gapStack = { childrenGap: 5 };

interface ModalSphere {
  open: boolean;
  handleOpen: () => void;
  sphere?: string;
}

export const ModalContent = (props: ModalSphere) => {
  const { setObjects, objects } = ObjectsProviderContext();

  const sphere = objects.find((obj) => obj.id === props.sphere);

  const [radius, setRadius] = useState(sphere?.radius ?? 100);
  const [intM, setIntM] = useState(sphere?.intensityM ?? 9);
  const [intP, setIntP] = useState(sphere?.intensityP ?? 9);

  const [Ka, setKa] = useState(arrayNumberToArrayString(sphere?.Ka));
  const [Kd, setKd] = useState(arrayNumberToArrayString(sphere?.Kd));
  const [Ks, setKs] = useState(arrayNumberToArrayString(sphere?.Ks));
  const [Ns, setNs] = useState(sphere?.n.toString() ?? '1');

  const [name, setName] = useState(sphere?.name ?? 'Esfera X');

  const [x, setX] = useState(sphere?.center[0].toString() ?? '0');
  const [y, setY] = useState(sphere?.center[1].toString() ?? '0');
  const [z, setZ] = useState(sphere?.center[2].toString() ?? '0');

  const onCreate = () => {
    if (name === '') setName('Esfera X');
    const [sX, sY, sZ] = [parseFloat(x), parseFloat(y), parseFloat(z)];
    const newSphere = new Sphere({
      center: [sX, -sY, sZ],
      radius: radius,
      Ka: [parseFloat(Ka[0]), parseFloat(Ka[1]), parseFloat(Ka[2])],
      Kd: [parseFloat(Kd[0]), parseFloat(Kd[1]), parseFloat(Kd[2])],
      Ks: [parseFloat(Ks[0]), parseFloat(Ks[1]), parseFloat(Ks[2])],
      Ns: Number(Ns),
      intensityM: intM,
      intensityP: intP,
      name: name,
    });
    if (props.sphere === undefined) setObjects([...objects, newSphere]);
    else
      setObjects(
        objects.map((obj) => (obj.id === props.sphere ? newSphere : obj))
      );
    props.handleOpen();
  };

  return (
    <Modal isOpen={props.open} onDismiss={props.handleOpen}>
      <div style={{ padding: 8 }}>
        <Stack
          horizontal
          verticalAlign='center'
          horizontalAlign='space-between'
        >
          <h2>Opções da esfera</h2>
          <IconButton
            onClick={props.handleOpen}
            iconProps={{ iconName: 'Cancel' }}
          ></IconButton>
        </Stack>
        <Stack tokens={gapStack}>
          <Slider
            label='Raio'
            min={20}
            max={200}
            value={radius}
            onChange={(e, v) => setRadius(e)}
          />
          <Text variant='xLarge'>Ka</Text>
          <Stack horizontal tokens={gapStack}>
            <TextField
              label='R'
              value={Ka[0]}
              onChange={(e) => setKa([e.currentTarget.value, Ka[1], Ka[2]])}
              min={0.0}
              max={1.0}
            />
            <TextField
              label='G'
              value={Ka[1]}
              onChange={(e) => setKa([Ka[0], e.currentTarget.value, Ka[2]])}
              min={0.0}
              max={1.0}
            />
            <TextField
              label='B'
              value={Ka[2]}
              onChange={(e) => setKa([Ka[0], Ka[1], e.currentTarget.value])}
              min={0.0}
              max={1.0}
            />
          </Stack>
          <Text variant='xLarge'>Kd</Text>
          <Stack horizontal tokens={gapStack}>
            <TextField
              label='R'
              value={Kd[0]}
              onChange={(e) => setKd([e.currentTarget.value, Kd[1], Kd[2]])}
              min={0.0}
              max={1.0}
            />
            <TextField
              label='G'
              value={Kd[1]}
              onChange={(e) => setKd([Kd[0], e.currentTarget.value, Kd[2]])}
              min={0.0}
              max={1.0}
            />
            <TextField
              label='B'
              value={Kd[2]}
              onChange={(e) => setKd([Kd[0], Kd[1], e.currentTarget.value])}
              min={0.0}
              max={1.0}
            />
          </Stack>
          <Text variant='xLarge'>Ks</Text>
          <Stack horizontal tokens={gapStack}>
            <TextField
              label='R'
              value={Ks[0]}
              onChange={(e) => setKs([e.currentTarget.value, Ks[1], Ks[2]])}
              min={0.0}
              max={1.0}
            />
            <TextField
              label='G'
              value={Ks[1]}
              onChange={(e) => setKs([Ks[0], e.currentTarget.value, Ks[2]])}
              min={0.0}
              max={1.0}
            />
            <TextField
              label='B'
              value={Ks[2]}
              onChange={(e) => setKs([Ks[0], Ks[1], e.currentTarget.value])}
              min={0.0}
              max={1.0}
            />
          </Stack>
          <TextField
            label='N'
            value={Ns}
            onChange={(e) => setNs(e.currentTarget.value)}
            type='number'
            min={0.0}
          />

          <TextField
            label='Nome da esfera'
            value={name}
            onChange={(e, v) => setName(v!)}
          />

          <Slider
            min={3}
            max={50}
            label='Intensidade de meridianos'
            value={intM}
            onChange={(e, v) => setIntM(e)}
          />
          <Slider
            min={3}
            max={50}
            label='Intensidade de paralelos'
            value={intP}
            onChange={(e, v) => setIntP(e)}
          />
          <Stack horizontal tokens={{ childrenGap: 10 }}>
            <TextField
              label='X'
              type='number'
              value={x}
              onChange={(e, v) => setX(v!)}
            />
            <TextField
              label='Y'
              type='number'
              value={y}
              onChange={(e, v) => setY(v!)}
            />
            <TextField
              label='Z'
              type='number'
              value={z}
              onChange={(e, v) => setZ(v!)}
            />
          </Stack>

          <PrimaryButton onClick={onCreate}>
            {sphere !== undefined ? 'Editar' : 'Criar'} esfera
          </PrimaryButton>
        </Stack>
      </div>
    </Modal>
  );
};
