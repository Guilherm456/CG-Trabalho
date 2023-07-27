import {
  IconButton,
  Modal,
  PrimaryButton,
  Stack,
  Text,
  TextField,
} from '@fluentui/react';
import { useObjects } from 'components/Provider';
import { FC, useState } from 'react';
import { arrayNumberToArrayString } from 'utils/others';

const gapStack = { childrenGap: 5 };

interface ModalLetter {
  open: boolean;
  handleOpen: () => void;
  letterID: string;
}

export const ModalContent: FC<ModalLetter> = ({
  open,
  handleOpen,
  letterID,
}) => {
  const { objects, handleChangeLetter } = useObjects();
  const letter = objects.find((obj) => obj.id === letterID);

  const [Ka, setKa] = useState(arrayNumberToArrayString(letter?.Ka));
  const [Kd, setKd] = useState(arrayNumberToArrayString(letter?.Kd));
  const [Ks, setKs] = useState(arrayNumberToArrayString(letter?.Ks));
  const [Ns, setNs] = useState(letter?.n.toString() ?? '1');

  const onCreate = () => {
    if (!letter) return;

    letter.setIlumination(
      [parseFloat(Ka[0]), parseFloat(Ka[1]), parseFloat(Ka[2])], // Ka
      [parseFloat(Kd[0]), parseFloat(Kd[1]), parseFloat(Kd[2])], // Kd
      [parseFloat(Ks[0]), parseFloat(Ks[1]), parseFloat(Ks[2])], // Ks
      parseFloat(Ns)
    );
    handleChangeLetter(letter);
    handleOpen();
  };
  return (
    <Modal isOpen={open} onDismiss={handleOpen}>
      <div style={{ padding: 8 }}>
        <Stack
          horizontal
          verticalAlign="center"
          horizontalAlign="space-between"
        >
          <h2>Opções da esfera</h2>
          <IconButton
            onClick={handleOpen}
            iconProps={{ iconName: 'Cancel' }}
          ></IconButton>
        </Stack>
        <Stack tokens={gapStack}>
          <Text variant="xLarge">Ka</Text>
          <Stack horizontal tokens={gapStack}>
            <TextField
              label="R"
              value={Ka[0]}
              onChange={(e) => setKa([e.currentTarget.value, Ka[1], Ka[2]])}
              min={0.0}
              max={1.0}
            />
            <TextField
              label="G"
              value={Ka[1]}
              onChange={(e) => setKa([Ka[0], e.currentTarget.value, Ka[2]])}
              min={0.0}
              max={1.0}
            />
            <TextField
              label="B"
              value={Ka[2]}
              onChange={(e) => setKa([Ka[0], Ka[1], e.currentTarget.value])}
              min={0.0}
              max={1.0}
            />
          </Stack>
          <Text variant="xLarge">Kd</Text>
          <Stack horizontal tokens={gapStack}>
            <TextField
              label="R"
              value={Kd[0]}
              onChange={(e) => setKd([e.currentTarget.value, Kd[1], Kd[2]])}
              min={0.0}
              max={1.0}
            />
            <TextField
              label="G"
              value={Kd[1]}
              onChange={(e) => setKd([Kd[0], e.currentTarget.value, Kd[2]])}
              min={0.0}
              max={1.0}
            />
            <TextField
              label="B"
              value={Kd[2]}
              onChange={(e) => setKd([Kd[0], Kd[1], e.currentTarget.value])}
              min={0.0}
              max={1.0}
            />
          </Stack>
          <Text variant="xLarge">Ks</Text>
          <Stack horizontal tokens={gapStack}>
            <TextField
              label="R"
              value={Ks[0]}
              onChange={(e) => setKs([e.currentTarget.value, Ks[1], Ks[2]])}
              min={0.0}
              max={1.0}
            />
            <TextField
              label="G"
              value={Ks[1]}
              onChange={(e) => setKs([Ks[0], e.currentTarget.value, Ks[2]])}
              min={0.0}
              max={1.0}
            />
            <TextField
              label="B"
              value={Ks[2]}
              onChange={(e) => setKs([Ks[0], Ks[1], e.currentTarget.value])}
              min={0.0}
              max={1.0}
            />
          </Stack>
          <TextField
            label="N"
            value={Ns}
            onChange={(e) => setNs(e.currentTarget.value)}
            type="number"
            min={0.0}
          />
        </Stack>
        <PrimaryButton onClick={onCreate}>Editar letra</PrimaryButton>
      </div>
    </Modal>
  );
};
