import { IEvents } from "../base/Events.ts";
import { ensureElement } from "../../utils/utils";

export interface IModal {
    open(): void;
    close(): void;
    render(): HTMLElement;
    set content(value: HTMLElement | null);
    get content(): HTMLElement;
    set locked(value: boolean);
}

export class Modal implements IModal {
    protected modalContainer: HTMLElement;
    protected closeButton: HTMLButtonElement;
    protected _content: HTMLElement;
    protected _modalContainer: HTMLElement;

    constructor(container: HTMLElement, protected events: IEvents) {
        this.modalContainer = container;

        this._modalContainer = ensureElement<HTMLElement>('.modal__container', this.modalContainer);
        this.closeButton = ensureElement<HTMLButtonElement>('.modal__close', this.modalContainer);
        this._content = ensureElement<HTMLElement>('.modal__content', this.modalContainer);

        this.closeButton.addEventListener('click', () => this.close());

        this.modalContainer.addEventListener('click', (event: MouseEvent) => {
            if (event.target === this.modalContainer) {
                this.close();
            }
        });
    }

    set content(value: HTMLElement | null) {
        if (value === null) {
            this._content.innerHTML = '';
        } else {
            this._content.replaceChildren(value);
        }
    }

    get content(): HTMLElement {
        return this._content;
    }

    open() {
        this.modalContainer.classList.add('modal_active');
        this.events.emit('modal:open');
    }

    close() {
        this.modalContainer.classList.remove('modal_active');
        this.content = null;
        this.events.emit('modal:close');
    }

    set locked(value: boolean) {
        if (value) {
            document.body.classList.add('page__wrapper_locked');
        } else {
            document.body.classList.remove('page__wrapper_locked');
        }
    }

    render(): HTMLElement {
        this.open();
        return this.modalContainer;
    }
}