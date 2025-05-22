import { CommonActivatableWidget } from "./CommonActivatableWidget";
import { CommonUserWidgetClass } from "./CommonUserWidget";
import { GameInstance } from "./GameInstance";
import { RegisterManager } from "./GameManager/RegisterManager";
import { GameUIManagerSubsystem } from "./GameUIManagerSubsystem";


export class CommonUIExtensions {

    public static getLayer<T extends CommonActivatableWidget>(layerName: string, widgetClass: CommonUserWidgetClass<T>): T {
        return GameInstance.getInstance().getSubsystem(GameUIManagerSubsystem).currentPolicy.getRootLayout().getLayer(layerName).getWidget(widgetClass) as T
    }

    public static pushContentToLayer<T extends CommonActivatableWidget>(layerName: string, widgetClass: CommonUserWidgetClass<T>, callback: (widget) => void): void {
        GameInstance.getInstance().getSubsystem(GameUIManagerSubsystem).currentPolicy.getRootLayout().pushWidgetToLayerStackAsync(layerName, widgetClass, callback)
    }

    public static pushContentToLayerByName(layerName: string, widgetClassName: string): void {
        let tempClass = RegisterManager.getInstance().getClass<CommonActivatableWidget>(widgetClassName) as unknown as CommonUserWidgetClass<CommonActivatableWidget>
        GameInstance.getInstance().getSubsystem(GameUIManagerSubsystem).currentPolicy.getRootLayout().pushWidgetToLayerStackAsync(layerName, tempClass)
    }

    public static PopContentFromLayer(widget: CommonActivatableWidget): void {
        GameInstance.getInstance().getSubsystem(GameUIManagerSubsystem).currentPolicy.getRootLayout().findAndRemoveWidgetFromLayer(widget)
    }
}