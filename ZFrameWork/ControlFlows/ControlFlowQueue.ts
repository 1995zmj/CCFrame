/**
 * 支持类成员函数的手动步骤队列
 * 保证类方法的 this 上下文正确绑定
 */
export class ControlFlowQueue<T extends object = any> {
    private steps: Array<{
        fn: (...args: any[]) => any;
        context?: T;
        boundArgs?: any[];
    }> = [];
    private currentIndex: number = -1;
    private isRunning: boolean = false;

    //====================== 核心方法 ======================
    
    //  添加类方法到队列
    public addStep<Method extends (this: T, ...args: any[]) => any>(
        method: Method,
        context: T,
        ...args: Parameters<Method>
    ): this {
        // 类型校验
        if (!this.isMethodOf(context, method)) {
            throw new Error("方法不属于该实例");
        }

        const boundFn = method.bind(context, ...args);
        this.steps.push({
            fn: boundFn,
            context,
        });
        return this;
    }
    /**
     * 添加静态方法或普通函数
     * @param fn 普通函数或静态方法
     */
    addStaticStep(fn: (...args: any[]) => any): this {
        this.steps.push({ fn });
        return this;
    }

    /** 启动队列执行 */
    start(): void {
        if (this.isRunning || this.steps.length === 0) return;
        
        this.isRunning = true;
        this.currentIndex = 0;
        this.executeCurrentStep();
    }

    /** 触发下一步 */
    next(): void {
        if (!this.isRunning) return;
        
        this.currentIndex++;
        if (this.currentIndex < this.steps.length) {
            this.executeCurrentStep();
        } else {
            this.completeQueue();
        }
    }

    /** 手动停止 */ 
    stop():void{
        this.completeQueue();
    }

    //====================== 私有方法 ======================
    private executeCurrentStep(): void {
        const { fn, context } = this.steps[this.currentIndex];
        try {
            const result = fn();
            
            // 处理阻断信号
            if (result === false) {
                this.completeQueue();
                return;
            }
            
            this.onStepComplete?.(this.currentIndex, context);
        } catch (error) {
            this.handleStepError(error, context);
        }
    }

    private isMethodOf(context: T, method: Function): boolean {
        // 方法1：原型链遍历（推荐）
        let proto = Object.getPrototypeOf(context);
        while (proto !== null) {
            if (Object.values(proto).includes(method)) {
                return true;
            }
            proto = Object.getPrototypeOf(proto);
        }
        return false;

        // 方法2：快速检查（适用于明确的方法定义）
        // return context[method.name as keyof T] === method;
    }


    private handleStepError(error: any, context?: T): void {
        this.onStepError?.(error, this.currentIndex, context);
        this.completeQueue();
    }

    private completeQueue(): void {
        this.isRunning = false;
        this.onQueueComplete?.(this.currentIndex);
    }

    //====================== 生命周期回调 ======================
    onStepComplete?: (stepIndex: number, context?: T) => void;
    onStepError?: (error: any, stepIndex: number, context?: T) => void;
    onQueueComplete?: (lastStepIndex: number) => void;

    //====================== 状态查询 ======================
    get currentStep(): number {
        return this.currentIndex + 1;
    }

    get totalSteps(): number {
        return this.steps.length;
    }

    get isActive(): boolean {
        return this.isRunning;
    }
}

//====================== 使用示例 ======================
// class Player {
//     private health: number = 100;

    
//     public get curHealth() : number {
//         return this.health
//     }
    

//     // 类成员方法
//     takeDamage(damage: number): void {
//         this.health -= damage;
//         console.log(`受到 ${damage} 点伤害，剩余生命值: ${this.health}`);
//     }

//     heal(amount: number): boolean {
//         if (this.health >= 100) return false;
        
//         this.health = Math.min(100, this.health + amount);
//         console.log(`恢复 ${amount} 点生命值，当前生命值: ${this.health}`);
//         return true;
//     }
//     playEffect(): void {
//         console.log("效果");
//     }
// }

// // 创建玩家实例和队列
// const player = new Player();
// const actionQueue = new ControlFlowQueue<Player>();

// // 添加类方法到队列
// actionQueue
//     .addStep(player.takeDamage, player, 3)  // 绑定类实例
//     .addStep(player.playEffect, player)        // 自动类型检查
//     // .addStaticStep(() => console.log("战斗结束"));

// // 配置回调
// actionQueue.onStepComplete = (index, ctx) => 
//     console.log(`步骤 ${index + 1} 完成，当前生命值: ${ctx?.curHealth}`);

// // 执行队列
// actionQueue.start();

// // 手动触发下一步
// setTimeout(() => actionQueue.next(), 1000);  // 执行 takeDamage(30)
// setTimeout(() => actionQueue.next(), 2000);  // 执行 heal(50)
// setTimeout(() => actionQueue.next(), 3000);  // 输出 "战斗结束"

