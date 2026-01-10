import { Card } from "./Card";
import { IActions, IProduct } from "../../types";
import { IEvents } from "../base/Events.ts";

export interface ICardPreview {
    text: HTMLElement;
    button: HTMLElement;
    render(data: IProduct): HTMLElement;
}

export class CardPreview extends Card implements ICardPreview {
    protected _cardText: HTMLElement;
    protected _cardButton: HTMLButtonElement | null;

    constructor(container: HTMLTemplateElement, protected events: IEvents, actions?: IActions) {
        super(container, events, actions);

        this._cardText = this._cardElement.querySelector('.card__text')!;
        this._cardButton = this._cardElement.querySelector('.card__button');

        if (this._cardButton) {
            if (actions?.onClick) {
                this._cardButton.addEventListener('click', actions.onClick);
            } else {
                this._cardButton.addEventListener('click', () => {
                    const cardId = this._cardElement.dataset.id;
                    if (cardId) {
                        this.events.emit('card:addBasket', { id: cardId });
                    }
                });
            }
        } else {
            console.warn('Кнопка .card__button не найдена в шаблоне карточки превью');
        }
    }

    get text(): HTMLElement {
        return this._cardText;
    }

    get button(): HTMLElement {
        return this._cardButton!;
    }

    protected checkAvailability(data: IProduct): string {
        if (data.price !== null) {
            return 'Купить';
        } else {
            if (this._cardButton) {
                this._cardButton.setAttribute('disabled', 'true');
            }
            return 'Не продается';
        }
    }

    render(data: IProduct): HTMLElement {
        super.render(data);
        if (data.description && this._cardText) {
            this._cardText.textContent = data.description;
        }
        if (this._cardButton) {
            this._cardButton.textContent = this.checkAvailability(data);
            if (data.price !== null) {
                this._cardButton.removeAttribute('disabled');
            }
        }
        return this._cardElement;
    }
}