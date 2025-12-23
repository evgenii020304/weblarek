import { IProduct, IBasket } from '../../types';

export class BasketModel implements IBasket {
    private _items: IProduct[] = [];

    get items(): IProduct[] {
        return this._items;
    }

    addItem(product: IProduct): void {
        if (!this.alreadyInBasket(product.id)) {
            this._items.push(product);
        }
    }

    alreadyInBasket(productId: string): boolean {
        return this._items.some(item => item.id === productId);
    }

    clear(): void {
        this._items = [];
    }

    getTotal(): number {
        return this._items.reduce((total, item) => total + (item.price || 0), 0);
    }

    getCount(): number {
        return this._items.length;
    }

    removeItem(productId: string): void {
        const index = this._items.findIndex(item => item.id === productId);
        if (index !== -1) {
            this._items.splice(index, 1);
        }
    }
}