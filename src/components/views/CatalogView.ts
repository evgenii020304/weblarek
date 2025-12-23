import { Component } from '../base/Component.ts';
import { CardView } from './CardView';
import { IProduct } from '../../types';

export interface ICatalogActions {
    onClick: (product: IProduct) => void;
}

export interface ICatalogData {
    items: IProduct[];
}

export class CatalogView extends Component<ICatalogData> {
    constructor(container: HTMLElement, protected actions?: ICatalogActions) {
        super(container);
    }

    render(data?: Partial<ICatalogData>): HTMLElement {
        if (!data?.items) return this.container;

        this.container.innerHTML = '';

        data.items.forEach((item) => {
            const template = document.getElementById('card-catalog') as HTMLTemplateElement;
            const cardElement = template.content.cloneNode(true) as DocumentFragment;
            const cardContainer = cardElement.querySelector('.card') as HTMLElement;

            const cardView = new CardView(cardContainer);

            cardView.category = item.category;
            cardView.title = item.title;
            cardView.image = item.image;
            cardView.price = item.price;

            cardView.onClick = (event: MouseEvent) => {
                event.preventDefault();
                if (this.actions?.onClick) {
                    this.actions.onClick(item);
                }
            };

            cardContainer.dataset.id = item.id;
            this.container.appendChild(cardElement);
        });

        return this.container;
    }
}