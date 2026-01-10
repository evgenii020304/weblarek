import { IEvents } from "../base/Events.ts";

export interface IContacts {
    formContacts: HTMLFormElement;
    inputAll: HTMLInputElement[];
    buttonSubmit: HTMLButtonElement;
    formErrors: HTMLElement;
    render(): HTMLElement;
}

export class Contacts implements IContacts {
    formContacts: HTMLFormElement;
    inputAll: HTMLInputElement[];
    buttonSubmit: HTMLButtonElement;
    formErrors: HTMLElement;

    constructor(container: HTMLElement, protected events: IEvents) {
        this.formContacts = container.querySelector('.form')!;
        this.inputAll = Array.from(this.formContacts.querySelectorAll('.form__input'));
        this.buttonSubmit = this.formContacts.querySelector('.button')!;
        this.formErrors = this.formContacts.querySelector('.form__errors')!;

        console.log('Contacts form initialized:', {
            form: !!this.formContacts,
            inputs: this.inputAll.length,
            button: !!this.buttonSubmit,
            errors: !!this.formErrors
        });

        this.inputAll.forEach(item => {
            item.addEventListener('input', (event) => {
                const target = event.target as HTMLInputElement;
                const field = target.name;
                const value = target.value;
                console.log(`Contacts input: ${field} = ${value}`);
                this.events.emit(`contacts:changeInput`, { field, value });
            })
        })

        this.formContacts.addEventListener('submit', (event: Event) => {
            event.preventDefault();
            console.log('Contacts form submitted');

            if (!this.buttonSubmit.disabled) {
                this.events.emit('contacts:submit');
            } else {
                console.log('Кнопка заблокирована, форма не отправляется');
            }
        });

        this.buttonSubmit.addEventListener('click', (event: Event) => {
            event.preventDefault();
            console.log('Contacts button clicked');

            if (!this.buttonSubmit.disabled) {
                this.events.emit('contacts:submit');
            }
        });
    }

    set valid(value: boolean) {
        console.log('Contacts valid set to:', value);
        this.buttonSubmit.disabled = !value;
    }

    render() {
        console.log('Contacts render called');
        return this.formContacts;
    }
}