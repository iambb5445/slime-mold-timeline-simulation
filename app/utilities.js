const RAD = Math.PI / 180;
const cosTable = [];
for (let i = 0; i < 360 * 2; i++) {
  cosTable.push(Math.cos(i * RAD));
}
function cos(t) {
  return cosTable[((t % 360) + 360) | 0];
}
function sin(t) {
  return cos(t + 90);
}

class Display {
  constructor(size, canvas, count=1, vertical=true) {
    this.size = size;
    this.canvas = canvas;
    this.space = 5;
    this.vertical = vertical;
    this.count = count;
    if (this.vertical) {
      this.canvas.width = size * count;
      this.canvas.height = size;
    }
    else {
      this.canvas.width = size / count;
      this.canvas.height = size;
    }
    this.context = canvas.getContext("2d");
    this.context.fillStyle = "rgba(0,255,0,.1)";
    this.black = new ImageData(this.size, this.size);
    for (let i = 0; i < this.size * this.size; i++) {
      this.black[i * 4 + 3] = 255;
    }
  }
  show(image) {
    this.context.putImageData(image, 0, 0);
  }
  showImages(images) {
    /*
    const image = new ImageData((this.size + this.space * (this.count - 1)) * this.count, this.size);
    for (let i = 0; i < this.count; i++) {
      for (let j = 0; j < images[i].data.length; j++) {
        image.data[i * images[i].data.length + j] = images[i].data[j];
      }
    }
    this.show(images[2]);
    */
    /*
    final:
    onst image = new ImageData(this.size * this.count, this.size * this.count);
    for (let i = 0; i < this.count; i++) {
    for (let j = 0; j < this.count; j++) {
      for (let x = 0; x < this.size; x++) {
        for (let y = 0; y < this.size; y++) {
          //for (let c = 0; c < 4; c++) {
            const index = y * this.size * this.count + x;
            const index2 = j * this.size * this.count + i;
            image.data[index * 4 + 0 + this.size * 4 * index2] = (j / this.count) * 255;
            image.data[index * 4 + 1 + this.size * 4 * index2] = (x / this.size) * 255;
            image.data[index * 4 + 2 + this.size * 4 * index2] = (y / this.size) * 255;
            image.data[index * 4 + 3 + this.size * 4 * index2] = 255;
          //}
        }
        }
      }
    }
    this.show(image);
    */
    let image;
    if (this.vertical) {
      image = new ImageData(this.size * this.count, this.size);
    }
    else {
      image = new ImageData(this.size, this.size * this.count);
    }
    for (let i = 0; i < (this.vertical? this.count: 1); i++) {
      for (let j = 0; j < (this.vertical? 1: this.count); j++) {
        for (let x = 0; x < this.size; x++) {
          for (let y = 0; y < this.size; y++) {
            for (let c = 0; c < 4; c++) {
              if (this.vertical) {
                const index = y * this.size * this.count + x;
                const index2 = j * this.size * this.count + i;
                image.data[index * 4 + c + this.size * 4 * index2] = images[i].data[(y * this.size + x) * 4 + c];
                if (this.size - x <= this.space && i != (this.count - 1)) {
                  image.data[index * 4 + c + this.size * 4 * index2] = 255;
                }
              }
              else {
                const index = y * this.size + x;
                const index2 = j * this.size + i;
                image.data[index * 4 + c + this.size * 4 * index2] = images[j].data[(y * this.size + x) * 4 + c];
                if (this.size - y < 5 && j != (this.count - 1)) {
                  image.data[index * 4 + c + this.size * 4 * index2] = 255;
                }
              }
            }
          }
        }
      }
    }
    this.show(image);
    /*
    for (let i = 1; i < images.length; i++) {
      for (let y = 0; y < 3; y++) {
        console.log(y * this.size * 4 + this.size * this.size * 4 * i);
        for (let x = 0; x < this.size; x++) {
          for (let c = 0; c < 4; c++) {
            const index = y * this.size + x;
            image.data[index * 4 + i + this.size * this.size * 4 * i] = 255;
            image.data[index * 4 + 3 + this.size * this.size * 4 * i] = 255;
          }
        }
      }
    }*/
    /*
    this.context.putImageData(images[0], 0, 0);
    this.context.putImageData(images[1], 0, this.size);
    this.context.putImageData(images[2], 0, 2 * this.size);
    this.context.putImageData(images[3], 0, 3 * this.size);
    this.context.putImageData(images[4], 0, 4 * this.size);
    */
  }
  showBlack() {
    this.show(this.black);
  }
}

class FrameData {
  constructor(size, particles=[]) {
    this.size = size;
    this.particles = particles;
    this.trailMap = new Float32Array(size * size);
    this.trailMap.fill(0);
    this.image = new ImageData(this.size, this.size);
  }
  static getRandom(size, particleCount, rotation) {
    const particles = [];
    for (let i = 0; i < particleCount; i++) {
      particles.push(Particle.getRandom(size, rotation));
    }
    const frameData = new FrameData(size, particles);
    return frameData;
  }
  setTrailMapEqualTo(frameData) {
    for (let i = 0; i < frameData.trailMap.length; i++) {
      this.trailMap[i] = frameData.trailMap[i];
    }
  }
  getImage() {
    for (let i = 0; i < this.trailMap.length; i++) {
      let x = i % this.size;
      let y = (i / this.size) | 0;
      let v = Math.round(this.trailMap[i] * 255);
      this.image.data[i * 4] = v;
      this.image.data[i * 4 + 1] = v;
      this.image.data[i * 4 + 2] = v;
      // visualize attractant gradient
      // image.data[i * 4 + 1] += settings.decay * 255 | 0;
      // if (this.trailMap[i] > 0) image.data[i * 4 + 1] += Math.round(128 + Math.log(trailMap2[i]))
      this.image.data[i * 4 + 3] = 255;
    }
    return this.image;
  }
  wrap(value) {
    let size = this.size;
    while (value < 0) {
      value += size;
    }
    while (value >= size) {
      value -= size;
    }
    return value;
  }
  getDiffused(x, y, diffusion, diffusionArea, decay) {
    let sum = 0;
    for (let ox = -diffusion; ox <= diffusion; ox++) {
      for (let oy = -diffusion; oy <= diffusion; oy++) {
        let pos = new Position(x + ox, y + oy);
        pos.wrap(this.size);
        sum += this.trailMap[pos.y * this.size + pos.x];
      }
    }
    return (sum / diffusionArea) * decay;
  }
  diffuse(diffusion, diffusionArea, decay) {
    const newTrailMap = new Float32Array(this.size * this.size);
    for (let x = 0; x < this.size; x++) {
      for (let y = 0; y < this.size; y++) {
        newTrailMap[y * this.size + x] = this.getDiffused(x, y, diffusion, diffusionArea, decay);
      }
    }
    this.trailMap = newTrailMap;
  }
  updateNext(newFrameData, sensorAngle, sensorDistance, rotation, velocity, divergenceProbability, depositSize, diffusion, diffusionArea, decay) {
    newFrameData.particles = [];
    newFrameData.setTrailMapEqualTo(this);
    for (let i = 0; i < this.particles.length; i++) {
      const particle = this.particles[i];
      const {leftPosition, centerPosition, rightPosition} =
            particle.getSensePositions(sensorAngle, sensorDistance, this.size);

      let senseLeft = this.trailMap[leftPosition.y * this.size + leftPosition.x];
      let senseCenter = this.trailMap[centerPosition.y * this.size + centerPosition.x];
      let senseRight = this.trailMap[rightPosition.y * this.size + rightPosition.x];

      let newParticle = particle.getCopy();
      if (senseLeft < senseCenter && senseCenter > senseRight) {
        // pass
      } else if (senseLeft < senseRight) {
        newParticle.rotateRight(rotation);
      } else if (senseLeft > senseRight) {
        newParticle.rotateLeft(rotation);
      }
      newParticle.rotateRandom(divergenceProbability, rotation);
      newParticle.move(velocity, this.size);
      newFrameData.particles.push(newParticle);
      const index = Math.round(newParticle.position.y) * this.size + Math.round(newParticle.position.x)
      newFrameData.trailMap[index] += depositSize;
    }
    newFrameData.diffuse(diffusion, diffusionArea, decay);
  }
  getNext(sensorAngle, sensorDistance, rotation, velocity, divergenceProbability, depositSize, diffusion, diffusionArea, decay) {
    const newFrameData = new FrameData(this.size);
    this.updateNext(newFrameData, sensorAngle, sensorDistance, rotation, velocity, divergenceProbability, depositSize, diffusion, diffusionArea, decay);
    return newFrameData;
  }
}

class Position {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
  _wrap(value, size) {
    while (value < 0) {
      value += size;
    }
    while (value >= size) {
      value -= size;
    }
    return value;
  }
  wrap(size) {
    this.x = this._wrap(this.x, size);
    this.y = this._wrap(this.y, size);
  }
  getCopy() {
    return new Position(this.x, this.y);
  }
  static getRandom(size) {
    const x = Math.random() * size;
    const y = Math.random() * size;
    return new Position(x, y);
  }
  static fromPosition(position, distance, angle, size) {
    const x = Math.round(position.x + distance * cos(angle));
    const y = Math.round(position.y + distance * sin(angle));
    return new Position(x, y);
  }
}

class Particle {
  constructor(position, heading) {
    this.position = position;
    this.heading = heading;
  }
  getCopy() {
    return new Particle(this.position.getCopy(), this.heading);
  }
  static getRandom(size, rotationUnit) {
    const position = Position.getRandom(size);
    const heading = Math.round((Math.random() * 360) / rotationUnit) * rotationUnit;
    return new Particle(position, heading);
  }
  getSensePosition(direction, sensorAngle, sensorDistance, size) {
    const angle = this.heading + sensorAngle * direction
    const position = Position.fromPosition(this.position, sensorDistance, angle);
    position.wrap(size);
    return position;
  }
  getSensePositions(sensorAngle, sensorDistance, size) {
    return {
      leftPosition: this.getSensePosition(-1, sensorAngle, sensorDistance, size),
      centerPosition: this.getSensePosition(0, sensorAngle, sensorDistance, size),
      rightPosition: this.getSensePosition(1, sensorAngle, sensorDistance, size),
    };
  }
  move(velocity, size) {
    this.position = Position.fromPosition(this.position, velocity, this.heading);
    this.position.wrap(size);
  }
  rotateRight(rotation) {
    this.heading += rotation;
  }
  rotateLeft(rotation) {
    this.heading -= rotation;
  }
  rotateRandom(divergenceProbability, rotation) {
    if (Math.random() > divergenceProbability) {
      return;
    }
    if (Math.random() > 0.5) {
      this.rotateRight(rotation);
    }
    else {
      this.rotateLeft(rotation);
    }
  }
}

export {sin, cos, Display, FrameData, Particle, Position};