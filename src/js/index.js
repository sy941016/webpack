require('../css/style.css');
let h_height = $('.header').height();
let f_height = $('.footer').height();
let changeDivHeight = function () {
    let wh = $(window).height();
    let mh = wh - h_height - f_height;
    $('.box').css('min-height', mh);
    console.log(mh)
}
changeDivHeight();
