import { GameInstance } from "../GameInstance";
import { StorageSubsystem } from "../Storage/StorageSubsystem";
import { Subsystem } from "../Subsystem";
import { AchievementStorage } from "./AchievementStorage";
import { achievement_data } from "../../resources/data/achievement_data";

export interface AchievementData {
    achievement_id: number,
    name: string,
    icon: string,
    des: string,
    type: string,
    count: number[],
    reward: number[],
}

export enum AchievementType {
    KilledMonster = 'KilledMonster',
    OpenBox = 'OpenBox',
    PlayGameCount = 'PlayGameCount',
    KillBoss = 'KillBoss',

    DamageMonster = 'DamageMonster',
    MaxHp = 'MaxHp',
    MaxAtk = 'MaxAtk',
    MaxDef = 'MaxDef',
    PassLevel = 'PassLevel',
}

const addType: String[] = [AchievementType.KilledMonster, AchievementType.OpenBox, AchievementType.PlayGameCount, AchievementType.KillBoss]
const changeType: String[] = [AchievementType.MaxHp, AchievementType.MaxAtk, AchievementType.MaxDef, AchievementType.DamageMonster, AchievementType.PassLevel]

export class AchievementSubsystem extends Subsystem {
    typeToName: Map<string, Array<string>> = new Map()
    allItems: Array<string> = new Array()
    public initData() {
        for (const key in achievement_data) {
            let configData = achievement_data[key] as AchievementData
            let dataName = 'AchievementData*' + configData.achievement_id
            //  这个可以在后期根据不同类型来开展
            GameInstance.getInstance().getSubsystem(StorageSubsystem).registerData(dataName, AchievementStorage, configData)
            let tempType = configData.type
            if (!this.typeToName.has(tempType)) {
                this.typeToName.set(tempType, [])
            }
            this.typeToName.get(tempType).push(dataName)
            this.allItems.push(dataName)
        }
    }

    public trigger(typeKey: string, value: number = 1) {
        if (addType.includes(typeKey)) {
            if (this.typeToName.has(typeKey)) {
                let list = this.typeToName.get(typeKey)
                for (let index = 0; index < list.length; index++) {
                    const dataName = list[index];
                    let data = GameInstance.getInstance().getSubsystem(StorageSubsystem).getData<AchievementStorage>(dataName)
                    data.addProgress(1)
                }
            }
        }
        else if (changeType.includes(typeKey)) {
            if (this.typeToName.has(typeKey)) {
                let list = this.typeToName.get(typeKey)
                for (let index = 0; index < list.length; index++) {
                    const dataName = list[index];
                    let data = GameInstance.getInstance().getSubsystem(StorageSubsystem).getData<AchievementStorage>(dataName)
                    data.changeProgress(value)
                }
            }
        }

    }

    public getAchievement(name: string): AchievementStorage {
        return GameInstance.getInstance().getSubsystem(StorageSubsystem).getData<AchievementStorage>(name)
    }
}




