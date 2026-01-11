import { IEvents } from "../base/Events";
import { ensureElement } from "../../utils/utils";

export interface IBasket {
    basket: HTMLElement;
    title: HTMLElement;
    basketList: HTMLElement;
    button: HTMLButtonElement;
    basketPrice: HTMLElement;
    renderSumAllProducts(sumAll: number): void;
    render(): HTMLElement;
}

export class Basket implements IBasket {
    basket: HTMLElement;
    title: HTMLElement;
    basketList: HTMLElement;
    button: HTMLButtonElement;
    basketPrice: HTMLElement;

    constructor(container: HTMLElement, protected events: IEvents) {
        this.basket = container;

        this.title = ensureElement<HTMLElement>('.modal__title', this.basket);
        this.basketList = ensureElement<HTMLElement>('.basket__list', this.basket);
        this.button = ensureElement<HTMLButtonElement>('.basket__button', this.basket);
        this.basketPrice = ensureElement<HTMLElement>('.basket__price', this.basket);

        this.button.addEventListener('click', () => {
            this.events.emit('order:open');
        });
    }

    set items(items: HTMLElement[]) {
        if (items.length) {
            this.basketList.replaceChildren(...items);
            this.button.removeAttribute('disabled');
        } else {
            this.button.setAttribute('disabled', 'disabled');
            this.basketList.innerHTML = '';
        }
    }

    renderSumAllProducts(sumAll: number) {
        this.basketPrice.textContent = `${sumAll} синапсов`;
    }

    render(): HTMLElement {
        this.title.textContent = 'Корзина';
        return this.basket;
    }
}