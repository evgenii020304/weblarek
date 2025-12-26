// import { Component } from '../base/Component.ts';
//
// export class ModalView extends Component<HTMLElement> {
//     protected _closeButton: HTMLButtonElement;
//     protected _content: HTMLElement;
//
//     constructor(container: HTMLElement) {
//         super(container);
//
//         this._closeButton = container.querySelector('.modal__close')!;
//         this._content = container.querySelector('.modal__content')!;
//
//         this._closeButton.addEventListener('click', () => this.close());
//
//         container.addEventListener('click', (event) => {
//             if (event.target === container) {
//                 this.close();
//             }
//         });
//
//         document.addEventListener('keydown', (event) => {
//             if (event.key === 'Escape') {
//                 this.close();
//             }
//         });
//     }
//
//     open(content?: HTMLElement) {
//         if (content) {
//             this._content.innerHTML = '';
//             this._content.appendChild(content);
//         }
//         this.container.classList.add('modal_active');
//         return this.container;
//     }
//
//     close() {
//         this.container.classList.remove('modal_active');
//         return this.container;
//     }
//
//     render(content: HTMLElement) {
//         this._content.innerHTML = '';
//         this._content.appendChild(content);
//         return this.container;
//     }
// }