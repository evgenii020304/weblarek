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
import { ProductModel } from "./models/ProductModel";
import { BasketModel } from "./models/BasketModel";
import { BuyerModel } from "./models/BuyerModel";
import { IOrderRequest, TPayment } from "../types";
import { ApiShop } from "./api/ApiShop";

export class Presenter {
    private catalogView!: CatalogView;
    private cardPreview!: CardPreview;
    private isPreviewInBasket = false;

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
        private headerView: HeaderView,
        private apiShop: ApiShop,
        private cardTemplate: HTMLTemplateElement,
        private basketItemTemplate: HTMLTemplateElement,
        private cardPreviewTemplate: HTMLTemplateElement,
        private catalogContainer: HTMLElement
    ) {
        this.init();
    }

    private init(): void {
        this.initializeViews();
        this.setupEventListeners();
        this.loadProducts();
    }

    private initializeViews(): void {
        this.catalogView = new CatalogView(
            this.catalogContainer,
            this.events,
            this.cardTemplate
        );

        this.cardPreview = new CardPreview(
            this.cardPreviewTemplate,
            this.events,
            {
                onClick: () => this.handlePreviewButtonClick()
            }
        );
    }

    private setupEventListeners(): void {
        this.events.on('card:select', (data: { id: string }) => {
            this.openProductDetails(data.id);
        });

        this.events.on('basket:open', () => {
            this.updateBasketView();
            this.modal.content = this.basketView.render();
            this.modal.open();
        });

        this.events.on('basket:remove', (data: { id: string }) => {
            this.basketModel.removeItem(data.id);
            this.updateHeader();
            this.updateBasketView();
        });

        this.events.on('order:open', () => {
            this.buyerModel.clear();
            this.orderForm.paymentSelection = '';
            this.orderForm.valid = false;
            this.modal.content = this.orderForm.render();
            this.modal.open();
        });

        this.events.on('order:paymentSelection', (button: HTMLButtonElement) => {
            this.buyerModel.setData({ payment: button.name as TPayment });
            this.validateOrderForm();
        });

        this.events.on('order:changeAddress', (data: { field: string; value: string }) => {
            if (data.field === 'address') {
                this.buyerModel.setData({ address: data.value });
                this.validateOrderForm();
            }
        });

        this.events.on('order:submit', () => {
            if (this.validateOrderForm()) {
                this.modal.content = this.contactsForm.render();
                this.contactsForm.valid = false;
                this.modal.open();
            }
        });

        this.events.on('contacts:changeInput', (data: { field: string; value: string }) => {
            if (data.field === 'email' || data.field === 'phone') {
                const updateData = { [data.field]: data.value };
                this.buyerModel.setData(updateData);
                this.validateContactForm();
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
            this.productModel.clearSelectedProduct();
            this.isPreviewInBasket = false;
        });
    }

    private async loadProducts(): Promise<void> {
        try {
            const products = await this.apiShop.getProducts();
            this.productModel.setItems(products);

            this.catalogView.render(products);
        } catch (error) {
            console.error('Failed to load products:', error);
        }
    }

    private openProductDetails(productId: string): void {
        const product = this.productModel.getItemById(productId);
        if (!product) return;

        this.productModel.setSelectedProduct(product);
        this.isPreviewInBasket = this.basketModel.alreadyInBasket(productId);

        this.modal.content = this.cardPreview.render(product, this.isPreviewInBasket);
        this.modal.open();
    }

    private handlePreviewButtonClick(): void {
        const product = this.productModel.getSelectedProduct();
        if (!product) return;

        if (this.isPreviewInBasket) {
            this.basketModel.removeItem(product.id);
        } else {
            this.basketModel.addItem(product);
        }

        this.updateHeader();
        this.modal.close();
    }

    private updateHeader(): void {
        this.headerView.counter = this.basketModel.getCount();
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

    private validateOrderForm(): boolean {
        const errors = this.buyerModel.validate();
        const hasPaymentOrAddressError = !!errors.payment || !!errors.address;

        const orderErrors: Record<string, string> = {};
        if (errors.payment) orderErrors.payment = errors.payment;
        if (errors.address) orderErrors.address = errors.address;

        this.orderForm.errors = orderErrors;
        this.orderForm.valid = !hasPaymentOrAddressError;

        return !hasPaymentOrAddressError;
    }

    private validateContactForm(): boolean {
        const errors = this.buyerModel.validate();
        const hasContactErrors = !!errors.email || !!errors.phone;

        const contactErrors: Record<string, string> = {};
        if (errors.email) contactErrors.email = errors.email;
        if (errors.phone) contactErrors.phone = errors.phone;

        this.contactsForm.errors = contactErrors;
        this.contactsForm.valid = !hasContactErrors;

        return !hasContactErrors;
    }

    private async submitOrder(): Promise<void> {
        if (!this.validateContactForm()) {
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
            this.updateHeader();

        } catch (error) {
            console.error('Ошибка при отправке заказа:', error);
            alert('Не удалось оформить заказ. Пожалуйста, попробуйте еще раз.');
        }
    }
}