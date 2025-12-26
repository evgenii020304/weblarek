// import { Component } from '../base/Component.ts';
// import { IProduct, TItemCategory } from '../../types';
// import {CDN_URL} from "../../utils/constants.ts";
//
// export interface ICardData extends IProduct {
//     buttonLabel?: string;
// }
//
// export class CardView extends Component<ICardData> {
//     protected _category: HTMLElement;
//     protected _title: HTMLElement;
//     protected _image: HTMLImageElement;
//     protected _price: HTMLElement;
//     protected _button: HTMLButtonElement | null;
//     protected _description?: HTMLElement;
//     protected _onClick?: (event: MouseEvent) => void;
//
//     constructor(container: HTMLElement) {
//         super(container);
//
//         this._category = container.querySelector('.card__category')!;
//         this._title = container.querySelector('.card__title')!;
//         this._image = container.querySelector('.card__image')!;
//         this._price = container.querySelector('.card__price')!;
//         this._button = container.querySelector('.card__button');
//         this._description = container.querySelector('.card__text') || undefined;
//
//         if (this._button) {
//             this._button.addEventListener('click', (event) => {
//                 if (this._onClick) {
//                     this._onClick(event);
//                 }
//             });
//         } else {
//             container.addEventListener('click', (event) => {
//                 if (this._onClick) {
//                     this._onClick(event);
//                 }
//             });
//         }
//     }
//
//     set category(value: TItemCategory) {
//         this.setText(this._category, value);
//         this.updateCategoryClass(value);
//     }
//
//     set title(value: string) {
//         this.setText(this._title, value);
//     }
//
//     set description(value: string) {
//         if (this._description) {
//             this.setText(this._description, value);
//         }
//     }
//
//     set image(value: string) {
//         this._image.src = CDN_URL + value;
//     }
//
//     set price(value: number | null) {
//         if (value === null) {
//             this.setText(this._price, 'Бесценно');
//         } else {
//             this.setText(this._price, `${value} синапсов`);
//         }
//     }
//
//     set buttonLabel(value: string) {
//         if (this._button) {
//             this.setText(this._button, value);
//         }
//     }
//
//     set onClick(callback: (event: MouseEvent) => void) {
//         this._onClick = callback;
//     }
//
//     private updateCategoryClass(category: TItemCategory) {
//         this._category.classList.remove(
//             'card__category_soft',
//             'card__category_hard',
//             'card__category_other',
//             'card__category_button',
//             'card__category_additional'
//         );
//
//         switch (category) {
//             case 'софт-скил':
//                 this._category.classList.add('card__category_soft');
//                 break;
//             case 'хард-скил':
//                 this._category.classList.add('card__category_hard');
//                 break;
//             case 'другое':
//                 this._category.classList.add('card__category_other');
//                 break;
//             case 'кнопка':
//                 this._category.classList.add('card__category_button');
//                 break;
//             case 'дополнительное':
//                 this._category.classList.add('card__category_additional');
//                 break;
//         }
//     }
// }