import { Subsystem } from "../Subsystem";
import { StorageData, StorageDataClass } from "./StorageData";

export class StorageSubsystem extends Subsystem {
    private _data: Map<string, StorageData> = new Map

    registerData<T extends StorageData>(name: string, storageDataClass: StorageDataClass<T>, configData: any): T {
        if (this._data.has(name)) {
            return this._data.get(name) as T
        } else {
            let data = new storageDataClass(name)
            data.initConfigData(configData)
            this._data.set(name, data)
            return data
        }
    }
    
   getData<T extends StorageData>(name: string): T {
        if (this._data.has(name)) {
            return this._data.get(name) as T
        }
        return null
    }


    
}