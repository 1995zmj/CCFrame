import { Subsystem } from "./Subsystem";

export class AssetSubsystem extends Subsystem {
    // TODO 还没有销毁 这个还是有点问题的
    private prefabMap: Map<string, cc.Prefab> = new Map();

    public loadPrefab(prefabPath: string, callback: (prefabClass: cc.Prefab) => void) {
        // console.log('loadPrefab called', prefabPath)
        let tempPrefab = this.prefabMap.get(prefabPath);
        if (tempPrefab) {
            // console.log('prefab found in cache')
            callback && callback(tempPrefab);
        }
        else {
            // console.log('loading prefab from resources')
            cc.resources.load(prefabPath, cc.Prefab, (err, prefab) => {
                if (err) {
                    console.log('error loading prefab', err);
                    return;
                }
                // console.log('prefab loaded from resources')
                this.prefabMap.set(prefabPath, prefab);
                callback && callback(prefab);
            });
        }
    }

    public clearAll(){
        this.prefabMap.clear()
    }

    // public loadPrefabPromise(prefabPath: string): Promise<cc.Prefab> {
    //     return new Promise((resolve)=>{
    //         let tempPrefab = this.prefabMap.get(prefabPath);
    //         if (tempPrefab) {
    //             resolve(tempPrefab)
    //         }
    //         else {
    //             cc.resources.load(prefabPath, cc.Prefab, (err, prefab) => {
    //                 if (err) {
    //                     console.log(err);
    //                     return;
    //                 }
    //                 this.prefabMap.set(prefabPath, prefab);
    //                 resolve(tempPrefab)
    //             });
    //         }
    //     })
    // }

    // public loadAssetBundle(assetBundleName:string, callback: (bundle)=> void)
    // {
    //     cc.assetManager.loadBundle(assetBundleName, (err, bundle)=>{
    //         callback(bundle)
    //     })
    // }
}