import { Actor, ActorClass } from "./Actor";
import { ExperienceData, GameModeData } from "./DefinitionConfidg/JsonDefinition";
import ExperienceManagerComponent from "./ExperienceManagerComponent";
import { GameInstance } from "./GameInstance";
import { ConfigManager } from "./GameManager/ConfigManager";
import { RegisterManager } from "./GameManager/RegisterManager";
import { GameState } from "./GameState";
import { PlayerState } from "./PlayerState";

@(RegisterManager.getInstance().registerClass('GameMode'))
export class GameMode extends Actor {
    public gameModeData: GameModeData = null
    // public pawn: Pawn = null
    public playerController
    private _experienceData: ExperienceData = null

    public playerState: PlayerState
    public gameState: GameState = null

    public gameStateClass: ActorClass<GameState>
    public playerStateClass: ActorClass<PlayerState>

    constructor() {
        super();
        console.log("创建了 gamemode")
        let gameConfigdata = ConfigManager.getInstance().getJson('GameModeConfig') as GameModeData
        this._experienceData = gameConfigdata.experienceConfig
        let gameStateClassString = gameConfigdata.gameStateClassString ?? "GameState"
        this.gameStateClass = RegisterManager.getInstance().getClass(gameStateClassString)
        let playerStateClassString = gameConfigdata.playerStateClassString ?? 'PlayerState'
        this.playerStateClass = RegisterManager.getInstance().getClass(playerStateClassString)
    }

    public preInitializeComponents(): void {
        // 这里创建 gamestate
        this.gameState = GameInstance.getInstance().getWorld().spawnActor(this.gameStateClass)
        // 先临时放一下
        this.playerState = GameInstance.getInstance().getWorld().spawnActor(this.playerStateClass)
        this.initGameState()
    }

    public initGame(): void {
        // this.gameState.init()
    }

    public initGameState() {

    }

    public initLate(): void {
        let experienceComponent = this.gameState.getComponent(ExperienceManagerComponent)
        experienceComponent.setCurrentExperience(this._experienceData)
    }

}