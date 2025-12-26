export type TItemCategory = 'софт-скил' | 'хард-скил' | 'другое' | 'кнопка' | 'дополнительное';
export type TItemPrice = number | null;
export type TPayment = 'card' | 'cash' | null;
export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE';

export interface IApiProduct  {
    id: string;
    description: string;
    image: string;
    title: string;
    category: TItemCategory;
    price: TItemPrice;
}

export interface IProduct extends IApiProduct {
    productIndex: number;
}

export interface IBasket {
    items: IProduct[];
    addItem(product: IProduct): void;
    alreadyInBasket(productId: string): boolean;
    clear(): void;
    getTotal(): number;
    getCount(): number;
    removeItem(productId: string): void;
}

export interface IBuyer {
    payment: TPayment;
    email: string;
    phone: string;
    address: string;
}

export interface IApiResponse  {
    total: number;
    items: IApiProduct[];
}

export interface IOrderRequest {
    id?: string;
    total?: number;
    error?: string;
}

export interface IApi {
    baseUrl: string;
    get<T extends object>(uri: string): Promise<T>;
    post<T extends object>(uri: string, data: object, method?: ApiPostMethods): Promise<T>;
}

export interface IValidationResult {
    payment?: string;
    email?: string;
    phone?: string;
    address?: string;
}