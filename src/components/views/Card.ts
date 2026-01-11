import { IActions, IProduct } from "../../types";
import { IEvents } from "../base/Events.ts";
import { categoryMap, CDN_URL } from "../../utils/constants";
import { ensureElement, cloneTemplate } from "../../utils/utils";

export interface ICard {
    render(data: IProduct): HTMLElement;
}

export class Card implements ICard {
    protected _cardElement: HTMLElement;
    protected _cardCategory: HTMLElement;
    protected _cardTitle: HTMLElement;
    protected _cardImage: HTMLImageElement;
    protected _cardPrice: HTMLElement;

    constructor(template: HTMLTemplateElement, protected events: IEvents, actions?: IActions) {
        this._cardElement = cloneTemplate<HTMLElement>(template);

        this._cardCategory = ensureElement<HTMLElement>('.card__category', this._cardElement);
        this._cardTitle = ensureElement<HTMLElement>('.card__title', this._cardElement);
        this._cardImage = ensureElement<HTMLImageElement>('.card__image', this._cardElement);
        this._cardPrice = ensureElement<HTMLElement>('.card__price', this._cardElement);

        if (actions?.onClick) {
            this._cardElement.addEventListener('click', actions.onClick);
        }
    }

    protected setText(element: HTMLElement, value: unknown) {
        element.textContent = String(value);
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

        return this._cardElement;
    }
}