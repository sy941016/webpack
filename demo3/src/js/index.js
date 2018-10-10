import {cube} from './math.js';
require('../css/style.css');

if (process.env.NODE_ENV !== 'production') {
    console.log('Looks like we are in development mode!');
}

function component() {
    var element = document.createElement('pre');
    element.innerHTML = [
        'Hello webpack!',
        '5 cubed is equal to ' + cube(5)
    ].join('\n\n');

    return element;
}

document.body.appendChild(component());