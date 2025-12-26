import { IBuyer, IValidationResult } from '../../types';

export class BuyerModel {
    private _data: Partial<IBuyer> = {};

    setData(data: Partial<IBuyer>): void {
        this._data = { ...this._data, ...data };
    }

    getData(): Partial<IBuyer> {
        return { ...this._data };
    }

    validate(): IValidationResult {
        const errors: IValidationResult = {};

        if (!this._data.payment) {
            errors.payment = 'Выберите способ оплаты';
        }

        if (!this._data.address || this._data.address.trim().length === 0) {
            errors.address = 'Введите адрес';
        }

        if (!this._data.email || this._data.email.trim().length === 0) {
            errors.email = 'Введите email';
        } else if (!this.isValidEmail(this._data.email)) {
            errors.email = 'Введите корректный email';
        }

        if (!this._data.phone || this._data.phone.trim().length === 0) {
            errors.phone = 'Введите телефон';
        } else if (!this.isValidPhone(this._data.phone)) {
            errors.phone = 'Введите корректный телефон';
        }

        return errors;
    }

    isValid(): boolean {
        const errors = this.validate();
        return Object.keys(errors).length === 0;
    }

    getOrderData(): IBuyer {
        if (!this.isValid()) {
            throw new Error('Данные покупателя не валидны');
        }

        return {
            payment: this._data.payment!,
            email: this._data.email!,
            phone: this._data.phone!,
            address: this._data.address!
        };
    }

    clear(): void {
        this._data = {};
    }

    private isValidEmail(email: string): boolean {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    private isValidPhone(phone: string): boolean {
        const digits = phone.replace(/\D/g, '');
        return digits.length >= 11;
    }
}