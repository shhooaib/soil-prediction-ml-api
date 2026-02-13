const form = document.getElementById('predictionForm');
const submitBtn = document.getElementById('submitBtn');
const btnText = submitBtn.querySelector('.btn-text');
const btnLoader = submitBtn.querySelector('.btn-loader');
const resultDiv = document.getElementById('result');
const errorDiv = document.getElementById('error');
const soilTypeDiv = document.getElementById('soilType');
const errorMessageDiv = document.getElementById('errorMessage');

const API_URL = 'http://127.0.0.1:5000/predict';

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Hide previous results/errors
    resultDiv.style.display = 'none';
    errorDiv.style.display = 'none';
    
    // Show loading state
    submitBtn.disabled = true;
    btnText.style.display = 'none';
    btnLoader.style.display = 'inline';
    
    // Get form values
    const formData = {
        "Temparature": parseFloat(document.getElementById('temperature').value),
        "Humidity": parseFloat(document.getElementById('humidity').value),
        "Moisture": parseFloat(document.getElementById('moisture').value),
        "Crop Type": document.getElementById('cropType').value,
        "Nitrogen": parseInt(document.getElementById('nitrogen').value),
        "Potassium": parseInt(document.getElementById('potassium').value),
        "Phosphorous": parseInt(document.getElementById('phosphorous').value),
        "Fertilizer Name": document.getElementById('fertilizerName').value
    };
    
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Display result
        soilTypeDiv.textContent = data.soil_type;
        resultDiv.style.display = 'block';
        
        // Scroll to result
        resultDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        
    } catch (error) {
        console.error('Error:', error);
        
        // Display error
        let errorMsg = 'Failed to predict soil type. ';
        
        if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
            errorMsg += 'Please make sure the backend server is running on http://127.0.0.1:5000';
        } else if (error.message.includes('HTTP error')) {
            errorMsg += `Server returned an error: ${error.message}`;
        } else {
            errorMsg += error.message;
        }
        
        errorMessageDiv.textContent = errorMsg;
        errorDiv.style.display = 'block';
        
        // Scroll to error
        errorDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    } finally {
        // Reset button state
        submitBtn.disabled = false;
        btnText.style.display = 'inline';
        btnLoader.style.display = 'none';
    }
});

// Add some helpful input validation
const numberInputs = document.querySelectorAll('input[type="number"]');
numberInputs.forEach(input => {
    input.addEventListener('input', (e) => {
        // Ensure valid number input
        if (e.target.value && isNaN(e.target.value)) {
            e.target.setCustomValidity('Please enter a valid number');
        } else {
            e.target.setCustomValidity('');
        }
    });
});




