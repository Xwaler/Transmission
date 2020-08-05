class Base extends Transmitter {
    constructor(x, y) {
        super(x, y, baseRadius);
        this.lastProduced = Date.now();
        this.health = 100;
    }

    need() {
        return 0;
    }

    canStore() {
        return false;
    }

    update() {
        const now = Date.now();
        if (now - this.lastProduced >= produceEvery) {
            this.energy_entities.push(new Energy(this));
            this.lastProduced = now;
        }
        for (let enemy of enemies) {
            if (this.collideWith(enemy)) {
                this.health -= 5;
                enemies.splice(enemies.indexOf(enemy), 1);
            }
        }
        super.update();
    }

    draw() {
        ctx.fillStyle = '#AAAAAA';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius,
            (Math.PI / 2) - (this.health / 100 * Math.PI) - 1e-16,
            (Math.PI / 2) + (this.health / 100 * Math.PI) + 1e-16
        );
        ctx.fill();
        super.draw();
    }
}
