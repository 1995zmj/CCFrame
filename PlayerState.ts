import { Actor } from "./Actor";
import { RegisterManager } from "./GameManager/RegisterManager";


@(RegisterManager.getInstance().registerClass('PlayerState'))
export class PlayerState extends Actor {
    constructor() {
        super();
        console.log("创建了 PlayerState")
    }
}