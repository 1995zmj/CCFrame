import { AssetSubsystem } from "../AssetSubsystem";
import { GameModeData } from "../DefinitionConfidg/JsonDefinition";
import { GameInstance } from "../GameInstance";
import { ConfigManager } from "../GameManager/ConfigManager";
import { GameUIManagerSubsystem } from "../GameUIManagerSubsystem";
import { World } from "../World";

const { ccclass, property } = cc._decorator;

@ccclass
export default class WorldComp extends cc.Component {

    @property(cc.JsonAsset)
    gameConfig: cc.JsonAsset = null

    _world: World = null

    protected onLoad(): void {
        if (!this.gameConfig) {
            console.log('检查 gameConfig')
            return
        }
        GameInstance.getInstance().changeWorld(this.node)
        this._world = GameInstance.getInstance().getWorld()
        let configName = 'GameModeConfig'
        ConfigManager.getInstance().addJsonAsset(configName, this.gameConfig)
        GameInstance.getInstance().getWorld().setGameConfig(ConfigManager.getInstance().getJson(configName) as GameModeData)
        GameInstance.getInstance().getSubsystem(GameUIManagerSubsystem).notifyPlayerAdded()
    }

    protected start(): void {
        GameInstance.getInstance().getWorld().initLate()
    }

    protected update(dt: number): void {
        // GameInstance.getInstance().getWorld().update(dt)
    }

    protected onDestroy(): void {
        GameInstance.getInstance().getSubsystem(GameUIManagerSubsystem).notifyPlayerRemoved()
        ConfigManager.getInstance().clearAll()
        GameInstance.getInstance().getSubsystem(AssetSubsystem).clearAll()
    }

}
