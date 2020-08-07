class Enemy extends Entity {
    constructor() {
        let x, y;
        if (Math.random() < .5) {
            x = Math.random() < .5 ? 0 : canvas.width;
            y = Math.random() * canvas.height;
        } else {
            x = Math.random() * canvas.width;
            y = Math.random() < .5 ? 0 : canvas.height;
        }
        let boss = Math.random() < bossChance;
        super(x, y, boss ? enemyRadius * 2 : enemyRadius);
        this.color = '#FF0000';
        this.max_health = boss ? 100 * 4 : 100
        this.health = this.max_health;

        let diff_x = base.x - this.x, diff_y = base.y - this.y;
        let norm = Math.sqrt((diff_x) ** 2 + (diff_y) ** 2);
        let dx = diff_x / norm, dy = diff_y / norm;
        this.vx = dx * enemySpeed;
        this.vy = dy * enemySpeed;
    }

    move() {
        this.x += this.vx;
        this.y += this.vy;
    }

    update() {
        this.move();
        if (gameTick % 2) {
            for (let relay of relays) {
                if (this.collideWith(relay)) {
                    for (let neighbor of relay.neighbors) {
                        neighbor.neighbors.splice(neighbor.neighbors.indexOf(relay), 1);
                    }
                    relays.splice(relays.indexOf(relay), 1);
                    this.health -= 25;
                    if (this.health <= 0) enemies.splice(enemies.indexOf(this), 1);
                    break;
                }
            }
        }
    }

    draw() {
        ctx.lineWidth = this.radius / 2;

        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius / 2, 0, 2 * Math.PI);
        ctx.fill();

        ctx.strokeStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI * (this.health / this.max_health));
        ctx.stroke();
    }
}
