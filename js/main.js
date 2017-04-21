var shallLaunch = false;
var hasLaunched = false;
var ball = document.getElementById('ball');
var hand = document.getElementById('right');
var handLock = document.getElementById('hand-lock');

var lastPosition = new CANNON.Vec3(0, 0, 0);
var currentPosition = new CANNON.Vec3(0, 0, 0);

function launch() {
    hasLaunched = true;
    let delta = 1/60.0;
    let velocity = currentPosition.vsub(lastPosition).scale(1/delta).scale(10);
    console.log(velocity);
    ball.body.applyLocalImpulse(velocity, new CANNON.Vec3(0, 0, 0));
}

AFRAME.registerComponent('throwing-hand', {
    dependencies: ['dynamic-body'],
    tick: function () {
        // handLock.setAttribute('position', this.el.getAttribute('position'));
        let position = this.el.getAttribute('position');

        if (!hasLaunched && ball.body) {
            ball.body.velocity.set(0, 0, 0);
            ball.body.angularVelocity.set(0, 0, 0);
            ball.body.position.set(position.x, position.y, position.z);
        }

        if (shallLaunch && ball.body) {
            shallLaunch = false;
            currentPosition.copy(position);
            launch();
        }

        lastPosition.copy(position);
    }
});

window.onload = function () {
    document.addEventListener('keydown', function (e) {
        if (e.keyCode === 32) {
            e.preventDefault();
            if (!hasLaunched) {
                shallLaunch = true;
            }
        }
    });
};
