import { Component } from '../base/Component.ts';
import { TPayment, IValidationResult } from '../../types';

export interface IOrderFormData {
    address?: string;
    payment?: TPayment;
    errors?: IValidationResult;
}

export class OrderFormView extends Component<IOrderFormData> {
    protected _cardButton: HTMLButtonElement;
    protected _cashButton: HTMLButtonElement;
    protected _addressInput: HTMLInputElement;
    protected _submitButton: HTMLButtonElement;
    protected _errorsContainer: HTMLElement;
    protected _selectedPayment: TPayment | null = null;

    constructor(container: HTMLElement) {
        super(container);

        this._cardButton = container.querySelector('button[name="card"]')!;
        this._cashButton = container.querySelector('button[name="cash"]')!;
        this._addressInput = container.querySelector('input[name="address"]')!;
        this._submitButton = container.querySelector('button[type="submit"]')!;
        this._errorsContainer = container.querySelector('.form__errors')!;

        this._cardButton.addEventListener('click', () => this.selectPayment('card'));
        this._cashButton.addEventListener('click', () => this.selectPayment('cash'));
        this._addressInput.addEventListener('input', () => this.validateForm());
    }

    set onSubmit(callback: () => void) {
        (this.container as HTMLFormElement).addEventListener('submit', (event) => {
            event.preventDefault();
            if (this._selectedPayment && this._addressInput.value.trim()) {
                callback();
            }
        });
    }

    getFormData() {
        return {
            payment: this._selectedPayment,
            address: this._addressInput.value.trim()
        };
    }

    private selectPayment(payment: TPayment) {
        this._selectedPayment = payment;
        this._cardButton.classList.toggle('button_alt-active', payment === 'card');
        this._cashButton.classList.toggle('button_alt-active', payment === 'cash');
        this.validateForm();
    }

    private validateForm() {
        const isValid = this._selectedPayment !== null &&
            this._addressInput.value.trim().length > 0;
        this.setDisabled(this._submitButton, !isValid);
    }

    render(data?: Partial<IOrderFormData>): HTMLElement {
        if (data?.payment) {
            this.selectPayment(data.payment);
        }
        if (data?.address) {
            this._addressInput.value = data.address;
        }
        if (data?.errors) {
            this.renderErrors(data.errors);
        }
        this.validateForm();
        return this.container;
    }

    private renderErrors(errors: IValidationResult) {
        const errorMessages = [];
        if (errors.payment) errorMessages.push(errors.payment);
        if (errors.address) errorMessages.push(errors.address);

        if (errorMessages.length > 0) {
            this.setText(this._errorsContainer, errorMessages.join(', '));
        } else {
            this.setText(this._errorsContainer, '');
        }
    }
}