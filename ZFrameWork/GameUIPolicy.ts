import { PrimaryGameLayout } from "./PrimaryGameLayout";

// 这里是争对本地多用户的
class RootViewportLayoutInfo {
    public rootLayout: PrimaryGameLayout = null
    public bAddedToViewport: boolean = false
}

export class GameUIPolicy {
    private _rootViewLayoutInfo: RootViewportLayoutInfo = null

    public getRootLayout(): PrimaryGameLayout {
        return this._rootViewLayoutInfo.rootLayout ? this._rootViewLayoutInfo.rootLayout : null
    }

    public getLayoutWidgetClass() {
        return PrimaryGameLayout
    }

    public createLayoutWidget(): PrimaryGameLayout {
        let tempClass = this.getLayoutWidgetClass()
        return new tempClass()
    }

    private addView(layout: PrimaryGameLayout) {
        let node = layout.rootNode
        cc.director.getScene().getChildByName("Canvas").addChild(node)
    }

    // 现在只设计一个人 这里就是初始化
    public notifyPlayerAdded() {
        this._rootViewLayoutInfo = new RootViewportLayoutInfo()
        this._rootViewLayoutInfo.rootLayout = this.createLayoutWidget()
        this.addView(this._rootViewLayoutInfo.rootLayout)
    }

    // 现在只设计一个人 这里就是销毁
    public notifyPlayerRemoved() {
        if (this._rootViewLayoutInfo) {
            this._rootViewLayoutInfo.rootLayout.destroy()
            this._rootViewLayoutInfo = null
        }
    }
}