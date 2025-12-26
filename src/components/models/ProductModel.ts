import { IApiProduct, IProduct } from '../../types';

export class ProductModel {
    private _items: IProduct[] = [];

    setItems(items: IApiProduct[]): void {
        this._items = items.map((item, index) => ({
            ...item,
            productIndex: index + 1
        }));
    }

    getItems(): IProduct[] {
        return this._items;
    }

    getItemById(id: string): IProduct | undefined {
        return this._items.find(item => item.id === id);
    }

    getTotalCount(): number {
        return this._items.length;
    }
}