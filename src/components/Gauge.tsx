import React, { useEffect, useRef } from "react";
import "./Gauge.css";

const HEIHGT = 400;
const WIDTH = 400;

const MAX_ROTATION = 300;

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

  const max_rotation = MAX_ROTATION;
  const rotation_align_adjustment = (360 - max_rotation) / 2;

  const num_labels = Math.min(20, val_max - val_min);

  const lett_height = 16;

  ctx.beginPath();

  for (let i = 0; i <= num_labels; i++) {
    const percentage = i / num_labels;
    const rotation = percentage * max_rotation;

    // Angle in degrees and radians
    const angle_degrees = rotation + rotation_align_adjustment;
    const angle_radians = (angle_degrees * Math.PI) / 180;

    // Apply rotation
    const new_dx = dx * Math.cos(angle_radians) - dy * Math.sin(angle_radians);
    const new_dy = dx * Math.sin(angle_radians) + dy * Math.cos(angle_radians);

    const new_end_x = start_x + new_dx;
    const new_end_y = start_y + new_dy;

    ctx.save();

    ctx.translate(new_end_x, new_end_y);
    console.log(angle_radians);
    ctx.rotate(angle_radians - Math.PI);

    ctx.textAlign = "center";
    ctx.fillText(String(i), 0, lett_height / 2);

    ctx.restore();
  }

  ctx.closePath();
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

  ctx.save();
  ctx.beginPath();

  const max_rotation = MAX_ROTATION;
  const rotation_align_adjustment = (360 - max_rotation) / 2;

  const val_in_percentage = val / val_max;
  const val_in_degrees = val_in_percentage * max_rotation;

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
  ctx.restore();
};

const pointer = (ctx: CanvasRenderingContext2D, rotationDeg: number) => {
  ctx.save();

  ctx.fillStyle = "#ff0000";
  ctx.strokeStyle = "#f57474";

  const width = WIDTH / 2;
  const height = HEIHGT / 2;

  const w_0 = 0.08;
  const w_1 = 0.01;
  const w_2 = 0.018;
  const w_3 = 0.08;

  const h_0 = 0.18;
  const h_1 = 0.15;
  const h_2 = 0;
  const h_3 = 0.13;

  const offset_h = height * 0.2;
  
  const path = new Path2D();
  path.moveTo(width, 0 + offset_h);

  path.lineTo(width + width * w_0, height * h_0 + offset_h);
  path.lineTo(width + width * w_1, height * h_1 + offset_h);
  path.lineTo(width + width * w_2, height - height * h_2);
  path.lineTo(width + width * w_3, height + height * h_3);

  path.lineTo(width - width * w_3, height + height * h_3);
  path.lineTo(width - width * w_2, height - height * h_2);
  path.lineTo(width - width * w_1, height * h_1 + offset_h);
  path.lineTo(width - width * w_0, height * h_0 + offset_h);
  path.lineTo(width, 0 + offset_h);

  path.moveTo(width, height);

  ctx.save();

  // ctx.fillStyle = "yellow";
  var rotation_center_point = { x: width, y: height};

  ctx.translate(rotation_center_point.x, rotation_center_point.y);
  


  const angle_degrees = 45;
  const angle_radians = (angle_degrees * Math.PI) / 180;

  ctx.rotate(angle_radians);

  ctx.translate(-rotation_center_point.x, -rotation_center_point.y)

  ctx.stroke(path);
  ctx.fill(path);


  ctx.restore();
};

const draw = (ctx: CanvasRenderingContext2D) => {
  ctx.font = "30px 'Courier New'";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillStyle = "#a328d9";
  ctx.strokeStyle = "#a328d9";

  ctx.save();

  ctx.fillStyle = "red";
  ctx.strokeStyle = "red";

  ctx.restore();

  pointer(ctx, 90);

  ctx.beginPath();
  ctx.arc(WIDTH / 2, HEIHGT / 2, 2, 0, 2 * Math.PI);
  ctx.closePath();
  ctx.fill();

  // drawPointer(ctx, 50, 0, 100);

  // drawScaleLabels(ctx, 0, 100);

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
