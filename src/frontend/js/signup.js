// const apiBase = "https://bridgetaskerapi.herokuapp.com/api/v1/auth";
const apiBase = "http://localhost:3000/api/v1/auth";

// const apiBase = "https://bridge-task-test-api.herokuapp.com/api/v1/auth"
const signupForm = document.querySelector("#signup-form");

const signupButton = document.getElementById('signup-btn');

const loginInputs = document.querySelectorAll('.login-input');

const first_name = document.getElementById("first_name");
const last_name = document.getElementById("last_name");
const email = document.getElementById("email");
const password = document.getElementById("password");
const phonenumber = document.getElementById('phonenumber');

// variable for material design loader
const materialDesignLoader = document.querySelector('.mdl-js-progress');
// variable for loading overlay
const loaderOverlay = document.querySelector('.loader-login-overlay');
// variable for displaying alert
const alertModal = document.querySelector('.alertModal');

// error spans
const emailErrorSpan = document.getElementById('create-acc-email-error-span');
const firstNameErrorSpan = document.getElementById('create-acc-firstname-error-span');
const lastnameErrorSpan = document.getElementById('create-acc-lastname-error-span');
const phonenumberErrorSpan = document.getElementById('create-acc-phonenumber-error-span');
const passwordErrorSpan = document.getElementById("create-acc-password-error-span");

const loader = {
  start() {
    materialDesignLoader.classList.add('mdl-progress');
    loaderOverlay.classList.add('overlay-loading');
  },
  stop() {
    materialDesignLoader.classList.remove('mdl-progress');
    loaderOverlay.classList.remove('overlay-loading');
  }
}

const Alert = {
  add_danger({
    message: message
  }) {
    alertModal.innerText = message;
    alertModal.classList.add('alert-danger');
  },
  add_warning({
    message: message
  }) {
    alertModal.innerText = message;
    alertModal.classList.add('alert-warning');
  },
  remove_alert() {
    alertModal.classList.remove('alert-danger');
    alertModal.classList.remove('alert-warning');
  }
}

function signupUser(){
  if (signupForm) {
    loader.start();

      let first_name_value = first_name.value.trim();
      let last_name_value = last_name.value.trim();
      let phonenumber_value = phonenumber.value.trim();
      let email_value = email.value.trim();
      let password_value = password.value.trim();

      fetch(`${apiBase}/signup`, {
          method: "POST",
          body: JSON.stringify({
            first_name: first_name_value,
            last_name: last_name_value,
            phonenumber: phonenumber_value,
            email: email_value,
            password: password_value,
          }),
          headers: {
            "Content-Type": "application/json"
          },
        })
        .then((response) => response.json())
        .then(response => {
          loader.stop();
          if (response.code === 200) {
            // save the token in the localstroage and redirect users here
            window.localStorage.setItem('token', response.token);
            // check if the users tried to access a route using web storage before but was redirected here
  
            // else redirect to all tasks page
            window.location.href = "./index.html";
          } else if (response.status === 'bad request') {
            // display incorrect username and password
            return Alert.add_danger({
              message: 'Email has been taken'
            })
          } else {
            return Alert.add_warning({
              message: 'something went wrong, please try again'
            });
          }
        })
        .catch((err) => {
          loader.stop();
          if (err.message.indexOf('Failed to fetch') === 0) {
            // display internet error message
            return Alert.add_warning({
              message: 'Could not connect to the internet, looks like you are offline'
            })
          } else {
            // display something went wrong message
            return Alert.add_warning({
              message: 'something went wrong, please try again'
            })
            // console.log("An error occur while connecting to our servers" + err);
          }
        });
    // });
  }
}


// ---------------------------------- FROM VALIDATION BEGINS ---------------

const validate = {
  email() {
    if (!email.value.trim()) {
      throwError(email, emailErrorSpan, 'Input cannot be empty');
    } else if (!checkEmailValidity(email.value)) {
      return throwError(email, emailErrorSpan, 'Invalid Email!');
    } else if (checkEmailValidity(email.value)) {
      throwSuccess(email, emailErrorSpan);
      return true;
    }
  },
  firstName() {
    if (!first_name.value.trim()) {
      throwError(first_name, firstNameErrorSpan, 'Input cannot be empty');
    } else if (first_name.value.trim().length < 2) {
      return throwError(first_name, firstNameErrorSpan, 'firstname must be more than 2 characters!');
    } else if (first_name.value.trim().length > 2) {
      throwSuccess(first_name, firstNameErrorSpan);
      return true;
    }
  },
  lastName() {
    if (!last_name.value.trim()) {
      throwError(last_name, lastnameErrorSpan, 'Input cannot be empty');
    } else if (last_name.value.trim().length < 2) {
      return throwError(last_name, lastnameErrorSpan, 'lastname must be more than 2 characters!');
    } else if (last_name.value.trim().length > 2) {
      throwSuccess(last_name, lastnameErrorSpan);
      return true;
    }
  },  phoneNumber() {
    if (!phonenumber.value.trim()) {
      throwError(phonenumber, phonenumberErrorSpan, 'Input cannot be empty');
    }else if (!checkIfNumber(phonenumber.value.trim())) {
      return throwError(phonenumber, phonenumberErrorSpan, 'Invalid phone number');
    }else if (phonenumber.value.trim().length < 11) {
      return throwError(phonenumber, phonenumberErrorSpan, 'Invalid phone number');
    }  else if (checkIfNumber(phonenumber.value.trim())) {
      throwSuccess(phonenumber, phonenumberErrorSpan);
      return true;
    }
  },
  password() {
    if (!password.value.trim()) {
      throwError(password, passwordErrorSpan, 'Input cannot be empty');
    } else if (password.value.trim().length < 4) {
      throwError(password, passwordErrorSpan, 'password must be more than 4 characters');
    } else if (password.value.trim().length > 4) {
      throwSuccess(password, passwordErrorSpan);
      return true;
    }
  }
}

loginInputs.forEach((input) => {
  input.addEventListener('keyup', (e) => {
    const currentInputType = e.currentTarget.name;

    if (currentInputType === 'email') {
      validate.email();
    } else if (currentInputType === 'password') {
      validate.password();
    } else if (currentInputType === 'firstname') {
      validate.firstName();
    } else if (currentInputType === 'phonenumber') {
      validate.phoneNumber();
    } else if (currentInputType === 'lastname') {
      validate.lastName();
    }
  })
});

signupButton.addEventListener('click', (e) => {
  e.preventDefault();
  validate.email();
  validate.password();
  validate.firstName();
  validate.lastName();
  validate.phoneNumber();
  (validate.email() && validate.password() && validate.firstName() && validate.lastName() && validate.phoneNumber()) && signupUser();
})

function throwError(input, span, errorText) {
  span ? span.innerText = `${errorText ? errorText : ''}` : '';
  input.classList.add('border-error-indicator');
  span ? span.classList.add('error-span-indicator') : '';
}

function throwSuccess(input, span) {
  span ? span.innerText = '' : '';
  input.classList.remove('border-error-indicator');
  span ? span.classList.remove('error-span-indicator') : '';
}

function checkEmailValidity(email) {
  const regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  return regex.test(String(email).toLowerCase());
}

function checkIfNumber(num){
  const regex = /^[0-9]*$/
  return regex.test(String(num));
}