import {
  Stack,
  TextField,
  DefaultButton,
  Text,
  PivotItem,
} from '@fluentui/react';
import { useState } from 'react';

const gapStack = { childrenGap: 5 };

export const PivotCamera = () => {
  const [xVRP, setXVRP] = useState('0');
  const [yVRP, setYVRP] = useState('0');
  const [zVRP, setZVRP] = useState('0');

  const [xP, setXP] = useState('0');
  const [yP, setYP] = useState('0');
  const [zP, setZP] = useState('0');

  const handleChangeCamera = () => {};

  return (
    <Stack>
      <Text variant='xLarge'>Editar câmera</Text>
      <Text variant='mediumPlus'>VRP</Text>
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
      <Text variant='mediumPlus'>P</Text>
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
      <DefaultButton text='Aplicar' onClick={() => handleChangeCamera()} />
    </Stack>
  );
};
