export class Score extends Phaser.Scene {
    constructor() {
      super("Score");
  
      this.gameSceneRef = null;
    }
  
    preload() {
      this.load.image("logo", "src/assets/arkanoidjs-logo.png");
    }
  
    create() {
      this.gameSceneRef = this.scene.get("GameScene");
  
      const sceneWidth = this.scale.gameSize.width;
      const sceneHeight = this.scale.gameSize.height;
      const width = (this.scale.gameSize.width / 100) * 25;
  
      this.cameras.main.setBackgroundColor("rgba(122,40,200,0.7)");
      this.cameras.main.setViewport(
        sceneWidth / 2 + (sceneWidth / 100) * 22.5,
        0,
        width,
        sceneHeight
      );
  
      const logo = this.add.image(width / 2, 250, "logo").setScale(1);
  
      this.tweens.add({
        targets: logo,
        scale: 0.8,
        duration: 500,
        ease: "Power2",
        yoyo: true,
        loop: 3,
      });
  
      //! CREO LA SCRITTA PER IL PUNTEGGIO
  
      this.scoreText = this.add
        .text(width / 2, logo.height, `Score: 0 `, {
          fontSize: 30,
          color: "#FFF",
          fontFamily: "Geizer, sans-serif",
        })
        .setOrigin(0.5);
  
      this.layer = this.add.container(0, 0);
      this.layer.setSize(width, sceneHeight);
      this.layer.add(logo);
    }
    update() {
      this.scoreText.setText(`Score: ${this.gameSceneRef.score}`);
    }
  }
  