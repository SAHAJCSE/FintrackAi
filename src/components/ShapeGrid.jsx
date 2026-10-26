import React, { useEffect, useRef } from 'react';

function ShapeGrid({
  shape = 'square',
  direction = 'diagonal',
  lineColor = '#94a3b8',
  hoverColor = '#10b981',
  hoverFillColor = '#10b981',
  fillOpacity = 0.45,
  cellSize = 40,
  speed = 0.5,
  tiltX = 0,
  tiltY = 0,
  rainbow = false,
  glow = 0.2,
}) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d');
    if (!canvas || !context) return undefined;

    let frameId = 0;
    let width = 0;
    let height = 0;
    let pointerX = -1000;
    let pointerY = -1000;
    let startTime = 0;
    const cell = Math.max(12, cellSize);

    const resize = () => {
      const bounds = canvas.getBoundingClientRect();
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      width = bounds.width;
      height = bounds.height;
      canvas.width = Math.round(width * ratio);
      canvas.height = Math.round(height * ratio);
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
    };

    const onPointerMove = (event) => {
      const bounds = canvas.getBoundingClientRect();
      pointerX = event.clientX - bounds.left;
      pointerY = event.clientY - bounds.top;
    };
    const onPointerLeave = () => {
      pointerX = -1000;
      pointerY = -1000;
    };

    const draw = (time) => {
      if (!startTime) startTime = time;
      const elapsed = (time - startTime) * speed * 0.001;
      context.clearRect(0, 0, width, height);
      context.save();
      context.translate(tiltX, tiltY);

      const rows = Math.ceil((height + cell * 2) / cell);
      const columns = Math.ceil((width + cell * 2) / cell) + (direction === 'diagonal' ? rows : 0);
      for (let row = -1; row < rows; row += 1) {
        const rowOffset = direction === 'diagonal' ? row * cell * 0.5 : 0;
        for (let column = -1; column < columns; column += 1) {
          const x = column * cell - (direction === 'diagonal' ? cell * rows * 0.25 : 0) + rowOffset;
          const y = row * cell;
          const centerX = x + cell / 2;
          const centerY = y + cell / 2;
          const distance = Math.hypot(centerX - pointerX, centerY - pointerY);
          const proximity = Math.max(0, 1 - distance / (cell * 3.2));
          const pulse = (Math.sin(elapsed + row * 0.16 + column * 0.12) + 1) * 0.5;
          const alpha = Math.min(0.95, proximity * 0.8 + pulse * 0.04);
          const stroke = rainbow
            ? `hsl(${(time * 0.025 + row * 8 + column * 4) % 360} 70% 55%)`
            : proximity > 0.08 ? hoverColor : lineColor;
          const size = shape === 'circle' ? cell * 0.38 : cell * 0.72;

          context.globalAlpha = alpha;
          context.strokeStyle = stroke;
          context.lineWidth = 1;
          context.shadowColor = proximity > 0.08 ? hoverColor : 'transparent';
          context.shadowBlur = proximity * glow * 20;
          if (proximity > 0.08) {
            context.fillStyle = hoverFillColor;
            context.globalAlpha = proximity * fillOpacity;
            if (shape === 'circle') {
              context.beginPath();
              context.arc(centerX, centerY, size / 2, 0, Math.PI * 2);
              context.fill();
            } else {
              context.fillRect(centerX - size / 2, centerY - size / 2, size, size);
            }
            context.globalAlpha = alpha;
          }
          if (shape === 'circle') {
            context.beginPath();
            context.arc(centerX, centerY, size / 2, 0, Math.PI * 2);
            context.stroke();
          } else {
            context.strokeRect(centerX - size / 2, centerY - size / 2, size, size);
          }
        }
      }

      context.restore();
      context.globalAlpha = 1;
      frameId = window.requestAnimationFrame(draw);
    };

    resize();
    frameId = window.requestAnimationFrame(draw);
    const observer = new ResizeObserver(resize);
    observer.observe(canvas);
    canvas.addEventListener('pointermove', onPointerMove);
    canvas.addEventListener('pointerleave', onPointerLeave);

    return () => {
      window.cancelAnimationFrame(frameId);
      observer.disconnect();
      canvas.removeEventListener('pointermove', onPointerMove);
      canvas.removeEventListener('pointerleave', onPointerLeave);
    };
  }, [cellSize, direction, fillOpacity, glow, hoverColor, hoverFillColor, lineColor, rainbow, shape, speed, tiltX, tiltY]);

  return <canvas ref={canvasRef} className="shape-grid-canvas" aria-hidden="true" />;
}

export default ShapeGrid;
