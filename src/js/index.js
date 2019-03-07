require('../css/style.css');

function component() {
    let element = document.createElement('pre');
    element.innerHTML = 'Hello webpack!'
    return element;
}
$('.demo').append(component());
