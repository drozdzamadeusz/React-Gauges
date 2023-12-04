class Vec2 {
  x: number;
  y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  set(x: number, y: number): void {
    this.x = x;
    this.y = y;
  }

  magSq(): number {
    return this.x * this.x + this.y * this.y;
  }

  mag(): number {
    return Math.sqrt(this.magSq());
  }

  add(x: number | Vec2, y?: number): Vec2 {
    if (x instanceof Vec2) {
      this.x += x.x;
      this.y += x.y;
    } else if (typeof x === "number" && typeof y === "number") {
      this.x += x;
      this.y += y;
    }
    return this;
  }

  sub(x: number | Vec2, y?: number): Vec2 {
    if (x instanceof Vec2) {
      this.x -= x.x;
      this.y -= x.y;
    } else if (typeof x === "number" && typeof y === "number") {
      this.x -= x;
      this.y -= y;
    }
    return this;
  }

  div(n: number): Vec2 {
    this.x /= n;
    this.y /= n;
    return this;
  }

  mult(x: number | Vec2, y?: number): Vec2 {
    if (x instanceof Vec2) {
      this.x *= x.x;
      this.y *= x.y;
    } else if (typeof x === "number" && typeof y === "number") {
      this.x *= x;
      this.y *= y;
    } else if (typeof x === "number") {
      this.x *= x;
      this.y *= x;
    }
    return this;
  }

  normalize(): Vec2 {
    return this.div(this.mag());
  }

  setMag(n: number): Vec2 {
    return this.normalize().mult(n);
  }

  dot(x: number | Vec2, y?: number): number {
    if (x instanceof Vec2) {
      return this.x * x.x + this.y * x.y;
    }
    return this.x * (x as number) + this.y * (y ?? 0);
  }

  dist(v: Vec2): number {
    const d = v.copy().sub(this);
    return d.mag();
  }

  limit(l: number): Vec2 {
    const mSq = this.magSq();
    if (mSq > l * l) {
      this.div(Math.sqrt(mSq)).mult(l);
    }
    return this;
  }

  headingRads(): number {
    return Math.atan2(this.y, this.x);
  }

  headingDegs(): number {
    return (this.headingRads() * 180.0) / Math.PI;
  }

  rotateRads(a: number): Vec2 {
    const newHead = this.headingRads() + a;
    const mag = this.mag();
    this.x = Math.cos(newHead) * mag;
    this.y = Math.sin(newHead) * mag;
    return this;
  }

  rotateDegs(a: number): Vec2 {
    const r = (a * Math.PI) / 180.0;
    return this.rotateRads(r);
  }

  angleBetweenRads(x: number | Vec2, y?: number): number {
    let v1 = this.copy();
    let v2: Vec2;

    if (x instanceof Vec2) {
      v2 = x.copy();
    } else {
      v2 = new Vec2(x as number, y ?? 0);
    }
    const angle = Math.acos(v1.dot(v2) / (v1.mag() * v2.mag()));
    return angle;
  }

  angleBetweenDegs(x: number | Vec2, y?: number): number {
    const r = this.angleBetweenRads(x, y);
    return (r * 180) / Math.PI;
  }

  lerp(x: number | Vec2, y: number, amt: number): Vec2 {
    if (x instanceof Vec2) {
      return this.lerp(x.x, x.y, y);
    }
    if (amt > 1.0) {
      amt = 1.0;
    }
    this.x += (x - this.x) * amt;
    this.y += (y - this.y) * amt;
    return this;
  }

  equals(x: number | Vec2, y?: number): boolean {
    let a: number, b: number;
    if (x instanceof Vec2) {
      a = x.x;
      b = x.y;
    } else {
      a = x as number;
      b = y ?? 0;
    }
    return this.x === a && this.y === b;
  }

  copy(): Vec2 {
    return new Vec2(this.x, this.y);
  }
}

export default Vec2;
