import { IEvents } from "../base/Events.ts";
import { ensureElement, cloneTemplate } from "../../utils/utils";
import { IValidationResult } from "../../types";

export interface IOrder {
    formOrder: HTMLFormElement;
    buttonAll: HTMLButtonElement[];
    paymentSelection: string;
    formErrors: HTMLElement;
    render(): HTMLElement;
    set valid(value: boolean);
    set errors(value: IValidationResult);
}

export class Order implements IOrder {
    formOrder: HTMLFormElement;
    buttonAll: HTMLButtonElement[];
    buttonSubmit: HTMLButtonElement;
    formErrors: HTMLElement;

    constructor(container: HTMLTemplateElement, protected events: IEvents) {
        this.formOrder = cloneTemplate<HTMLFormElement>(container);
        this.buttonAll = Array.from(this.formOrder.querySelectorAll('.button_alt')) as HTMLButtonElement[];
        this.buttonSubmit = ensureElement<HTMLButtonElement>('.order__button', this.formOrder);
        this.formErrors = ensureElement<HTMLElement>('.form__errors', this.formOrder);

        this.buttonAll.forEach(item => {
            item.addEventListener('click', () => {
                this.paymentSelection = item.name;
                events.emit('order:paymentSelection', item);
            });
        });

        this.formOrder.addEventListener('input', (event: Event) => {
            const target = event.target as HTMLInputElement;
            const field = target.name;
            const value = target.value;
            this.events.emit(`order:changeAddress`, { field, value });
        });

        this.formOrder.addEventListener('submit', (event: Event) => {
            event.preventDefault();
            this.events.emit('order:submit');
        });
    }

    set paymentSelection(paymentMethod: string) {
        this.buttonAll.forEach(item => {
            item.classList.toggle('button_alt-active', item.name === paymentMethod);
        });
    }

    set valid(value: boolean) {
        this.buttonSubmit.disabled = !value;
    }

    set errors(value: IValidationResult) {
        const errorMessages = Object.values(value).filter(Boolean);
        this.formErrors.textContent = errorMessages.join('. ');
    }

    render() {
        return this.formOrder;
    }
}