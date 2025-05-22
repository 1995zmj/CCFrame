import { RegisterManager } from "./GameManager/RegisterManager"

// export class WorldSetting {
//     protected _rootNode: cc.Node
//     private _actorList: Array<ZActor> = new Array()
//     private _gameMode: ZGameMode
//     private _curGameModeData: GameModeData

//     public set rootNode(node: cc.Node) {
//         this._rootNode = node
//     }

//     public setGameConfig(config: GameModetConfigContainer) {
//         this._curGameModeData = config.getData()
//         let gameModeClassString = this._curGameModeData.gameModeClassString
//         this._gameMode = this.spawnActorByName<ZGameMode>(gameModeClassString)
//         this._gameMode.preInitializeComponents()
//         this._gameMode.init()
//     }

//     public spawnActorByName<T extends ZActor>(actorClassName: string): T {
//         const tempClass = RegisterManager.getInstance().getActorClassByName<T>(actorClassName)
//         return this.spawnActor<T>(tempClass)
//     }

//     public spawnActor<T extends ZActor>(actorClass: ZActorClass<T>): T {
//         const tempActor = new actorClass()
//         this._actorList.push(tempActor)
//         this._rootNode.addChild(tempActor.rootNode)
//         return tempActor as T
//     }


//     // 这个应该是localplay初始完之后，要看是创建actor，gamemode 也是actor
//     public initializeActorsForPlay(){

//     }


    

// }