import { ActorComponent } from "./ActorComponent";
import { GameInstance } from "./GameInstance";
import { World } from "./World";

export interface ActorClass<T extends Actor> {
    new(): T;
    prefabPath: string;
}

export class Actor extends cc.Node {
    uid: number = 0
    protected _world: World = null
    public static prefabPath: string = ''
    protected _displayNode: cc.Node = null
    private _wantUpdateDisplayNodeCount: number = 0

    constructor() {
        super();
        this._world = GameInstance.getInstance().getWorld()
    }

    public initExtrNode(node: cc.Node) {
        this.addChild(node)
        this._displayNode = node
        if (this._wantUpdateDisplayNodeCount > 0) {
            this._wantUpdateDisplayNodeCount = 0
            this.tryUpdateDisplayNode()
        }
    }

    public beginPlay() {

    }

    public endPlay() {
        console.log('actor destroy ', this.constructor)
        this._displayNode = null
        this._world = null
    }

    public tryUpdateDisplayNode() {
        if (this._displayNode) {
            this.onUpdateDisplayNode()
        }
        else {
            this._wantUpdateDisplayNodeCount += 1
        }
    }

    public onUpdateDisplayNode() {

    }

    public recycle() {
        let components = this.getComponents(cc.Component)
        for (let index = 0; index < components.length; index++) {
            let component = components[index]
            if (component instanceof ActorComponent) {
                component.recycle()
            }
        }
    }

    // public findComponentByClass<T extends ZActorComponent>(componentClass: ZClass<T>): T {
    //     return this._ownedComponents.get(componentClass) as T
    // }

}