import { ConfigManager } from "../GameManager/ConfigManager"
import ShowSpriteComp from "./ShowSpriteComp"

export class SpriteAnimatorControler {
    private _showSpriteComp: ShowSpriteComp = null
    private _data = null
    private _p: Map<string, cc.SpriteAtlas> = new Map()
    private _animatorToSprites: Map<string, cc.SpriteFrame[]> = new Map()
    private _name: string = ''
    private _animSpeeds: Map<string, number> = new Map()  // 存储不同动画的播放速率
    private _currentAnim: string = ''  // 当前播放的动画名称

    public initData(node: cc.Node, name: string) {
        if (!name || name == '') {
            console.error('error')
            return
        }
        if (!node.getComponent(cc.Sprite)) {
            console.error('error')
            return
        }
        if (!node.getComponent(ShowSpriteComp)) {
            this._showSpriteComp = node.addComponent(ShowSpriteComp)
        }
        this._animatorToSprites.clear()
        this._name = name
        let path = 'char/' + name + '/' + name + '_data'
        cc.resources.load(path, cc.JsonAsset, (err, jsonAsset) => {
            if (err) {
                console.log(err);
                return;
            }
            this._data = jsonAsset.json
            this.loadSpriteAsset(this._data)
        });
    }

    public loadSpriteAsset(jsonData) {
        // 加载所有动画的精灵图集
        for (let animName in jsonData.has) {
            let path = 'char/' + jsonData.name + '/' + jsonData.name + '_' + jsonData.has[animName];
            ConfigManager.getInstance().loadSpriteAtlas(path, (spriteAtlas) => {
                if (spriteAtlas) {
                    this._p.set(jsonData.has[animName], spriteAtlas);
                    // 如果是idle动画，只加载但不播放
                    if (animName === 'idle') {
                        this.playeAnimator('idle', false);
                    }
                }
            });
        }
    }

    public playeAnimator(name: string, play: boolean = true) {
        if (!this._data || !this._data.has[name]) {
            console.warn('Animation not found:', name);
            return;
        }
        let p = this._data.has[name];
        let spriteAtlas = this._p.get(p);
        if (!spriteAtlas) {
            console.warn('Sprite atlas not loaded:', p);
            return;
        }
        let spriteFrames = spriteAtlas.getSpriteFrames();
        let frames = [];
        for (let i = 0; i < this._data[p][name].length; i++) {
            let frameName = this._data[p][name][i];
            let frame = spriteFrames.find(f => f.name === frameName);
            if (frame) {
                frames.push(frame);
                // 只在播放动画且是第一帧时设置原始大小
                if (i === 0 && play) {
                    const originalSize = frame.getOriginalSize();
                    this._showSpriteComp.node.setContentSize(originalSize);
                }
            }
        }
        this._animatorToSprites.set(name, frames);
        this._showSpriteComp.setSpriteFrames(frames);
        
        // 设置动画播放速率
        let speed = this._animSpeeds.get(name);
        if (speed !== undefined) {
            this._showSpriteComp.setInterval(speed);
        }

        // 控制是否播放动画
        if (play) {
            this._showSpriteComp.play();
            this._currentAnim = name;
        } else {
            this._showSpriteComp.stop();
            this._currentAnim = '';
        }
    }

    // 设置动画播放速率
    public setAnimSpeed(animName: string, speed: number) {
        this._animSpeeds.set(animName, speed);
        // 如果当前正在播放这个动画，立即应用新的速率
        if (this._showSpriteComp && this._currentAnim === animName) {
            this._showSpriteComp.setInterval(speed);
        }
    }

    // 获取动画播放速率
    public getAnimSpeed(animName: string): number {
        return this._animSpeeds.get(animName) || 0.15; // 默认0.15秒
    }

    public getSpriteFrames(name: string): cc.SpriteFrame[] {
        return this._animatorToSprites.get(name)
    }

    // 开始播放当前动画
    public play() {
        if (this._showSpriteComp) {
            this._showSpriteComp.play();
        }
    }

    // 停止播放当前动画
    public stop() {
        if (this._showSpriteComp) {
            this._showSpriteComp.stop();
        }
    }

    // 是否正在播放动画
    public isPlaying(): boolean {
        return this._showSpriteComp ? this._showSpriteComp.isPlaying() : false;
    }

    public recycle() {
        this._data = null
        this._name = ''
        this._p.clear()
        this._animatorToSprites.clear()
        this._animSpeeds.clear()
        this._currentAnim = ''
    }
}