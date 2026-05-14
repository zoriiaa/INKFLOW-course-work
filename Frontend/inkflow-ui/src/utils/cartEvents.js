export function notifyCartChanged() {
    window.dispatchEvent(new CustomEvent('inkflow-cart-changed'));
}
