export class ConfigManager {
    private static instance: ConfigManager;

    private _jsonAssetMap: Map<string, cc.JsonAsset> = new Map()
    private _spriteFrameMap: Map<string, cc.SpriteFrame> = new Map()
    private _spriteAtlasrMap: Map<string, cc.SpriteAtlas> = new Map()

    public static getInstance(): ConfigManager {
        if (this.instance == null) {
            this.instance = new ConfigManager();
        }
        return this.instance;
    }

    constructor() {
    }

    public loadConfig(jsonPath: string, callback) {
        console.log("load config ", jsonPath)
        let tempJsonAsset = this._jsonAssetMap.get(jsonPath);
        if (tempJsonAsset) {
            callback && callback(tempJsonAsset);
        }
        else {
            cc.resources.load(jsonPath, cc.JsonAsset, (err, jsonAsset) => {
                if (err) {
                    console.log(err);
                    return;
                }
                this._jsonAssetMap.set(jsonAsset.name, jsonAsset);
                callback && callback(jsonAsset);
            });
        }
    }

    public addJsonAsset(name: string, jsonAsset: cc.JsonAsset) {
        this._jsonAssetMap.set(name, jsonAsset);
    }

    public getJson(jsonAssetName: string) {
        if (!this._jsonAssetMap.has(jsonAssetName)) {
            throw new Error(`对应资源没有加载 ${jsonAssetName}`);
        }
        return this._jsonAssetMap.get(jsonAssetName).json
    }

    public loadSpriteFrame(path: string, callback: (spriteFrame: cc.SpriteFrame) => void) {
        if (this._spriteFrameMap.has(path)) {
            callback && callback(this._spriteFrameMap.get(path));
            return;
        }
        cc.resources.load(path, cc.SpriteFrame, (err, spriteFrame) => {
            if (err) {
                console.log(err);
                return;
            }
            this._spriteFrameMap.set(path, spriteFrame);
            callback && callback(spriteFrame);
        });
    }

    public loadSpriteAtlas(path: string, callback: (spriteAtlas: cc.SpriteAtlas) => void) {
        if (this._spriteAtlasrMap.has(path)) {
            callback && callback(this._spriteAtlasrMap.get(path));
            return;
        }
        cc.resources.load(path, cc.SpriteAtlas, (err, spriteAtlas) => {
            if (err) {
                console.log(err);
                return;
            }
            this._spriteAtlasrMap.set(path, spriteAtlas);
            callback && callback(spriteAtlas);
        });
    }

    public clearAll() {
        this._jsonAssetMap.clear()
        this._spriteFrameMap.clear()
        this._spriteAtlasrMap.clear()
    }
}