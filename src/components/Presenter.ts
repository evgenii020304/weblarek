import { IEvents } from "./base/Events.ts";
import { Modal } from "./views/Modal";
import { Basket } from "./views/Basket";
import { Success } from "./views/Success";
import { Order } from "./views/FormOrder";
import { Contacts } from "./views/FormContact";
import { Card } from "./views/Card";
import { CardPreview } from "./views/CardPreview";
import { BasketItem } from "./views/BasketItem";
import { HeaderView } from "./views/HeaderView";
import { ProductModel } from "./models/ProductModel";
import { BasketModel } from "./models/BasketModel";
import { BuyerModel } from "./models/BuyerModel";
import { IProduct, IOrderRequest, TPayment } from "../types";
import { Api } from "./base/Api.ts";

export class Presenter {
    private headerView: HeaderView;

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
        private api: Api,
        private cardTemplate: HTMLTemplateElement,
        private basketItemTemplate: HTMLElement,
        headerContainer: HTMLElement
    ) {
        this.headerView = new HeaderView(events, headerContainer);
        this.init();
    }

    private init(): void {
        this.setupEventListeners();
        this.loadProducts();
    }

    private setupEventListeners(): void {
        this.events.on('card:select', (data: { id: string }) => {
            this.openProductDetails(data.id);
        });

        this.events.on('card:addBasket', (data: { id: string }) => {
            this.addToBasket(data.id);
        });

        this.events.on('basket:open', () => {
            this.openBasket();
        });

        this.events.on('basket:remove', (data: { id: string }) => {
            this.removeFromBasket(data.id);
        });

        this.events.on('order:open', () => {
            this.openOrderForm();
        });

        this.events.on('order:paymentSelection', (button: HTMLButtonElement) => {
            this.selectPayment(button);
        });

        this.events.on('order:changeAddress', (data: { field: string; value: string }) => {
            this.updateAddress(data.value);
        });

        this.events.on('order:submit', () => {
            this.validateOrderAndOpenContacts();
        });

        this.events.on('contacts:changeInput', (data: { field: string; value: string }) => {
            this.updateContact(data.field, data.value);
        });

        this.events.on('contacts:submit', () => {
            this.submitOrder();
        });

        this.events.on('success:close', () => {
            this.closeSuccess();
        });

        this.events.on('modal:close', () => {
            this.modal.locked = false;
            this.productModel.clearSelectedProduct();
        });

        this.events.on('order:submit', () => {
            this.validateOrderAndOpenContacts();
        });

        this.events.on('contacts:submit', () => {
            console.log('Presenter: contacts:submit получено');
            this.submitOrder();
        });
    }

    private async loadProducts(): Promise<void> {
        try {
            const response = await this.api.get<{ items: IProduct[] }>('/product');
            this.productModel.setItems(response.items);
            this.renderCatalog();
        } catch (error) {
            console.error('Failed to load products:', error);
            this.showError('Не удалось загрузить товары. Пожалуйста, обновите страницу.');
        }
    }

    private renderCatalog(): void {
        const catalogContainer = document.querySelector('.gallery');
        if (!catalogContainer) return;

        const products = this.productModel.getItems();
        const cards = products.map(product => {
            const card = new Card(
                this.cardTemplate,
                this.events,
                {
                    onClick: () => this.events.emit('card:select', { id: product.id })
                }
            );
            return card.render(product);
        });
        catalogContainer.replaceChildren(...cards);
    }

    private openProductDetails(productId: string): void {
        const product = this.productModel.getItemById(productId);
        if (!product) return;

        this.productModel.setSelectedProduct(product);

        const previewTemplate = document.querySelector<HTMLTemplateElement>('#card-preview');
        if (!previewTemplate) {
            console.error('Шаблон #card-preview не найден');
            return;
        }

        const cardPreview = new CardPreview(
            previewTemplate,
            this.events,
            {
                onClick: () => this.events.emit('card:addBasket', { id: product.id })
            }
        );

        this.modal.content = cardPreview.render(product);
        this.modal.open();
    }

    private addToBasket(productId: string): void {
        const product = this.productModel.getItemById(productId);
        if (!product || product.price === null) return;

        this.basketModel.addItem(product);
        this.updateBasket();
        this.modal.close();
    }

    private removeFromBasket(productId: string): void {
        this.basketModel.removeItem(productId);
        this.updateBasket();
    }

    private updateBasket(): void {
        this.headerView.counter = this.basketModel.getCount();

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

    private openBasket(): void {
        this.updateBasket();
        this.modal.content = this.basketView.render();
        this.modal.open();
    }

    private openOrderForm(): void {
        if (this.basketModel.getCount() === 0) return;

        this.orderForm.paymentSelection = '';
        this.orderForm.valid = false;
        this.buyerModel.clear();

        this.modal.content = this.orderForm.render();
        this.modal.open();
    }

    private selectPayment(button: HTMLButtonElement): void {
        this.buyerModel.setData({ payment: button.name as TPayment });
        this.validateOrderForm();
    }

    private updateAddress(address: string): void {
        this.buyerModel.setData({ address });
        this.validateOrderForm();
    }

    private validateOrderForm(): void {
        const errors = this.buyerModel.validate();
        const hasPaymentOrAddressError = !!errors.payment || !!errors.address;
        this.orderForm.valid = !hasPaymentOrAddressError;
    }

    private validateOrderAndOpenContacts(): void {
        const buyerData = this.buyerModel.getData();
        const errors = this.buyerModel.validate();

        console.log('Валидация заказа:', { buyerData, errors });

        if (errors.payment || errors.address) {
            console.error('Ошибки валидации заказа:', errors);
            return;
        }
        this.openContactsForm();
    }

    private openContactsForm(): void {
        this.contactsForm.valid = false;

        this.modal.content = this.contactsForm.render();
        this.modal.open();
    }

    private updateContact(field: string, value: string): void {
        const updateData: Partial<{ email: string; phone: string }> = {};

        if (field === 'email') {
            updateData.email = value;
        } else if (field === 'phone') {
            updateData.phone = value;
        }

        this.buyerModel.setData(updateData);
        this.validateContactForm();
    }

    private validateContactForm(): void {
        const errors = this.buyerModel.validate();
        const hasContactErrors = !!errors.email || !!errors.phone;
        this.contactsForm.valid = !hasContactErrors;
    }

    private async submitOrder(): Promise<void> {
        console.log('submitOrder вызван');

        const buyerData = this.buyerModel.getData();
        const errors = this.buyerModel.validate();

        console.log('Данные для заказа:', {
            buyerData,
            errors,
            basketItems: this.basketModel.items.length,
            total: this.basketModel.getTotal()
        });

        if (Object.keys(errors).length > 0) {
            console.error('Ошибки валидации:', errors);
            alert(`Пожалуйста, исправьте ошибки:\n${Object.values(errors).join('\n')}`);
            return;
        }

        if (this.basketModel.items.length === 0) {
            console.error('Корзина пуста');
            alert('Корзина пуста');
            return;
        }

        const orderData: IOrderRequest = {
            payment: buyerData.payment,
            email: buyerData.email,
            phone: buyerData.phone,
            address: buyerData.address,
            total: this.basketModel.getTotal(),
            items: this.basketModel.items.map(item => item.id)
        };

        console.log('Отправка заказа:', orderData);

        try {
            if (!this.api) {
                console.log('API не настроен, используем mock');
                this.modal.content = this.successView.render(orderData.total);
                this.modal.open();
                this.basketModel.clear();
                this.buyerModel.clear();
                this.updateBasket();
                return;
            }

            const response = await this.api.post<{ id: string; total: number }>('/order', orderData);
            console.log('Ответ от сервера:', response);

            this.modal.content = this.successView.render(response.total);
            this.modal.open();

            this.basketModel.clear();
            this.buyerModel.clear();
            this.updateBasket();

        } catch (error) {
            console.error('Ошибка при отправке заказа:', error);
            this.showError('Не удалось оформить заказ. Пожалуйста, попробуйте еще раз.');
        }
    }

    private closeSuccess(): void {
        this.modal.close();
        this.buyerModel.clear();
    }

    private showError(message: string): void {
        const errorElement = document.createElement('div');
        errorElement.className = 'error-message';
        errorElement.textContent = message;

        this.modal.content = errorElement;
        this.modal.open();

        setTimeout(() => {
            this.modal.close();
        }, 3000);
    }
}