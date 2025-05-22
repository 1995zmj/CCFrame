import { Serialized, StorageData } from "../Storage/StorageData";
import { StorageUtil } from "../Storage/StorageUtil";
import { Subsystem } from "../Subsystem";
import { AchievementData } from "./AchievementSubsystem";

export class AchievementStorage extends StorageData {
    public data: AchievementData = null

    @Serialized('achievementId', 0)
    private _achievementId: number

    @Serialized('progress', 0)
    private _progress: number

    @Serialized('targetIndex', 0)
    private _targetIndex: number

    constructor(prefix: string) {
        super(prefix)
        // this['compled'] = false
        this.storageKey = prefix
        this.unserialize()
    }

    public initConfigData(data: AchievementData) {
        this.data = data;
        // 检擦
        if (this.data.achievement_id != this._achievementId) {

        }

        // 校验数据
        if (this._targetIndex >= this.data.count.length) {
            this._targetIndex = this.data.count.length - 1
        }
    }

    public getName() {

    }

    public getDes() {

    }

    public getTarget(): number {
        if (this.isCompleted()) {
            return 0
        }
        return this.data.count[this._targetIndex]
    }

    public getReward(): number {
        if (this.isCompleted()) {
            return 0
        }
        return this.data.reward[this._targetIndex]
    }

    public isCompleted(): boolean {
        return this._targetIndex >= this.data.count.length
    }

    public canClaim(): boolean {
        if (this.isCompleted()) {
            return false
        }
        if (this._progress >= this.data.count[this._targetIndex]) {
            return true
        }
        return false
    }

    public claimReward(): void {
        if (this.isCompleted()) {
            return
        }
        this._targetIndex = this._targetIndex + 1
        this.wantSaveKeyValue('targetIndex')
    }

    public addProgress(value: number) {
        this._progress = this._progress + value
        this.wantSaveKeyValue('progress')
    }
    public changeProgress(value: number) {
        this._progress = value

        this.wantSaveKeyValue('progress')
    }
}