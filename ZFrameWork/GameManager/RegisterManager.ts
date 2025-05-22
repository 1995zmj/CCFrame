export const { ccclass, property } = cc._decorator;

export class RegisterManager {
    private static instance: RegisterManager;

    public static getInstance(): RegisterManager {
        if (this.instance == null) {
            this.instance = new RegisterManager();
        }
        return this.instance;
    }

    public getClass<T>(className: string): T {
        return cc.js.getClassByName(className) as T;
    }

    public registerClass(className: string) {
        return ccclass(className)
    }
}