const canvas = document.getElementById('canvas1');
const c = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
c.textBaseLine = 'middle';

const myWord = 'robbert';

const myUpperWord = myWord.toUpperCase();
const lettersArray = [...myUpperWord];
let hue = 0;
let particles = [];
let numberOfParticles = (canvas.width * canvas.height) / 10000;

const mouse = {
  x: undefined,
  y: undefined,
  radius: 60,
  autopilotAngle: 0,
};

window.addEventListener('mousemove', function (e) {
  mouse.x = e.x;
  mouse.y = e.y;
});

class Particle {
  constructor(x, y, radius) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = 'hsl(' + hue + ', 100%, 50%)';
    this.letter = lettersArray[Math.floor(Math.random() * lettersArray.length)];
  }
  draw() {
    // circle
    c.beginPath();
    c.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    c.fillStyle = this.color;
    c.closePath();
    c.fill();

    // reflection
    c.beginPath();
    c.arc(this.x, this.y, this.radius * 0.8, 0, Math.PI * 1.5, true);
    c.fillStyle = 'white';
    c.closePath();
    c.fill();

    // letter
    c.font = this.radius + 'px Courier';
    c.fillText(
      this.letter,
      this.x - this.radius / 3.4,
      this.y + this.radius / 3.2
    );
  }
  update() {
    if (mouse.x === undefined && mouse.y === undefined) {
      let newX =
        ((mouse.radius * canvas.width) / 200) *
        Math.sin(mouse.autopilotAngle * (Math.PI / 180));
      let newY =
        ((mouse.radius * canvas.height) / 200) *
        Math.cos(mouse.autopilotAngle * (Math.PI / 360));
      mouse.x = newX + canvas.width / 2;
      mouse.y = newY + canvas.height / 2;
    }
    mouse.autopilotAngle += 0.01;
  }
}

function handleOverlap() {
  let overlapping = false;
  let protection = 500;
  let counter = 0;

  while (particles.length < numberOfParticles && counter < protection) {
    let randomAngle = Math.PI * 2 * Math.random();
    let randomRadius = mouse.radius * Math.random();
    let particle = {
      x: mouse.x + randomRadius * Math.cos(randomAngle),
      y: mouse.y + randomRadius * Math.sin(randomAngle),
      radius: Math.floor(Math.random() * 30) + 10,
    };
    overlapping = false;

    for (let i = 0; i < particles.length; i++) {
      let previousParticle = particles[i];
      let dx = particle.x - previousParticle.x;
      let dy = particle.y - previousParticle.y;
      let distance = Math.sqrt(dx * dx + dy * dy);
      if (distance < particle.radius + previousParticle.radius) {
        overlapping = true;
        break;
      }
    }
    if (!overlapping) {
      particles.unshift(new Particle(particle.x, particle.y, particle.radius));
    }
    counter++;
  }
}

handleOverlap();

// animate functie hieronder
function animate() {
  c.clearRect(0, 0, canvas.width, canvas.height);
  for (let i = 0; i < particles.length; i++) {
    particles[i].draw();
    particles[i].update();
  }
  if (particles.length >= numberOfParticles) {
    for (let i = 0; i < 4; i++) {
      particles.pop();
    }
  }
  handleOverlap();
  hue++;
  requestAnimationFrame(animate);
}

// pause boolean
const paused = 0;
if (paused) {
  alert('animation paused');
} else {
  animate();
}

///// autopilot functie hieronder
let autopilot = setInterval(function () {
  mouse.x = undefined;
  mouse.y = undefined;
}, 40);

canvas.addEventListener('mouseleave', function () {
  autopilot = setInterval(function () {
    mouse.x = undefined;
    mouse.y = undefined;
  }, 40);
});

canvas.addEventListener('mouseenter', function () {
  clearInterval(autopilot);
});
