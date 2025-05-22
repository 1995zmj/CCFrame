// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class FollowPlayComp extends cc.Component {

    @property(cc.Node)
    playerNode: cc.Node = null;

  
    public onLoad(): void {
        console.log('buff component onLoad')
    }
    public onEnable(): void {
        console.log('buff component enable')
    }

    public start(): void {
        console.log('buff component start')
    }

    public onDisable(): void {
        console.log('buff component disable')
    }

    public onDestroy(): void {
        console.log('buff component destroy')
    }
}
