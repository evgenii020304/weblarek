import { Api } from './components/base/Api';
import { ProductModel } from './components/models/ProductModel';
import { BasketModel } from './components/models/BasketModel.ts';
import { BuyerModel } from './components/models/BuyerModel';
import { CatalogView } from './components/views/CatalogView';
import { BasketView } from './components/views/BasketView';
import { ModalView } from './components/views/ModalView';
import { CardView } from './components/views/CardView';
import { OrderFormView } from './components/views/OrderFormView';
import { ContactsFormView } from './components/views/ContactsFormView';
import { SuccessView } from './components/views/SuccessView';
import { API_URL } from './utils/constants';
import { IProduct, TItemCategory, IOrderResponse, IApiResponse } from './types';
import './scss/styles.scss';

function ensureProductType(item: any): IProduct {
    return {
        id: item.id,
        title: item.title,
        price: item.price,
        category: item.category as TItemCategory,
        description: item.description,
        image: item.image,
        productIndex: item.productIndex || 0
    };
}

async function initApp() {
    const productModel = new ProductModel();
    const cartModel = new BasketModel();
    const buyerModel = new BuyerModel();

    const api = new Api(API_URL);

    const galleryContainer = document.querySelector('.gallery') as HTMLElement;
    const modalContainer = document.getElementById('modal-container') as HTMLElement;

    if (!galleryContainer || !modalContainer) {
        throw new Error('Не найден один из контейнеров');
    }

    const modalView = new ModalView(modalContainer);

    function updateCartCounter() {
        const counter = document.querySelector('.header__basket-counter');
        if (counter) {
            counter.textContent = cartModel.getCount().toString();
        }
    }

    const basketTemplate = document.getElementById('basket') as HTMLTemplateElement;
    const orderTemplate = document.getElementById('order') as HTMLTemplateElement;
    const contactsTemplate = document.getElementById('contacts') as HTMLTemplateElement;
    const successTemplate = document.getElementById('success') as HTMLTemplateElement;

    const basketContent = basketTemplate.content.cloneNode(true) as DocumentFragment;
    const orderContent = orderTemplate.content.cloneNode(true) as DocumentFragment;
    const contactsContent = contactsTemplate.content.cloneNode(true) as DocumentFragment;
    const successContent = successTemplate.content.cloneNode(true) as DocumentFragment;

    const basketContainer = basketContent.querySelector('.basket') as HTMLElement;
    const orderContainer = orderContent.querySelector('.form') as HTMLElement;
    const contactsContainer = contactsContent.querySelector('.form') as HTMLElement;
    const successContainer = successContent.querySelector('.order-success') as HTMLElement;

    modalContainer.querySelector('.modal__content')!.appendChild(basketContainer);

    const catalogView = new CatalogView(galleryContainer, {
        onClick: (product: IProduct) => {
            const template = document.getElementById('card-preview') as HTMLTemplateElement;
            const previewContent = template.content.cloneNode(true) as DocumentFragment;
            const previewContainer = previewContent.querySelector('.card') as HTMLElement;

            const previewView = new CardView(previewContainer);
            previewView.category = product.category;
            previewView.title = product.title;
            previewView.image = product.image;
            previewView.price = product.price;
            previewView.buttonLabel = cartModel.alreadyInBasket(product.id) ? 'Удалить' : 'В корзину';

            const textElement = previewContainer.querySelector('.card__text');
            if (textElement && product.description) {
                textElement.textContent = product.description;
            }

            previewView.onClick = (event: MouseEvent) => {
                event.preventDefault();
                if (cartModel.alreadyInBasket(product.id)) {
                    cartModel.removeItem(product.id);
                } else {
                    cartModel.addItem(product);
                }
                updateCartCounter();
                modalView.close();
            };

            modalView.open(previewContainer);
        }
    });

    const basketView = new BasketView(basketContainer);
    const orderFormView = new OrderFormView(orderContainer);
    const contactsFormView = new ContactsFormView(contactsContainer);
    const successView = new SuccessView(successContainer);

    function showBasket() {
        basketView.render({
            items: cartModel.items,
            total: cartModel.getTotal()
        });
        basketView.onCheckout = () => {
            if (cartModel.getCount() > 0) {
                showOrderForm();
            }
        };
        basketView.onRemove = (id: string) => {
            cartModel.removeItem(id);
            updateCartCounter();
            showBasket();
        };
        modalView.open(basketContainer);
    }

    function showOrderForm() {
        const buyerData = buyerModel.getData();
        orderFormView.render({
            payment: buyerData.payment,
            address: buyerData.address,
            errors: buyerModel.validate()
        });

        orderFormView.onSubmit = () => {
            const formData = orderFormView.getFormData();
            buyerModel.setData(formData);

            const validation = buyerModel.validate();
            if (validation.payment || validation.address) {
                orderFormView.render({ errors: validation });
                return;
            }

            showContactsForm();
        };

        modalView.open(orderContainer);
    }

    function showContactsForm() {
        const buyerData = buyerModel.getData();
        contactsFormView.render({
            email: buyerData.email,
            phone: buyerData.phone,
            errors: buyerModel.validate()
        });

        contactsFormView.onSubmit = () => {
            const formData = contactsFormView.getFormData();
            buyerModel.setData(formData);

            const validation = buyerModel.validate();
            if (validation.email || validation.phone) {
                contactsFormView.render({ errors: validation });
                return;
            }

            if (buyerModel.isValid() && cartModel.getCount() > 0) {
                submitOrder();
            }
        };

        modalView.open(contactsContainer);
    }

    async function submitOrder() {
        try {
            const orderData = buyerModel.getOrderData();
            const orderRequest = {
                ...orderData,
                total: cartModel.getTotal(),
                items: cartModel.items.map((item: IProduct) => item.id)
            };

            const response = await api.post<IOrderResponse>('/order', orderRequest);

            if (!response.error) {
                showSuccess(response.total || cartModel.getTotal());
                cartModel.clear();
                buyerModel.clear();
                updateCartCounter();
            }
        } catch (error) {
            console.error('Ошибка при оформлении заказа:', error);
        }
    }

    function showSuccess(total: number) {
        successView.render({ total });
        successView.onClose = () => {
            modalView.close();
        };
        modalView.open(successContainer);
    }

    const basketButton = document.querySelector('.header__basket');
    if (basketButton) {
        basketButton.addEventListener('click', showBasket);
    }

    try {
        const response = await api.get<IApiResponse>('/product');
        const products = response.items.map(ensureProductType);

        if (products.length === 0) {
            const { apiProducts } = await import('./utils/data');
            const testProducts = apiProducts.items.map(ensureProductType);
            productModel.setItems(testProducts);
            catalogView.render({ items: testProducts });
        } else {
            productModel.setItems(products);
            catalogView.render({ items: products });
        }

        updateCartCounter();

    } catch (error) {
        console.error('Ошибка при загрузке товаров:', error);
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
} else {
    initApp();
}