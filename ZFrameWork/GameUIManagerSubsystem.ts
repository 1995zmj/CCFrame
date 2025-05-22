import { AssetSubsystem } from "./AssetSubsystem";
import { CommonUserWidget, CommonUserWidgetClass } from "./CommonUserWidget";
import { GameInstance } from "./GameInstance";
import { GameUIPolicy } from "./GameUIPolicy";
import { Subsystem } from "./Subsystem";

export class GameUIManagerSubsystem extends Subsystem {

    private _currentPolicy: GameUIPolicy

    constructor() {
        super();
        // TODO 这里要创建一个现在先固定后面可以配置
        
    }

    public get currentPolicy(): GameUIPolicy {
        return this._currentPolicy
    }

    public set currentPolicy(inPolicy: GameUIPolicy) {
        if (this._currentPolicy != inPolicy) {
            this._currentPolicy = inPolicy
        }
    }

    public notifyPlayerAdded() {
        if (!this.currentPolicy) {
            this._currentPolicy = new GameUIPolicy()
        }
        this.currentPolicy.notifyPlayerAdded()

    }

    public notifyPlayerRemoved() {
        if (this.currentPolicy) {
            this.currentPolicy.notifyPlayerRemoved()
            this.currentPolicy = null
        }
    }

    public createWidget<T extends CommonUserWidget>(widgetclass: CommonUserWidgetClass<T>, callback: (T) => void) {
        console.log('createWidget called', widgetclass.prefabPath)
        GameInstance.getInstance().getSubsystem(AssetSubsystem).loadPrefab(widgetclass.prefabPath, (prefab) => {
            // console.log('prefab loaded', prefab)
            let node: cc.Node = cc.instantiate(prefab);
            let widget = new widgetclass()
            widget.initNode(node)
            callback(widget)
        })
    }

    public destroyWidget(widget: CommonUserWidget) {
        widget.destroy()
    }

}


