import { IActions, IProduct } from "../../types";
import { IEvents } from "../base/Events.ts";
import {categoryMap, CDN_URL} from "../../utils/constants";
import "../../scss/styles.scss"

export interface ICard {
    render(data: IProduct): HTMLElement;
}

export class Card implements ICard {
    protected _cardElement: HTMLElement;
    protected _cardCategory: HTMLElement;
    protected _cardTitle: HTMLElement;
    protected _cardImage: HTMLImageElement;
    protected _cardPrice: HTMLElement;
    protected _data: IProduct | null = null;

    constructor(container: HTMLTemplateElement, protected events: IEvents, actions?: IActions) {
        this._cardElement = container.content.querySelector('.card')!.cloneNode(true) as HTMLElement;
        this._cardCategory = this._cardElement.querySelector('.card__category')!;
        this._cardTitle = this._cardElement.querySelector('.card__title')!;
        this._cardImage = this._cardElement.querySelector('.card__image')!;
        this._cardPrice = this._cardElement.querySelector('.card__price')!;

        if (actions?.onClick) {
            this._cardElement.addEventListener('click', actions.onClick);
        }
    }

    protected setText(element: HTMLElement, value: unknown)  {
        if (element) {
            return element.textContent = String(value);
        }
    }

    protected setCategory(value: string): void {
        this.setText(this._cardCategory, value);

        const categoryClass = categoryMap[value as keyof typeof categoryMap];
        if (categoryClass) {
            this._cardCategory.className = 'card__category';
            this._cardCategory.classList.add(categoryClass);
        }
    }

    protected formatPrice(value: number | null): string {
        if (value === null) {
            return 'Бесценно';
        }
        return `${value} синапсов`;
    }

    render(data: IProduct): HTMLElement {
        this._cardCategory.textContent = data.category;
        this.setCategory(data.category);
        this._cardTitle.textContent = data.title;
        this._cardImage.src = `${CDN_URL}/${data.image}`;
        this._cardImage.alt = data.title;
        this._cardPrice.textContent = this.formatPrice(data.price);

        this._cardElement.dataset.id = data.id;
        this._data = data;
        return this._cardElement;
    }
}