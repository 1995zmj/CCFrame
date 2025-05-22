import { Subsystem } from "./Subsystem";


//  主要用 cc.director.getScheduler()
export class ZGameScheduleSubsystem extends Subsystem {
    private _curScheduler: cc.Scheduler = null

    constructor() {
        super();
        this._curScheduler = cc.director.getScheduler()
    }

    public schedule(func, interval, repeat, delay){
        this._curScheduler.schedule(func, interval, repeat, delay)
    }
}


