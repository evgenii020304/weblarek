import { IActions, IProduct } from "../../types";
import { IEvents } from "../base/Events.ts";
import { ensureElement, cloneTemplate } from "../../utils/utils";

export interface IBasketItem {
    basketItem: HTMLElement;
    index: HTMLElement;
    title: HTMLElement;
    price: HTMLElement;
    buttonDelete: HTMLButtonElement;
    render(data: IProduct, item: number): HTMLElement;
}

export class BasketItem implements IBasketItem {
    basketItem: HTMLElement;
    index: HTMLElement;
    title: HTMLElement;
    price: HTMLElement;
    buttonDelete: HTMLButtonElement;

    constructor(template: HTMLTemplateElement, protected events: IEvents, actions?: IActions) {
        this.basketItem = cloneTemplate<HTMLElement>(template);

        this.index = ensureElement<HTMLElement>('.basket__item-index', this.basketItem);
        this.title = ensureElement<HTMLElement>('.card__title', this.basketItem);
        this.price = ensureElement<HTMLElement>('.card__price', this.basketItem);
        this.buttonDelete = ensureElement<HTMLButtonElement>('.basket__item-delete', this.basketItem);

        if (actions?.onClick) {
            this.buttonDelete.addEventListener('click', actions.onClick);
        }
    }

    protected formatPrice(value: number | null): string {
        if (value === null) {
            return 'Бесценно';
        }
        return `${value} синапсов`;
    }

    render(data: IProduct, item: number) {
        this.index.textContent = String(item);
        this.title.textContent = data.title;
        this.price.textContent = this.formatPrice(data.price);
        return this.basketItem;
    }
}