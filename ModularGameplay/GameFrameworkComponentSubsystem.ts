import { Actor } from "../Actor";
import { GameInstance } from "../GameInstance";
import { Subsystem } from "../Subsystem";

class ComponentRequestInfo {
    className: string
    additionFlags: string
}
class ComponentRequest {
    receiverClassName: string
    componentClassName: string
}
// TODO 都还没有销毁
export class GameFrameworkComponentSubsystem extends Subsystem {
    public static AddGameFrameworkComponentReceiver(receiver: Actor) {
        let gfc = GameInstance.getInstance().getSubsystem(GameFrameworkComponentSubsystem)
        if (gfc) {
            gfc.addReceiverInternal(receiver)
        }
    }

    public static removeGameFrameworkComponentReceiver(receiver: Actor) {

        let gfc = GameInstance.getInstance().getSubsystem(GameFrameworkComponentSubsystem)
        if (gfc) {
            gfc.removeReceiverInternal(receiver)
        }
    }

    public static sendGameFrameworkComponentExtensionEvent(receiver: Actor, eventName: string) {

    }

    public receiverClassToComponentClassMap: Map<string, Set<ComponentRequestInfo>> = new Map()
    public requestTrackingMap: Map<ComponentRequest, number> = new Map()

    public addReceiverInternal(receiver: Actor) {
        for (let tempClass = receiver.constructor; tempClass != Actor; tempClass = Object.getPrototypeOf(tempClass)) {
            let requestInfoSet = this.receiverClassToComponentClassMap.get(tempClass.name)
            requestInfoSet.forEach((requestInfo) => {
                if (requestInfo.className) {
                    this.createComponentOnInstance(receiver, requestInfo.className, requestInfo.additionFlags)
                }
            })
        }
    }

    public removeReceiverInternal(receiver: Actor) {
        // receiver.getComponents()
        // TInlineComponentArray<UActorComponent*> ComponentsToDestroy;
        // for (UActorComponent* Component : Receiver->GetComponents())
        // {
        //     if (UActorComponent* GFC = Cast<UActorComponent>(Component))
        //     {
        //         UClass* ComponentClass = GFC->GetClass();
        //         TSet<FObjectKey>* ComponentInstances = ComponentClassToComponentInstanceMap.Find(ComponentClass);
        //         if (ComponentInstances)
        //         {
        //             if (ComponentInstances->Contains(GFC))
        //             {
        //                 ComponentsToDestroy.Add(GFC);
        //             }
        //         }
        //     }
        // }

        // for (UActorComponent* Component : ComponentsToDestroy)
        // {
        //     DestroyInstancedComponent(Component);
        // }

        // SendExtensionEventInternal(Receiver, NAME_ReceiverRemoved);
    }

    public createComponentOnInstance(receiver: Actor, componentClassName: string, flags: string) {
        // TODO 判断是不是有相同的组件
        // TODO 判断存在的组件是不是有继承的关系
        // let componentClass = RegisterManager.getInstance().getClassByName<ActorComponent>(componentClassName)
        // let component = receiver.createDefaultSubobject(componentClass)
        // component.init()
    }

    // public addComponentRequest(receiverClass: ActorClass<ZActor>, componentClass: Class<ActorComponent>, additionFlags: string) {
    //     let newRequest = new ComponentRequest()
    //     newRequest.receiverClassName = receiverClass.name
    //     newRequest.componentClassName = componentClass.name

    //     let count = this.requestTrackingMap.get(newRequest)
    //     if (count) {
    //         count = count + 1
    //     } else {
    //         count = 1
    //     }
    //     this.requestTrackingMap.set(newRequest, count)
    //     if (count == 1) {
    //         let requestInfoSet = this.receiverClassToComponentClassMap.get(receiverClass.name)
    //         if (!requestInfoSet) {
    //             requestInfoSet = new Set()
    //         }
    //         let requestInfo = new ComponentRequestInfo()
    //         requestInfoSet.add(requestInfo)

    //         let actors = GameInstance.getInstance().getWorld().getAllActor()
    //         for (const tempActor of actors) {
    //             if (tempActor.constructor.name == receiverClass.name) {
    //                 this.createComponentOnInstance(tempActor, componentClass.name, additionFlags)
    //             }
    //         }
    //     }

    // }

    // public removeComponentOnInstance() {

    // }
}