import { IEvents } from "../base/Events.ts";
import { ensureElement } from "../../utils/utils";
import { IValidationResult } from "../../types";

export interface IContacts {
    formContacts: HTMLFormElement;
    inputAll: HTMLInputElement[];
    buttonSubmit: HTMLButtonElement;
    formErrors: HTMLElement;
    render(): HTMLElement;
    set valid(value: boolean);
    set errors(value: IValidationResult);
}

export class Contacts implements IContacts {
    formContacts: HTMLFormElement;
    inputAll: HTMLInputElement[];
    buttonSubmit: HTMLButtonElement;
    formErrors: HTMLElement;

    constructor(container: HTMLElement, protected events: IEvents) {
        this.formContacts = container as HTMLFormElement;
        this.inputAll = Array.from(this.formContacts.querySelectorAll('.form__input'));
        this.buttonSubmit = ensureElement<HTMLButtonElement>('.button', this.formContacts);
        this.formErrors = ensureElement<HTMLElement>('.form__errors', this.formContacts);

        this.inputAll.forEach(item => {
            item.addEventListener('input', (event) => {
                const target = event.target as HTMLInputElement;
                const field = target.name;
                const value = target.value;
                this.events.emit(`contacts:changeInput`, { field, value });
            });
        });

        this.formContacts.addEventListener('submit', (event: Event) => {
            event.preventDefault();
            this.events.emit('contacts:submit');
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
        return this.formContacts;
    }
}