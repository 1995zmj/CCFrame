import { CommonUIExtensions } from "../../CommonUIExtensions";
import { GameInstance } from "../../GameInstance";
import { UIExtensionSystem } from "../../UIExtension/UIExtensionSystem";
import { GameFeatureAction_WorldActionBase } from "./ZGameFeatureAction_WorldActionBase";

export interface LayoutRequest {
    layoutClassString: string;
    layerId: string;
}

export interface ElementRequest {
    widgetClassString: string;
    slotId: string;
}

export class GameFeatureAction_AddWidget extends GameFeatureAction_WorldActionBase {

    private layouts: Array<LayoutRequest> = null
    private widgets: Array<ElementRequest> = null

    public handleActorExtension(context: any){

    }

    public addToWorld(context: any){
        // TODO 还不完善 先不适用
        // this.addWidgets(context)
    }

    public addWidgets(context: any){
        console.log(context)
        context.forEach(element => {
            let tempType = element[0]
            
            if (tempType == 'LayoutRequest') {
                let layoutClassString = element[1]
                let layerId = element[2]
                CommonUIExtensions.pushContentToLayerByName(layerId, layoutClassString)
            }
            else if (tempType == 'ElementRequest') {
                let elementClassString = element[1]
                let slotName = element[2]
                GameInstance.getInstance().getSubsystem(UIExtensionSystem).registerExtension(slotName, elementClassString)
            }
        });
    }

}