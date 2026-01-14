import { IProduct, IBasket } from '../../types';
import {EventEmitter} from "../base/Events.ts";

export class BasketModel extends EventEmitter implements IBasket  {
    private _items: IProduct[] = [];

    constructor() {
        super();
    }

    get items(): IProduct[] {
        return this._items;
    }

    addItem(product: IProduct): void {
        if (!this.alreadyInBasket(product.id)) {
            this._items.push(product);
            this.emit('basket:changed');
        }
    }

    alreadyInBasket(productId: string): boolean {
        return this._items.some(item => item.id === productId);
    }

    getTotal(): number {
        return this._items.reduce((total, item) => {
            return total + (item.price || 0);
        }, 0);
    }

    getCount(): number {
        return this._items.length;
    }

    removeItem(productId: string): void {
        const index = this._items.findIndex(item => item.id === productId);
        if (index !== -1) {
            this._items.splice(index, 1);
            this.emit('basket:changed');
        }
    }

    clear(): void {
        this._items = [];
        this.emit('basket:changed');
    }
}