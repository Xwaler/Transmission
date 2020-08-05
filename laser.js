class Laser extends Entity {
    constructor(x, y, dx, dy) {
        super(x, y, shotWidth);
        this.vx = dx * shotSpeed;
        this.vy = dy * shotSpeed;
    }

    update() {
        this.move();
        if (this.x < 0 || this.y < 0 || this.x > canvas.width || this.y > canvas.height)
            shots.splice(shots.indexOf(this), 1);
        for (let enemy of enemies) {
            if (this.collideWith(enemy)) {
                enemy.health -= shotDamage;
                if (enemy.health <= 0) {
                    enemies.splice(enemies.indexOf(enemy), 1);
                    ++credits.innerText;
                }
                shots.splice(shots.indexOf(this), 1);
            }
        }
    }

    move() {
        this.x += this.vx;
        this.y += this.vy;
    }

    draw() {
        ctx.strokeStyle = '#FF0000';
        ctx.lineWidth = this.radius;
        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(this.x - (this.vx * relayRadius) / Math.sqrt(2), this.y - (this.vy * relayRadius) / Math.sqrt(2));
        ctx.stroke();
    }
}
