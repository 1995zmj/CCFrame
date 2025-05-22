
import { AssetSubsystem } from "./AssetSubsystem";
import { ExperienceData } from "./DefinitionConfidg/JsonDefinition";
import { GameInstance } from "./GameInstance";
import { ConfigManager } from "./GameManager/ConfigManager";
import { Delegate } from "./GameManager/Delegate";
import { GameStateComponent } from "./ModularGameplay/GameStateComponent";

enum EExperienceLoadState {
    Unloaded,
    Loading,
    LoadingGameFeatures,
    LoadingChaosTestingDelay,
    ExecutingActions,
    Loaded,
    Deactivating
}

export interface LoadTaskInfo {
    type: string
    path: string
}

const { ccclass } = cc._decorator;
@ccclass()
export default class ExperienceManagerComponent extends GameStateComponent {

    private _loadState: EExperienceLoadState = EExperienceLoadState.Unloaded
    private _currentExperience: ExperienceData = null
    public onExperienceLoaded: Delegate = null
    private _maxLoadCount = 0
    private _curLoadCount = 0

    private _loadTaskInfos: Array<LoadTaskInfo> = []

    constructor() {
        super();
        this.onExperienceLoaded = Delegate.create<() => void>()
    }

    public setCurrentExperience(experienceData: ExperienceData) {
        this._currentExperience = experienceData
        this.startExperienceLoad()
    }

    public addLoadTask(LoadTaskInfo) {
        if (this._loadState == EExperienceLoadState.Unloaded) {
            this._loadTaskInfos.push(LoadTaskInfo)
        }
        else {
            console.error('load task not run');
        }
    }

    public startExperienceLoad() {
        console.log("开始 startExperienceLoad")
        this._loadState = EExperienceLoadState.Loading

        // 这个暂时没有用到
        // this._currentExperience.actions.forEach(element => {
        //     let tempClassName = "ZGameFeatureAction_" + element.actionClassName
        //     console.log("zmj actions", tempClassName)
        //     let tempClass = RegisterManager.getInstance().getClass<ZGameFeatureAction>(tempClassName)
        //     let gameFeatureAction = new tempClass()
        //     gameFeatureAction.onGameFeatureActivating(element.data)
        // });

        // 根据配置加载 prefab json
        // this._currentExperience.jsons.forEach(element => {
        //     this._maxLoadCount += 1
        //     ConfigManager.getInstance().loadConfig(element, (jsonAsset) => {
        //         this.loadProgress()
        //     })
        // });

        this._maxLoadCount += 1
        ConfigManager.getInstance().loadConfig('json/all_data_file', (jsonAsset) => {
            let data = jsonAsset.json
            for (let index = 0; index < data.length; index++) {
                const element = data[index];
                this._maxLoadCount += 1
                let path = 'json/' + element
                ConfigManager.getInstance().loadConfig(path, (jsonAsset) => {
                    this.loadProgress()
                })
            }
            this.loadProgress()
        })

        this._currentExperience.prefabs.forEach(element => {
            this._maxLoadCount += 1
            GameInstance.getInstance().getSubsystem(AssetSubsystem).loadPrefab(element, () => {
                this.loadProgress()
            })
        });
        this._loadTaskInfos.forEach(element => {
            console.log('zmj _loadTaskInfos', element)
            this._maxLoadCount += 1
            if (element.type == 'json') {
                ConfigManager.getInstance().loadConfig(element.path, () => {
                    this.loadProgress()
                })
            }
            else if (element.type == 'prefab') {
                GameInstance.getInstance().getSubsystem(AssetSubsystem).loadPrefab(element.path, () => {
                    this.loadProgress()
                })
            }
        });

        if (this._maxLoadCount == 0) {
            this.onExperienceLoaded.broadcast()
        }
    }

    public loadProgress() {
        this._curLoadCount += 1
        console.log("load progress", this._curLoadCount, this._maxLoadCount)
        if (this._curLoadCount == this._maxLoadCount) {
            this.onExperienceLoaded.broadcast()
            // 这里标记着已经加载完了
            this._curLoadCount += 1
        }
    }

    protected onDestroy(): void {
        this.onExperienceLoaded.destroy()
        super.onDestroy()
    }
}
