const form = document.getElementById('form');
const username = document.getElementById('username');
const email = document.getElementById('email');
const phone = document.getElementById('phone');
const password = document.getElementById('password');
const password2 = document.getElementById('password2');
const address = document.getElementById('address');
const expiry = document.getElementById('expiry');

function isFutureDate(date) {
    const today = new Date();
    const inputDate = new Date(date + "-01");
    return inputDate > today;
}

form.addEventListener('submit', function(e) {
    e.preventDefault();
    if (validateInputs()) {
        alert('Signup successful!'); 
        form.submit();
    }
});

function isValidUsername(username) {
    return /^[A-Za-z]+$/.test(username);
}

function isValidEmail(email) {
    return /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email.toLowerCase());
}

function isValidPakistaniPhone(phone) {
    return /^03\d{9}$/.test(phone);
}

function setError(elementId, message) {
    document.getElementById(elementId + "Error").innerText = message;
}

function setSuccess(elementId) {
    document.getElementById(elementId + "Error").innerText = '';
}

function validateInputs() {
    let isValid = true;

    if (username.value.trim() === '') {
        setError('username', 'Username is required');
        isValid = false;
    } else if (!isValidUsername(username.value.trim())) {
        setError('username', 'Username must contain only alphabets');
        isValid = false;
    } else {
        setSuccess('username');
    }

    if (email.value.trim() === '') {
        setError('email', 'Email is required');
        isValid = false;
    } else if (!isValidEmail(email.value.trim())) {
        setError('email', 'Provide a valid email address');
        isValid = false;
    } else {
        setSuccess('email');
    }

    if (phone.value.trim() === '') {
        setError('phone', 'Phone number is required');
        isValid = false;
    } else if (!isValidPakistaniPhone(phone.value.trim())) {
        setError('phone', 'Provide a valid Pakistani phone number (e.g., 03001234567)');
        isValid = false;
    } else {
        setSuccess('phone');
    }

    if (password.value.trim() === '') {
        setError('password', 'Password is required');
        isValid = false;
    } else if (password.value.trim().length < 8) {
        setError('password', 'Password must be at least 8 characters.');
        isValid = false;
    } else {
        setSuccess('password');
    }

    if (password2.value.trim() === '') {
        setError('password2', 'Please confirm your password');
        isValid = false;
    } else if (password2.value.trim() !== password.value.trim()) {
        setError('password2', "Passwords don't match");
        isValid = false;
    } else {
        setSuccess('password2');
    }

    if (address.value.trim() === '') {
        setError('address', 'Address is required');
        isValid = false;
    } else {
        setSuccess('address');
    }

    if (expiry.value.trim() === '') {
        setError('expiry', 'Expiry date is required');
        isValid = false;
    } else if (!isFutureDate(expiry.value.trim())) {
        setError('expiry', 'Expiry date must be in the future');
        isValid = false;
    } else {
        setSuccess('expiry');
    }

    return isValid;
}
