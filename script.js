
let generateButton = document.getElementById('generate-chart');
let resetGenButton = document.getElementById('reset-chart-gen');


function updateBox() {
    let unit = document.getElementById('unit').value;
    let nature = document.getElementById('nature').value;
    let age = document.getElementById('age').value;
    let sex = document.querySelector('input[name="sex"]:checked').value.slice(0, 1);
    let AVPU = determineAVPU();


    // Dispatch information
    let dispatchOutput = `${unit} was dispatched to a ${nature} for a ${age} yo${sex}.`
    document.getElementById('dispatch-output').innerHTML = dispatchOutput;

    // Scene description
    let sceneOutput = `On arrival, the patient was ${AVPU}.`
    document.getElementById('scene-output').innerHTML = sceneOutput;
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
    const orientationTrue = [];

    let orientationCount = 0
    Object.keys(orientation).forEach(question => {if (question) {orientationCount++}});
    
    console.log(orientationCount);

    // Patient is alert
    if (avpu === 'alert') {
        if (orientationCount === 4) {
            avpuOutput = 'awake, alert, and oriented x 4';
        } else if (orientationCount === 3) {     
            avpuOutput = 'awake, alert, and oriented to '
        }





    } else if (avpu === 'verbal') {  // Patient is responsive to verbal
        avpuOutput = 'responsive to verbal stimuli';
    } else if (avpu === 'painful') {  // Patient is responsive to pain
        avpuOutput = 'responsive to painful stimuli';
    } else if (avpu === 'unresponsive') {
        avpuOutput = 'unresponsive'
    }

    return avpuOutput
    

}

generateButton.onclick = updateBox;
resetGenButton.onclick = resetBox;