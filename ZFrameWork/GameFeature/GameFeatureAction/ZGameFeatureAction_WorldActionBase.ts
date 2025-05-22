import { GameFeatureAction } from "../GameFeatureAction";

export interface LayoutRequest {
    layoutClassString: string;
    layerId: string;
}

export interface ElementRequest {
    widgetClassString: string;
    slotId: string;
}

export class GameFeatureAction_WorldActionBase extends GameFeatureAction {



    public onGameFeatureActivating(context: any): void {
        this.addToWorld(context)
    }

    public onGameFeatureDeactivating(context: any): void {
        
    }

    public addToWorld(context: any){

    }

}