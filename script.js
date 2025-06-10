
let generateButton = document.getElementById('generate-chart');
let resetGenButton = document.getElementById('reset-chart-gen');


function updateBox() {
    let unit = document.getElementById('unit').value;
    let nature = document.getElementById('nature').value;
    let age = document.getElementById('age').value;
    let sex = document.querySelector('input[name="sex"]:checked').value.slice(0, 1);
    let avpu = determineAVPU();
    let positionSelect = determinePosition();
    let location = document.getElementById('location').value;
    let attendedBy = document.getElementById('bystanders').value;


    // Dispatch information
    let dispatchOutput = `${unit} was dispatched to a ${nature} for a ${age} yo${sex}.`
    document.getElementById('dispatch-output').innerHTML = dispatchOutput;

    // Scene description
    let sceneOutput = `On arrival, the patient was ${avpu} `;
    let positionOutput = `${positionSelect}`;
    let locationOutput = ' ' + location;
    let attendedByOutput = '';

    if (attendedBy) {
        attendedByOutput = ' attended by ' + attendedBy;
    }



    document.getElementById('scene-output').innerHTML = sceneOutput + positionOutput + locationOutput + attendedByOutput + ".";
}

function resetBox() {
    document.getElementById('chart-gen-output').innerHTML = "Chart has been reset..";
}

function determineAVPU() {
    let avpuOutput = "";
    let avpu = document.querySelector('input[name="AVPU"]:checked').value;
    const orientation = {
        person: document.getElementById('person-orientation').checked,
        place: document.getElementById('place-orientation').checked,
        time: document.getElementById('time-orientation').checked,
        event: document.getElementById('event-orientation').checked
    };
    let orientationTrue = [];

    let orientationCount = 0
    Object.keys(orientation).forEach(question => {
        if (orientation[question]) {
            orientationCount++;
            orientationTrue.push(question);
        };
    });

    // Patient is alert
    if (avpu === 'alert') {
        if (orientationCount === 4) {
            avpuOutput = 'awake, alert, and oriented x 4';
        } else if (orientationCount === 3) {     
            avpuOutput = 'awake, alert, and oriented to ' + orientationTrue[0] + ", " 
            + orientationTrue[1] + ", and " + orientationTrue[2];
        } else if (orientationCount === 2) {
            avpuOutput = 'awake, alert, and oriented to ' + orientationTrue[0] + " and " 
            + orientationTrue[1];
        } else if (orientationCount === 1) {
            avpuOutput = 'awake, alert, and oriented to ' + orientationTrue[0];
        }

    } else if (avpu === 'verbal') {  // Patient is responsive to verbal
        avpuOutput = 'responsive to verbal stimuli';
    } else if (avpu === 'painful') {  // Patient is responsive to pain
        avpuOutput = 'responsive to painful stimuli';
    } else if (avpu === 'unresponsive') {
        avpuOutput = 'unresponsive';
    }

    return avpuOutput
}

    function determinePosition() {
        let positionSelect = document.querySelector('input[name="position"]:checked').value;
        if (positionSelect === 'sitting-position') {
            return 'sitting';
        } else if (positionSelect === 'standing-position') {
            return 'standing';
        } else if (positionSelect === 'supine-position') {
            return 'supine';
        } else if (positionSelect === 'L-Lateral-position') {
            return 'left-lateral recumbant position';
        } else if (positionSelect === 'L-Lateral-position') {
            return 'right-lateral recumbant position';
        }
    }

generateButton.onclick = updateBox;
resetGenButton.onclick = resetBox;