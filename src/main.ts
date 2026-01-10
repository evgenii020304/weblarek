import { EventEmitter } from './components/base/Events';
import { Api } from './components/base/Api.ts';
import { ProductModel } from './components/models/ProductModel';
import { BasketModel } from './components/models/BasketModel';
import { BuyerModel } from './components/models/BuyerModel';
import { Modal } from './components/views/Modal';
import { Basket } from './components/views/Basket';
import { Success } from './components/views/Success';
import { Order } from './components/views/FormOrder';
import { Contacts } from './components/views/FormContact';
import { Presenter } from './components/Presenter';
import { API_URL } from './utils/constants';
import './scss/styles.scss';

const events = new EventEmitter();

const api = new Api(API_URL);

const productModel = new ProductModel();
const basketModel = new BasketModel();
const buyerModel = new BuyerModel();

const modalContainer = document.querySelector<HTMLElement>('#modal-container');
const headerContainer = document.querySelector<HTMLElement>('.header');

const basketTemplate = document.querySelector<HTMLTemplateElement>('#basket');
const successTemplate = document.querySelector<HTMLTemplateElement>('#success');
const orderTemplate = document.querySelector<HTMLTemplateElement>('#order');
const contactsTemplate = document.querySelector<HTMLTemplateElement>('#contacts');
const cardTemplate = document.querySelector<HTMLTemplateElement>('#card-catalog');
const basketItemTemplate = document.querySelector<HTMLTemplateElement>('#card-basket');

console.log('Найденные элементы:', {
    modalContainer: !!modalContainer,
    headerContainer: !!headerContainer,
    basketTemplate: !!basketTemplate,
    successTemplate: !!successTemplate,
    orderTemplate: !!orderTemplate,
    contactsTemplate: !!contactsTemplate,
    cardTemplate: !!cardTemplate,
    basketItemTemplate: !!basketItemTemplate
});

if (!modalContainer) {
    throw new Error('Не найден элемент: #modal-container');
}
if (!headerContainer) {
    throw new Error('Не найден элемент: .header');
}
if (!basketTemplate) {
    throw new Error('Не найден шаблон: #basket');
}
if (!successTemplate) {
    throw new Error('Не найден шаблон: #success');
}
if (!orderTemplate) {
    throw new Error('Не найден шаблон: #order');
}
if (!contactsTemplate) {
    throw new Error('Не найден шаблон: #contacts');
}
if (!cardTemplate) {
    throw new Error('Не найден шаблон: #card-catalog');
}
if (!basketItemTemplate) {
    throw new Error('Не найден шаблон: #card-basket');
}

const basketElement = basketTemplate.content.querySelector('.basket');
const successElement = successTemplate.content.querySelector('.order-success');
const contactsElement = contactsTemplate.content.querySelector('.form');
const basketItemElement = basketItemTemplate.content.querySelector('.basket__item');

console.log('Элементы из шаблонов:', {
    basketElement: !!basketElement,
    successElement: !!successElement,
    contactsElement: !!contactsElement,
    basketItemElement: !!basketItemElement
});

if (!basketElement) {
    throw new Error('Не найден элемент .basket в шаблоне #basket');
}
if (!successElement) {
    throw new Error('Не найден элемент .order-success в шаблоне #success');
}
if (!contactsElement) {
    throw new Error('Не найден элемент .form в шаблоне #contacts');
}
if (!basketItemElement) {
    throw new Error('Не найден элемент .basket__item в шаблоне #card-basket');
}

const modal = new Modal(modalContainer, events);
const basketView = new Basket(basketContainer, events);
const successView = new Success(successContainer, events);
const orderForm = new Order(orderTemplate, events);
const contactsForm = new Contacts(contactsContainer, events);

console.log('Представления инициализированы');

const presenter = new Presenter(
    events,
    productModel,
    basketModel,
    buyerModel,
    modal,
    basketView,
    successView,
    orderForm,
    contactsForm,
    api,
    cardTemplate,
    basketItemContainer,
    headerContainer
);

console.log('Приложение инициализировано успешно');

(window as any).app = {
    events,
    productModel,
    basketModel,
    buyerModel,
    presenter
};