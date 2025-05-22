import { World } from "../World";

const { ccclass, property } = cc._decorator;

@ccclass
export default class DebugComp extends cc.Component {

    @property(cc.JsonAsset)
    gameConfig: cc.JsonAsset = null

    _world: World = null

    protected onLoad(): void {
        
    }

    protected start(): void {

    }

    protected update(dt: number): void {
    }

    protected onDestroy(): void {
    }

}
