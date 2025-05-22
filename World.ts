import { BuffComponent } from "../Game/Buff/BuffComponent";
import { Actor, ActorClass } from "./Actor"
import { AssetSubsystem } from "./AssetSubsystem";
import { GameModeData } from "./DefinitionConfidg/JsonDefinition";
import { GameInstance } from "./GameInstance";
import { RegisterManager } from "./GameManager/RegisterManager"
import { GameMode } from "./GameMode";

export class World {
    protected _rootNode: cc.Node
    public set rootNode(node: cc.Node) {
        this._rootNode = node
    }
    public get rootNode(): cc.Node {
        return this._rootNode
    }

    private _gameMode: GameMode = null
    private _curGameModeData: GameModeData = null

    public get gameMode(): GameMode {
        return this._gameMode
    }


    public _actors: Map<number, Actor> = new Map()

    public setGameConfig(data: GameModeData) {
        this._curGameModeData = data
        let gameModeClassString = this._curGameModeData.gameModeClassString
        this._gameMode = this.spawnActorByName<GameMode>(gameModeClassString)
        this._gameMode.preInitializeComponents()


    }

    // 这个应该是localplay初始完之后，要看是创建actor，gamemode 也是actor
    public initializeActorsForPlay() {

    }

    public initLate() {
        this._gameMode.initLate()
    }

    public update(dt) {
        // this._gameMode && this._gameMode.update(dt)
    }

    public destroy(): void {
        this._actors.forEach((actor) => {
            this.destroyActor(actor)
        })
        if (this._gameMode) {
            this.destroyActor(this._gameMode)
        }
        this._gameMode = null
        this._curGameModeData = null
        // this.clearAllActor()
    }

    // --------- actor 相关
    // 给每个生成的实例一个uid  显示比较简单的++
    private _uidIndex: number = -1

    public getNextUid() {
        return ++this._uidIndex
    }

    public spawnActorByName<T extends Actor>(actorClassName: string): T {
        const tempClass = RegisterManager.getInstance().getClass<ActorClass<T>>(actorClassName)
        if (!tempClass) {
            console.error('class is error ', actorClassName)
            return null
        }
        return this.spawnActor<T>(tempClass)
    }

    public spawnActor<T extends Actor>(actorClass: ActorClass<T>): T {
        const tempActor = new actorClass()
        tempActor.uid = this.getNextUid()
        tempActor.name = tempActor.constructor.name + '-' + tempActor.uid
        this._rootNode.addChild(tempActor)
        this._actors.set(tempActor.uid, tempActor)
        tempActor.beginPlay()
        if (actorClass.prefabPath != "") {
            // TODO 这里加载有问题 要对prefab资源缓存 不要每次都异步加载 还有在加载界面先加载好
            GameInstance.getInstance().getSubsystem(AssetSubsystem).loadPrefab(actorClass.prefabPath, (prefab) => {
                console.log(prefab)
                let node: cc.Node = cc.instantiate(prefab);
                tempActor.initExtrNode(node)
            })
        }
        return tempActor as T
    }

    public destroyActor<T extends Actor>(actor: T) {
        if (this._actors.has(actor.uid)) {
            this._actors.delete(actor.uid)
        }
        actor.recycle()
        actor.removeFromParent()
        actor.endPlay()
    }

    // public getAllActor(): Array<Actor> {
    //     return this._actorList
    // }

    // public clearAllActor(): void {
    //     console.log('clear all actor')
    //     for (const actor of this._actorList) {
    //         actor.destroy()
    //     }
    //     this._actorList = null

    //     this._actorPoolMap.clear()
    // }

    // public getAllActorByClass<T extends Actor>(actorClass: ActorClass<T>): Array<Actor> {
    //     let tempList = []
    //     for (const actor in this._actorList) {
    //         if (actor.constructor == actorClass) {
    //             tempList.push(actor)
    //         }
    //     }
    //     return tempList
    // }

    public getActorByUid<T extends Actor>(uid: number): T {
        if (this._actors.has(uid)) {
            return this._actors.get(uid) as T
        }
        return null
    }

    // actor pool
    private _actorPoolMap: Map<ActorClass<Actor>, Array<Actor>> = new Map()
    public getActorFromPool<T extends Actor>(actorClass: ActorClass<Actor>): T {
        let tempActor = null
        if (this._actorPoolMap.has(actorClass)) {
            let tempActorList = this._actorPoolMap.get(actorClass)
            if (tempActorList.length > 0) {
                tempActor = this._actorPoolMap.get(actorClass).pop()
                tempActor.uid = this.getNextUid()
                tempActor.name = tempActor.constructor.name + '-' + tempActor.uid
                this._rootNode.addChild(tempActor)
                this._actors.set(tempActor.uid, tempActor)
            }
            else {
                tempActor = this.spawnActor(actorClass)
            }
        }
        else {
            this._actorPoolMap.set(actorClass, [])
            tempActor = this.spawnActor(actorClass)
        }

        return tempActor
    }

    public pushActorToPool(actor: Actor) {
        let actorClass = actor.constructor as ActorClass<Actor>
        if (this._actorPoolMap.has(actorClass)) {
            this._actorPoolMap.get(actorClass).push(actor)
        }
        else {
            this._actorPoolMap.set(actorClass, [])
            this._actorPoolMap.get(actorClass).push(actor)
        }
        actor.recycle()
        actor.uid = -1
        actor.name = actor.constructor.name + '-pool'
        if (this._actors.has(actor.uid)) {
            this._actors.delete(actor.uid)
        }
        if (actor.getComponent(BuffComponent)?._buffs.size > 0) {
            console.error('buff 没有清楚掉')
        }
        actor.removeFromParent()
    }
}