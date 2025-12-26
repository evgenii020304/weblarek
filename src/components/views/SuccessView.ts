// import { Component } from '../base/Component.ts';
//
// export interface ISuccessData {
//     total: number;
// }
//
// export class SuccessView extends Component<ISuccessData> {
//     protected _description: HTMLElement;
//     protected _closeButton: HTMLButtonElement;
//
//     constructor(container: HTMLElement) {
//         super(container);
//
//         this._description = container.querySelector('.order-success__description')!;
//         this._closeButton = container.querySelector('.order-success__close')!;
//     }
//
//     set onClose(callback: () => void) {
//         this._closeButton.addEventListener('click', callback);
//     }
//
//     render(data?: Partial<ISuccessData>): HTMLElement {
//         if (data?.total !== undefined) {
//             this.setText(this._description, `Списано ${data.total} синапсов`);
//         }
//         return this.container;
//     }
// }