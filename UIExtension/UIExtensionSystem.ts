// ------------------------------
// 核心类型定义
// ------------------------------

import { Delegate } from "../GameManager/Delegate";
import { Subsystem } from "../Subsystem";

type GameplayTag = string;
type EUIExtensionAction = 'Added' | 'Removed';
type EUIExtensionPointMatch = 'ExactMatch' | 'PartialMatch';
type UIExtensionPointDelegate = Delegate<(action: EUIExtensionAction, request: UIExtensionRequest) => void>;

interface IUIExtensionPoint {
    tag: GameplayTag;
    context?: object;
    allowedDataClassStrings: string[];
    matchType: EUIExtensionPointMatch;
    delegate: UIExtensionPointDelegate;
}

interface IUIExtension {
    tag: GameplayTag;
    elementClassString: string,
    context?: object;
    data: object;
    priority: number;
}

export class UIExtensionRequest {
    constructor(
        public extensionHandle: UIExtensionHandle,
        public tag: GameplayTag,
        public priority: number,
        public data: object,
        public context?: object
    ) { }
}

// ------------------------------
// 句柄系统
// ------------------------------

export class UIExtensionHandle {
    constructor(
        public system: UIExtensionSystem,
        public extension: IUIExtension
    ) { }

    unregister(): void {
        this.system.unregisterExtension(this);
    }

    get isValid(): boolean {
        return this.system.hasExtension(this.extension);
    }
}

export class UIExtensionPointHandle {
    constructor(
        public system: UIExtensionSystem,
        public point: IUIExtensionPoint
    ) { }

    unregister(): void {
        this.system.unregisterExtensionPoint(this);
    }

    get isValid(): boolean {
        return this.system.hasExtensionPoint(this.point);
    }
}

// ------------------------------
// 核心扩展系统
// ------------------------------

export class UIExtensionSystem extends Subsystem {
    private extensionPoints = new Map<GameplayTag, IUIExtensionPoint[]>();
    private extensions = new Map<GameplayTag, IUIExtension[]>();

    // ---------- 扩展点操作 ----------
    registerExtensionPoint(
        tag: GameplayTag,
        matchType: EUIExtensionPointMatch = 'ExactMatch',
        allowedClassStrings: string[],
        delegate: UIExtensionPointDelegate,
        context?: object
    ): UIExtensionPointHandle {
        const point: IUIExtensionPoint = {
            tag,
            context,
            allowedDataClassStrings: allowedClassStrings,
            matchType,
            delegate
        };

        const points = this.extensionPoints.get(tag) || [];
        points.push(point);
        this.extensionPoints.set(tag, points);

        this.notifyPointOfExtensions(point);
        return new UIExtensionPointHandle(this, point);
    }

    unregisterExtensionPoint(handle: UIExtensionPointHandle): void {
        const points = this.extensionPoints.get(handle.point.tag) || [];
        const index = points.indexOf(handle.point);
        if (index !== -1) {
            points.splice(index, 1);
        }
    }

    // ---------- 扩展操作 ----------
    // TODO  这里的销毁要核对一下
    registerExtension(
        tag: GameplayTag,
        elementClassString: string,
        data?: object,
        priority?: number,
        context?: object
    ): UIExtensionHandle {
        const extension: IUIExtension = {
            tag,
            elementClassString,
            context,
            data,
            priority
        };

        const exts = this.extensions.get(tag) || [];
        exts.push(extension);
        this.extensions.set(tag, exts);

        this.notifyPointsOfExtension('Added', extension);
        return new UIExtensionHandle(this, extension);
    }

    unregisterExtension(handle: UIExtensionHandle): void {
        const exts = this.extensions.get(handle.extension.tag) || [];
        const index = exts.indexOf(handle.extension);
        if (index !== -1) {
            exts.splice(index, 1);
            this.notifyPointsOfExtension('Removed', handle.extension);
        }
    }

    // ---------- 通知系统 ----------
    private notifyPointOfExtensions(point: IUIExtensionPoint): void {
        let currentTag: GameplayTag | null = point.tag;
        while (currentTag) {
            if (this.extensions.has(currentTag)) {
                this.extensions.get(currentTag).forEach(ext => {
                    if (this.doesExtensionPassContract(ext, point)) {
                        const req = new UIExtensionRequest(
                            new UIExtensionHandle(this, ext),
                            ext.tag,
                            ext.priority,
                            ext.data,
                            ext.context
                        );
                        point.delegate.broadcast('Added', req);
                    }
                });
            }

            if (point.matchType === 'ExactMatch') break;
            currentTag = this.getParentTag(currentTag);
        }
    }

    private notifyPointsOfExtension(action: EUIExtensionAction, ext: IUIExtension): void {
        let currentTag: GameplayTag | null = ext.tag;
        let isInitialTag = true;

        while (currentTag) {
            if (this.extensionPoints.has(currentTag)) {
                this.extensionPoints.get(currentTag)!.forEach(point => {
                    if (isInitialTag || point.matchType === 'PartialMatch') {
                        if (this.doesExtensionPassContract(ext, point)) {
                            const req = new UIExtensionRequest(
                                new UIExtensionHandle(this, ext),
                                ext.tag,
                                ext.priority,
                                ext.data,
                                ext.context
                            );
                            point.delegate.broadcast(action, req);
                        }
                    }
                });
            }

            isInitialTag = false;
            currentTag = this.getParentTag(currentTag);
        }
    }

    // ---------- 校验逻辑 ----------
    private doesExtensionPassContract(ext: IUIExtension, point: IUIExtensionPoint): boolean {
        // 上下文匹配校验
        // const contextMatch = 
        //     (!ext.context && !point.context) || 
        //     (ext.context === point.context);

        // // 数据类型校验
        // const dataTypeValid = point.allowedDataClasses.some(cls =>
        //     ext.data instanceof cls || 
        //     (typeof ext.data === 'function' && cls.isPrototypeOf(ext.data))
        // );

        // return contextMatch && dataTypeValid;
        return point.allowedDataClassStrings.indexOf(ext.elementClassString) != -1
    }

    // ---------- 工具方法 ----------
    private getParentTag(tag: GameplayTag): GameplayTag | null {
        const parts = tag.split('.');
        return parts.length > 1 ? parts.slice(0, -1).join('.') : null;
    }

    hasExtension(ext: IUIExtension): boolean {
        return this.extensions.get(ext.tag)?.includes(ext) ?? false;
    }

    hasExtensionPoint(point: IUIExtensionPoint): boolean {
        return this.extensionPoints.get(point.tag)?.includes(point) ?? false;
    }
}

// ------------------------------
// 使用示例
// ------------------------------

// 定义数据类
// class WeaponData {
//     constructor(
//         public damage: number,
//         public fireRate: number
//     ) {}
// }

// // 注册扩展点
// import { GameInstance } from "../GameInstance";
// const system = GameInstance.getInstance().getSubsystem(UIExtensionSystem)
// const pointHandle = system.registerExtensionPoint(
//     'ui.weapon.status',
//     'PartialMatch',
//     [WeaponData],
//     (action, req) => {
//         console.log(`Weapon UI ${action}:`, req.data);
//     }
// );

// // 注册扩展
// const weaponExt = system.registerExtension(
//     'ui.weapon.status.advanced',
//     new WeaponData(35, 0.5),
//     100
// );

// // 注销扩展
// setTimeout(() => {
//     weaponExt.unregister();
// }, 5000);