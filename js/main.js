var shallThrow = false;
var hasThrown = false;
var ball;
var lastPosition = new CANNON.Vec3(0, 0, 0);
var currentPosition = new CANNON.Vec3(0, 0, 0);
var hasPrepared = false;

function throwBall(delta) {
    hasThrown = true;
    hasPrepared = false;
    let velocity = currentPosition.vsub(lastPosition).scale(1/delta);
    ball.body.applyLocalImpulse(velocity.scale(50), new CANNON.Vec3(0, 0, 0));
}

AFRAME.registerComponent('throwing-hand', {
    dependencies: ['dynamic-body', 'vive-controls'],
    init: function () {
        this.el.addEventListener('triggerdown', function (e) {
            hasPrepared = true;
            console.log('triggerdown');
        });
        this.el.addEventListener('triggerup', function (e) {
            if (!hasThrown && hasPrepared) { shallThrow = true};
            console.log('triggerup');
        });
        this.el.addEventListener('menuup', function (e) { // restart
            hasThrown = false;
            hasPrepared = false;
            shallThrow = false;
            lastPosition = new CANNON.Vec3(0, 0, 0);
            currentPosition = new CANNON.Vec3(0, 0, 0);
        });

    },
    tick: function (uptime, delta) {
        let position = this.el.getAttribute('position');

        if (!hasThrown && ball && ball.body) {
            ball.body.velocity.set(0, 0, 0);
            ball.body.angularVelocity.set(0, 0, 0);
            ball.body.quaternion.set(0, 0, 0, 1);
            ball.body.position.set(position.x, position.y, position.z);
        }

        if (shallThrow && ball && ball.body) {
            shallThrow = false;
            currentPosition.copy(position);
            throwBall(delta / 1000.0);
        }

        lastPosition.copy(position);
    }
});

window.onload = function () {
    ball = document.getElementById('ball');

    //
    // make the ball not bounce when colliding with the ground or the bumpers
    //

    let world = document.querySelector('a-scene').systems['physics'].world;
    let groundMaterial = document.querySelector('[static-body]').body.material;
    let laneObjects = document.querySelectorAll(['static-body']);
    for (let i = 0; i < laneObjects.length; i++) {
        laneObjects[i].body.material = groundMaterial;
    }

    // create a contact material: ball vs ground/bumpers
    let contactMaterial = new CANNON.ContactMaterial(
        groundMaterial, ball.body.material, { restitution: 0.001 });
    world.addContactMaterial(contactMaterial);
};
