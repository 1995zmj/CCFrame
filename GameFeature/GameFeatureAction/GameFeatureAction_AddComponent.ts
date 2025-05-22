import { GameFeatureAction_AddWidget } from "./GameFeatureAction_AddWidget";

class GameFeatureComponentEntry {
    public actorClassName: string
    public componentClass: string
}

export class GameFeatureAction_AddComponent extends GameFeatureAction_AddWidget {
    private ComponentsList: Array<GameFeatureComponentEntry> = null

    constructor() {
        super();
        this.ComponentsList = new Array()
    }

    public handleActorExtension(context: any) {

    }

    public addToWorld(context: any) {
        // 还不完善先不使用
        // this.addComponents(context)
    }

    // public addComponents(context: any) {
    //     console.log(context)
    //     context.forEach(element => {
    //         let actorClassName = element[0]
    //         let componentClass = element[1]
    //         let tempClass = RegisterManager.getInstance().getActorClassByName<ZActor>(actorClassName) as ZActorClass<ZActor>
    //         let tempComponentClass = RegisterManager.getInstance().getClassByName<ZActorComponent>(componentClass)
    //         GameInstance.getInstance().getSubsystem(ZGameFrameworkComponentSubsystem).addComponentRequest(tempClass, tempComponentClass, "add")
    //     });
    // }

}
