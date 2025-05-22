import { CommonActivatableWidgetContainerBase } from "./CommonActivatableWidgetContainerBase";

// export class ZPrimaryGameLayout extends ZCommonUserWidget {
//     private layers: Map<ZGameplayTag, ZCommonActivatableWidgetContainerBase>;


//     public registerLayer(layerTag: ZGameplayTag, layerWidget: ZCommonActivatableWidgetContainerBase) {
//         this.layers.set(layerTag, layerWidget)
//     }

//     public getLayerWidget(layerName: ZGameplayTag): ZCommonActivatableWidgetContainerBase {
//         return this.layers.get(layerName)
//     }

//     public pushWidgetToLayerStackAsync<T extends CommonActivatableWidget>(layerName: ZGameplayTag, activatableWidgetClass: ZClass<T>, stateFunc: Function): T {
//         let activatableWidget = new activatableWidgetClass()
//         let layer = this.getLayerWidget(layerName)
//         layer.addWidget(activatableWidget)
//         return activatableWidget
//     }
// }