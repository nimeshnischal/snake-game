export default class Snake {
    constructor(scene) {
        this.scene = scene;
        this.lastMoveTime = 0;
        this.moveInterval = 300;
        this.tileSize = 16;
        this.direction = Phaser.Math.Vector2.UP;
        this.body = [];    
        this.apple = this.scene.add.rectangle(300,400,this.tileSize, this.tileSize, 0x00ff00).setOrigin(0);
        this.initBody();
        this.positionApple();
        this.scene.input.keyboard.on('keydown', e => this.keydown(e));
    }

    initBody() {
        this.body.push(
            this.scene.add.rectangle(
                Math.floor(this.scene.game.config.width/(2*this.tileSize)) * this.tileSize,
                Math.floor(this.scene.game.config.height/(2*this.tileSize)) * this.tileSize,
                this.tileSize, this.tileSize, 0xff4455)
            .setOrigin(0));
    }

    getRandomAppleCoordinateWithin(distance) {
        return Math.floor(Math.random() * (distance - this.tileSize) / this.tileSize) * this.tileSize;
    }

    positionApple() {
        // Preventing positioning apple on snake's body
        const bodyCoordinates = this.body.map(p => [p.x, p.y]);
        let applePosX = this.getRandomAppleCoordinateWithin(this.scene.game.config.width - this.tileSize);
        let applePosY = this.getRandomAppleCoordinateWithin(this.scene.game.config.height - this.tileSize);
        while (bodyCoordinates.some(p => p[0] === applePosX && p[1] === applePosY)) {
            applePosX = getRandomAppleCoordinateWithin(this.scene.game.config.width - this.tileSize);
            applePosY = getRandomAppleCoordinateWithin(this.scene.game.config.height - this.tileSize);
        }

        this.apple.x = applePosX;
        this.apple.y = applePosY;
    }

    keydown(event) {
        console.log(event);
        switch(event.keyCode) {
            case 37: // left
                if (this.direction === Phaser.Math.Vector2.RIGHT) {
                    this.slower();
                } else if (this.direction === Phaser.Math.Vector2.LEFT) {
                    this.faster()
                } else {
                    this.direction = Phaser.Math.Vector2.LEFT;
                }
                break;
            case 38: // up
                if (this.direction === Phaser.Math.Vector2.DOWN) {
                    this.slower();
                } else if (this.direction === Phaser.Math.Vector2.UP) {
                    this.faster()
                } else {
                    this.direction = Phaser.Math.Vector2.UP;
                }
                break;
            case 39: // right
                if (this.direction === Phaser.Math.Vector2.LEFT) {
                    this.slower();
                } else if (this.direction === Phaser.Math.Vector2.RIGHT) {
                    this.faster()
                } else {
                    this.direction = Phaser.Math.Vector2.RIGHT;
                }
                break;
            case 40: // down
                if (this.direction === Phaser.Math.Vector2.UP) {
                    this.slower();
                } else if (this.direction === Phaser.Math.Vector2.DOWN) {
                    this.faster()
                } else {
                    this.direction = Phaser.Math.Vector2.DOWN;
                }
                break;
        }
    }

    update(time) {
        if (time >= this.lastMoveTime + this.moveInterval) {
            this.lastMoveTime = time;
            this.move();
        }
    }

    eatTheApple() {
        this.body.push(
            this.scene.add.rectangle(0, 0, this.tileSize, this.tileSize, 0x002288)
            .setOrigin(0));
        this.positionApple();
    }

    faster() {
        this.moveInterval /= 1.2;
    }

    slower() {
        this.moveInterval *= 1.2;
    }

    move() {
        const nextHeadPOsX = this.body[0].x + this.direction.x * this.tileSize;
        const nextHeadPOsY = this.body[0].y + this.direction.y * this.tileSize;
        if (nextHeadPOsX === this.apple.x && nextHeadPOsY === this.apple.y) {
            this.eatTheApple();
        }
        // Moving body
        for (let index = this.body.length - 1; index > 0; index--) {
            this.body[index].x = this.body[index-1].x;
            this.body[index].y = this.body[index-1].y;
        }
        // Moving head
        this.body[0].x = nextHeadPOsX;
        this.body[0].y = nextHeadPOsY;
        // Restart if snake hits wall
        if (this.body[0].x < 0 ||
            this.body[0].x >= this.scene.game.config.width ||
            this.body[0].y < 0 ||
            this.body[0].y >= this.scene.game.config.height
        ) {
                this.scene.scene.restart();
        }
        // Restart if snake eats itself
        for (let i = 1; i < this.body.length; i++) {
            if (this.body[i].x === this.body[0].x &&
                this.body[i].y === this.body[0].y) {
                    this.scene.scene.restart();
                }
        }
    }
}