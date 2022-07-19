import { useState } from 'react';
import { DefaultButton, PrimaryButton, Stack } from '@fluentui/react';
import { ObjectsProviderContext } from 'components/Provider';
import { ModalContent } from './Modal_Sphere';

const gapStack = { childrenGap: 5 };

export const PivotScene = () => {
  const { handleClear, handleClearObjects } = ObjectsProviderContext();
  const [modalOpen, setModalOpen] = useState(false);

  const handleOpen = () => setModalOpen(!modalOpen);

  return (
    <div>
      <Stack tokens={gapStack}>
        <PrimaryButton
          text='Criar esfera'
          onClick={handleOpen}
          iconProps={{ iconName: 'Add' }}
        />
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
      </Stack>
      {modalOpen ? (
        <ModalContent handleOpen={handleOpen} open={modalOpen} />
      ) : null}
    </div>
  );
};
