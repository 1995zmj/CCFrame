export class Delegate<T extends (...args: any[]) => void = () => void> {
    private _listeners: Array<{
        func: T;
        context?: any;
        once?: boolean;
    }> = [];

    /**
     * 私有构造函数，禁止外部直接实例化
     */
    private constructor() { }

    /**
     * 创建 Delegate 实例的静态工厂方法
     */
    public static create<T extends (...args: any[]) => void = () => void>(): Delegate<T> {
        return new Delegate<T>();
    }

    /**
     * 添加监听函数（通用方法）
     * @param func 函数
     * @param context 绑定的上下文（建议类方法传此参数）
     * @param once 是否单次执行
     */
    public add(func: T, context?: any, once?: boolean): void {
        if (typeof func !== 'function') {
            throw new Error('Delegate.add: 参数必须是一个函数');
        }
        const exists = this._listeners.some(
            item => item.func === func && item.context === context
        );
        if (!exists) {
            this._listeners.push({ func, context, once });
        }
    }

    /**
     * 便捷方法：添加类方法作为监听函数
     * @param context 类实例（this）
     * @param methodName 类方法名
     * @param once 是否单次执行
     */
    public addHandler(context: any, methodName: string, once?: boolean): void {
        const func = context[methodName];
        if (typeof func !== 'function') {
            throw new Error(`Delegate.addHandler: ${methodName} 不是一个函数`);
        }
        this.add(func as T, context, once);
    }

    /**
     * 广播事件
     * @param args 事件参数
     */
    public broadcast(...args: Parameters<T>): void {
        const listenersToCall = [...this._listeners];
        this._listeners = this._listeners.filter(item => !item.once);

        listenersToCall.forEach(({ func, context }) => {
            try {
                const boundFunc = context ? func.bind(context) : func;
                boundFunc(...args);
            } catch (error) {
                console.error('Delegate.broadcast 执行出错:', error);
            }
        });
    }

    /**
     * 移除监听函数（通用方法）
     * @param func 函数
     * @param context 绑定的上下文
     */
    public remove(func: T, context?: any): void {
        this._listeners = this._listeners.filter(
            item => !(item.func === func && item.context === context)
        );
    }

    /**
     * 便捷方法：移除类方法监听
     * @param context 类实例（this）
     * @param methodName 类方法名
     */
    public removeHandler(context: any, methodName: string): void {
        const func = context[methodName];
        if (typeof func !== 'function') return;
        this.remove(func as T, context);
    }

    public removeAll(): void {
        this._listeners = [];
    }

    public destroy(): void {
        this._listeners = [];
    }
}