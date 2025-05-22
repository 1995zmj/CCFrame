import { CommonActivatableWidget } from "./CommonActivatableWidget";
import { CommonUserWidget, CommonUserWidgetClass } from "./CommonUserWidget";
import { GameInstance } from "./GameInstance";
import { GameUIManagerSubsystem } from "./GameUIManagerSubsystem";

export class CommonActivatableWidgetContainerBase extends CommonUserWidget {
    private _widgets: Map<CommonUserWidgetClass<CommonActivatableWidget>, CommonActivatableWidget>

    constructor(tag: string) {
        super()
        this._rootNode = new cc.Node()
        this._rootNode.name = 'N_' + tag
        this._rootNode.addComponent(cc.Widget)
        let tempComp = this._rootNode.getComponent(cc.Widget)
        tempComp.isAlignTop = true
        tempComp.top = 0
        tempComp.isAlignBottom = true
        tempComp.bottom = 0
        tempComp.isAlignLeft = true
        tempComp.left = 0
        tempComp.isAlignRight = true
        tempComp.right = 0

        this._widgets = new Map()
    }

    public destroy(): void {
        this.removeAllWidget()
        this._rootNode.removeFromParent()
        this._rootNode = null
        super.destroy()
    }

    public addWidget<T extends CommonActivatableWidget>(widgetClass: CommonUserWidgetClass<T>, callback?: (widget) => void) {
        let tempWidgetClass = widgetClass as CommonUserWidgetClass<T>
        GameInstance.getInstance().getSubsystem(GameUIManagerSubsystem).createWidget(tempWidgetClass, (tempLayout) => {
            this._rootNode.addChild(tempLayout.rootNode)
            this._widgets.set(widgetClass, tempLayout)
            callback && callback(tempLayout)
        })
    }

    public getWidget<T extends CommonActivatableWidget>(widgetClass: CommonUserWidgetClass<T>) {
        return this._widgets.get(widgetClass)
    }

    public removeWidget(widget: CommonActivatableWidget) {
        widget.rootNode.removeFromParent()
        let tempWdigetClass = widget.constructor as unknown as CommonUserWidgetClass<CommonActivatableWidget>
        this._widgets.delete(tempWdigetClass)
    }

    public removeAllWidget() {
        this._widgets.forEach((value, key) => {
            value.destroy()
        });
        this._widgets.clear()
    }
}