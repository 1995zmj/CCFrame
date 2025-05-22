// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;

@ccclass
export default class InputComp extends cc.Component {


    @property(cc.Node)
    inputNode: cc.Node = null

    @property(cc.Node)
    bottomNode: cc.Node = null

    @property(cc.Node)
    topNode: cc.Node = null

    speed: number = 5
    dirction: cc.Vec2 = cc.v2(0, 0)

    protected onLoad(): void {
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
    }

    protected onDestroy(): void {
        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
    }

    public onKeyDown(event) {
        switch (event.keyCode) {
            case cc.macro.KEY.a:
                this.dirction.x = -1
                break;
            case cc.macro.KEY.d:
                this.dirction.x = 1
                break;
            case cc.macro.KEY.w:
                this.dirction.y = 1

                break;
            case cc.macro.KEY.s:
                this.dirction.y = -1
                break;
            default:
                break;
        }
    }

    public onKeyUp(event) {
        switch (event.keyCode) {
            case cc.macro.KEY.a:
                this.dirction.x = 0
                break;
            case cc.macro.KEY.d:
                this.dirction.x = 0
                break;
            case cc.macro.KEY.w:
                this.dirction.y = 0
                break;
            case cc.macro.KEY.s:
                this.dirction.y = 0
                break;
            default:
                break;
        }
    }


    protected update(dt: number): void {
        let curPositon = this.node.getPosition()
        this.node.setPosition(cc.v2(curPositon.x + this.dirction.x * this.speed, curPositon.y + this.dirction.y * this.speed))
    }

}
