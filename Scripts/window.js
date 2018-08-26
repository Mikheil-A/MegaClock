//These variables make sure (that) the window is right in the centre of the screen
var width = 550, height = 400;
var posX = (screen.width / 2) - (width / 2);
var posY = (screen.height / 2) - (height / 2);

window.onload = window.onresize = function () {
    window.resizeTo(width, height);
    window.moveTo(posX, posY);
}
