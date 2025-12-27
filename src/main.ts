import { BasketModel } from './components/models/BasketModel';
import { BuyerModel } from './components/models/BuyerModel';
import { ProductModel } from './components/models/ProductModel';
import { Api } from './components/base/Api';
import { IProduct, TItemCategory, IOrderRequest } from './types';
import { ApiShop } from './components/api/ApiShop';
import { apiProducts } from './utils/data';
import {API_URL} from "./utils/constants.ts";

console.log('ТЕСТИРОВАНИЕ ВСЕХ МОДЕЛЕЙ\n');

console.log('\n\n1. ПОДГОТОВКА ДАННЫХ:');

const testApiProducts: IProduct[] = apiProducts.items.map(item => ({
    ...item,
    category: item.category as TItemCategory
}));

console.log('- Загружено товаров:', testApiProducts.length);
testApiProducts.forEach((product, index) => {
    console.log(`  ${index + 1}. ${product.title} - ${product.price} ₽ (${product.category})`);
});

console.log('\n\n2. ТЕСТИРОВАНИЕ PRODUCT MODEL:');
const productModel = new ProductModel();
productModel.setItems(testApiProducts);

const products = productModel.getItems();
console.log('- Обработано товаров:', productModel.getTotalCount());
console.log('- Первый товар:', products[0].title);

console.log(
    '- Поиск товара по ID:',
    productModel.getItemById('854cef69-976d-4c2a-a18c-2aa45046c390')?.title || 'Не найден'
);

// ТЕСТ selectedProduct
console.log('- Установка выбранного товара');
productModel.setSelectedProduct(products[0]);
console.log(
    '  Выбранный товар:',
    productModel.getSelectedProduct()?.title
);

console.log('- Сброс выбранного товара');
productModel.clearSelectedProduct();
console.log(
    '  После сброса:',
    productModel.getSelectedProduct()
);

console.log('\n\n3. ТЕСТИРОВАНИЕ BASKET MODEL:');
const basketModel = new BasketModel();

products.forEach(product => basketModel.addItem(product));
console.log('- Добавлено товаров в корзину:', basketModel.getCount());
console.log('- Сумма корзины:', basketModel.getTotal(), '₽');

console.log('- Содержимое корзины:');
basketModel.items.forEach(item => {
    console.log(`  • ${item.title} — ${item.price ?? 'Бесплатно'} ₽`);
});

console.log('- Проверка дубликатов:');
const initialCount = basketModel.getCount();
basketModel.addItem(products[0]);
console.log(`  Было: ${initialCount}, стало: ${basketModel.getCount()}`);

console.log('- Удаление товара:');
const productToRemove = products[1];
basketModel.removeItem(productToRemove.id);
console.log(`  Удален "${productToRemove.title}"`);

console.log('- Осталось в корзине:');
basketModel.items.forEach(item => {
    console.log(`  • ${item.title}`);
});

basketModel.clear();
console.log('- После очистки корзины:', basketModel.getCount(), 'товаров');

console.log('\n\n4. ТЕСТИРОВАНИЕ BUYER MODEL:');
const buyerModel = new BuyerModel();

console.log('- Начальное состояние (пустые данные):');
console.log('  Валидны:', buyerModel.isValid());
console.log('  Ошибки:', buyerModel.validate());

console.log('\n- Устанавливаем валидные данные:');
buyerModel.setData({
    payment: 'card',
    email: 'test@example.com',
    phone: '+79123456789',
    address: 'ул. Тестовая, 1'
});

console.log('  Данные покупателя:', buyerModel.getData());
console.log('  Валидны:', buyerModel.isValid());

console.log('\n- Тест невалидного email:');
buyerModel.setData({ email: 'неправильный-email' });
console.log('  Ошибки:', buyerModel.validate());

console.log('\n- Тест пустого адреса:');
buyerModel.setData({ address: '', email: 'test@test.ru', phone: '+79123456789', payment: 'cash' });
console.log('  Ошибки:', buyerModel.validate());

console.log('\n- Обновление части данных:');
buyerModel.clear();
buyerModel.setData({ email: 'first@email.com' });
buyerModel.setData({ phone: '+79998887766' });
console.log('  Результат:', buyerModel.getData());

buyerModel.clear();
console.log('- После очистки:', buyerModel.getData());

console.log('\n\n5. ИНТЕГРАЦИОННЫЙ ТЕСТ:');

const scenarioProductModel = new ProductModel();
scenarioProductModel.setItems(testApiProducts);
const scenarioProducts = scenarioProductModel.getItems();

const scenarioBasketModel = new BasketModel();
scenarioBasketModel.addItem(scenarioProducts[0]);
scenarioBasketModel.addItem(scenarioProducts[1]);

const scenarioBuyerModel = new BuyerModel();
scenarioBuyerModel.setData({
    payment: 'cash',
    email: 'buyer@example.com',
    phone: '+79215554433',
    address: 'г. Москва, ул. Покупки, д. 10'
});

console.log('- Сценарий покупки:');
console.log('  Товаров в корзине:', scenarioBasketModel.getCount());
console.log('  Сумма заказа:', scenarioBasketModel.getTotal(), '₽');
console.log('  Данные покупателя валидны:', scenarioBuyerModel.isValid());

if (scenarioBuyerModel.isValid()) {
    console.log('  Готово к оформлению заказа!');
}

console.log('\n\n6. ТЕСТИРОВАНИЕ API КЛАССА:');
const api = new Api(API_URL);
console.log('- Создан экземпляр Api');
console.log('  baseUrl:', api.baseUrl);

console.log('\n\n7. ЗАПРОС /product ЧЕРЕЗ ApiShop:');

const apiShop = new ApiShop(api);

apiShop.getProducts()
    .then(serverProducts => {
        console.log('Ответ сервера /product:');
        console.log(serverProducts);

        productModel.setItems(serverProducts);

        products.length = 0;
        products.push(...serverProducts);

        console.log('\nЗапись товаров в ProductModel:');
        console.log(productModel.getItems());
    });

console.log('\n\n8. ТЕСТ sendOrder ЧЕРЕЗ ApiShop:');

const orderBasket = new BasketModel();
orderBasket.addItem(products[0]);
orderBasket.addItem(products[1]);

const orderBuyer = new BuyerModel();
orderBuyer.setData({
    payment: 'card',
    email: 'order@test.ru',
    phone: '+79990001122',
    address: 'г. Москва, ул. Заказная, 5'
});

const orderData: IOrderRequest = {
    items: orderBasket.items.map(item => item.id),
    total: orderBasket.getTotal(),
    ...orderBuyer.getData()
};

console.log('Отправляем заказ:', orderData);

apiShop.sendOrder(orderData)
    .then(response => {
        console.log('Заказ успешно создан!');
        console.log('ID заказа:', response.id);
        console.log('Сумма заказа:', response.total);
    })
    .catch(error => {
        console.error('Ошибка при отправке заказа:', error);
    });


