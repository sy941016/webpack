import {cube} from './math.js';
require('../css/style.css');

if (process.env.NODE_ENV !== 'production') {
    console.log('Looks like we are in development mode!');
}

function component() {
    var element = document.createElement('pre');
    element.innerHTML = [
        'Hello webpack!',
        '94 cubed is equal to ' + cube(94)
    ].join('\n\n');

    return element;
}
document.body.appendChild(component());