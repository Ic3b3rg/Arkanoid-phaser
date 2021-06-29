import Phaser, { Game } from "phaser";
import { BackgroundScene } from "./background.scene";
import {Score } from "./score"

class MyGame extends Phaser.Scene {
  constructor() {
    super("GameScene");
    this.broke = null;
    this.bar = null;
    this.ball = null;
    this.ballLauched = false;
    this.pinkBrick = null;
    this.purpleBrick = null;
    this.score = 0;
    this.istructionText = null;
    this.gameOverText = null;
    this.winText = null;
    this.ballLauched = false;
  }

  preload() {
    this.load.image("ball", "src/assets/ball.png");
    this.load.image("bar", "src/assets/bar.png");
    this.load.image("brick1", "src/assets/brick01.png");
    this.load.image("brick2", "src/assets/brick02.png");
    this.load.image("brick3", "src/assets/brick03.png");
    this.load.audio("broke", "src/sounds/brokeWall.ogg");
  }

  create() {
    const sceneWidth = this.scale.gameSize.width;
    const sceneHeight = this.scale.gameSize.height;

    this.cameras.main.setViewport(
      sceneWidth / 2 - ((sceneWidth / 100) * 40) / 2,
      0,
      (sceneWidth / 100) * 40,
      sceneHeight
    );
    this.cameras.main.setBackgroundColor("rgba(0,0,0,0.75)");
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;
    this.cameras.main.setBounds(0, 0, width, height);
    this.physics.world.setBounds(0, 0, width, height);
    this.physics.world.setBoundsCollision(true, true, true, false);

    this.broke = this.sound.add("broke", { loop: false, volume: 0.5 });

      /**
       * RESTART FUNCTION
       */
      document.addEventListener('click', ()=> {
        if(this.ballLauched === false){
          this.scene.restart()
        }
      })

    this.istructionText = this.add.text(
      this.physics.world.bounds.width / 2,
      this.physics.world.bounds.height / 2 + 56 ,
      "Click to restart",
      {
        fontSize: 30,
        color: "#fff",
        fontFamily: "Geizer, sans-serif",
      }
    );
    this.istructionText.setOrigin(0.5);

    this.istructionText.setVisible(false);

    this.gameOverText = this.add.text(
      this.physics.world.bounds.width / 2,
      this.physics.world.bounds.height / 2,
      "Game Over",
      {
        fontSize: 50,
        color: "#fff",
        fontFamily: "Geizer, sans-serif",
      }
    );
    this.gameOverText.setOrigin(0.5);

    this.gameOverText.setVisible(false);

    // this.winText = this.add.text(
    //   this.physics.world.bounds.width / 2,
    //   this.physics.world.bounds.height / 2,
    //   "You Win",
    //   {
    //     fontSize: 50,
    //     color: "#fff",
    //     fontFamily: "Geizer, sans-serif",
    //   }
    // );
    // this.winText.setOrigin(0.5);

    // this.winText.setVisible(false);

    /**
     * Create sprites
     */

    this.bar = this.physics.add
      .sprite(
        width / 2,
        height - 32,
        "bar" // key of image for the sprite
      )
      .setScale(3, 2)
      .setCollideWorldBounds(true)
      .setImmovable(true);

    this.ball = this.physics.add
      .sprite(this.bar.x, this.bar.y - 20, "ball")
      .setScale(3)
      .setCollideWorldBounds(true)
      .setBounce(1, 1);
    this.ball.body.onWorldBounds = true;

    this.pinkBrick = this.physics.add.group({
      key: "brick2",
      frame: [0],
      frameQuantity: 23,
      setScale: {
        x: 2,
      },
      immovable: true,
      collideWorldBounds: true,
    });
    Phaser.Actions.GridAlign(this.pinkBrick.getChildren(), {
      width: 0,
      cellWidth: 32,
      cellHeight: 32,
      y: 100,
      x: 32,
    });

    this.purpleBrick = this.physics.add.group({
      key: "brick3",
      frame: [0],
      frameQuantity: 23,
      setScale: {
        x: 2,
      },
      immovable: true,
      collideWorldBounds: true,
    });
    Phaser.Actions.GridAlign(this.purpleBrick.getChildren(), {
      width: 0,
      cellWidth: 32,
      cellHeight: 32,
      y: 180,
      x: 32,
    });

    /**
     * END CREATE
     */

    this.physics.add.collider(
      this.bar,
      this.ball,
      () => {
        this.ball.setVelocityY(this.ball.body.velocity.y + 5);

        let newVelocityX = Math.abs(
          this.ball.body.velocity.x - (this.ball.x - this.bar.x) * 5
        );
        if (this.ball.x < this.bar.x) {
          this.ball.setVelocityX(-newVelocityX);
        } else {
          this.ball.setVelocityX(newVelocityX);
        }
      },
      null,
      this
    );

    this.physics.add.collider(
      this.ball,
      [this.purpleBrick, this.pinkBrick],
      (ball = this.ball, brick) => {
        brick.disableBody(true, true);
        this.broke.play();
        this.score += 10;

        if (ball.body.velocity.x === 0) {
          runNum = Math.random();
          if (random >= 0.5) {
            ball.body.setVelocityX(150);
          } else {
            ball.body.setVelocityX(-150);
          }
        }
      },
      null,
      this
    );
  }

  update() {
    const width = this.cameras.main.width;
    const pointer = this.input.activePointer;

    if (
      pointer.x >= this.cameras.main.x &&
      pointer.x <= this.cameras.main.x + width
    ) {
      const mouseXRelativeToViewport = scale(
        pointer.x,
        this.cameras.main.x,
        this.cameras.main.x + width,
        0,
        this.cameras.main.width
      );
      this.bar.setX(mouseXRelativeToViewport);
      if (!this.ballLauched) {
        this.ball.setX(this.bar.x);
        if (pointer.leftButtonDown()) {
          this.ballLauched = true;
          this.ball.setVelocityY(-500);
          this.ball.setVelocityX(Math.random() * 80);
        }
      }
    }

    if (this.ball.y > this.bar.y + 32) {
      this.gameOverText.setVisible(true);
      this.istructionText.setVisible(true);
      this.ball.disableBody(true, true);
      this.ballLauched = false;
      this.score = 0;
    }
    if(this.pinkBrick.countActive() <= 0 && this.purpleBrick.countActive() <= 0 ){
      this.winText.setVisible(true);
      this.ball.disableBody(true,true);
      this.ballLauched = false;
      this.score = 0
    }


  }
}
const scale = (num, in_min, in_max, out_min, out_max) => {
  return ((num - in_min) * (out_max - out_min)) / (in_max - in_min) + out_min;
};
const config = {
  type: Phaser.AUTO,
  scale: {
    mode: Phaser.Scale.FIT,
    parent: "arkanoidJS",
    width: innerWidth,
    height: innerHeight,
  },
  physics: {
    default: "arcade",
    arcade: {
      gravity: false,
    },
  },
  scene: [BackgroundScene,Score, MyGame],
};

const game = new Phaser.Game(config);
