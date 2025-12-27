
let generateButton = document.getElementById('generate-chart');
let resetGenButton = document.getElementById('reset-chart-gen');

function updateBox() {
    // Reset output box and reset button
    let outputLines = document.getElementsByClassName('gen-output');
    for (i = 0; i < outputLines.length; i++) {
        outputLines[i].innerHTML = '';
    }
    resetGenButton.innerHTML = "Reset";

    // Dispatch information
    let unit = document.getElementById('unit').value;
    let nature = document.getElementById('nature').value;
    let age = document.getElementById('age').value;
    let sex = '';
    let dispatchOutput = "";

    if (document.getElementById('male').checked) {
        sex = 'm';
    } else if (document.getElementById('female').checked) {
        sex = 'f';
    }

    if (!unit) unit = 'EMS';

    dispatchOutput += `${unit} was dispatched`;
    if (nature) dispatchOutput += ` to a ${nature}`;
    if (age) dispatchOutput += ` for a ${age} yo${sex}`;
    
    dispatchOutput += `. `;

    document.getElementById('dispatch-output').innerHTML = dispatchOutput;

    // Scene description
    let sceneOutput = determineAVPU() + determinePosition();
    let location = document.getElementById('found-location').value;
    let attendedBy = document.getElementById('bystanders').value;
    let otherSceneInfo = document.getElementById('other-scene-info').innerHTML;

    if (location) sceneOutput += " " + location;
    if (attendedBy) sceneOutput += ' attended by ' + attendedBy;
    otherSceneInfo ? sceneOutput += ". " + otherSceneInfo : sceneOutput += ". ";

    document.getElementById('scene-output').innerHTML = sceneOutput;

    // HPI
    let HPIOutput = determineHPIOutput();
    document.getElementById('hpi-output').innerHTML = HPIOutput;

    // Exam
    let skinOutput = determineSkinOutput();
    let radialOutput = determineRadialOutput();
    let respOutput = determineRespiratoryOutput();
    let bpOutput = determineBP();
    let otherExamInfo = document.getElementById('other-exam-info').innerHTML;

    document.getElementById('exam-output').innerHTML = skinOutput + radialOutput + respOutput + bpOutput;

    if (document.getElementById('trauma-present').checked) {
        document.getElementById('exam-output').innerHTML += determineTrauma();
    }

    if (otherExamInfo) {
        document.getElementById('exam-output').innerHTML += "<br /><br />" + otherExamInfo;
    }

    // Interventions
    let interventions = determineInterventions();
    document.getElementById('interventions-output').innerHTML = interventions;

    // ALS
    let alsOutput = getALSStatus();
    document.getElementById('als-output').innerHTML = alsOutput;
    
    // Transport
    let transportOutput = getTransportOutput(unit);
    document.getElementById('transport-output').innerHTML = transportOutput;
}


function determineAVPU() {
    let avpuOutput = `On arrival, the patient was `;

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

        let orientationCount = 0;
        Object.keys(orientation).forEach(question => {
            if (orientation[question]) {
                orientationCount++;
                orientationTrue.push(question);
            };
        });

        // Patient is alert
        if (avpu === 'alert') {
            if (orientationCount === 4) {
                avpuOutput += 'awake, alert, and oriented x 4';
            } else if (orientationCount === 3) {     
                avpuOutput += 'awake, alert, and oriented to ' + orientationTrue[0] + ", " 
                + orientationTrue[1] + ", and " + orientationTrue[2];
            } else if (orientationCount === 2) {
                avpuOutput += 'awake, alert, and oriented to ' + orientationTrue[0] + " and " 
                + orientationTrue[1];
            } else if (orientationCount === 1) {
                avpuOutput += 'awake, alert, and oriented to ' + orientationTrue[0];
            } else if (orientationCount === 0) {
                avpuOutput += 'awake, alert, but not oriented to person, place, event, or time';
            }

        } else if (avpu === 'verbal') {  // Patient is responsive to verbal
            avpuOutput += 'responsive to verbal stimuli';
        } else if (avpu === 'painful') {  // Patient is responsive to pain
            avpuOutput += 'responsive to painful stimuli';
        } else if (avpu === 'unresponsive') {
            avpuOutput += 'unresponsive';
        }
        return avpuOutput;
    } else {
        return "On arrival, the patient was found";
    }

}


function determinePosition() {
    let positionSelect = document.querySelector('input[name="position"]:checked');
    
    if (positionSelect) {
        if (positionSelect.value === 'sitting-position') {
            return ' sitting';
        } else if (positionSelect.value === 'standing-position') {
            return ' standing';
        } else if (positionSelect.value === 'supine-position') {
            return ' supine';
        } else if (positionSelect.value === 'L-lateral-position') {
            return ' in the left-lateral recumbant position';
        } else if (positionSelect.value === 'R-lateral-position') {
            return ' in the right-lateral recumbant position';
        } else if (positionSelect.value === 'prone-position') {
            return ' prone';
        }
    } else {
        return '';
    }
}


function determinePronouns() {
    let sexInput = document.querySelector('input[name="sex"]:checked');

    if (sexInput) {
        if (sexInput.value === 'male') {
            sex = 'm';
        } else if (sexInput.value === 'female') {
            sex = 'f';
        }
    } else {
         sex = '';
    }


    let pronouns = [];
    if (sex === 'm') {
        pronouns = ['he', 'him', 'his', 'his', 's'];
    } else if (sex === 'f') {
        pronouns = ['she', 'her', 'her', 'hers', 's'];
    } else {
        pronouns = ['they', 'them', 'their', 'theirs', ''];
    }

    return pronouns;
}


function determineHPIOutput() {
    let symptomsObject = {
        'chest pain': document.getElementById('chest-pain').checked,
        'shortness of breath': document.getElementById('sob').checked,
        'headache': document.getElementById('headache').checked,
        'nausea': document.getElementById('nausea').checked,
        'vomiting': document.getElementById('vomiting').checked,
        'lightheadedness': document.getElementById('lightheadedness').checked,
        'dizziness': document.getElementById('dizziness').checked,
        'fever': document.getElementById('fever').checked,
        'chills': document.getElementById('chills').checked,
        'abdominal pain': document.getElementById('abd-pain').checked,
        'weakness': document.getElementById('weakness').checked,
        'recent falls': document.getElementById('recent-falls').checked
    }
    let hpiOutput = "";
    let positiveSymptoms = [];
    let negativeSymptoms = [];
    let onset = document.getElementById('symptom-onset').value;

    Object.keys(symptomsObject).forEach(key => {
        symptomsObject[key] ? positiveSymptoms.push(key) : negativeSymptoms.push(key);
    })
    
    if (positiveSymptoms.length > 0 && document.getElementById('report-symptoms').checked) {
        hpiOutput += "The patient is complaining of " + listItems(positiveSymptoms) +  ". ";
    }

    if (onset) hpiOutput += `The patient reports the symptoms began ${onset} prior to EMS arrival. `;
    
    // chest pain assessment
    if (symptomsObject['chest pain']) hpiOutput += cpAssessment();

    hpiOutput += document.getElementById('hpi-other').innerHTML + " ";

    if (negativeSymptoms.length > 0 && document.getElementById('report-symptoms').checked) {
        hpiOutput += "The patient denies " + listItems(negativeSymptoms) + ". ";
    }

    return hpiOutput;
}


function cpAssessment() {
    let location = document.getElementById('cp-location').value;
    let radiation = document.getElementById('cp-radiating').value;
    let reproducible = document.getElementById('cp-reproducible').checked;
    let quality = document.getElementById('cp-quality').value;
    let pain = document.getElementById('cp-pain').value;

    let cardiacHx = {
        'past myocardial infarction' : document.getElementById('cp-hx-mi').checked,
        'stent placement' : document.getElementById('cp-hx-stents').checked,
        'coronary artery bypass graft (CABG)': document.getElementById('cp-hx-cabg').checked,
        'pacemaker placement' : document.getElementById('cp-hx-pacemaker').checked,
        'defibrillator placement' : document.getElementById('cp-hx-defibrillator').checked,
        'LVAD placement' : document.getElementById('cp-hx-lvad').checked,
        'anxiety' : document.getElementById('cp-hx-anxiety').checked
    }

    let cpOther = document.getElementById('cp-other').innerHTML;
    let pronouns = determinePronouns();

    let positiveHx = [];
    let negativeHx = [];

    Object.keys(cardiacHx).forEach(key => {
        cardiacHx[key] ? positiveHx.push(key) : negativeHx.push(key);
    })

    let cpOutput = "";

    location ? cpOutput += `The patient reported ${location} chest pain` : cpOutput += 'The patient reported chest pain';
    radiation ? cpOutput += ` radiating ${radiation}` : cpOutput += ` that was nonradiating`;
    reproducible ? cpOutput += ' and reproducible on palpation. ' : cpOutput += ' and nonreproducible. ';

    if (quality && pain) {
        cpOutput += capitalize(pronouns[0]) + ` described ` + pronouns[2] + ` pain as ${quality} and rated ${pain}/10. `;
    } else if (!quality && pain) {
        cpOutput += capitalize(pronouns[0]) + ` rated ` + pronouns[2] + ` pain ${pain}/10. `;
    } else if (quality && !pain) {
        cpOutput += capitalize(pronouns[0]) + ` described ` + pronouns[2] + ` pain as ${quality}. `;
    }

    if (positiveHx.length > 0) {
        cpOutput += "The patient endorsed history of " + listItems(positiveHx) + ". ";
    }

    if (cpOther) {
        cpOutput += cpOther;
    }

    return cpOutput;
}


function determineSkinOutput() {
    let skinTemperature = document.getElementById('skin-temperature').innerHTML.toLowerCase();
    let skinColor = document.getElementById('skin-color').innerHTML.toLowerCase();
    let skinMoisture = document.getElementById('skin-moisture').innerHTML.toLowerCase();

    let skinOutput = "On exam, the patient's skin was found to be ";

    if (skinTemperature === 'normal temperature' && skinColor === 'normal color' && skinMoisture === 'normal moisture') {
        skinOutput += 'normal in temperature, color, and moisture. ';
    } else {
        if (skinTemperature === 'normal temperature') {
            skinOutput += 'normal in temperature, '; 
        } else {
            skinOutput += skinTemperature + ', ';
        }

        if (skinColor === 'normal color') { 
            skinOutput += 'normal in color, '; 
        } else {
            skinOutput += skinColor + ', ';
        }

        if (skinMoisture === 'normal moisture') {
            skinOutput += 'and normal in moisture. ';
        } else {
            skinOutput += 'and ' + skinMoisture + '. ';
        }
    }

    return skinOutput;
}


function determineRadialOutput() {
    let radialStrength = document.getElementById('radial-strength').innerHTML.toLowerCase();
    let radialRegularity = document.getElementById('radial-regularity').innerHTML.toLowerCase();
    let radialRate = document.getElementById('radial-rate').innerHTML.toLowerCase();
    let radialEqual = document.getElementById('radial-equal').innerHTML.toLowerCase();

    let radialOutput = "The patient's pulses were found to be ";

    if (radialStrength === 'strong' && radialRegularity === 'regularly regular' && radialRate === 'normal rate' 
        && radialEqual === 'equal qilaterally') {
            radialOutput += "strong, steady, normal in rate, and equal bilaterally.";
    } else {
        radialOutput += radialStrength + ", " + radialRegularity + ", "
        if (radialRate === 'normal rate') {
            radialOutput += "normal in rate, and " + radialEqual + ". ";
        } else {
            radialOutput += radialRate + ", and " + radialEqual + ". ";
        }
    }

    return radialOutput;
}


function determineRespiratoryOutput() {
    let respDistress = document.getElementById('resp-distress').checked;
    let respMuscles = document.getElementById('resp-muscle-use').checked;
    let respDysneaCount = document.getElementById('resp-dyspnea').value.toLowerCase();
    let respRate = document.getElementById('respiration-rate').innerHTML.toLowerCase();
    let respDepth = document.getElementById('respiration-depth').innerHTML.toLowerCase();
    let respRhythm = document.getElementById('respiration-rhythm').innerHTML.toLowerCase();

    let leftLungSound = document.getElementById('left-lung-sound').innerHTML.toLowerCase();
    let rightLungSound = document.getElementById('right-lung-sound').innerHTML.toLowerCase();

    let spo2Value = document.getElementById('spo2-value').value;
    let roomAir = document.getElementById('room-air-O2').checked;

    let respOutput = "";

    if (respRate === 'apnic') {
        respOutput += "The patient did not appear to be breathing. "
    } else {
        if (respDistress) {
            respOutput += "The patient appeared to be in respiratory distress. " 
            respMuscles ? respOutput += "Accessory muscle use noted. " : respOutput += "No accessory muscle use noted. ";
            
            if (respDysneaCount) {
                respOutput += `The patient exhibited ${respDysneaCount} word dyspnea. `;
            } else {
                if (document.getElementById('speak-fully').checked) {
                    respOutput += "The patient was able to speak in full and complete sentences. ";
                }
            }

            if (respRate === 'regular rate' && respDepth === 'regular depth' && respRhythm === 'regular rhythm') {
                respOutput += "Respirations were found to be regular in rate, depth, and rhythm. "
            } else {
                if (respRate === 'regular rhythm') {
                    respOutput += "Respirations were found to be regular in rate, ";
                } else {
                    respOutput += `Respirations were found to be ${respRate}, `;
                }


                if (respDepth === 'regular depth') {
                    respOutput += "regular in depth, ";
                } else {
                    respOutput += `${respDepth}, `;
                }

                if (respRhythm === 'regular rhythm') {
                    respOutput += "and regular in rhythm. ";
                } else {
                    respOutput += "and irregular in rhythm. ";
                }
            }

        } else {
            respOutput += "The patient did not appear to be in respiratory distress. " 
            + "No accessory muscle use noted. "
            
            if (document.getElementById('speak-fully').checked) {
                    respOutput += "The patient was able to speak in full and complete sentences. ";
                }
            
            respOutput += "Respirations were found to be regular in rate, depth, and rhythm. ";
        }

        // Equal Lung Sounds
        if (leftLungSound === 'left - clear' && rightLungSound === 'right - clear') {
            respOutput += "Lung sounds were found to be clear and equal bilaterally. ";
        } else if (leftLungSound === 'left - diminished' && rightLungSound === 'right - diminished') {
            respOutput += "Lung sounds were found to be diminished bilaterally. ";
        } else if (leftLungSound === 'left - wheeze' && rightLungSound === 'right - wheeze') {
            respOutput += "Audible wheezing was heard throughout both lungs. ";
        } else if (leftLungSound === 'left - rales' && rightLungSound === 'right - rales') {
            respOutput += "Audible rales was heard throughout both lungs. ";
        } else if (leftLungSound === 'left - rhonchi' && rightLungSound === 'right - rhonchi') {
            respOutput += "Audible rhonchi was heard throughout both lungs. ";
        } else {
            // Left-side lung sounds
            if (leftLungSound === 'left - clear') {
                respOutput += "Lung sounds were found to clear on the left. ";
            } else if (leftLungSound === 'left - diminished') {
                respOutput += "Lung sounds were found to be diminished on the left. "
            } else if (leftLungSound === 'left - wheeze') {
                respOutput += "Audible wheezing was heard on patient's left side. "
            } else if (leftLungSound === 'left - rales') {
                respOutput += "Audible rales was heard on patient's left side. "
            } else if (leftLungSound === 'left - rhonchi') {
                respOutput += "Audible rhonchi was heard on patient's left side. "
            }

            // Right-side lung sounds
            if (rightLungSound === 'right - clear') {
                respOutput += 'Lung sounds were found to be clear on the right. '
            } else if (rightLungSound === 'right - diminished') {
                respOutput += 'Lung sounds were found to be diminished on the right. '
            } else if (rightLungSound === 'right - wheeze') {
                respOutput += "Audible wheezing was heard on the patient's right side. "
            } else if (rightLungSound === 'right - rales') {
                respOutput += "Audible rales was heard on the patient's right side. "
            } else if (rightLungSound === 'right - rhonchi') {
                respOutput += "Audible rhonchi was heard on the patient's right side. "
            }
        }

        if (spo2Value) {
            if (spo2Value > 91) {
                respOutput += `SpO2 was found to be ${spo2Value}% indicating adequate oxygenation`;
            } else if (spo2Value === "") {
                document.getElementById('error-output').innerHTML += "Missing input: SpO2<br/>";
            } else {
                respOutput += `SpO2 was found to be ${spo2Value}% indicating inadequate oxygenation`;
            }
            roomAir ? respOutput += " at room air. " : respOutput += ". "
        }

        
    }
    
    return respOutput;
}


function determineBP() {
    let bp = document.getElementById('bp').value.toLowerCase();
    let bpOutput = ""

    if (bp) {
        let systolic = bp.split("/")[0]
        let diastolic = bp.split("/")[1]

        if (systolic >= 100 && systolic <= 140 && diastolic <= 80) {
            bpOutput += "The patient's blood pressure was obtained and found to be within normal limits. ";
        } else if (systolic > 140 && diastolic > 80) {
            bpOutput += `The patient's blood pressure was obtained and found to be elevated at ${bp} mm Hg. `
        } else {
            bpOutput += `The patient's blood pressure was obtained. `
            if (systolic > 140) {
               bpOutput += `The patient's systolic blood pressure was found to be elevated at ${systolic} mm Hg. `
            }
            
            if (systolic < 100) {
               bpOutput += `The patient's systolic blood pressure was found to be decreased at ${systolic} mm Hg. `
            }

            if (diastolic > 80) {
               bpOutput += `Of note, the patient's diastolic blood pressure was found to be elevated at ${diastolic} mm Hg. `
            }
        }
        
    }

    return bpOutput

}


function determineTrauma() {
    let traumaList = {
        'head': document.getElementById('head-dcap').checked,
        'neck': document.getElementById('neck-dcap').checked,
        'chest': document.getElementById('chest-dcap').checked,
        'abdomen': document.getElementById('abdomen-dcap').checked,
        'back': document.getElementById('back-dcap').checked,
        'hip/pelvis': document.getElementById('hip/pelvis-dcap').checked,
        'upper extremities': document.getElementById('upper-ext-dcap').checked,
        'lower extremities': document.getElementById('lower-ext-dcap').checked
    }

    let positiveDCAP = [];
    let negativeDCAP = [];

    let traumaOutput = [];

    Object.keys(traumaList).forEach(key => {
        if (traumaList[key]) {
            positiveDCAP.push(key);
        } else {
            negativeDCAP.push(key);
        }
    })

    traumaOutput += document.getElementById('trauma-desc').innerHTML + " ";

    if (negativeDCAP.length > 0 && document.getElementById('trauma-present').checked) {
        traumaOutput += "No DCAP-BTLS noted to " + listItems(negativeDCAP) + ". ";
    }

    return traumaOutput;



}


function determineInterventions() {
    // oxygen variables
    let oxygen = document.getElementById('oxygen').checked;
    let oxygenLPM = document.getElementById('oxygen-lpm').value;
    let oxygenSPO2 = document.getElementById('oxygen-reassess-spo2').value;
    let oxygenLPM2 = document.getElementById('oxygen-lpm2').value;
    let oxygenSPO22 = document.getElementById('oxygen-reassess-spo2-2').value;

    // airway variables
    let airway = document.getElementById('airway').checked;
    let airwaySize = document.getElementById('airway-size').value;

    // albuterol variables
    let albuterol = document.getElementById('albuterol').checked;
    let albuterolMDI = document.getElementById('albuterol-mdi').checked;
    let albuterolMDIPuffs = document.getElementById('mdi-puffs').value;
    let albuterolHHN = document.getElementById('albuterol-hhn').checked;
    let albuterolDose1 = document.getElementById('hhn-one-dose').checked;
    let albuterolDose2 = document.getElementById('hhn-two-doses').checked;
    let albuterolSPO2 = document.getElementById('hhn-spo2-dose1').value;
    let albuterolSPO22 = document.getElementById('hhn-spo2-dose2').value;

    let cpap = document.getElementById('cpap').checked;
    let asa = document.getElementById('asa').checked;
    let collar = document.getElementById('c-collar').checked;
    let narcan = document.getElementById('narcan').checked;
    let epipen = document.getElementById('epi-pen').checked;

    let interventionsOutput = "";

    // an airway was placed
    if (airway) {
        // oral airway
        if (document.getElementById('airway-oral').checked) {
            interventionsOutput += "An oropharyngeal airway was placed in the patient's mouth. ";
        // nasal airway
        } else if (document.getElementById('airway-nasal').checked) {
            // size of nasal airway given
            if (airwaySize) {
                interventionsOutput += "A size " + airwaySize + " nasopharyngeal airway was placed. ";
            } else {
                interventionsOutput += "A nasopharyngeal airway was placed. ";
            }
        }
        // was the airway successfully secured?
        if (document.getElementById('airway-secured').checked) {
            interventionsOutput += "The patient's airway was secured. ";
        } else {
            interventionsOutput += "The patient's airway could not be secured. ";
        }
    }

    if (oxygen) {
        interventionsOutput += "The patient was administered oxygen";
        if (oxygenLPM) {
            interventionsOutput += " at " + oxygenLPM + " LPM"
        }

        if (document.getElementById('oxygen-nc').checked) {
            interventionsOutput += " via a nasal cannula";
        } else if (document.getElementById('oxygen-nrb').checked) {
            interventionsOutput += " via a non-rebreather";
        } else if (document.getElementById('oxygen-bvm').checked) {
            interventionsOutput += " via a bag-valve mask";
        } else if (document.getElementById('oxygen-bb').checked) {
            interventionsOutput += " using the blow-by method";
        }

        interventionsOutput += ". ";

        if (document.getElementById('oxygen-improved').checked) {
            interventionsOutput += "Patient oxygenation improved. ";
        } else {
            interventionsOutput += "Patient oxygenation did not show significant improvement. ";
        }

        if (oxygenSPO2) {
            interventionsOutput += "On reassessment, the patient's SpO2 was found to be " + oxygenSPO2 + "%. ";
        }

        if (oxygenLPM2) {
            interventionsOutput += "The patient's oxygen administration was changed to " + oxygenLPM2 + " LPM";
            
            if (document.getElementById('oxygen-nc2').checked) {
            interventionsOutput += " via a nasal cannula2";
            } else if (document.getElementById('oxygen-nrb2').checked) {
            interventionsOutput += " via a non-rebreather";
            } else if (document.getElementById('oxygen-bvm2').checked) {
            interventionsOutput += " via a bag-valve mask";
            } else if (document.getElementById('oxygen-bb2').checked) {
            interventionsOutput += " using the blow-by method";
            }

            interventionsOutput += ". ";

            if (document.getElementById('oxygen-improved2').checked) {
                interventionsOutput += "Patient oxygenation improved. ";
            } else {
                interventionsOutput += "Patient oxygenation still did not show significant improvement. ";
            }

            if (oxygenSPO22) {
                interventionsOutput += "On second reassessment, the patient's SpO2 was found to be " + oxygenSPO22 + "%. ";
            }
        }
    }

    // Albuterol
    if (albuterol) {
        // Albuterol via inhalor
        if (albuterolMDI) {
            interventionsOutput += "The patient was assisted with ";
            if (albuterolMDIPuffs) {
                interventionsOutput += albuterolMDIPuffs + " puffs of ";
            }
            interventionsOutput += " their prescribed albuterol metered dose inhalor. ";
            if (document.getElementById('mdi-improve')) {
                interventionsOutput += "The patient reported an improvement of symptoms. ";
            }
        }
        
        // Albuterol via nebulizer
        if (albuterolHHN) {
            interventionsOutput += "The patient was administered ";
            // one dose of albuterol
            if (albuterolDose1) {
                interventionsOutput += " one dose of albuterol at 2.5mg/3mL via a handheld nebulizer treatment. ";
                if (albuterolSPO2) {
                    interventionsOutput += "On reassessment, the patient's SpO2 was found to be " + albuterolSPO2 + "%. ";
                }
            // two doses of albuterol
            } else if (albuterolDose2) {
                // first reassessment SpO2 given
                if (albuterolSPO2) {
                    interventionsOutput += " one dose of albuterol at 2.5mg/3mL via a handheld nebulizer treatment. ";
                    interventionsOutput += "On reassessment, the patient's SpO2 was found to be " + albuterolSPO2 + "%. ";
                    interventionsOutput += "After approximately 5 minutes, a second dose of albuterol was given. ";
                    if (albuterolSPO22) {
                        interventionsOutput += "The patient was reassessed again. SpO2 was found to be " + albuterolSPO22 + "%. ";
                    }
                // reassessment SpO2 between doses not given
                } else {
                    interventionsOutput += " one dose of albuterol at 2.5mg/3mL via a handheld nebulizer treatment. ";
                    interventionsOutput += "After approximately 5 minutes, a second dose of albuterol was given. ";
                    // final SpO2 given
                    if (albuterolSPO22) {
                        interventionsOutput += "On reassessment, SpO2 was found to be " + albuterolSPO22 + "%. ";
                    }
                }
            }
        }
        
        if (!(albuterolMDI || albuterolHHN)) {
            interventionsOutput += "The patient was given albuterol.";
        }
    }

    // CPAP
    if (cpap) {
        interventionsOutput += "The patient was placed on CPAP";
        if (document.getElementById('cpap-wet').checked) {
            interventionsOutput += " at 10 cm H2O";

        } else if (document.getElementById('cpap-dry').checked) {
            interventionsOutput += " at 5 cm H2O";
        }
        
        interventionsOutput += ". ";
        
        if (document.getElementById("cpap-improved")) {
            interventionsOutput += "The patient reported an improvement of symptoms. ";
        }
    }


    // ASA
    if (asa) {
        if (document.getElementById('asa-dose-81').checked) {
            interventionsOutput += "The patient was administered 81 mg of aspirin for a full dose of 344 mg since they stated they had already taken 243 mg in the past 24 hours. ";
        } else if (document.getElementById('asa-dose-162').checked) {
            interventionsOutput += "The patient was administered 162 mg of aspirin for a full dose of 344 mg since they stated they had already taken 162 mg in the past 24 hours. ";
        } else if (document.getElementById('asa-dose-243').checked) {
            interventionsOutput += "The patient was administered 243 mg of aspirin for a full dose of 344 mg since they stated they had already taken 81 mg in the past 24 hours. ";
        } else if (document.getElementById('asa-dose-344').checked) {
            interventionsOutput += "The patient was administered 344 mg of aspirin. ";
        } else if (document.getElementById('asa-dose-done').checked) {
            interventionsOutput += "Aspirin was considered, however, the patient stated they had already taken the full 344 mg dose for today. ";
        } else if (document.getElementById('asa-dose-none').checked) {
            interventionsOutput += "Aspirin was considered but not given as the patient's signs and symptoms associated with chest pain made it likely that the chest pain was not cardiac in nature. ";
        }

        if (document.getElementById('asa-improved').checked) {
            interventionsOutput += "The patient reported an improvement in symptoms. ";
        }

        if (document.getElementById('asa-reassess').value) {
            interventionsOutput += "On reassessment, the patient stated their chest pain was " + document.getElementById('asa-reassess').value + "/10.";
        }
    }

    // C-Collar
    if (collar) {
        interventionsOutput += "The patient's cervical spine was immobilized using a c-collar. "
    }


    // Narcan
    if (narcan) {
        interventionsOutput += "The patient was given 4 mg naloxone via a single-dose nasal spray. "
    }


    // Epi-Pen
    if (epipen) {
        if (document.getElementById('epi-adult').checked) {
            interventionsOutput += "The patient was administered 0.3 mg epinephrine using an auto-injector. ";
        } else if (document.getElementById('epi-child').checked) {
            interventionsOutput += "The patient was administed 0.15 mg epinephrine using an auto-injector. ";
        } else {
            interventionsOutput += "The patient was injected with an epi-pen auto-injector. "
        }
    }

    return interventionsOutput;
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


function getTransportOutput(unit) {
    let transportDecision = document.querySelector('input[name="transport-decision"]:checked');
    let transportMethod = document.querySelector('input[name="transport-method"]:checked');
    let destination = document.getElementById('destination').value;
    let bed = document.getElementById('bed').value;
    let rnName = document.getElementById('rn-name').value;
    let transportDescription = document.getElementById('transport-desc').innerHTML;
    let transportOutput = ''
    let pronouns = determinePronouns();

    if (!destination) destination = 'the hospital';
    if (!bed) bed = 'their bed';
    rnName ? rnName = "RN " + rnName : rnName = "RN";



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
                transportOutput += `<br /><br />En route to ${destination}, the patient was continuously monitored and reassessed. `;

                if (transportDescription) {
                    transportOutput += transportDescription + " ";
                } else {
                    transportOutput += "The patient had no new complaints. ";
                }

                // at destination
                transportOutput += `<br /><br />At ${destination}, the patient was transferred to ${bed} without incident. Both side rails were raised. Patient care was transferred to ${destination} ${rnName} with report.`

                return transportOutput;
            
            }
        }

    } else {
        document.getElementById('error-output').innerHTML += "Missing input: transport decision"
    }
}


function resetBox() {
    let outputLines = document.getElementsByClassName('gen-output');
    for (i = 0; i < outputLines.length; i++) {
        outputLines[i].innerHTML = '';
    }
    outputLines[0].innerHTML = 'No Chart Generated Yet..'

    resetGenButton.innerHTML = "Chart has been reset..";
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


function listItems(array) {
    let items = "";
    if (array.length === 1) {
        return array[0];
    } else if (array.length === 2) {
        return array[0] + " and " + array[1];
    } else if (array.length > 2) {
        items = array[0]
        for (let i = 1; i < array.length - 1; i++) {
            items += ", " + array[i];
        }
        items += ", and " + array[array.length - 1];

        return items;
    }

}


function showHide(checkbox, showHide, reverse=false) {
    if (!reverse) {
        checkbox.checked ? showHide.style.display = "block" : showHide.style.display = "none";
    } else {
        checkbox.checked ? showHide.style.display = "none" : showHide.style.display = "inline-block";
    }
}


function capitalize(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}


// BUTTONS ------------------------------------------------------------
// Skin Condition Buttons 
document.getElementById('skin-temperature').onclick = () => 
    rotateButton(document.getElementById('skin-temperature'), ['Normal Temperature', 'Hot', 'Cool']);
document.getElementById('skin-color').onclick = () => 
    rotateButton(document.getElementById('skin-color'), ['Normal Color', 'Pale', 'Cyanotic', 'Flushed', 'Jaundiced']);
document.getElementById('skin-moisture').onclick = () => 
    rotateButton(document.getElementById('skin-moisture'), ['Normal Moisture', 'Diaphoretic']);
document.getElementById('skin-moisture').onclick = () => 
    rotateButton(document.getElementById('skin-moisture'), ['Normal Moisture', 'Diaphoretic']);

// Radial Pulses Buttons
document.getElementById('radial-strength').onclick = () => 
    rotateButton(document.getElementById('radial-strength'), ['Strong', 'Weak', 'Bounding']);
document.getElementById('radial-regularity').onclick = () => 
    rotateButton(document.getElementById('radial-regularity'), ['Regularly Regular', 'Regularly Irregular', 'Irregularly Irregular']);
document.getElementById('radial-rate').onclick = () => 
    rotateButton(document.getElementById('radial-rate'), ['Normal Rate', 'Bradycardic', 'Tachycardic']);
document.getElementById('radial-equal').onclick = () => 
    rotateButton(document.getElementById('radial-equal'), ['Equal Bilaterally', 'Unequal Bilaterally']);

// Respiration Buttons
document.getElementById('respiration-rate').onclick = () => 
    rotateButton(document.getElementById('respiration-rate'), ['Regular Rate', 'Slow', 'Rapid', 'Apnic']);
document.getElementById('respiration-depth').onclick = () => 
    rotateButton(document.getElementById('respiration-depth'), ['Regular Depth', 'Shallow', 'Deep']);
document.getElementById('respiration-rhythm').onclick = () => 
    rotateButton(document.getElementById('respiration-rhythm'), ['Regular Rhythm', 'Irregular Rhythm']);

// Lung Sounds Buttons
document.getElementById('left-lung-sound').onclick = () => 
    rotateButton(document.getElementById('left-lung-sound'), ['Left - Not Checked', 'Left - Clear', 'Left - Diminished', 'Left - Wheeze', 'Left - Rales', 'Left - Rhonchi']);
document.getElementById('right-lung-sound').onclick = () => 
    rotateButton(document.getElementById('right-lung-sound'), ['Right - Not Checked', 'Right - Clear', 'Right - Diminished', 'Right - Wheeze', 'Right - Rales', 'Right - Rhonchi']);

// Chest Pain
document.getElementById('chest-pain').onclick = () => 
    showHide(document.getElementById('chest-pain'), document.getElementById('cardiac-assessment'));

// Oxygen
document.getElementById('oxygen').onclick = () =>
    showHide(document.getElementById('oxygen'), document.getElementById('oxygen-info'));

document.getElementById('oxygen-improved').onclick = () =>
    showHide(document.getElementById('oxygen-improved'), document.getElementById('oxygen-info2'), true);

// Airway
document.getElementById('airway').onclick = () =>
    showHide(document.getElementById('airway'), document.getElementById('airway-info'));
document.getElementById('airway-nasal').onclick = () =>
    showHide(document.getElementById('airway-nasal'), document.getElementById('airway-size-div'));
document.getElementById('airway-oral').onclick = () =>
    showHide(document.getElementById('airway-nasal'), document.getElementById('airway-size-div'));

// Albuterol
document.getElementById('albuterol').onclick = () =>
    showHide(document.getElementById('albuterol'), document.getElementById('albuterol-info'))

document.getElementById('albuterol-mdi').onclick = () =>
    showHide(document.getElementById('albuterol-mdi'), document.getElementById("mdi-info-div"));

document.getElementById('albuterol-hhn').onclick = () =>
    showHide(document.getElementById('albuterol-hhn'), document.getElementById('hhn-info-div'));

document.getElementById('hhn-two-doses').onclick = () =>
    showHide(document.getElementById('hhn-two-doses'), document.getElementById('hhn-spo2-dose2-div'));
document.getElementById('hhn-one-dose').onclick = () =>
    showHide(document.getElementById('hhn-two-doses'), document.getElementById('hhn-spo2-dose2-div'));

// CPAP
document.getElementById('cpap').onclick = () =>
    showHide(document.getElementById('cpap'), document.getElementById('cpap-info-div'));

// Aspirin
document.getElementById('asa').onclick = () =>
    showHide(document.getElementById('asa'), document.getElementById('asa-info-div'));

// Epi-pEn
document.getElementById('epi-pen').onclick = () =>
    showHide(document.getElementById('epi-pen'), document.getElementById('epi-div'));

// Update Box and Reset Buttons
generateButton.onclick = updateBox;
resetGenButton.onclick = resetBox;

// ----------------------------------------