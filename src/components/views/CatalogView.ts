import { IEvents } from "../base/Events";

export interface ICatalogView {
    set items(value: HTMLElement[]);
    clear(): void;
}

export class CatalogView implements ICatalogView {
    constructor(
        protected container: HTMLElement,
        protected events: IEvents
    ) {}

    set items(cards: HTMLElement[]) {
        this.clear();

        if (cards.length > 0) {
            this.container.append(...cards);
        }
    }

    clear(): void {
        this.container.innerHTML = '';
    }
}