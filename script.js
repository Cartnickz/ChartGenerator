
let generateButton = document.getElementById('generate-chart');
let resetGenButton = document.getElementById('reset-chart-gen');

function updateBox() {
    // Reset output box
    let outputLines = document.getElementsByClassName('gen-output');
    for (i = 0; i < outputLines.length; i++) {
        outputLines[i].innerHTML = '';
    }

    // Update reset button
    resetGenButton.innerHTML = "Reset";

    // Dispatch information
    let unit = seekInput(document.getElementById('unit'));
    let nature = seekInput(document.getElementById('nature'));
    let age = seekInput(document.getElementById('age'));
    let sex = '';

    // Sex
    let sexInput = document.querySelector('input[name="sex"]:checked')
    if (sexInput) {
        if (sexInput.value === 'male') {
            sex = 'm'
        } else if (sexInput.value === 'female') {
            sex = 'f'
        } else {
            sex = ''
        }
    } else {
        document.getElementById('error-output').innerHTML += "Missing input: " + 'sex' + "<br />"
    }

    let pronouns = []

    if (sex === 'm') {
        pronouns = ['he', 'him', 'his', 'his', 's'];
    } else if (sex === 'f') {
        pronouns = ['she', 'her', 'her', 'hers', 's'];
    } else {
        pronouns = ['they', 'them', 'their', 'theirs', ''];
    }
    
    let dispatchOutput = `${unit} was dispatched to a ${nature} for a ${age} yo${sex}.`
    document.getElementById('dispatch-output').innerHTML = dispatchOutput;

    // Scene description
    let avpu = determineAVPU();
    let positionSelect = determinePosition();
    let location = seekInput(document.getElementById('location'));
    let attendedBy = document.getElementById('bystanders').value;

    let sceneOutput = `On arrival, the patient was ${avpu} `;
    let positionOutput = `${positionSelect}`;
    let locationOutput = ' ' + location;
    let attendedByOutput = '';

    if (attendedBy) {
        attendedByOutput = ' attended by ' + attendedBy;
    }

    document.getElementById('scene-output').innerHTML = sceneOutput + positionOutput 
    + locationOutput + attendedByOutput + ".";

    // ALS
    let alsOutput = getALSStatus();
    document.getElementById('als-output').innerHTML = alsOutput;
    
    // Transport
    let transportOutput = getTransportOutput(unit, pronouns);
    document.getElementById('transport-output').innerHTML = transportOutput;


}


function resetBox() {
    let outputLines = document.getElementsByClassName('gen-output');
    for (i = 0; i < outputLines.length; i++) {
        outputLines[i].innerHTML = '';
    }
    outputLines[0].innerHTML = 'No Chart Generated Yet..'

    resetGenButton.innerHTML = "Chart has been reset..";
}


function seekInput(input) {
    if (input.value) {
        return input.value
    } else {
        document.getElementById('error-output').innerHTML += "Missing input: " + input.name + "<br />";
    }
}


function rotateButton(button, names) {
    let currentIndex = names.indexOf(button.innerHTML);
    if (currentIndex !== -1) {
        // get length of list
        let length = names.length;
        // increment index (unless at end of array, then start over)
        if (currentIndex + 1 === length) {
            button.innerHTML = names[0];
        } else {
            button.innerHTML = names[currentIndex + 1];
        }
    } else {
        document.getElementById('error-output').innerHTML += "Button value not in array: " + button.id + "<br />";
    }
}


function determineAVPU() {
    let avpuOutput = "";

    let avpuInput = document.querySelector('input[name="AVPU"]:checked');

    if (avpuInput) {
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
            } else if (orientationCount === 0) {
                avpuOutput = 'awake, alert, but not oriented to person, place, event, or time';
            }

        } else if (avpu === 'verbal') {  // Patient is responsive to verbal
            avpuOutput = 'responsive to verbal stimuli';
        } else if (avpu === 'painful') {  // Patient is responsive to pain
            avpuOutput = 'responsive to painful stimuli';
        } else if (avpu === 'unresponsive') {
            avpuOutput = 'unresponsive';
        }
        return avpuOutput
    } else {
        document.getElementById('error-output').innerHTML += 'Missing input: AVPU<br />';
    }


}


function determinePosition() {
    let positionSelect = document.querySelector('input[name="position"]:checked');
    
    if (positionSelect) {
        if (positionSelect.value === 'sitting-position') {
            return 'sitting';
        } else if (positionSelect.value === 'standing-position') {
            return 'standing';
        } else if (positionSelect.value === 'supine-position') {
            return 'supine';
        } else if (positionSelect.value === 'L-Lateral-position') {
            return 'left-lateral recumbant position';
        } else if (positionSelect.value === 'L-Lateral-position') {
            return 'right-lateral recumbant position';
        }
    } else {
        document.getElementById('error-output').innerHTML += "Missing input: position<br />";
    }


}


function getALSStatus() {
    let ALSSelect = document.querySelector('input[name="ALS"]:checked');

    if (ALSSelect) {
        if (ALSSelect.value === 'not-requested') {
            return ''
        } else if (ALSSelect.value === 'not-available') {
            return 'ALS was requested but not available per headquarters.'
        } else if (ALSSelect.value === 'proximity') {
            return 'ALS was cancelled due to proximity.'
        } else if (ALSSelect.value === 'snn') {
            return 'ALS was recalled; services were not needed.'
        } else if (ALSSelect.value === 'als-triage') {
            return 'ALS arrived on scene, assessed the patient, and triaged patient care to BLS.'
        } else if (ALSSelect.value === 'one-treat') {
            return 'ALS arrived on scene. BLS assisted one ALS provider in providing patient care.'
        } else if (ALSSelect.value === 'two-treat') {
            return 'ALS arrived on scene. BLS assisted two ALS providers in providing patient care.'
        }
    } else {
        document.getElementById('error-output').innerHTML += "Missing input: ALS disposition<br />";
    }
}


function getTransportOutput(unit, pronouns) {
    let transportDecision = document.querySelector('input[name="transport-decision"]:checked');
    let transportMethod = document.querySelector('input[name="transport-method"]:checked');
    let destination = seekInput(document.getElementById('destination'));
    let bed = seekInput(document.getElementById('bed'));
    let rnName = " " + seekInput(document.getElementById('rn-name'));
    let transportOutput = ''

    if (transportDecision) {
        if (transportDecision.value === 'rma') {  // RMA
            return `The patient was recommended transport to the hospital. `
            + `The patient refused. Attempts were made to convince the patient to go to the hospital. ` 
            + `The patient was made aware of the limitations of a pre-hospital assessment and the risks of refusing further care and evaluation. `
            + `Patient repeated that ${pronouns[0]} did not want to go to the hospital and ${pronouns[0]} signed AMA. `
            + '<br /><br />'
            + `The patient was advised to call back at anytime if ${pronouns[0]} change${pronouns[4]} ${pronouns[2]} mind or if ${pronouns[2]} condition worsens. `
            + '<br /><br />'
            + `${unit} cleared RMA/AMA.`
        } else {  // Transport
            if (!transportMethod) {
                document.getElementById('error-output').innerHTML += 'Missing input: transport method<br />';
            } else {
                // Assisted to Stretcher
                if (transportMethod.value === 'assisted') {
                    transportOutput += 'The patient was assisted to the stretcher and secured using all straps and both side rails. '
                    + 'The stretcher was loaded into the ambulance and secured.'
                // Stairchair to Stretcher
                } else if (transportMethod.value === 'stairchair') {
                    transportOutput += 'The patient was carried to the stretcher using a stairchair and secured using all straps and both side rails. '
                    + 'The stretcher was loaded into the ambulance and secured.'
                // Reeves to Stretcher
                } else if (transportMethod.value === 'reeves') {
                    transportOutput += 'The patient was carried to the stretcher using a reeves and secured using all straps and both side rails. '
                    + 'The stretcher was loaded into the ambulance and secured.'
                }

                // en route
                transportOutput += `<br /><br />En route to ${destination}, the patient was continuously monitored and reassessed. The patient had no new complaints.`

                // at destination
                transportOutput += `<br /><br />At ${destination}, the patient was transferred to ${bed} without incident. Both side rails were raised. Patient care was transferred to ${destination} RN${rnName} with report.`

                return transportOutput
            
            }
        }

    } else {
        document.getElementById('error-output').innerHTML += "Missing input: transport decision"
    }
}





// BUTTONS ------------------------------------------------------------
// Skin Condition Buttons 
document.getElementById('skin-temperature').onclick = () => 
    rotateButton(document.getElementById('skin-temperature'), ['Normal Temperature', 'Hot', 'Cool']);
document.getElementById('skin-color').onclick = () => 
    rotateButton(document.getElementById('skin-color'), ['Normal Color', 'Pale', 'Cyanotic', 'Jaundiced']);
document.getElementById('skin-moisture').onclick = () => 
    rotateButton(document.getElementById('skin-moisture'), ['Normal Moisture', 'Diaphoretic']);
document.getElementById('skin-moisture').onclick = () => 
    rotateButton(document.getElementById('skin-moisture'), ['Normal Moisture', 'Diaphoretic']);

// Radial Pulses Buttons
document.getElementById('radial-strength').onclick = () => 
    rotateButton(document.getElementById('radial-strength'), ['Strong', 'Weak', 'Bounding']);
document.getElementById('radial-regularity').onclick = () => 
    rotateButton(document.getElementById('radial-regularity'), ['Regularly Regular', 'Regularly Irregular ', 'Irregularly Irregular']);
document.getElementById('radial-rate').onclick = () => 
    rotateButton(document.getElementById('radial-rate'), ['Normal Rate', 'Bradycardic', 'Tachycardic']);
document.getElementById('radial-equal').onclick = () => 
    rotateButton(document.getElementById('radial-equal'), ['Equal Bilaterally', 'Not Equal Bilaterally']);

// Respiration Buttons
document.getElementById('respiration-rate').onclick = () => 
    rotateButton(document.getElementById('respiration-rate'), ['Regular Rate', 'Slow', 'Rapid']);
document.getElementById('respiration-depth').onclick = () => 
    rotateButton(document.getElementById('respiration-depth'), ['Regular Depth', 'Shallow', 'Deep']);
document.getElementById('respiration-rhythm').onclick = () => 
    rotateButton(document.getElementById('respiration-rhythm'), ['Regular Rhythm', 'Irregular Rhythm']);

// Lung Sounds Buttons
document.getElementById('left-lung-sound').onclick = () => 
    rotateButton(document.getElementById('left-lung-sound'), ['Left - Clear', 'Left - Diminished', 'Left - Wheeze', 'Left - Rales', 'Left - Rhonchi']);
document.getElementById('right-lung-sound').onclick = () => 
    rotateButton(document.getElementById('right-lung-sound'), ['Right - Clear', 'Right - Diminished', 'Right - Wheeze', 'Right - Rales', 'Right - Rhonchi']);

// Update Box and Reset Buttons
generateButton.onclick = updateBox;
resetGenButton.onclick = resetBox;

// ----------------------------------------