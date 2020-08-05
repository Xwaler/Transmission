class Energy extends Entity {
    constructor(father) {
        super(father.x, father.y, energyRadius);
        this.destination = null;
    }

    setDestination(destination) {
        this.destination = destination;
    }

    move() {
        if (this.destination !== null) {
            let diff_x = this.destination.x - this.x, diff_y = this.destination.y - this.y;
            let norm = Math.sqrt((diff_x) ** 2 + (diff_y) ** 2);
            if (norm > energySpeed) {
                let normed_x = diff_x / norm, normed_y = diff_y / norm;
                this.x += normed_x * energySpeed;
                this.y += normed_y * energySpeed;
            } else {
                this.x = this.destination.x;
                this.y = this.destination.y;
                this.destination = null;
            }
        }
    }

    draw() {
        ctx.beginPath();
        ctx.lineWidth = 1;
        ctx.fillStyle = '#000000'
        ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
        ctx.fill();
    }
}
