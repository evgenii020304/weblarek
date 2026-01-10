import { IEvents } from "../base/Events.ts";

export interface IModal {
    open(): void;
    close(): void;
    render(): HTMLElement
}

export class Modal implements IModal {
    protected modalContainer: HTMLElement;
    protected closeButton: HTMLButtonElement;
    protected _content: HTMLElement;
    protected _pageWrapper: HTMLElement;

    constructor(container: HTMLElement, protected events: IEvents) {
        this.modalContainer = container;
        this.closeButton = container.querySelector('.modal__close')!;
        this._content = container.querySelector('.modal__content')!;
        this._pageWrapper = document.querySelector('.page__wrapper')!;

        this.closeButton.addEventListener('click', this.close.bind(this));
        this.modalContainer.addEventListener('click', this.close.bind(this));
        this.modalContainer.querySelector('.modal__container')!.addEventListener('click', event => event.stopPropagation());
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
            this._pageWrapper.classList.add('page__wrapper_locked');
        } else {
            this._pageWrapper.classList.remove('page__wrapper_locked');
        }
    }

    render(): HTMLElement {
        this._content;
        this.open();
        return this.modalContainer
    }
}