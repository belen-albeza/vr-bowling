var shallLaunch = false;
var ball = document.getElementById('ball');
var hand = document.getElementById('hand');
var handLock = document.getElementById('hand-lock');

var lastPosition = new CANNON.Vec3(0, 0, 0);
var currentPosition = new CANNON.Vec3(0, 0, 0);

function launch() {
    ball.removeAttribute('constraint');
    console.log('LAUnch!');
}

AFRAME.registerComponent('throwing-hand', {
    tick: function () {
        handLock.setAttribute('position', this.el.getAttribute('position'));

        if (shallLaunch) {
            shallLaunch = false;
            launch();
        }
    }
});

window.onload = function () {
    document.addEventListener('keydown', function (e) {
        if (e.keyCode === 32) {
            e.preventDefault();
            shallLaunch = true;
        }
    });
};
