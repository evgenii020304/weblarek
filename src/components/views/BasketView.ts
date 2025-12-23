import { Component } from '../base/Component.ts';
import { IProduct } from '../../types';

export interface IBasketData {
    items: IProduct[];
    total: number;
}

export class BasketView extends Component<IBasketData> {
    protected _list: HTMLElement;
    protected _total: HTMLElement;
    protected _button: HTMLButtonElement;
    protected _onRemove?: (id: string) => void;

    constructor(container: HTMLElement) {
        super(container);

        this._list = container.querySelector('.basket__list')!;
        this._total = container.querySelector('.basket__price')!;
        this._button = container.querySelector('.basket__button')!;
    }

    set onCheckout(callback: () => void) {
        this._button.addEventListener('click', callback);
    }

    set onRemove(callback: (id: string) => void) {
        this._onRemove = callback;
    }

    render(data?: Partial<IBasketData>): HTMLElement {
        if (data?.items) {
            this._list.innerHTML = '';
            data.items.forEach((item, index) => {
                this.addItem(item, index);
            });
        }

        if (data?.total !== undefined) {
            this.setText(this._total, `${data.total} синапсов`);
        }

        this.setDisabled(this._button, !data?.items?.length);
        return this.container;
    }

    private addItem(item: IProduct, index: number) {
        const template = document.getElementById('card-basket') as HTMLTemplateElement;
        const itemElement = template.content.cloneNode(true) as DocumentFragment;
        const itemContainer = itemElement.querySelector('.card') as HTMLElement;

        const indexElement = itemContainer.querySelector('.basket__item-index') as HTMLElement;
        const titleElement = itemContainer.querySelector('.card__title') as HTMLElement;
        const priceElement = itemContainer.querySelector('.card__price') as HTMLElement;
        const deleteButton = itemContainer.querySelector('.basket__item-delete') as HTMLButtonElement;

        this.setText(indexElement, String(index + 1));
        this.setText(titleElement, item.title);
        this.setText(priceElement, `${item.price} синапсов`);

        if (this._onRemove) {
            deleteButton.addEventListener('click', (event) => {
                event.preventDefault();
                this._onRemove!(item.id);
            });
        }

        this._list.appendChild(itemElement);
    }
}