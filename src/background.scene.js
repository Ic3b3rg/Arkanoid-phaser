export class BackgroundScene extends Phaser.Scene {

    constructor() {
        super('BackgroundScene');
        this.layer = null;
        this.gameScene = null;
    }

    preload() {

        this.load.image('space-bg', 'src/assets/space-bg.png');

    }

    create() {
        const width = this.scale.gameSize.width;
        const height = this.scale.gameSize.height;

        this.layer = this.add.container(0, 0);
        this.layer.setSize(width, height);
        this.layer.setScale(2);

        const background = this.add.tileSprite(0, 0, this.layer.width, this.layer.height, 'space-bg');
        this.layer.add(background);

        this.scene.launch('GameScene');
        this.scene.launch('Score');
        
    }
}