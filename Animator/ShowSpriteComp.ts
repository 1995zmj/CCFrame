const { ccclass, property } = cc._decorator;

@ccclass
export default class ShowSpriteComp extends cc.Component {

    @property
    interval: number = 0.6  // 动画帧间隔时间，值越小播放越快

    @property
    startIndex: number = 0

    private _curIndex: number = 0
    private _time: number = 0
    private _maxNumber: number = 0
    private _sprite: cc.Sprite = null
    private _spriteFrames: cc.SpriteFrame[] = null
    private _isPlaying: boolean = false  // 是否正在播放动画

    protected onLoad(): void {
        this._sprite = this.node.getComponent(cc.Sprite)
    }

    public setData(atlas: cc.SpriteAtlas)
    {
        this.setSpriteFrames(atlas.getSpriteFrames())
    }

    public setSpriteFrames(spriteFrames: cc.SpriteFrame[])
    {
        this._spriteFrames = spriteFrames
        this._curIndex = 0  // 重置当前帧索引
        this._sprite.spriteFrame = this._spriteFrames[this._curIndex]
        this._maxNumber = this._spriteFrames.length
    }

    // 设置动画播放速率
    public setInterval(interval: number) {
        this.interval = interval
    }

    // 开始播放动画
    public play() {
        this._isPlaying = true;
    }

    // 停止播放动画
    public stop() {
        this._isPlaying = false;
        // 重置到第一帧
        if (this._spriteFrames && this._spriteFrames.length > 0) {
            this._curIndex = 0;
            this._sprite.spriteFrame = this._spriteFrames[0];
        }
    }

    // 是否正在播放
    public isPlaying(): boolean {
        return this._isPlaying;
    }

    protected update(dt: number): void {
        if (!this._spriteFrames || !this._sprite || !this._isPlaying) {
            return
        }
        this._time += dt
        if (this._time > this.interval) {
            this._time -= this.interval
            this.playSpriteLoop()
        }
    }

    protected onDestroy(): void {
        this._sprite = null
        this._spriteFrames = null
    }

    public playSprite() {
        this.play();
    }

    protected playSpriteLoop() {
        this._sprite.spriteFrame = this._spriteFrames[this._curIndex]
        this._curIndex += 1
        this._curIndex %= this._maxNumber
    }
}
