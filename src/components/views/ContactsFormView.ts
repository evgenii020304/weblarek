import { Component } from '../base/Component.ts';
import { IValidationResult } from '../../types';

export interface IContactsFormData {
    email?: string;
    phone?: string;
    errors?: IValidationResult;
}

export class ContactsFormView extends Component<IContactsFormData> {
    protected _emailInput: HTMLInputElement;
    protected _phoneInput: HTMLInputElement;
    protected _submitButton: HTMLButtonElement;
    protected _errorsContainer: HTMLElement;

    constructor(container: HTMLElement) {
        super(container);

        this._emailInput = container.querySelector('input[name="email"]')!;
        this._phoneInput = container.querySelector('input[name="phone"]')!;
        this._submitButton = container.querySelector('button[type="submit"]')!;
        this._errorsContainer = container.querySelector('.form__errors')!;

        this._emailInput.addEventListener('input', () => this.validateForm());
        this._phoneInput.addEventListener('input', () => this.validateForm());
    }

    set onSubmit(callback: () => void) {
        (this.container as HTMLFormElement).addEventListener('submit', (event) => {
            event.preventDefault();
            if (this.validateForm()) {
                callback();
            }
        });
    }

    getFormData() {
        return {
            email: this._emailInput.value.trim(),
            phone: this._phoneInput.value.trim()
        };
    }

    private validateForm(): boolean {
        const email = this._emailInput.value.trim();
        const phone = this._phoneInput.value.trim();

        const emailValid = this.isValidEmail(email);
        const phoneValid = this.isValidPhone(phone);

        this.setDisabled(this._submitButton, !(emailValid && phoneValid));
        return emailValid && phoneValid;
    }

    private isValidEmail(email: string): boolean {
        return email.includes('@') && email.includes('.');
    }

    private isValidPhone(phone: string): boolean {
        const digits = phone.replace(/\D/g, '');
        return digits.length >= 10;
    }

    render(data?: Partial<IContactsFormData>): HTMLElement {
        if (data?.email) {
            this._emailInput.value = data.email;
        }
        if (data?.phone) {
            this._phoneInput.value = data.phone;
        }
        if (data?.errors) {
            this.renderErrors(data.errors);
        }
        this.validateForm();
        return this.container;
    }

    private renderErrors(errors: IValidationResult) {
        const errorMessages = [];
        if (errors.email) errorMessages.push(errors.email);
        if (errors.phone) errorMessages.push(errors.phone);

        if (errorMessages.length > 0) {
            this.setText(this._errorsContainer, errorMessages.join(', '));
        } else {
            this.setText(this._errorsContainer, '');
        }
    }
}