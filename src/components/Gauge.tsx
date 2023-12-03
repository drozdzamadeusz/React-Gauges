import React, { useEffect, useRef } from "react";
import "./Gauge.css";

const HEIHGT = 400;
const WIDTH = 400;

const drawScaleLabels = (
  ctx: CanvasRenderingContext2D,
  val_min: number,
  val_max: number
) => {
  const start_x = WIDTH / 2;
  const start_y = HEIHGT / 2;
  const end_x = WIDTH / 2;
  const end_y = HEIHGT;

  //Calculate differences
  const dx = end_x - start_x;
  const dy = end_y - start_y;
  console.log(dx, dy);

  ctx.beginPath();

  const max_rotation = 340;
  const rotation_align_adjustment = (360 - max_rotation) / 2;

  const num_labels = Math.max(20, val_min - val_max);

  for (let i = val_min; i <= num_labels; i++) {
    // Angle in degrees and radians
    const angle_degrees = i + rotation_align_adjustment;
    const angle_radians = (angle_degrees * Math.PI) / 180;

    // Apply rotation
    const new_dx = dx * Math.cos(angle_radians) - dy * Math.sin(angle_radians);
    const new_dy = dx * Math.sin(angle_radians) + dy * Math.cos(angle_radians);

    const new_end_x = start_x + new_dx;
    const new_end_y = start_y + new_dy;

    ctx.fillText(String(i), new_end_x, new_end_y);
  }

  ctx.stroke();
};

const drawPointer = (
  ctx: CanvasRenderingContext2D,
  val: number,
  val_min: number,
  val_max: number
) => {
  const start_x = WIDTH / 2;
  const start_y = HEIHGT / 2;
  const end_x = WIDTH / 2;
  const end_y = HEIHGT;

  //Calculate differences
  const dx = end_x - start_x;
  const dy = end_y - start_y;
  console.log(dx, dy);

  //   ctx.beginPath();

  //   const max_rotation = 340;
  //   const rotation_align_adjustment = (360 - max_rotation) / 2;

  //   for (let i = 0; i <= max_rotation; i++) {
  //     // Angle in degrees and radians
  //     const angle_degrees = i + rotation_align_adjustment;
  //     console.log(angle_degrees);
  //     const angle_radians = (angle_degrees * Math.PI) / 180;

  //     // Apply rotation
  //     const new_dx = dx * Math.cos(angle_radians) - dy * Math.sin(angle_radians);
  //     const new_dy = dx * Math.sin(angle_radians) + dy * Math.cos(angle_radians);

  //     const new_end_x = start_x + new_dx;
  //     const new_end_y = start_y + new_dy;

  //     ctx.moveTo(start_x, start_y);
  //     ctx.lineTo(new_end_x, new_end_y);
  //   }

  //   ctx.stroke();

  ctx.beginPath();

  const max_rotation = 340;
  const rotation_align_adjustment = (360 - max_rotation) / 2;

  const val_in_percentage = (100 * val) / val_max;
  const val_in_degrees = (val_in_percentage / 100) * max_rotation;

  const angle_degrees = val_in_degrees + rotation_align_adjustment;
  console.log(angle_degrees);
  const angle_radians = (angle_degrees * Math.PI) / 180;

  // Apply rotation
  const new_dx = dx * Math.cos(angle_radians) - dy * Math.sin(angle_radians);
  const new_dy = dx * Math.sin(angle_radians) + dy * Math.cos(angle_radians);

  const new_end_x = start_x + new_dx;
  const new_end_y = start_y + new_dy;

  ctx.moveTo(start_x, start_y);
  ctx.lineTo(new_end_x, new_end_y);

  ctx.stroke();
};

const draw = (ctx: CanvasRenderingContext2D) => {
  ctx.beginPath();

  ctx.font = "16px Arial";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillStyle = "#a328d9";
  ctx.strokeStyle = "#a328d9";

  drawPointer(ctx, 50, 0, 100);

  drawScaleLabels(ctx, 0, 100);

  //   for (let i = 0; i <= 200; i++) {
  //     drawPointer(ctx, i, 0, 200);
  //   }
};

const Gauge = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const canvasCtxRef = React.useRef<CanvasRenderingContext2D | null>(null);

  useEffect(() => {
    if (canvasRef.current) {
      canvasCtxRef.current = canvasRef.current.getContext("2d");
      const ctx = canvasCtxRef.current;
      if (ctx) draw(ctx);
    }
  }, []);

  return (
    <div className="gauge">
      <canvas ref={canvasRef} height={HEIHGT} width={WIDTH}></canvas>
    </div>
  );
};

export default Gauge;
