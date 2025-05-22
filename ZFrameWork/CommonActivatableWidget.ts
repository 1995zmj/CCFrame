import { CommonUserWidget } from "./CommonUserWidget";
import { Delegate } from "./GameManager/Delegate";
import { PrimaryGameLayout } from "./PrimaryGameLayout";

export class CommonActivatableWidget extends CommonUserWidget {

    protected closeDelegate: Delegate<()=>void> = null
    public bindBtnEvent(btnNode: cc.Node, func: (button) => void) {
        btnNode.on('click', func, this);
    }

    public setCloseDelegate(delegate: Delegate<()=>void>){
        this.closeDelegate = delegate
    }

    public closeSelf(): void {
        PrimaryGameLayout.getPrimaryGameLayout().findAndRemoveWidgetFromLayer(this)
        this.closeDelegate && this.closeDelegate.broadcast()
        this.closeDelegate = null
    }
}