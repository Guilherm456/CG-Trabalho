import { useEffect, useRef } from 'react';
import { useObjects } from './Provider';

const ZBuffer = ({}) => {
  const { objects, camera } = useObjects();
  const canvas = useRef();

  const zBuffer = new Array(500)
    .fill(Infinity)
    .map(() => new Array(500).fill(-Infinity));

  const draw = () => {
    if (!canvas.current) return;

    const ctx = (canvas.current as any).getContext(
      'webgl'
    ) as WebGLRenderingContext;

    const buffer = ctx.createFramebuffer();

    ctx.bindFramebuffer(ctx.FRAMEBUFFER, buffer);
    ctx.clearColor(0, 0, 0, 1);
    ctx.clear(ctx.COLOR_BUFFER_BIT);

    // Descomentar APENAS quando funcionar uma vez
    // Ele vai ficar atualizando a tela a cada 1 segundo
    // setTimeout(draw, 1000);
    // Esse código faz a camera ficar se movendo
    // camera.updatePositionCamera(-camera.sensitivity, 'Z', true);
  };
  useEffect(() => {
    setTimeout(draw, 100);
  }, [canvas, camera, objects]);

  return (
    <canvas
      ref={canvas as any}
      onClick={() => {
        camera.updatePositionCamera(-camera.sensitivity, 'Z', true);
      }}
    />
  );
};

export default ZBuffer;
