import { CommonActivatableWidget } from "../CommonActivatableWidget"

export class CommonTipsLayer extends CommonActivatableWidget {
    static prefabPath: string = 'ui/P_Tips_U'

    public infoLable: cc.Label = null
    public moveNode: cc.Node = null

    public init(): void {
        this.moveNode = this.rootNode.getChildByName('slot_move')
        this.infoLable = this.moveNode.getChildByName('txt_ino').getComponent(cc.Label)
        this.moveNode.opacity = 0
    }
    public setupDialgo(str: string) {
        let height = 0
        let moveDistance = 100
        this.infoLable.string = str
        this.moveNode.position = cc.v3(0, height, 0)
        cc.tween(this.moveNode)
            .to(0.2, { opacity: 255 })
            .to(0.5, { position: cc.v2(0, height + moveDistance)})
            .to(0.2, { opacity: 0 })
            // 当前面的动作都执行完毕后才会调用这个回调函数
            .call(() => { this.closeSelf()})
            .start()
    }
}
