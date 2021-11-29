var elementBool = true;
var active = false;

let element = document.getElementById('ml2');
let elementStyle = window.getComputedStyle(element);
let elementDisplay = elementStyle.getPropertyValue('display');

const spans = document.querySelectorAll('.word span');

spans.forEach((span) => {
    span.addEventListener('click', (e) => {
        e.target.classList.add('active');
    });
    span.addEventListener('animationend', (e) => {
        e.target.classList.remove('active');
    });
});

// Wrap every letter in a span
var textWrapper = document.querySelector('#ml2');
textWrapper.innerHTML = textWrapper.textContent.replace(/\S/g, "<span class='letter'>$&</span>");

var ml4 = {};
ml4.opacityIn = [0, 1];
ml4.scaleIn = [0.2, 1];
ml4.scaleOut = 3;
ml4.durationIn = 2500;

function animations() {
    if (elementBool) {
        element = document.getElementById('ml2');
        elementStyle = window.getComputedStyle(element);
        elementDisplay = elementStyle.getPropertyValue('display');
    }

    if (elementDisplay === 'block' && elementBool == true) {
        active = true;
        elementBool = false;
    }

    if (active) {
        anime.timeline({ loop: false })
            .add({
                targets: '#ml2 .letter',
                scale: [4, 1],
                opacity: [0, 1],
                translateZ: 0,
                easing: "easeOutExpo",
                duration: 950,
                delay: (el, i) => 70 * i
            });

        setTimeout(function () {
            anime.timeline({ loop: false })
                .add({
                    targets: '#ml4 .letters-1',
                    opacity: ml4.opacityIn,
                    scale: ml4.scaleIn,
                    duration: ml4.durationIn
                });
        }, 2000);

        active = false;
    }
}

setInterval('animations()', 100);

