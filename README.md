https://github.com/evgenii020304/weblarek
# «Web-Larёk»
«Web-Larёk» — это интернет-магазин с товарами для веб-разработчиков, где пользователи могут просматривать товары, добавлять их в корзину и оформлять заказы. Сайт предоставляет удобный интерфейс с модальными окнами для просмотра деталей товаров, управления корзиной и выбора способа оплаты, обеспечивая полный цикл покупки с отправкой заказов на сервер.

## Проектная работа "Веб-ларек"

**Стек:** HTML, SCSS, TS, Webpack

**Паттерн программирования:** упрощённая версия архитектурного паттерна MVP

Model - слой данных, отвечает за хранение и изменение данных.  
View - слой представления, отвечает за отображение данных на странице.  
Presenter - презентер содержит основную логику приложения и отвечает за связь представления и данных.

Взаимодействие между классами обеспечивается использованием событийно-ориентированного подхода. Модели и Представления генерируют события при изменении данных или взаимодействии пользователя с приложением, а Презентер обрабатывает эти события используя методы как Моделей, так и Представлений.

**Структура проекта:**

- `src/` — исходные файлы проекта
- `src/components/` — папка с JS компонентами
- `src/components/base/` — папка с базовым кодом

**Важные файлы:**

- `src/pages/index.html` — HTML-файл главной страницы
- `src/types/index.ts` — файл с типами
- `src/index.ts` — точка входа приложения
- `src/scss/styles.scss` — корневой файл стилей
- `src/utils/constants.ts` — файл с константами
- `src/utils/utils.ts` — файл с утилитами

## Установка и запуск
Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run dev
```

или

```
yarn
yarn dev
```
## Сборка

```
npm run build
```

или

```
yarn build
```

## Интерфейсы данных
В приложении используются следующие интерфейсы для описания данных:

### Товар (IProduct)

```
export interface IProduct {
    id: string;
    productIndex: number;
    description: string;
    image: string;
    title: string;
    category: TItemCategory;
    price: TItemPrice;
}
```

Назначение: Описывает структуру данных товара в каталоге интернет-магазина.

**Поля:**

`id: string` — уникальный идентификатор товара
`productIndex: number` — порядковый индекс товара в каталоге, используется для сортировки
`description: string` — подробное описание товара
`image: string` — URL изображения товара
`title: string` — название товара
`category: TItemCategory` — категория товара
`price: TItemPrice` — цена товара 

### Покупатель (IBuyer)

```
export interface IBuyer {
    payment: TPayment;
    email: string;
    phone: string;
    address: string;
}
```

Назначение: Описывает данные покупателя, необходимые для оформления заказа.

**Поля:**

`payment: TPayment` — выбранный способ оплаты ('card' или 'cash')
`email: string` — email покупателя для связи
`phone: string` — телефон покупателя для связи
`address: string` — адрес доставки заказа

### Корзина (IBasket)

```
export interface IBasket {
    items: IProduct[];
    addItem(product: IProduct): void;
    alreadyInBasket(productId: string): boolean;
    clear(): void;
    getTotal(): number;
    getCount(): number;
    removeItem(productId: string): void;
    checkTotal(value: number): boolean;
}
```

Назначение: Описывает функционал корзины покупок для управления товарами.

**Поля:**

`items: IProduct[]` — массив товаров, находящихся в корзине
`addItem(product: IProduct): void` — добавляет товар в корзину (если его там еще нет)
`alreadyInBasket(productId: string): boolean` — проверяет, находится ли товар с указанным ID в корзине
`clear(): void` — полностью очищает корзину
`getTotal(): number` — возвращает общую стоимость всех товаров в корзине
`getCount(): number` — возвращает количество товаров в корзине
`removeItem(productId: string): void` — удаляет товар с указанным ID из корзины
`checkTotal(value: number): boolean` — проверяет, совпадает ли общая сумма с переданным значением

### Ответ сервера на заказ (IOrderResponse)

```
export interface IOrderResponse {
    id?: string;
    total?: number;
    error?: string;
    code?: number;
}
```

Назначение: Структура ответа сервера после оформления заказа.

**Поля:**

`id?: string` — уникальный идентификатор созданного заказа (при успешном оформлении)
`total?: number` — подтвержденная сумма заказа
`error?: string` — текст ошибки (при неудачном оформлении)
`code?: number` — код ошибки (при неудачном оформлении)

### Результат валидации (IValidationResult)

```
export interface IValidationResult {
    payment?: string;
    email?: string;
    phone?: string;
    address?: string;
}
```

Назначение: Содержит сообщения об ошибках валидации данных покупателя.

**Поля:**

`payment?: string` — ошибка валидации способа оплаты
`email?: string` — ошибка валидации email
`phone?: string` — ошибка валидации телефона
`address?: string` — ошибка валидации адреса

### API (IApi)

```
export interface IApi {
    baseUrl: string;
    get<T extends object>(uri: string): Promise<T>;
    post<T extends object>(uri: string, data: object, method?: ApiPostMethods): Promise<T>;
}
```

Назначение: Описывает интерфейс для работы с HTTP API сервера.

**Поля:**

`baseUrl: string` — базовый URL API сервера
`get<T extends object>(uri: string): Promise<T>` — выполняет GET запрос к указанному endpoint и возвращает данные
`post<T extends object>(uri: string, data: object, method?: ApiPostMethods): Promise<T>` — выполняет POST/PUT/DELETE запрос с данными и возвращает результат

### Ответ API с товарами (IApiResponse)

```
export interface IApiResponse {
    items: IProduct[];
}
```

Назначение: Структура ответа сервера при запросе списка товаров.

**Поля:**

`items: IProduct[]` — массив товаров, полученных с сервера

### Типы данных

```
export type TItemCategory = 'софт-скил' | 'хард-скил' | 'другое' | 'кнопка' | 'дополнительное';
export type TItemPrice = number | null;
export type TPayment = 'card' | 'cash' | null;
export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE';
```

Назначение: Определяют допустимые значения для различных свойств.

**Типы:**

`TItemCategory` — категории товаров, влияют на цветовое оформление карточек
`TItemPrice` — цена товара (число или null для недоступных товаров)
`TPayment` — способы оплаты заказа
`ApiPostMethods` — HTTP методы для запросов изменения данных


## Базовый код

### Класс Component
Является базовым классом для всех компонентов интерфейса.
Класс является дженериком и принимает в переменной `T` тип данных, которые могут быть переданы в метод `render` для отображения.

**Конструктор:**

`constructor(container: HTMLElement)` — принимает ссылку на DOM элемент, за отображение которого отвечает компонент

**Поля класса:**

`protected readonly container: HTMLElement` — корневой DOM элемент компонента

**Методы класса:**

`render(data?: Partial<T>): HTMLElement` — главный метод класса. Принимает данные для отображения, записывает их в поля класса через Object.assign и возвращает корневой DOM элемент
`protected setImage(element: HTMLImageElement, src: string, alt?: string): void` — утилитарный метод для установки изображения. Меняет src и alt атрибуты элемента img
`protected setText(element: HTMLElement, value: unknown): void` — утилитарный метод для установки текстового содержимого. Преобразует значение в строку и устанавливает как textContent
`protected setDisabled(element: HTMLElement, state: boolean): void` — утилитарный метод для управления состоянием disabled элемента

### Класс Api
Назначение: Реализует интерфейс IApi для взаимодействия с HTTP API сервера. Предоставляет методы для выполнения GET и POST запросов с обработкой ошибок.

**Конструктор:**

`constructor(baseUrl: string, options: RequestInit = {})` — принимает базовый URL API и дополнительные опции для запросов

**Поля класса:**

`baseUrl: string` — базовый URL API сервера, к которому будут добавляться endpoint-ы
`options: RequestInit` — конфигурация HTTP запросов, включая заголовки по умолчанию

**Методы класса:**

`protected handleResponse<T>(response: Response): Promise<T>` — внутренний метод для обработки ответов сервера. При успешном ответе (status 200-299) возвращает распарсенный JSON, при ошибке — отклоняет промис с сообщением об ошибке
`get<T extends object>(uri: string): Promise<T>` — выполняет GET запрос к указанному endpoint. Возвращает промис с данными типа T
`post<T extends object>(uri: string, data: object, method?: ApiPostMethods): Promise<T>` — выполняет POST/PUT/DELETE запрос с передачей данных. Принимает данные для отправки и опционально метод запроса

### Класс EventEmitter
Брокер событий реализует паттерн "Наблюдатель", позволяющий отправлять события и подписываться на события, происходящие в системе. Класс используется для связи слоя данных и представления.

Конструктор класса не принимает параметров.

**Поля класса:**  

`_events: Map<string | RegExp, Set<Function>>)` - хранит коллекцию подписок на события. Ключи коллекции - названия событий или регулярное выражение, значения - коллекция функций обработчиков, которые будут вызваны при срабатывании события.

**Методы класса:**

`on<T extends object>(event: EventName, callback: (data: T) => void): void` - подписка на событие, принимает название события и функцию обработчик.  
`emit<T extends object>(event: string, data?: T): void` - инициализация события. При вызове события в метод передается название события и объект с данными, который будет использован как аргумент для вызова обработчика.  
`trigger<T extends object>(event: string, context?: Partial<T>): (data: T) => void` - возвращает функцию, при вызове которой инициализируется требуемое в параметрах событие с передачей в него данных из второго параметра.

### Класс BuyerModel
Назначение: Модель для хранения и валидации данных покупателя при оформлении заказа.

**Поля класса:**

`private _data: Partial<IBuyer> = {}` — внутреннее хранилище данных покупателя

**Методы класса:**

`setData(data: Partial<IBuyer>): void` — устанавливает данные покупателя, объединяя с существующими
`getData(): Partial<IBuyer>` — возвращает копию текущих данных покупателя
`validate(): IValidationResult` — проверяет корректность всех заполненных полей, возвращает объект с ошибками
`isValid(): boolean` — проверяет, прошли ли все заполненные поля валидацию
`getOrderData(): IBuyer` — возвращает полные данные для отправки на сервер
`clear(): void` — очищает все данные покупателя
`private isValidEmail(email: string): boolean` — внутренний метод валидации email
`private isValidPhone(phone: string): boolean` — внутренний метод валидации телефона

### Класс CartModel
Назначение: Реализует интерфейс IBasket для управления корзиной покупок.

**Поля класса:**

`private _items: IProduct[] = []` — внутреннее хранилище товаров в корзине

**Методы класса:**

`get items(): IProduct[]` — геттер для получения массива товаров
`addItem(product: IProduct): void` — добавляет товар в корзину, если его там еще нет
`alreadyInBasket(productId: string): boolean` — проверяет наличие товара в корзине по ID
`clear(): void` — полностью очищает корзину
`getTotal(): number` — вычисляет общую стоимость всех товаров в корзине
`getCount(): number` — возвращает количество товаров в корзине
`removeItem(productId: string): void` — удаляет товар из корзины по ID
`getItems(): IProduct[]` — возвращает копию массива товаров

### Класс ProductModel
Назначение: Модель для хранения и управления каталогом товаров.

**Поля класса:**

`private _items: IProduct[] = []` — внутреннее хранилище товаров

**Методы класса:**

`setItems(items: IProduct[]): void` — устанавливает массив товаров в каталог
`getItems(): IProduct[]` — возвращает все товары каталога
`getItemById(id: string): IProduct | undefined` — находит товар по его уникальному идентификатору

### Класс CatalogView
Назначение: View-компонент для отображения каталога товаров на главной странице.

**Конструктор:**

`constructor(container: HTMLElement, actions?: ICatalogActions)` — принимает контейнер и обработчики действий

**Методы класса:**

`render(data?: Partial<ICatalogData>): HTMLElement` — рендерит каталог товаров, создавая карточки для каждого товара, настраивает обработчики кликов

### Класс CardView
Назначение: View-компонент для отображения карточки товара в разных контекстах (каталог, превью).

**Поля класса:**

Защищенные поля для DOM элементов карточки
`_onClick` — обработчик клика

**Сеттеры:**

`category(value: TItemCategory)` — устанавливает категорию и обновляет CSS класс
`title(value: string)` — устанавливает заголовок товара
`image(value: string)` — устанавливает изображение с fallback на случай ошибки
`price(value: number | null)` — устанавливает цену товара
`buttonLabel(value: string)` — устанавливает текст кнопки
`onClick(callback)` — устанавливает обработчик клика

### Класс BasketView
Назначение: View-компонент для отображения содержимого корзины в модальном окне.

**Поля класса:**

`_onRemove` — обработчик удаления товара

**Сеттеры:**

`onCheckout(callback)` — устанавливает обработчик оформления заказа
`onRemove(callback)` — устанавливает обработчик удаления товара

**Методы:**

`render(data)` — рендерит список товаров в корзине и общую сумму


### Класс ModalView
Назначение: View-компонент для управления модальными окнами.

**Методы класса:**

`open(content?: HTMLElement)` — открывает модальное окно с переданным содержимым
`close()` — закрывает модальное окно
`render(content: HTMLElement)` — обновляет содержимое модального окна

### Класс OrderFormView
Назначение: View-компонент для формы оформления заказа (способ оплаты + адрес).

**Сеттеры:**

`onSubmit(callback)` — устанавливает обработчик отправки формы

**Методы:**

`getFormData()` — возвращает данные формы
`selectPayment()` — выбирает способ оплаты
`validateForm()` — валидирует форму и управляет состоянием кнопки отправки

### Класс ContactsFormView
Назначение: View-компонент для формы контактов (email + телефон) в процессе оформления заказа. Это третий шаг оформления заказа после выбора товаров и указания адреса доставки.

**Конструктор:**

`constructor(container: HTMLElement)` — принимает DOM-элемент формы контактов, находит внутри него все необходимые поля и кнопки

**Поля класса:**

`protected _emailInput: HTMLInputElement` — поле ввода email адреса покупателя
`protected _phoneInput: HTMLInputElement` — поле ввода номера телефона покупателя
`protected _submitButton: HTMLButtonElement` — кнопка "Оплатить" для отправки данных
`protected _errorsContainer: HTMLElement` — контейнер для отображения сообщений об ошибках валидации

**Методы класса:**

`set onSubmit(callback: () => void)` — Устанавливает обработчик события отправки формы
`getFormData()` — Собирает данные из формы в структурированный объект
`render(data?: Partial<IContactsFormData>): HTMLElement` — Основной метод отрисовки компонента
`private validateForm(): boolean` — Проверяет корректность заполненных данных в реальном времени
`private isValidEmail(email: string): boolean` — Проверяет корректность формата email адреса ("@" и ".")
`private isValidPhone(phone: string): boolean` — Проверяет корректность номера телефона (более 10 цифр)
`private renderErrors(errors: IValidationResult)` — Отображает сообщения об ошибках валидации

### Класс SuccessView
Назначение: View-компонент для отображения экрана успешного оформления заказа. Показывает итоговую сумму и предоставляет кнопку для закрытия модального окна.

**Поля класса:**

`protected _description: HTMLElement` — элемент для отображения описания с суммой заказа
`protected _closeButton: HTMLButtonElement` — кнопка закрытия модального окна

**Сеттеры:**

`set onClose(callback: () => void)` — устанавливает обработчик клика по кнопке закрытия

**Методы класса:**

`render(data?: Partial<ISuccessData>): HTMLElement` — рендерит компонент, устанавливая текст описания с суммой списанных синапсов

### Пример полного цикла оформления заказа:

// 1. Пользователь открывает корзину
`showBasket() → BasketView.render(cartModel.items)`

// 2. Нажимает "Оформить"
`basketView.onCheckout → showOrderForm()`

// 3. Заполняет адрес и способ оплаты
`orderFormView.onSubmit → buyerModel.setData() → showContactsForm()`

// 4. Заполняет контакты
`contactsFormView.onSubmit → buyerModel.setData() → submitOrder()`

// 5. Отправка на сервер
`submitOrder() → api.post('/order') → showSuccess()`

// 6. Показ результата
`successView.render() → successView.onClose → modalView.close()`