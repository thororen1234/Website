export function getElement<T extends HTMLElement>(id: string): T | null {
    return document.getElementById(id) as T | null
}

export function onClick<T extends HTMLElement>(
    id: string,
    handler: (element: T, event: MouseEvent) => void,
): void {
    const element = getElement<T>(id)
    if (!element) return
    element.addEventListener('click', (event) => handler(element, event))
}

export function setAttribute<T extends HTMLElement>(
    id: string,
    name: string,
    value: string,
): void {
    const element = getElement<T>(id)
    if (element) element.setAttribute(name, value)
}

export function setRootAttribute(name: string, value: string): void {
    document.documentElement.setAttribute(name, value)
}

export function onEvent<T extends HTMLElement>(
    id: string,
    event: keyof HTMLElementEventMap,
    handler: (element: T, event: Event) => void,
): void {
    const element = getElement<T>(id)
    if (!element) return
    element.addEventListener(event, (event) => handler(element, event))
}

export function toggleClass<T extends HTMLElement>(
    id: string,
    className: string,
): void {
    const element = getElement<T>(id)
    if (element) element.classList.toggle(className)
    console.debug('[DOM] Toggled class:', className)
}
