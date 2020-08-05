class Relay extends Transmitter {
    constructor(x, y) {
        super(x, y, relayRadius);
        this.consumption = 0;
        this.lastShot = gameTick;
    }

    attack(enemy) {
        let diff_x = enemy.x - this.x, diff_y = enemy.y - this.y;
        let norm = Math.sqrt((diff_x) ** 2 + (diff_y) ** 2);
        let dx = diff_x / norm, dy = diff_y / norm;
        shots.push(new Laser(this.x, this.y, dx, dy));
    }

    update() {
        super.update();
        if (gameTick - this.lastShot >= shotCooldown) {
            let energy_available = null;
            for (let energy of this.energy_entities) {
                if (energy.destination === null) {
                    energy_available = energy;
                    break
                }
            }
            this.use = false;
            for (let enemy of enemies) {
                if (Math.sqrt((enemy.x - this.x) ** 2 + (enemy.y - this.y) ** 2) <= relayAttackRange) {
                    this.use = true;

                    if (energy_available !== null) {
                        this.attack(enemy);
                        this.lastShot = gameTick;
                        ++this.consumption;
                        if (this.consumption >= shotsPerEnergy) {
                            this.energy_entities.splice(this.energy_entities.indexOf(energy_available), 1);
                            this.consumption = 0;
                        }
                    }
                    break;
                }
            }
        }
    }

    draw() {
        let val = transmitterStorage - this.energy_entities.length, color = '#';
        if (val === transmitterStorage) val = 'A';
        for (let _ = 0; _ < 6; ++_) color += val;
        ctx.beginPath();
        ctx.fillStyle = color;
        ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
        ctx.fill();
        super.draw();
    }
}
