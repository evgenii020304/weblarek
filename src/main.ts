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
import { HeaderView } from "./components/views/HeaderView.ts";
import { CardPreview } from "./components/views/CardPreview.ts";
import { CatalogView } from "./components/views/CatalogView.ts";
import { Presenter } from './components/Presenter';
import { API_URL } from './utils/constants';
import {cloneTemplate, ensureElement} from './utils/utils';
import {ApiShop} from "./components/api/ApiShop.ts";
import './scss/styles.scss';

const events = new EventEmitter();

const api = new Api(API_URL);
const apiShop = new ApiShop(api);

const productModel = new ProductModel();
const basketModel = new BasketModel();
const buyerModel = new BuyerModel();

const modalContainer = ensureElement<HTMLElement>('#modal-container');
const headerContainer = ensureElement<HTMLElement>('.header');
const catalogContainer = ensureElement<HTMLElement>('.gallery');

const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const successTemplate = ensureElement<HTMLTemplateElement>('#success');
const orderTemplate = ensureElement<HTMLTemplateElement>('#order');
const contactsTemplate = ensureElement<HTMLTemplateElement>('#contacts');
const cardTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const basketItemTemplate = ensureElement<HTMLTemplateElement>('#card-basket');

const basketElement = cloneTemplate<HTMLElement>(basketTemplate);
const successElement = cloneTemplate<HTMLElement>(successTemplate);
const contactsElement = cloneTemplate<HTMLElement>(contactsTemplate);

const modal = new Modal(modalContainer, events);
const basketView = new Basket(basketElement, events);
const successView = new Success(successElement, events);
const orderForm = new Order(orderTemplate, events);
const contactsForm = new Contacts(contactsElement, events);
const headerView = new HeaderView(events, headerContainer);
const catalogView = new CatalogView(catalogContainer, events);
const cardPreview = new CardPreview(
    cardPreviewTemplate,
    events,
    {
        onClick: () => {
            presenter.handlePreviewButtonClick();
        }
    }
);

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
    catalogView,
    headerView,
    cardPreview,
    apiShop,
    cardTemplate,
    basketItemTemplate
);

(window as any).app = {
    events,
    productModel,
    basketModel,
    buyerModel,
    presenter
};