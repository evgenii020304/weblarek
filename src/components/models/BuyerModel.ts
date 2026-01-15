import { IBuyer, IValidationResult } from '../../types';
import { EventEmitter } from "../base/Events";

export class BuyerModel extends EventEmitter {
    private _data: IBuyer = {
        payment: null,
        email: '',
        phone: '',
        address: '',
    };

    constructor() {
        super();
    }

    setData(data: Partial<IBuyer>): void {
        const oldData = { ...this._data };
        this._data = { ...this._data, ...data };

        if (JSON.stringify(oldData) !== JSON.stringify(this._data)) {
            this.emit('data:changed', this._data);
        }
    }

    getData(): IBuyer {
        return { ...this._data };
    }

    validate(): IValidationResult {
        const errors: IValidationResult = {};

        if (!this._data.payment) {
            errors.payment = 'Выберите способ оплаты';
        }

        if (!this._data.address.trim()) {
            errors.address = 'Введите адрес';
        }

        if (!this._data.email.trim()) {
            errors.email = 'Введите email';
        } else if (!this.isValidEmail(this._data.email)) {
            errors.email = 'Введите корректный email';
        }

        if (!this._data.phone.trim()) {
            errors.phone = 'Введите телефон';
        } else if (!this.isValidPhone(this._data.phone)) {
            errors.phone = 'Введите корректный телефон';
        }

        return errors;
    }

    isValid(): boolean {
        return Object.keys(this.validate()).length === 0;
    }

    clear(): void {
        const oldData = { ...this._data };
        this._data = {
            payment: null,
            email: '',
            phone: '',
            address: '',
        };

        if (JSON.stringify(oldData) !== JSON.stringify(this._data)) {
            this.emit('data:changed', this._data);
            this.emit('data:cleared');
        }
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