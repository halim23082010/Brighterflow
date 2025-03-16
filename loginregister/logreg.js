
var config = {
    cUrl: 'https://api.countrystatecity.in/v1/countries',
    ckey: 'NHhvOEcyWk50N2Vna3VFTE00bFp3MjFKR0ZEOUhkZlg4RTk1MlJlaA==' // API key
};

var countryselect = document.querySelector('.country'),
    countrystate = document.querySelector('.state'),
    countrycity = document.querySelector('.city'),
    registerBtn = document.querySelector('input[type="submit"]'); // الزر

// في البداية يتم تعطيل الزر
registerBtn.disabled = true;

// تحميل الدول
function loadcountries() {
    fetch(config.cUrl, { headers: { "X-CSCAPI-KEY": config.ckey } })
        .then(response => response.json())
        .then(data => {
            data.forEach(country => {
                const option = document.createElement('option');
                option.value = country.iso2;
                option.textContent = country.name;
                countryselect.appendChild(option);
            });
        })
        .catch(error => console.log('  Error: Did not load countries', error));
}

// تحميل الولايات بناءً على الدولة المختارة
function loadStates() {
    const selectedCountryCode = countryselect.value;
    countrystate.innerHTML = '<option value=""> Select State </option>'; // Reset the previous options

    fetch(`${config.cUrl}/${selectedCountryCode}/states`, {
        headers: { "X-CSCAPI-KEY": config.ckey }
    })
        .then(response => response.json())
        .then(data => {
            data.forEach(state => {
                const option = document.createElement('option');
                option.value = state.iso2;
                option.textContent = state.name;
                countrystate.appendChild(option);
            });
        })
        .catch(error => console.log('  Error: Did not load states', error));
}

// تحميل المدن بناءً على الدولة والولاية
function loadCities() {
    const selectedCountryCode = countryselect.value;
    const selectedStateCode = countrystate.value;

    countrycity.innerHTML = '<option value=""> Select City </option>';

    fetch(`${config.cUrl}/${selectedCountryCode}/states/${selectedStateCode}/cities`, {
        headers: { "X-CSCAPI-KEY": config.ckey }
    })
        .then(response => response.json())
        .then(data => {
            data.forEach(city => {
                const option = document.createElement('option');
                option.value = city.iso2;
                option.textContent = city.name;
                countrycity.appendChild(option);
            });
        })
        .catch(error => console.log('  Error: Did not load cities', error));
}


function isStrongPassword(password) {
    return password.length >= 8 && /[a-zA-Z]/.test(password) && /\d/.test(password);
}


function comparePasswords() {
    const password = document.getElementById('password').value;
    const repeatPassword = document.getElementById('password-repeat').value;
    const passwordError = document.getElementById('passwordErrorMessage');

    
    if (repeatPassword !== '') {
        
        if (!isStrongPassword(password)) {
            passwordError.innerText = 'Password must be at least 8 characters, include at least one letter and  number!';
        } else if (password !== repeatPassword) {
            passwordError.innerText = 'Passwords do not match!';
        } else {
            passwordError.innerText = ''; 
        }
    }
    
    
    if (password === repeatPassword && isStrongPassword(password)) {
        registerBtn.disabled = false;
    } else {
        registerBtn.disabled = true;
    }
}


function validateFields() {
    const fname = document.getElementById('fname').value.trim();
    const lname = document.getElementById('lname').value.trim();
    const email = document.getElementById('email').value.trim();
    const date = document.getElementById('date').value;
    const country = countryselect.value;
    const state = countrystate.value;
    const city = countrycity.value;
    const terms = document.getElementById('terms').checked; 

    const isValid = fname && lname && email && date && country && state && city && terms; 

    
    if (isValid) {
        registerBtn.disabled = false;
    } else {
        registerBtn.disabled = true;
    }

    
    if (!terms) {
        document.getElementById('termsErrorMessage').innerText = 'You should agree to the Terms and Conditions!';
    } else {
        document.getElementById('termsErrorMessage').innerText = '';
    }
}


function validateEmail(email) {
    const gmailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
    return gmailRegex.test(email);
}


function validateAndRegister() {
    const fname = document.getElementById('fname').value.trim();
    const lname = document.getElementById('lname').value.trim();
    const email = document.getElementById('email').value.trim();
    const date = document.getElementById('date').value;
    const password = document.getElementById('password').value;
    const repeatPassword = document.getElementById('password-repeat').value;
    const terms = document.getElementById('terms').checked;

    const emailError = document.getElementById('emailErrorMessage');
    const passwordError = document.getElementById('passwordErrorMessage');
    const termsError = document.getElementById('termsErrorMessage');

    emailError.innerText = '';
    passwordError.innerText = '';
    termsError.innerText = '';

    
    if (!terms) {
        termsError.innerText = 'You should agree to the Terms and Conditions!';
        return;
    }

    
    if (!fname || !lname || !email || !date || !password || !repeatPassword) {
        showAlert('  Please fill out all fields!');
        return;
    }

    // التحقق من البريد الإلكتروني
    if (!validateEmail(email)) {
        emailError.innerText = '  Please enter a valid Gmail address!';
        return;
    }

    // التحقق من كلمة المرور
    if (!isStrongPassword(password)) {
        passwordError.innerText = 'Password must be at least 8 characters, include at least one letter and  number!';
        return;
    }

    if (password !== repeatPassword) {
        passwordError.innerText = 'Passwords do not match!';
        return;
    }

    // إذا كانت جميع الشروط صحيحة
    showSuccess('  Registration successful! 🎉');
    clearForm();
}


function showSuccess(message) {
    const container = document.getElementById('register');
    const success = document.createElement('div');
    success.className = 'success-message';
    success.innerText = message;

    container.appendChild(success);

    setTimeout(() => {
        success.remove();
    }, 3000);
}


function showAlert(message) {
    const container = document.getElementById('register');
    const alertDiv = document.createElement('div');
    alertDiv.className = 'error-popup';
    alertDiv.innerText = message;

    container.appendChild(alertDiv);

    setTimeout(() => {
        alertDiv.remove();
    }, 3000);
}


function clearForm() {
    const inputs = document.querySelectorAll('input');
    inputs.forEach(input => input.value = '');

    document.getElementById('emailErrorMessage').innerText = '';
    document.getElementById('passwordErrorMessage').innerText = '';
    document.getElementById('termsErrorMessage').innerText = '';
}


window.onload = () => {
    loadcountries();
    validateFields();
};


document.getElementById('fname').addEventListener('input', validateFields);
document.getElementById('lname').addEventListener('input', validateFields);
document.getElementById('email').addEventListener('input', validateFields);
document.getElementById('date').addEventListener('input', validateFields);
document.getElementById('password').addEventListener('input', comparePasswords);
document.getElementById('password-repeat').addEventListener('input', comparePasswords);
document.getElementById('country').addEventListener('change', loadStates);
document.getElementById('state').addEventListener('change', loadCities);
document.getElementById('city').addEventListener('change', validateFields);
document.getElementById('terms').addEventListener('change', validateFields); 







