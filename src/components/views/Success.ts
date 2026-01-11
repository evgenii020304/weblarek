import { IEvents } from "../base/Events.ts";
import { ensureElement } from "../../utils/utils";

export interface ISuccess {
    success: HTMLElement;
    description: HTMLElement;
    button: HTMLButtonElement;
    render(total: number): HTMLElement;
}

export class Success implements ISuccess {
    success: HTMLElement;
    description: HTMLElement;
    button: HTMLButtonElement;

    constructor(container: HTMLElement, protected events: IEvents) {
        this.success = container;

        this.description = ensureElement<HTMLElement>('.order-success__description', this.success);
        this.button = ensureElement<HTMLButtonElement>('.order-success__close', this.success);

        this.button.addEventListener('click', () => {
            events.emit('success:close');
        });
    }

    render(total: number) {
        this.description.textContent = `Списано ${total} синапсов`;
        return this.success;
    }
}