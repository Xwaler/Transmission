class Base extends Transmitter {
    constructor(x, y) {
        super(x, y, baseRadius);
        this.lastProduced = gameTick;
        this.health = 100;
        this.sendCooldown = minProduceEvery;
    }

    need() {
        return 0;
    }

    canStore() {
        return false;
    }

    update() {
        if (gameTick - this.lastProduced >= produceEvery && super.canStore()) {
            this.energy_entities.push(new Energy(this));
            this.lastProduced = gameTick;
        }
        if (gameTick % 2) {
            for (let enemy of enemies) {
                if (this.collideWith(enemy)) {
                    this.health -= enemy.health / 20;
                    enemies.splice(enemies.indexOf(enemy), 1);
                }
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
