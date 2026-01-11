import { Card } from "./Card";
import { IActions, IProduct } from "../../types";
import { IEvents } from "../base/Events.ts";

export interface ICardPreview {
    text: HTMLElement | null;
    button: HTMLButtonElement | null;
    render(data: IProduct, isInBasket?: boolean): HTMLElement;
}

export class CardPreview extends Card implements ICardPreview {
    protected _cardText: HTMLElement | null = null;
    protected _cardButton: HTMLButtonElement | null = null;

    constructor(template: HTMLTemplateElement, protected events: IEvents, actions?: IActions) {
        super(template, events, actions);

        this._cardText = this._cardElement.querySelector('.card__text');
        this._cardButton = this._cardElement.querySelector('.card__button');

        if (this._cardButton && actions?.onClick) {
            this._cardButton.addEventListener('click', actions.onClick);
        }
    }

    get text(): HTMLElement | null {
        return this._cardText;
    }

    get button(): HTMLButtonElement | null {
        return this._cardButton;
    }

    protected getButtonText(data: IProduct, isInBasket: boolean): string {
        if (data.price === null) {
            return 'Не продается';
        } else if (isInBasket) {
            return 'Удалить из корзины';
        } else {
            return 'В корзину';
        }
    }

    protected updateButtonState(data: IProduct, isInBasket: boolean): void {
        if (!this._cardButton) return;

        this._cardButton.textContent = this.getButtonText(data, isInBasket);

        if (data.price === null) {
            this._cardButton.setAttribute('disabled', 'true');
        } else {
            this._cardButton.removeAttribute('disabled');
        }
    }

    render(data: IProduct, isInBasket: boolean = false): HTMLElement {
        super.render(data);

        if (data.description && this._cardText) {
            this._cardText.textContent = data.description;
        }

        this.updateButtonState(data, isInBasket);

        return this._cardElement;
    }

    updateBasketState(isInBasket: boolean): void {
        if (this._cardButton && this._cardButton.textContent) {
            const currentText = this._cardButton.textContent;
            if (isInBasket && currentText !== 'Удалить из корзины') {
                this._cardButton.textContent = 'Удалить из корзины';
            } else if (!isInBasket && currentText !== 'В корзину') {
                this._cardButton.textContent = 'В корзину';
            }
        }
    }
}