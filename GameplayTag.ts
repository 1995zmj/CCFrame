// ------------------------------
// 核心类型定义
// ------------------------------

type GameplayTag = string;
type TagValidationResult = { isValid: boolean; error?: string };

// ------------------------------
// 标签管理器 (单例模式)
// ------------------------------

class GameplayTagManager {
    private static instance: GameplayTagManager;
    private registeredTags = new Map<GameplayTag, GameplayTag>();
    private tagParentMap = new Map<GameplayTag, GameplayTag | null>();

    private constructor() { }

    static get(): GameplayTagManager {
        if (!GameplayTagManager.instance) {
            GameplayTagManager.instance = new GameplayTagManager();
        }
        return GameplayTagManager.instance;
    }

    // ---------- 标签注册 ----------
    registerTag(tag: GameplayTag): TagValidationResult {
        // 验证标签格式
        const validation = this.validateTagSyntax(tag);
        if (!validation.isValid) {
            return validation;
        }

        // 检查重复注册
        if (this.registeredTags.has(tag)) {
            return {
                isValid: false,
                error: `Tag '${tag}' is already registered`
            };
        }

        // 注册标签并建立父子关系
        this.registeredTags.set(tag, tag);
        this.buildParentRelationships(tag);

        return { isValid: true };
    }

    // ---------- 标签验证 ----------
    private validateTagSyntax(tag: GameplayTag): TagValidationResult {
        const tagRegex = /^[a-zA-Z]+(\.[a-zA-Z]+)*$/;

        if (!tagRegex.test(tag)) {
            return {
                isValid: false,
                error: `Invalid tag format: '${tag}'. Must follow 'Parent.Child.Grandchild' format`
            };
        }
        return { isValid: true };
    }

    // ---------- 层级关系构建 ----------
    private buildParentRelationships(tag: GameplayTag) {
        const parts = tag.split('.');
        let currentParent: GameplayTag | null = null;

        // 逐级注册隐式父标签
        for (let i = 0; i < parts.length; i++) {
            const currentTag = parts.slice(0, i + 1).join('.');

            if (!this.registeredTags.has(currentTag)) {
                this.registeredTags.set(currentTag, currentTag);
                this.tagParentMap.set(currentTag, currentParent);
            }

            currentParent = currentTag;
        }
    }

    // ---------- 标签查询 ----------
    isValidTag(tag: GameplayTag): boolean {
        return this.registeredTags.has(tag);
    }

    getParentTag(tag: GameplayTag): GameplayTag | null {
        return this.tagParentMap.get(tag) || null;
    }

    getAllChildTags(parentTag: GameplayTag): GameplayTag[] {
        const children: GameplayTag[] = [];
        const parentParts = parentTag.split('.').length;

        this.registeredTags.forEach((_, tag) => {
            if (tag.startsWith(`${parentTag}.`) &&
                tag.split('.').length === parentParts + 1) {
                children.push(tag);
            }
        });

        return children;
    }

    // ---------- 标签匹配 ----------
    matchesTag(queryTag: GameplayTag, targetTag: GameplayTag): boolean {
        return queryTag === targetTag ||
            this.getTagDepth(queryTag) < this.getTagDepth(targetTag);
    }

    private getTagDepth(tag: GameplayTag): number {
        return tag.split('.').length;
    }
}

// ------------------------------
// 标签包装类
// ------------------------------

class FGameplayTag {
    constructor(private tag: GameplayTag) {
        if (!GameplayTagManager.get().isValidTag(tag)) {
            throw new Error(`Invalid gameplay tag: ${tag}`);
        }
    }

    toString(): GameplayTag {
        return this.tag;
    }

    matches(other: FGameplayTag): boolean {
        return GameplayTagManager.get().matchesTag(this.tag, other.tag);
    }

    get parent(): FGameplayTag | null {
        const parentTag = GameplayTagManager.get().getParentTag(this.tag);
        return parentTag ? new FGameplayTag(parentTag) : null;
    }

    get directChildren(): FGameplayTag[] {
        return GameplayTagManager.get()
            .getAllChildTags(this.tag)
            .map(t => new FGameplayTag(t));
    }
}

// ------------------------------
// 使用示例
// ------------------------------

// 初始化标签管理器
const tagManager = GameplayTagManager.get();

// 注册标签
tagManager.registerTag("Ability");
tagManager.registerTag("Ability.Attack");
tagManager.registerTag("Ability.Attack.Fire");
tagManager.registerTag("Ability.Defense");

// 创建标签实例
const fireTag = new FGameplayTag("Ability.Attack.Fire");
const attackTag = new FGameplayTag("Ability.Attack");
const defenseTag = new FGameplayTag("Ability.Defense");

// 匹配测试
console.log(fireTag.matches(attackTag)); // true
console.log(attackTag.matches(fireTag)); // false
console.log(defenseTag.matches(attackTag)); // false

// 获取父标签
console.log(fireTag.parent?.toString()); // "Ability.Attack"

// 获取子标签
console.log(attackTag.directChildren.map(t => t.toString()));
// ["Ability.Attack.Fire"]