var granimInstance = new Granim({
    element: '#canvas-interactive',
    name: 'interactive-gradient',
    elToSetClassOn: '.canvas-interactive-wrapper',
    direction: 'diagonal',
    isPausedWhenNotInView: true,
    stateTransitionSpeed: 300,
    states : {
        "default-state": {
            gradients: [
                ['#0F2027', '#203A43'],
                ['#141E30', '#243B55']
            ],
            transitionSpeed: 10000
        },
        "work": {
            gradients: [
                ['#e52d27', '#b31217'],
                ['#e43a15', '#e65245']
            ],
            transitionSpeed: 3000
        },
        "shortRest": {
            gradients: [
                ['#F7971E', '#FFD200'],
                ['#F2C94C', '#F2994A']
            ],
            transitionSpeed: 3000
        },
        "longRest": {
            gradients: [
                ['#DCE35B', '#45B649'],
                ['#56ab2f', '#a8e063']
            ],
            transitionSpeed: 3000
        }
    }
});

