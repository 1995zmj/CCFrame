import { CommonActivatableWidget } from "../../ZFrameWork/CommonActivatableWidget"
import { Delegate } from "../GameManager/Delegate"



export interface ConfirmationDialogAction {
    result: string
    optionalDisplayText: string
}


export class CommonGameDialogDescriptor {
    public static createConfirmationOk(header: string, body: string) {
        let descriptor = new CommonGameDialogDescriptor()
        descriptor.header = header
        descriptor.body = body
        // 不添加任何按钮动作，这样会显示关闭按钮
        return descriptor
    }
    public static createConfirmationOkCancel() {

    }
    public static createConfirmationYesNo(header: string, body: string) {

        let descriptor = new CommonGameDialogDescriptor()
        descriptor.header = header
        descriptor.body = body

        descriptor.buttonActions.push({
            result: 'Confirmed',
            optionalDisplayText: 'Yes'
        })
        descriptor.buttonActions.push({
            result: 'Declined',
            optionalDisplayText: 'No'
        })

        return descriptor
    }
    public static createConfirmationYesNoCancel() {

    }

    public header: string
    public body: string

    public buttonActions: Array<ConfirmationDialogAction> = []

}

export class CommonGameDialogLayer extends CommonActivatableWidget {
    static prefabPath: string = 'ui/P_Dialog_U'

    public headerLable;
    public bodyLable;
    public closeBtn;
    public btnYes;
    public btnNo;
    public resultCallback: Delegate
    public cancelCallback: Delegate

    public init(): void {
        this.headerLable = this.rootNode.getChildByName('txt_header').getComponent(cc.Label)
        this.bodyLable = this.rootNode.getChildByName('txt_body').getComponent(cc.Label)
        this.closeBtn = this.rootNode.getChildByName('btn_close')
        this.btnYes = this.rootNode.getChildByName('btn_y')
        this.btnNo = this.rootNode.getChildByName('btn_n')

        this.bindBtnEvent(this.closeBtn, () => {
            if (this.resultCallback) {
                this.resultCallback.broadcast()
            }
            this.closeSelf()
        })
        this.bindBtnEvent(this.btnYes, () => {
            if (this.resultCallback) {
                this.resultCallback.broadcast()
            }
            this.closeSelf()
        })
        this.bindBtnEvent(this.btnNo, () => {
            if (this.cancelCallback) {
                this.cancelCallback.broadcast()
            }
            this.closeSelf()
        })
    }

    public setupDialgo(descriptor: CommonGameDialogDescriptor, confirmDelegate: Delegate<() => void>, cancelDelegate?: Delegate<() => void>) {
        this.resultCallback = confirmDelegate
        this.cancelCallback = cancelDelegate

        // 设置标题
        if (descriptor.header) {
            this.headerLable.string = descriptor.header
        }

        // 设置内容
        if (descriptor.body) {
            this.bodyLable.string = descriptor.body
        }

        // 根据buttonActions显示/隐藏按钮
        this.btnYes.active = false
        this.btnNo.active = false
        this.closeBtn.active = false

        for (let action of descriptor.buttonActions) {
            if (action.result === 'Confirmed') {
                this.btnYes.active = true
            } else if (action.result === 'Declined') {
                this.btnNo.active = true
            }
        }

        // 如果没有配置任何按钮，则显示关闭按钮
        if (descriptor.buttonActions.length === 0) {
            this.closeBtn.active = true
        }
    }

    public closeSelf(): void {
        this.resultCallback = null
        this.cancelCallback = null
        super.closeSelf()
    }

    public KillDialog() {

    }
}
