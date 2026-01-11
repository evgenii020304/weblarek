import { IEvents } from "../base/Events";
import { IProduct } from "../../types";
import { Card } from "./Card";

export interface ICatalogView {
    render(items: IProduct[]): void;
}

export class CatalogView implements ICatalogView {
    constructor(
        protected container: HTMLElement,
        protected events: IEvents,
        protected cardTemplate: HTMLTemplateElement
    ) {}

    render(items: IProduct[]): void {
        this.container.innerHTML = '';

        items.forEach(product => {
            const card = new Card(
                this.cardTemplate,
                this.events,
                {
                    onClick: (event: MouseEvent) => {
                        event.preventDefault();
                        this.events.emit('card:select', { id: product.id });
                    }
                }
            );

            const cardElement = card.render(product);
            this.container.appendChild(cardElement);
        });
    }
}