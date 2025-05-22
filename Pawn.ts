import { Actor } from "./Actor";
import { AssetSubsystem } from "./AssetSubsystem";
import { GameInstance } from "./GameInstance";


// enum MoveState {
//     None,
//     Move,
//     Idle
// }

// export class Pawn extends Actor {
//     public static prefabPath: string = 'char/CharNode';
//     private _animation: cc.Animation
//     private _curMoveState = MoveState.None
//     private _speed = 100
//     private _dir = cc.Vec2.ZERO
//     public init(): void {
//         super.init()
//         this.initAnimation()
//     }

//     public initAnimation() {
//         let path = 'char/c2/c2_animation_node'
//         GameInstance.getInstance().getSubsystem(AssetSubsystem).loadPrefab(path, (prefab) => {
//             const newNode = cc.instantiate(prefab);
//             this.rootNode.addChild(newNode);
//             this._animation = newNode.getComponent(cc.Animation)
//             this.changeAnimationState(MoveState.Idle)
//         })
//     }

//     public changeAnimationState(state: MoveState) {
//         if (this._curMoveState != state) {
//             this._curMoveState = state
//             switch (state) {
//                 case MoveState.Move:
//                     this._animation.play('run')
//                     break;
//                 default:
//                     this._animation.play('idle')
//                     break;
//             }
//         }
//     }

//     public tryMove(dir: cc.Vec2) {
//         if (dir.len() > 0) {
//             this.changeAnimationState(MoveState.Move)
//             if (dir.x > 0) {
//                 this.rootNode.scaleX = 1
//             }
//             else {
//                 this.rootNode.scaleX = -1
//             }
//             console.log(dir)
//             this._dir = dir

//         } else {
//             this.changeAnimationState(MoveState.Idle)
//         }
//     }

//     public update(dt: number): void {
//         if (this._curMoveState == MoveState.Move) {
//             this.rootNode.x += this._speed * this._dir.x * dt
//             this.rootNode.y += this._speed * this._dir.y * dt
//         }
//     }
// }