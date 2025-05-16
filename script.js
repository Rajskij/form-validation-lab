const loginForm = document.getElementById('login');
const registrationForm = document.getElementById('registration');
const errorDisplay = document.getElementById('errorDisplay');

// Part 3: Registration Form Validation Requirements
registrationForm.addEventListener('submit', event => {
    event.preventDefault();

    const username = registrationForm.elements['username'];
    const email = registrationForm.elements['email'];
    const password = registrationForm.elements['password'];
    const passwordCheck = registrationForm.elements['passwordCheck'];
    const terms = registrationForm.elements['terms'];
    let message = '';

    message += `${validateUsername(username.value)}\n`
    message += `${validateEmail(email.value)}\n`
    message += `${validatePassword(password.value, passwordCheck.value, username.value)}\n`
    if (!terms.checked) message += 'The terms and conditions must be accepted';

    message = message.trim();
    if (message.length > 0) {
        showMessage(false, false, message);
        return;
    }
    
    localStorage.setItem(username.value, {
        username: username.value.toLowerCase(),
        email: email.value.toLowerCase(),
        password: password.value
    })

    username.value = '';
    email.value = '';
    password.value = '';
    passwordCheck.value = '';
    terms.checked = false;

    showMessage(true, false, 'User was successfully created!');
});

const validateUsername = function(username) {
    if (username === '') return 'The username cannot be blank';
    if (username.length < 4) return 'The username must be at least four characters long';
    if (new Set(username).size < 2) return 'The username must contain at least two unique characters';
    if (/[\s\W]/.test(username)) return 'The username cannot contain any special characters or whitespace';

    return '';
} 

const validateEmail = function(email) {
    if (email === '') return 'The email cannot be blank';

    const atPos = email.indexOf('@');
    const dotPos = email.indexOf('.');

    if (email.length < 6) return 'The email must contain at least 6 character';
    if (atPos < 2) return 'The email must contain "@" character';
    if (dotPos < 2) return 'The email must contain "." character';
    if (dotPos - atPos < 2) return 'You must include a domain name after the @ symbol';
    if (/^.+@example\.com$/.test(email)) return 'The email must not be from the domain "example.com."'

    return '';
} 

const validatePassword = function(password, passwordCheck, username) {
    if (password.length < 12) return 'Passwords must be at least 12 characters long.';
    if (!/[A-Z]/.test(password)) return 'Passwords must have at least one uppercase letter';
    if (!/[a-z]/.test(password)) return 'Passwords must have at least one lowercase letter';
    if (!/[0-9]/.test(password)) return 'Passwords must have at least one number';
    if (!/[\W]/.test(password)) return 'Passwords must have at least one special character';
    if (password.toLowerCase() === 'password') return 'Passwords cannot contain the word "password" (uppercase, lowercase, or mixed)';
    if (password === username) return 'Passwords cannot contain the username';
    if (password !== passwordCheck) return 'Both passwords must match';

    return '';
}

// Part 4: Login Form Validation Requirements
loginForm.addEventListener('submit', event => {
    event.preventDefault();

    const username = loginForm.elements['username'];
    const password = loginForm.elements['password'];
    const persist = loginForm.elements['persist'];

    if (localStorage.getItem(username.value.toLowerCase()) === null) {
        showMessage(false, false, 'The username doesn\'t exist');
        return
    }

    if (username.value === '' || password.value === '') {
        username.value ? password.focus() : username.focus();
        const errorField = username.value ? 'password' : 'username' 
        showMessage(false, persist.checked, `The ${errorField} cannot be blank`);
    } else {
        showMessage(true, persist.checked, `All validation is successful`);
        username.value = '';
        password.value = '';
    }
});

function showMessage(isSuccessful, isChecked, message) {
    errorDisplay.style.display = 'flex'
    errorDisplay.innerText = '';
    errorDisplay.innerText = message;

    if (isSuccessful) {
        errorDisplay.style.backgroundColor = 'rgb(204, 255, 222)';
        errorDisplay.style.color = 'green';
        if (isChecked) {
            errorDisplay.textContent += '. Keep me logged in is checked'
        }
    } else {
        errorDisplay.style.backgroundColor = '#fcc'
        errorDisplay.style.color = 'red';
    }
}
