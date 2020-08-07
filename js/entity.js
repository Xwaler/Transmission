class Entity {
    constructor(x, y, radius) {
        this.x = x;
        this.y = y;
        this.color = '#000000';
        this.radius = radius;
    }

    collideWith(other) {
        return (this.x - other.x) ** 2 + (this.y - other.y) ** 2 <= (this.radius + other.radius) ** 2
    }

    draw() {
        ctx.beginPath();
        ctx.lineWidth = 2;
        ctx.strokeStyle = this.color;
        ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
        ctx.stroke();
    }
}

class Transmitter extends Entity {
    constructor(x, y, radius) {
        super(x, y, radius);
        this.neighbors = [];
        this.energy_entities = [];
        this.use = false;
        this.lastSend = gameTick;
        this.sendCooldown = sendEvery;
    }

    need() {
        return transmitterStorage * (this.use ? 2 : 1) - this.energy_entities.length;
    }

    canStore() {
        return this.energy_entities.length < transmitterStorage;
    }

    send(energy_entity, relay) {
        this.energy_entities.splice(this.energy_entities.indexOf(energy_entity), 1);
        energy_entity.setDestination(relay);
        relay.energy_entities.push(energy_entity);
        this.lastSend = gameTick;
    }

    update() {
        if (this.energy_entities.length > 0 && gameTick - this.lastSend >= this.sendCooldown) {
            for (let energy_entity of this.energy_entities) {
                if (energy_entity.destination === null) {
                    let max_need = this.need(), most_in_need = null;
                    for (let neighbor of this.neighbors) {
                        if (neighbor.need() > max_need && neighbor.canStore()) {
                            max_need = neighbor.need();
                            most_in_need = neighbor;
                        }
                    }
                    if (most_in_need !== null && most_in_need.hasOwnProperty('energy_entities')) {
                        this.send(energy_entity, most_in_need);
                        break;
                    }
                }
            }
        }
        for (let energy_entity of this.energy_entities) {
            energy_entity.move();
        }
    }

    draw() {
        super.draw();
        for (let energy_entity of this.energy_entities) {
            energy_entity.draw();
        }
        ctx.lineWidth = 1;
        ctx.strokeStyle = '#777777';
        for (let neighbor of this.neighbors) {
            ctx.beginPath();
            ctx.moveTo(this.x, this.y);
            ctx.lineTo(neighbor.x, neighbor.y);
            ctx.stroke();
        }
    }
}
