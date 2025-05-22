import { CommonUserWidget, CommonUserWidgetClass } from "../CommonUserWidget";
import { GameInstance } from "../GameInstance";
import { Delegate } from "../GameManager/Delegate";
import { RegisterManager } from "../GameManager/RegisterManager";
import { GameUIManagerSubsystem } from "../GameUIManagerSubsystem";
import { UIExtensionPointHandle, UIExtensionRequest, UIExtensionSystem } from "./UIExtensionSystem";

const { ccclass, property } = cc._decorator;

@ccclass
export default class UIExtensionPointComp extends cc.Component {

    @property()
    slotName: string = ''

    @property()
    allowedClassName: string = ''


    delegate: Delegate<(action: string, request: UIExtensionRequest) => void>
    handle: UIExtensionPointHandle

    protected onLoad(): void {
        let tempName = this.node.name;
        if (tempName.startsWith('slot')) {
            this.delegate = Delegate.create<(action, req) => void>()
            this.delegate.add(this.OnAddOrRemoveExtension, this)
            if (this.slotName != '') {
                this.handle = GameInstance.getInstance().getSubsystem(UIExtensionSystem).registerExtensionPoint(this.slotName, 'ExactMatch', [this.allowedClassName], this.delegate)
            }
        }
    }

    public OnAddOrRemoveExtension(action: string, request: UIExtensionRequest): void {
        let tempClass = RegisterManager.getInstance().getClass(request.extensionHandle.extension.elementClassString) as CommonUserWidgetClass<CommonUserWidget>
        GameInstance.getInstance().getSubsystem(GameUIManagerSubsystem).createWidget(tempClass, (tempLayout) => {
            this.node.addChild(tempLayout.rootNode)
            tempLayout.setExtrData(request.data)
        })
    }

    protected onDestroy(): void {
        if (this.slotName != '' && this.handle) {
            GameInstance.getInstance().getSubsystem(UIExtensionSystem).unregisterExtensionPoint(this.handle)
            this.delegate.destroy()
            this.delegate = null
        }
    }
}
