import React, { useState } from 'react';
import {
  DefaultButton,
  IconButton,
  Modal,
  Panel,
  SpinButton,
  Stack,
} from '@fluentui/react';

import Canva from './components/Canva';

function App() {
  const [modalOpen, setModalOpen] = useState(false);

  const handleOpen = () => setModalOpen(!modalOpen);

  return (
    <div style={{ display: 'flex', width: '100vw', height: '95vh' }}>
      <div className='canvaArea' style={{ flexGrow: 1 }}>
        <Canva />
      </div>
      <Panel isOpen={true} isBlocking={false} headerText='Opções'>
        <Stack>
          <DefaultButton text='Criar esfera' onClick={handleOpen} />
        </Stack>
      </Panel>
      <Modal isOpen={modalOpen} onDismiss={handleOpen}>
        <div>
          <h2>Opções da esfera</h2>
          <IconButton iconProps={{ iconName: 'Cancel' }} onClick={handleOpen} />
        </div>
        <div>
          <Stack>
            <SpinButton label='Raio' defaultValue='0' />
          </Stack>
        </div>
      </Modal>
    </div>
  );
}

export default App;
