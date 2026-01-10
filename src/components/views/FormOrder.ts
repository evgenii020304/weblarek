import { IEvents } from "../base/Events.ts";

export interface IOrder {
    formOrder: HTMLFormElement;
    buttonAll: HTMLButtonElement[];
    paymentSelection: String;
    formErrors: HTMLElement;
    render(): HTMLElement;
}

export class Order implements IOrder {
    formOrder: HTMLFormElement;
    buttonAll: HTMLButtonElement[];
    buttonSubmit: HTMLButtonElement;
    formErrors: HTMLElement;

    constructor(container: HTMLTemplateElement, protected events: IEvents) {
        this.formOrder = container.content.querySelector('.form')!.cloneNode(true) as HTMLFormElement;
        this.buttonAll = Array.from(this.formOrder.querySelectorAll('.button_alt'));
        this.buttonSubmit = this.formOrder.querySelector('.order__button')!;
        this.formErrors = this.formOrder.querySelector('.form__errors')!;

        this.buttonAll.forEach(item => {
            item.addEventListener('click', () => {
                this.paymentSelection = item.name;
                events.emit('order:paymentSelection', item);
                this.validateForm();
            });
        });

        this.formOrder.addEventListener('input', (event: Event) => {
            const target = event.target as HTMLInputElement;
            const field = target.name;
            const value = target.value;
            this.events.emit(`order:changeAddress`, { field, value });
            this.validateForm();
        });

        this.formOrder.addEventListener('submit', (event: Event) => {
            event.preventDefault();
            this.events.emit('order:submit');
        });
    }

    private validateForm(): void {
        const addressInput = this.formOrder.querySelector('input[name="address"]') as HTMLInputElement;
        const paymentSelected = this.buttonAll.some(btn => btn.classList.contains('button_alt-active'));
        const addressFilled = addressInput?.value.trim().length > 0;

        this.buttonSubmit.disabled = !(paymentSelected && addressFilled);
    }

    set paymentSelection(paymentMethod: string) {
        this.buttonAll.forEach(item => {
            item.classList.toggle('button_alt-active', item.name === paymentMethod);
        });
        this.validateForm();
    }

    set valid(value: boolean) {
        this.buttonSubmit.disabled = !value;
    }

    render() {
        return this.formOrder;
    }
}