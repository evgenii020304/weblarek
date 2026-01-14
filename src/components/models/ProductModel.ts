import { IProduct } from '../../types';
import {EventEmitter} from "../base/Events.ts";

export class ProductModel extends EventEmitter{
    private _items: IProduct[] = [];
    private _selectedProduct: IProduct | null = null;

    constructor() {
        super();
    }

    setItems(items: IProduct[]): void {
        this._items = items;
        this.emit('items:changed', this._items);
    }

    getItems(): IProduct[] {
        return this._items;
    }

    getItemById(id: string): IProduct | undefined {
        return this._items.find(item => item.id === id);
    }

    setSelectedProduct(productId: string): void {
        const product = this.getItemById(productId);
        if (product) {
            this._selectedProduct = product;
            this.emit('selected:changed', this._selectedProduct);
        }
    }

    getSelectedProduct(): IProduct | null {
        return this._selectedProduct;
    }

    clearSelectedProduct(): void {
        this._selectedProduct = null;
    }
}
