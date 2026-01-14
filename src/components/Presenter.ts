import { IEvents } from "./base/Events";
import { Modal } from "./views/Modal";
import { Basket } from "./views/Basket";
import { Success } from "./views/Success";
import { Order } from "./views/FormOrder";
import { Contacts } from "./views/FormContact";
import { CardPreview } from "./views/CardPreview";
import { BasketItem } from "./views/BasketItem";
import { CatalogView } from "./views/CatalogView";
import { HeaderView } from "./views/HeaderView";
import { Card } from "./views/Card.ts";
import { ProductModel } from "./models/ProductModel";
import { BasketModel } from "./models/BasketModel";
import { BuyerModel } from "./models/BuyerModel";
import { IOrderRequest, IProduct, TPayment, IBuyer } from "../types";
import { ApiShop } from "./api/ApiShop";

export class Presenter {
    constructor(
        private events: IEvents,
        private productModel: ProductModel,
        private basketModel: BasketModel,
        private buyerModel: BuyerModel,
        private modal: Modal,
        private basketView: Basket,
        private successView: Success,
        private orderForm: Order,
        private contactsForm: Contacts,
        private catalogView: CatalogView,
        private headerView: HeaderView,
        private cardPreview: CardPreview,
        private apiShop: ApiShop,
        private cardTemplate: HTMLTemplateElement,
        private basketItemTemplate: HTMLTemplateElement,
    ) {
        this.init();
    }

    private init(): void {
        this.setupModelListeners();
        this.setupEventListeners();
        this.loadProducts();
    }

    private setupModelListeners(): void {
        this.productModel.on('items:changed', (items: IProduct[]) => {
            this.renderCatalog(items);
        });

        this.productModel.on('selected:changed', (product: IProduct) => {
            this.openProductDetails(product);
        });

        this.basketModel.on('basket:changed', () => {
            this.updateBasketView();
            this.updateHeader();
        });

        this.buyerModel.on('data:changed', (data: IBuyer) => {
            this.updateFormsWithModelData(data);
        });
    }

    private setupEventListeners(): void {
        this.events.on('card:select', (data: { id: string }) => {
            this.productModel.setSelectedProduct(data.id);
        });

        this.events.on('basket:open', () => {
            this.modal.content = this.basketView.render();
            this.modal.open();
        });

        this.events.on('basket:remove', (data: { id: string }) => {
            this.basketModel.removeItem(data.id);
        });

        this.events.on('order:open', () => {
            this.modal.content = this.orderForm.render();
            this.modal.open();
        });

        this.events.on('order:paymentSelection', (button: HTMLButtonElement) => {
            this.buyerModel.setData({ payment: button.name as TPayment });
        });

        this.events.on('order:changeAddress', (data: { field: string; value: string }) => {
            if (data.field === 'address') {
                this.buyerModel.setData({ address: data.value });
            }
        });

        this.events.on('order:submit', () => {
            const errors = this.buyerModel.validateOrderForm();
            if (Object.keys(errors).length === 0) {
                this.modal.content = this.contactsForm.render();
                this.modal.open();
            }
        });

        this.events.on('contacts:changeInput', (data: { field: string; value: string }) => {
            if (data.field === 'email' || data.field === 'phone') {
                const updateData = { [data.field]: data.value };
                this.buyerModel.setData(updateData);
            }
        });

        this.events.on('contacts:submit', () => {
            this.submitOrder();
        });

        this.events.on('success:close', () => {
            this.modal.close();
        });

        this.events.on('modal:close', () => {
            this.modal.locked = false;
        });
    }

    private async loadProducts(): Promise<void> {
        const products = await this.apiShop.getProducts();
        this.productModel.setItems(products);
    }

    private renderCatalog(items: IProduct[]): void {
        const cards = items.map(product => {
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
            return card.render(product);
        });

        this.catalogView.items = cards;
    }

    handlePreviewButtonClick = (): void => {
        const product = this.productModel.getSelectedProduct();
        if (!product) {
            return;
        }
        const isInBasket = this.basketModel.alreadyInBasket(product.id);
        if (isInBasket) {
            this.basketModel.removeItem(product.id);
        } else {
            this.basketModel.addItem(product);
        }
        this.modal.close();
    };

    private openProductDetails(product: IProduct): void {
        if (!product) return;
        const isInBasket = this.basketModel.alreadyInBasket(product.id);
        const previewElement = this.cardPreview.render(product, isInBasket);
        this.modal.content = previewElement;
        this.modal.open();
    }

    private updateFormsWithModelData(data: IBuyer): void {
        this.orderForm.updateData(data);
        const orderErrors = this.buyerModel.validateOrderForm();
        this.orderForm.errors = orderErrors;
        this.orderForm.valid = Object.keys(orderErrors).length === 0;

        this.contactsForm.updateData(data);
        const contactErrors = this.buyerModel.validateContactForm();
        this.contactsForm.errors = contactErrors;
        this.contactsForm.valid = Object.keys(contactErrors).length === 0;
    }

    private updateBasketView(): void {
        const basketItems = this.basketModel.items.map((product, index) => {
            const basketItem = new BasketItem(
                this.basketItemTemplate,
                this.events,
                {
                    onClick: () => this.events.emit('basket:remove', { id: product.id })
                }
            );
            return basketItem.render(product, index + 1);
        });

        this.basketView.items = basketItems;
        this.basketView.renderSumAllProducts(this.basketModel.getTotal());
    }

    private updateHeader(): void {
        this.headerView.counter = this.basketModel.getCount();
    }

    private async submitOrder(): Promise<void> {
        if (!this.buyerModel.isValid()) {
            const errors = this.buyerModel.validate();
            const errorMessages = Object.values(errors).filter(Boolean);
            alert(`Пожалуйста, исправьте ошибки:\n${errorMessages.join('\n')}`);
            return;
        }

        if (this.basketModel.getCount() === 0) {
            alert('Корзина пуста');
            return;
        }

        const buyerData = this.buyerModel.getData();
        const orderData: IOrderRequest = {
            payment: buyerData.payment!,
            email: buyerData.email,
            phone: buyerData.phone,
            address: buyerData.address,
            total: this.basketModel.getTotal(),
            items: this.basketModel.items.map(item => item.id)
        };

        try {
            const response = await this.apiShop.sendOrder(orderData);
            this.modal.content = this.successView.render(response.total);
            this.modal.open();

            this.basketModel.clear();
            this.buyerModel.clear();
        } catch (error) {
            console.error('Ошибка при отправке заказа:', error);
            alert('Не удалось оформить заказ. Пожалуйста, попробуйте еще раз.');
        }
    }
}