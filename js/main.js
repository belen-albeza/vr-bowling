var shallLaunch = false;
var hasLaunched = false;
var ball;
var hand;
var lastPosition = new CANNON.Vec3(0, 0, 0);
var currentPosition = new CANNON.Vec3(0, 0, 0);
var hasPrepared = false;

function launch() {
    hasLaunched = true;
    hasPrepared = false;
    let delta = 1/60.0;
    let velocity = currentPosition.vsub(lastPosition).scale(1/delta).scale(50);
    console.log(velocity);
    ball.body.applyLocalImpulse(velocity, new CANNON.Vec3(0, 0, 0));
}

AFRAME.registerSystem('bowling', {
});

AFRAME.registerComponent('throwing-hand', {
    dependencies: ['dynamic-body', 'vive-controls'],
    init: function () {
        this.el.addEventListener('triggerdown', function (e) {
            hasPrepared = true;
            console.log('triggerdown');
        });
        this.el.addEventListener('triggerup', function (e) {
            if (!hasLaunched && hasPrepared) { shallLaunch = true};
            console.log('triggerup');
        });
        this.el.addEventListener('menuup', function (e) { // restart
            hasLaunched = false;
            hasPrepared = false;
            shallLaunch = false;
            lastPosition = new CANNON.Vec3(0, 0, 0);
            currentPosition = new CANNON.Vec3(0, 0, 0);
        });
    },
    tick: function () {
        // handLock.setAttribute('position', this.el.getAttribute('position'));
        let position = this.el.getAttribute('position');

        if (!hasLaunched && ball && ball.body) {
            ball.body.velocity.set(0, 0, 0);
            ball.body.angularVelocity.set(0, 0, 0);
            ball.body.quaternion.set(0, 0, 0, 1);
            ball.body.position.set(position.x, position.y, position.z);
        }

        if (shallLaunch && ball && ball.body) {
            shallLaunch = false;
            currentPosition.copy(position);
            launch();
        }

        lastPosition.copy(position);
    }
});

window.onload = function () {
    ball = document.getElementById('ball');
    hand = document.getElementById('right');
};
