import { GameInstance } from "./GameInstance";
import { GameUIManagerSubsystem } from "./GameUIManagerSubsystem";
import { Subsystem } from "./Subsystem";
import { CommonGameDialogDescriptor, CommonGameDialogLayer } from "./Widget/CommonGameDialogLayer";
import { CommonTipsLayer } from "./Widget/CommonTipsLayer";

export class CommonMessagingSubsystem extends Subsystem {

    public showConfirmation(descriptor: CommonGameDialogDescriptor, delegate, cancelDelegate?) {
        let rootLayout = GameInstance.getInstance().getSubsystem(GameUIManagerSubsystem).currentPolicy.getRootLayout()
        rootLayout.pushWidgetToLayerStackAsync('UI.Layer.Moal', CommonGameDialogLayer, (widget) => {
            widget.setupDialgo(descriptor, delegate, cancelDelegate)
        })
    }

    public showTips(str: string) {
        let rootLayout = GameInstance.getInstance().getSubsystem(GameUIManagerSubsystem).currentPolicy.getRootLayout()
        rootLayout.pushWidgetToLayerStackAsync('UI.Layer.Moal', CommonTipsLayer, (widget) => {
            widget.setupDialgo(str)
        })
    }

    public showError() {

    }


    // public showTip()
    // {
    //     let rootLayout = GameInstance.getInstance().getSubsystem(ZGameUIManagerSubsystem).currentPolicy.getRootLayout()
    //     rootLayout.pushWidgetToLayerStackAsync
    // }
}


