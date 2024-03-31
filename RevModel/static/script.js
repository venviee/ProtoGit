// script.js
// Client-side validation can go here if needed

function generateStageInputs(type, durationLabel, growthRateLabel) {
    const numberOfStages = document.getElementById(`${type}NumberOfStages`).value || 0;
    const container = document.getElementById(`${type}StagesContainer`);
    container.innerHTML = ''; // Clear previous stages

    for (let i = 0; i < numberOfStages; i++) {
        const div = document.createElement('div');
        div.innerHTML = `
        <label>Stage ${i + 1}: ${durationLabel}</label> <input type="number" min="1" name="${type}StageYears[]" required onchange="updateRemainingYears('${type}')">
        <label>Stage ${i + 1}: ${growthRateLabel}</label> <input type="number" name="${type}StageGrowthRates[]" step="0.01" required>
        `;
        container.appendChild(div);
    }
    updateRemainingYears(type); // Update immediately after generating the inputs
}

function updateRemainingYears(type) {
    const totalYears = parseInt(document.getElementById('number_of_years').value, 10) || 0;;
    let allocatedYears = 0;
    document.querySelectorAll(`#${type}StagesContainer input[name="${type}StageYears[]"]`).forEach(input => {
        allocatedYears += parseInt(input.value, 10) || 0;
    });
    const remainingYearsElement = document.getElementById(`${type}RemainingYears`);
     // debugging console log statement
    remainingYearsElement.textContent = `Remaining Years: ${totalYears - allocatedYears}`;
}

function toggleGrowthType(type) {
    // Show or hide growth type options based on the selection
    const choice = document.getElementById(`${type}_choice`).value;
    const constantGrowthDiv = document.getElementById(`${type}ConstantGrowth`);
    const stagedGrowthDiv = document.getElementById(`${type}StagedGrowth`);
    const constantInputs = document.querySelectorAll(`#${type}ConstantGrowth input`);
    const stagedInputs = document.querySelectorAll(`#${type}StagedGrowth input`);
    if (choice === 'constant') {
        constantGrowthDiv.style.display = 'block';
        stagedGrowthDiv.style.display = 'none';
        stagedInputs.forEach(input => input.removeAttribute('required'));
        constantInputs.forEach(input => input.setAttribute('required', 'required'));
    } else if (choice === 'staged') {
        constantGrowthDiv.style.display = 'none';
        stagedGrowthDiv.style.display = 'block';
        constantInputs.forEach(input => input.removeAttribute('required'));
        stagedInputs.forEach(input => input.setAttribute('required', 'required'));
        generateStageInputs(type); // Regenerate stage inputs on type change to reset everything
    }
}

//Pop up open and close functions
function showTooltip(message) {
    var modal = document.getElementById('tooltipModal');
    var msg = document.getElementById('tooltipMessage');
    msg.innerHTML = message;
    modal.style.display = 'block';
}

function closeTooltip() {
    var modal = document.getElementById('tooltipModal');
    modal.style.display = 'none';
}

// Close the modal if the user clicks anywhere outside of it
window.onclick = function(event) {
    var modal = document.getElementById('tooltipModal');
    if (event.target == modal) {
        closeTooltip();
    }
}

// Call updateRemainingYears for all pages on load if number_of_years is set
window.onload = function() {
    var numberOfYearsElement = document.getElementById('number_of_years');
    var typeElement = document.getElementById('type'); // This gets the input element
    var typeValue = typeElement ? typeElement.value : ''; // Extract the value from the element
    // debugging console log statement
    console.log('Type value in onload function:', typeValue);
    if (numberOfYearsElement && numberOfYearsElement.value && typeValue) {
        updateRemainingYears(typeValue); // Pass the string value to the function
    }
};


document.addEventListener('DOMContentLoaded', function() {
    
    // Add event listener for the back button if it exists
    const backButton = document.getElementById('backButton');
    if (backButton) {
        backButton.addEventListener('click', function() {
            const url = backButton.getAttribute('data-url');
            location.href = url;
        });
    }

    document.querySelectorAll('select[name$="_choice"]').forEach(select => {
        select.addEventListener('change', function() {
            const type = select.name.split('_')[0];
            toggleGrowthType(type);
        });
    });

    document.getElementById('number_of_years').addEventListener('change', function() {
        ['revenue', 'grossmargin', 'sga', 'capex'].forEach(type => updateRemainingYears(type));
    });

    document.getElementById('financialModelForm').addEventListener('submit', function(event) {
        const requiredInputs = document.querySelectorAll('input:required, select:required');
        let isAllFilled = true;
        requiredInputs.forEach(function(input) {
            if (input.type !== 'hidden' && !input.value.trim()) {
                isAllFilled = false;
            }
        });

        if (!isAllFilled) {
            event.preventDefault(); // Prevent form submission
            alert('All required fields must be filled out.');
            return; // Stop further execution if any required field is empty
        }

        // Get the type from the hidden input outside of the 'if' block to ensure it is accessible everywhere within this function.
        const type = document.getElementById('type').value;
        // Retrieve the choice made by the user
        const choice = document.getElementById(`${type}_choice`).value;

        // remaning years total validation logic for staged choice only
        if (choice === 'staged') {
            // Retrieve the remaining years for validation.
            const remainingYearsElement = document.getElementById(`${type}RemainingYears`);
            const remainingYearsText = remainingYearsElement ? remainingYearsElement.textContent : '';
            const remainingYears = remainingYearsText ? parseInt(remainingYearsText.replace(/[^\d-]/g, ''), 10) : null;
            console.log('Remaining years validation value:', remainingYears);

        // Check if remaining years is not zero and prevent form submission if true.
            if (remainingYears !== 0) {
                event.preventDefault(); // Prevent form submission
                alert('The sum of years across all stages must match the total number of years. Please adjust your inputs.');
                return; // Stop further execution if remaining years is not zero
            }
        }
    });
});
