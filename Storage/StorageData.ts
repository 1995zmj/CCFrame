// ======================
// 序列化装饰器模块
// ======================

import { StorageUtil } from "./StorageUtil";

export type StorageDataClass<T extends StorageData> = new (prefix: string) => T;

export function Serialized(
    key: string,
    value: any,
) {
    return function (target: any, propertyName: any) {
        StorageData.saveSubKey.set(key, {
            name: key,
            privateName: propertyName,
            defaultValue: value,
        });
    };
}

/** 字段序列化配置 */
interface FieldConfig {
    /** 对外暴露的属性名 */
    name: string;
    /** 实际存储的属性名 */
    privateName: any;
    /** 默认值 */
    defaultValue?: any;
    // /** 序列化转换函数 */
    // serialize?: (value: T[K]) => T[K];
    // /** 反序列化转换函数 */
    // deserialize?: (value: T[K]) => T[K];
}


// ----------------------
// 可序列化基类
// ----------------------
export class StorageData {
    public storageKey: string;
    public static saveSubKey: Map<string, FieldConfig> = new Map()
    protected isInitialized: boolean = false;
    private readonly instanceId: string;

    constructor(prefix: string) {
        //   this.instanceId = this.generateInstanceId();
        //   this.storageKey = `${prefix}_${this.instanceId}`;
    }

    // 初始化配置数据
    public initConfigData(data: Record<string, any>): void {
        //   Object.entries(data).forEach(([key, value]) => {
        //     if (key in this) {
        //       (this as any)[key] = value;
        //     }
        //   });
    }

    // 反序列化
    unserialize(): void {
        StorageData.saveSubKey.forEach((config) => {
            const key = `${this.storageKey}_${config.name}`;
            this[config.privateName] = StorageUtil.getLocalItem(key, config.defaultValue);
        });
    }

    // 序列化
    serialize(): void {
        StorageData.saveSubKey.forEach((config) => {
            const key = `${this.storageKey}_${config.name}`;
            StorageUtil.wantSaveKeyValue(key, this[config.privateName]);
        });
    }

    public wantSaveKeyValue(name) {
        const config = StorageData.saveSubKey.get(name)
        const key = `${this.storageKey}_${config.name}`;
        StorageUtil.wantSaveKeyValue(key, this[config.privateName]);
    }

    public getCurValue(name: string) {
        const config = StorageData.saveSubKey.get(name)
        return this[config.privateName]
    }
}