// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;

@ccclass
export default class TouchComp extends cc.Component {

    @property(cc.Node)
    bottomNode: cc.Node = null

    @property(cc.Node)
    topNode: cc.Node = null

    speed: number = 5
    curDirction: cc.Vec2 = cc.v2(0, 0)
    startTouchPosiotn: cc.Vec2 = cc.v2(0, 0)
    isTouch: boolean = false

    _evenKey = 'touch_move'
    _eventTarget: cc.EventTarget = null

    protected onLoad(): void {
        this.bottomNode.active = false
        this._eventTarget = new cc.EventTarget()
        this.node.on(cc.Node.EventType.TOUCH_START, this.onTouchStart, this)
        this.node.on(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove, this)
        this.node.on(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this)
    }

    protected onDestroy(): void {
        this.node.off(cc.Node.EventType.TOUCH_START, this.onTouchStart, this)
        this.node.off(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove, this)
        this.node.off(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this)
        this._eventTarget.clear()
        this._eventTarget = null
    }

    public onTouchStart(event: cc.Event.EventTouch) {
        if (this.isTouch) {
            return
        }
        this.bottomNode.active = true
        this.isTouch = true
        this.startTouchPosiotn = event.getLocation()
        this.bottomNode.setPosition(this.startTouchPosiotn)
    }

    public onTouchMove(event: cc.Event.EventTouch) {
        if (!this.isTouch) {
            return
        }
        let position = event.getLocation()
        let delta = position.subSelf(this.startTouchPosiotn).normalize()
        this._eventTarget.emit(this._evenKey, delta)
        this.topNode.setPosition(delta.mul(20))
    }

    public onTouchEnd(event: cc.Event.EventTouch) {
        this.isTouch = false
        this.bottomNode.active = false
        this.topNode.setPosition(cc.Vec2.ZERO)
        this._eventTarget.emit(this._evenKey, cc.Vec2.ZERO)
    }

    public registerEvent(func:(dir:cc.Vec2)=>void, owner) {
        this._eventTarget.on(this._evenKey, func, owner)
    }

}
