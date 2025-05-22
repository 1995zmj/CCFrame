import { GameMode } from "./GameMode";
import { Subsystem, SubsystemClass } from "./Subsystem";
import { StorageUtil } from "./Storage/StorageUtil";
import { World } from "./World";
import { AchievementSubsystem } from "./Achievement/AchievementSubsystem";
import { TalentSubsystem } from "../Game/Buff/TalentSubsystem";

export class GameInstance {
    private static _instance: GameInstance;

    private _subsystemMap: Map<SubsystemClass<Subsystem>, Subsystem> = new Map()

    private _curWorld: World
    private _globalCustomData: any = {}

    public static getInstance(): GameInstance {
        if (this._instance == null) {
            this._instance = new GameInstance();
            this._instance.getSubsystem(AchievementSubsystem).initData()
            this._instance.getSubsystem(TalentSubsystem).initData()
        }
        return this._instance;
    }

    public tryChangeScence(scenceName: string, customData: any = {})
    {
        if (this._curWorld) {
            this._curWorld.destroy()
            this._curWorld = null
        }
        this._globalCustomData = customData
        cc.director.loadScene(scenceName)
    }

    public getGlobalCustomData(){
        return this._globalCustomData
    }

    public changeWorld(worldNode: cc.Node) {
        if (this._curWorld) {
            this._curWorld.destroy()
            this._curWorld = null
        }
        this._curWorld = new World()
        this._curWorld.rootNode = worldNode
    }

    public getWorld(): World {
        return this._curWorld
    }

    public getGameMode(): GameMode {
        return this._curWorld.gameMode
    }

    public getSubsystem<T extends Subsystem>(subsystemClass: SubsystemClass<T>): T {
        if (!this._subsystemMap.has(subsystemClass)) {
            let tempSubsystem = new subsystemClass()
            this._subsystemMap.set(subsystemClass, tempSubsystem);
        }
        return this._subsystemMap.get(subsystemClass) as T
    }

    //  这里应该是最初的入口了
    public initializeForPlay() {
        //  这里创建world
        //  加载worldsetting
    }

    public startPlay() {
        // 读取配置，创建gamemode
        //world设置gamemode  setGamemode -> this.creategameode

        // 初始化actor

        // gamemode 调用initgame
    }

    //  这里是创建 gamemode
    public createGameMode(inWorld: World) {

    }
}