window.requestAnimFrame = (function() {
    return window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        function(callback) {
            window.setTimeout(callback, 1000 / 60);
        };
})();

var canvas = document.getElementById('canvas'),
    ctx = canvas.getContext('2d'),
    cw = window.innerWidth,
    ch = window.innerHeight,
    fireworks = [],
    particles = [],
    hue = 120,
    limiterTotal = 5,
    limiterTick = 0,
    timerTotal = 80,
    timerTick = 0,
    mousedown = false,
    mx,
    my;

// set canvas dimensions
canvas.width = cw;
canvas.height = ch;

function random(min, max) {
    return Math.random() * (max - min) + min;
}

function calculateDistance(p1x, p1y, p2x, p2y) {
    var xDistance = p1x - p2x,
        yDistance = p1y - p2y;
    return Math.sqrt(Math.pow(xDistance, 2) + Math.pow(yDistance, 2));
}

function Firework(sx, sy, tx, ty) {
    this.x = sx;
    this.y = sy;
    this.sx = sx;
    this.sy = sy;
    this.tx = tx;
    this.ty = ty;
    this.distanceToTarget = calculateDistance(sx, sy, tx, ty);
    this.distanceTraveled = 0;
    this.coordinates = [];
    this.coordinateCount = 3;
    while (this.coordinateCount--) {
        this.coordinates.push([this.x, this.y]);
    }
    this.angle = Math.atan2(ty - sy, tx - sx);
    this.speed = 2;
    this.acceleration = 1.05;
    this.brightness = random(50, 70);
    this.targetRadius = 1;
    var grandExplosionSound = document.getElementById('grandExplosionSound');
    if (grandExplosionSound) {
        grandExplosionSound.play();
    }
    
    // Phát âm thanh phóng pháo hoa
    var explosionSound = document.getElementById('explosionSound'); 
    var explosionSound1 = document.getElementById('explosionSound1');
    if (explosionSound) explosionSound.play();
    if (explosionSound1) explosionSound1.play(); 
    var launchSound = document.getElementById('launchSound');
    if (launchSound) launchSound.play();
}

Firework.prototype.update = function(index) {
    this.coordinates.pop();
    this.coordinates.unshift([this.x, this.y]);

    if (this.targetRadius < 8) {
        this.targetRadius += 0.3;
    } else {
        this.targetRadius = 1;
    }

    this.speed *= this.acceleration;

    var vx = Math.cos(this.angle) * this.speed,
        vy = Math.sin(this.angle) * this.speed;
    this.distanceTraveled = calculateDistance(this.sx, this.sy, this.x + vx, this.y + vy);

    if (this.distanceTraveled >= this.distanceToTarget) {
        if (Math.random() < 0.8) { // 60% cơ hội cho một vụ nổ lớn
            createGrandParticles1(this.tx, this.ty);
         
        } else {
            createParticles(this.tx, this.ty, Math.random() < 0.2); // 10% cơ hội tạo vụ nổ lớn thông thường
        }
        fireworks.splice(index, 1);

        // Phát âm thanh nổ pháo hoa
       
     } else { 
        this.x += vx; 
        this.y += vy;
     }
}

Firework.prototype.draw = function() {
    ctx.beginPath();
    ctx.moveTo(this.coordinates[this.coordinates.length - 1][0], this.coordinates[this.coordinates.length - 1][1]);
    ctx.lineTo(this.x, this.y);
    ctx.strokeStyle = 'hsl(' + hue + ', 100%, ' + this.brightness + '%)';
    ctx.stroke();
}

var firstFireworkComplete = false; // Biến cờ để theo dõi quả đại pháo đầu tiên
var firstFirework = true; // Biến cờ để chỉ bắn quả đại pháo đầu tiên
function Particle(x, y, big) {
    this.x = x;
    this.y = y;
    this.coordinates = [];
    this.coordinateCount = 5;
    while (this.coordinateCount--) {
        this.coordinates.push([this.x, this.y]);
    }
    this.angle = random(0, Math.PI * 2);
    this.speed = random(0, 30);
    this.friction = 0.95;
    this.gravity = 1;
    this.hue = random(hue - 20, hue + 20);
    this.brightness = random(50, 80);
    this.alpha = 1;
    this.decay = random(0.015, 0.0008);
    this.size = big ? 2 : 1;
}


Particle.prototype.update = function(index) {
    this.coordinates.pop();
    this.coordinates.unshift([this.x, this.y]);
    this.speed *= this.friction;
    this.x += Math.cos(this.angle) * this.speed;
    this.y += Math.sin(this.angle) * this.speed + this.gravity;
    this.alpha -= this.decay;

    if (this.alpha <= this.decay) {
        particles.splice(index, 1);
    }
}

Particle.prototype.draw = function() {
    ctx.beginPath();
    ctx.moveTo(this.coordinates[this.coordinates.length - 1][0], this.coordinates[this.coordinates.length - 1][1]);
    ctx.lineTo(this.x, this.y);
    ctx.strokeStyle = 'hsla(' + this.hue + ', 100%, ' + this.brightness + '%, ' + this.alpha + ')';
    ctx.lineWidth = this.size;
    ctx.stroke();
}





function Particle1(x, y, big) {
    this.x = x;
    this.y = y;
    this.coordinates = [];
    this.coordinateCount = 5;
    while (this.coordinateCount--) {
        this.coordinates.push([this.x, this.y]);
    }
    this.angle = random(0, Math.PI * 2);
    this.speed = random(0, 12);
    this.friction = 0.95;
    this.gravity = 1;
    this.hue = random(hue - 20, hue + 20);
    this.brightness = random(50, 80);
    this.alpha = 1;
    this.decay = random(0.015, 0.03);
    this.size = big ? 2 : 1;
}


Particle1.prototype.update = function(index) {
    this.coordinates.pop();
    this.coordinates.unshift([this.x, this.y]);
    this.speed *= this.friction;
    this.x += Math.cos(this.angle) * this.speed;
    this.y += Math.sin(this.angle) * this.speed + this.gravity;
    this.alpha -= this.decay;

    if (this.alpha <= this.decay) {
        particles.splice(index, 1);
    }
}

Particle1.prototype.draw = function() {
    ctx.beginPath();
    ctx.moveTo(this.coordinates[this.coordinates.length - 1][0], this.coordinates[this.coordinates.length - 1][1]);
    ctx.lineTo(this.x, this.y);
    ctx.strokeStyle = 'hsla(' + this.hue + ', 100%, ' + this.brightness + '%, ' + this.alpha + ')';
    ctx.lineWidth = this.size;
    ctx.stroke();
}


// Function to create particles for a grand firework explosion
function createGrandParticles1(x, y) {
    var particleCount = 1010; 
    while (particleCount--) {
        particles.push(new Particle(x, y, true)); // Pass 'true' to indicate a bigger particle
    }
}

function createGrandParticles(x, y) {
    var particleCount = 4000; // Increase the number of particles for a grand effect
    while (particleCount--) {
        particles.push(new Particle(x, y, true)); // Pass 'true' to indicate a bigger particle
    }
}

// Function to create particles for regular explosions
function createParticles(x, y, bigExplosion) {
    var particleCount = bigExplosion ? 100 : 80;
    while (particleCount--) {
        particles.push(new Particle1(x, y, bigExplosion));
    }
}



function loop() {
    requestAnimFrame(loop);

    hue += 0.5;

    ctx.globalCompositeOperation = 'destination-out';
    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.fillRect(0, 0, cw, ch);
    ctx.globalCompositeOperation = 'lighter';

    var i = fireworks.length;
    while (i--) {
        fireworks[i].draw();
        fireworks[i].update(i);
    }

    var i = particles.length;
    while (i--) {
        particles[i].draw();
        particles[i].update(i);
    }

    if (firstFirework) {
        fireworks.push(new Firework(cw / 2, ch, cw / 2, ch / 4)); // Quả đại pháo bay lên chính giữa
        firstFirework = false;
    }

    if (firstFireworkComplete) {
        var launchPoints = [
            { x: cw / 2, y: ch },
            { x: cw / 4, y: ch },
            { x: 3 * cw / 4, y: ch },
            { x: cw / 8, y: ch },
            { x: 7 * cw / 8, y: ch }
        ];

        if (!mousedown) {
            launchPoints.forEach(point => {
                if (Math.random() < 0.05) {
                    fireworks.push(new Firework(point.x, point.y, random(cw / 4, 3 * cw / 4), random(ch / 4, ch / 2)));
                }
            });
        } else {
            launchPoints.forEach(point => {
                if (Math.random() < 0.1) {
                    fireworks.push(new Firework(point.x, point.y, mx, my));
                }
            });
        }
    }
}

// Cập nhật Firework.prototype.update để theo dõi khi nào quả đại pháo hoàn tất
Firework.prototype.update = function(index) {
    this.coordinates.pop();
    this.coordinates.unshift([this.x, this.y]);

    if (this.targetRadius < 8) {
        this.targetRadius += 0.3;
    } else {
        this.targetRadius = 1;
    }

    this.speed *= this.acceleration;

    var vx = Math.cos(this.angle) * this.speed,
        vy = Math.sin(this.angle) * this.speed;
    this.distanceTraveled = calculateDistance(this.sx, this.sy, this.x + vx, this.y + vy);

    if (this.distanceTraveled >= this.distanceToTarget) {
        if(!firstFireworkComplete){
            createGrandParticles(this.tx, this.ty); 
            fireworks.splice(index, 1);
        }
        else{
            createParticles(this.tx, this.ty); // Tạo hiệu ứng nổ lớn
            fireworks.splice(index, 1);
        }
       

        if (!firstFireworkComplete && this.tx === cw / 2 && this.ty === ch / 4) {
            firstFireworkComplete = true; // Đánh dấu quả đại pháo hoàn tất

        }
    } else {
        this.x += vx;
        this.y += vy;
    }
}
canvas.addEventListener('mousemove', function(e) {
    mx = e.pageX - canvas.offsetLeft;
    my = e.pageY - canvas.offsetTop;
});

canvas.addEventListener('mousedown', function(e) {
    e.preventDefault();
    mousedown = true;
});

canvas.addEventListener('mouseup', function(e) {
    e.preventDefault();
    mousedown = false;
});

window.onload = loop;
window.onload = function() {
    loop();
    displayNewYearMessage();
}

function displayNewYearMessage() {
    const message = document.getElementById('newYearMessage');
    message.classList.remove('hidden');
    message.style.opacity = 1;

    setTimeout(() => {
        message.style.opacity = 0;
    }, 50000); // Sau 10 giây, dòng chữ sẽ dần biến mất
}

