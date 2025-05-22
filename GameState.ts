import { Actor } from "./Actor";
import ExperienceManagerComponent from "./ExperienceManagerComponent";
import { RegisterManager } from "./GameManager/RegisterManager";

export class GameState extends Actor
{ 
    public experienceManagerComponent:ExperienceManagerComponent = null
    constructor() {
        super();
        this.experienceManagerComponent = this.addComponent(ExperienceManagerComponent)
        console.log("初始化 gamestate")
        this.experienceManagerComponent.onExperienceLoaded.add(this.loaded, this)
    }

    public beginPlay(): void {
        
    }

    public loaded(){
        console.log("gamestate loaded")
    }
}