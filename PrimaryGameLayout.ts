import { CommonActivatableWidget } from "./CommonActivatableWidget";
import { CommonActivatableWidgetContainerBase } from "./CommonActivatableWidgetContainerBase";
import { CommonUserWidget, CommonUserWidgetClass } from "./CommonUserWidget";
import { GameInstance } from "./GameInstance";
import { GameUIManagerSubsystem } from "./GameUIManagerSubsystem";

export class PrimaryGameLayout extends CommonUserWidget {
    private _layers: Map<string, CommonActivatableWidgetContainerBase> = new Map();

    constructor() {
        super();
        this._rootNode = new cc.Node()
        this._rootNode.name = 'MMM'
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
        let debugNode = this.createDebguNode()
        this._rootNode.addChild(debugNode)
        this.registerLayer('UI.Layer.Game')
        this.registerLayer('UI.Layer.GameMenu')
        this.registerLayer('UI.Layer.Menu')
        this.registerLayer('UI.Layer.Moal')
    }

    public destroy(): void {
        this.clearLayer()
        this._rootNode.removeFromParent()
        this._rootNode = null
        super.destroy()
    }

    public static getPrimaryGameLayout(): PrimaryGameLayout {
        return GameInstance.getInstance().getSubsystem(GameUIManagerSubsystem).currentPolicy.getRootLayout()
    }

    private createDebguNode() {
        let tempNode = new cc.Node()
        tempNode.name = 'debugNode'
        let tempComp = tempNode.addComponent(cc.Widget)
        tempComp.isAlignTop = true
        tempComp.top = 0
        tempComp.isAlignLeft = true
        tempComp.left = 0
        return tempNode
    }

    private clearLayer() {
        this._layers.forEach((value, key) => {
            value.destroy()
        });
        this._layers.clear()
    }

    private registerLayer(layerTag: string) {
        let tempContainer = new CommonActivatableWidgetContainerBase(layerTag)
        this._rootNode.addChild(tempContainer.rootNode)
        this._layers.set(layerTag, tempContainer)
    }

    public getLayer(layerName: string): CommonActivatableWidgetContainerBase {
        return this._layers.get(layerName)
    }

    public pushWidgetToLayerStackAsync<T extends CommonActivatableWidget>(layerName: string, activatableWidgetClass: CommonUserWidgetClass<T>, callback?: (widget) => void): void {
        let layer = this.getLayer(layerName)
        layer.addWidget(activatableWidgetClass, callback)
    }

    public findAndRemoveWidgetFromLayer(wdiget: CommonActivatableWidget) {
        this._layers.forEach((value, key) => {
            value.removeWidget(wdiget)
        });
    }
}