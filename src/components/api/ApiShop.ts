import { IApi, IProduct, IOrderRequest, IOrderResponse } from '../../types';

export class ApiShop {
    private api: IApi;

    constructor(api: IApi) {
        this.api = api;
    }

    getProducts(): Promise<IProduct[]> {
        return this.api
            .get<{ items: IProduct[] }>('/product')
            .then(response => response.items);
    }

    sendOrder(order: IOrderRequest): Promise<IOrderResponse> {
        return this.api.post<IOrderResponse>('/order', order);
    }
}
