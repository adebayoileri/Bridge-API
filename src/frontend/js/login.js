// const apiBase = "https://bridgetaskerapi.herokuapp.com/api/v1/auth";
// const apiBase = "http://localhost:5000/api/v1/auth";

const apiBase = "https://bridge-task-test-api.herokuapp.com/api/v1/auth"
const email = document.getElementById("email");
const password  = document.getElementById('password');
const loginForm = document.querySelector("#login-form");
const loginInputs = document.querySelectorAll('.login-input');
const emailErrorSpan = document.getElementById('login-acc-email-error-span');
const passwordErrorSpan = document.getElementById('login-acc-password-error-span');
const loginButton = document.getElementById('login-btn');

// variable for material design loader
const materialDesignLoader = document.querySelector('.mdl-js-progress');
// variable for loading overlay
const loaderOverlay = document.querySelector('.loader-login-overlay');
// variable for displaying alert
const alertModal = document.querySelector('.alertModal');

const loader = {
  start(){
    materialDesignLoader.classList.add('mdl-progress');
    loaderOverlay.classList.add('overlay-loading');
  },
  stop(){
    materialDesignLoader.classList.remove('mdl-progress');
    loaderOverlay.classList.remove('overlay-loading');
  }
}

const Alert = {
  add_danger({message : message}){
    alertModal.innerText = message;
    alertModal.classList.add('alert-danger');
  },
  add_warning({message: message}){
    alertModal.innerText = message;
    alertModal.classList.add('alert-warning');
  },
  remove_alert(){
    alertModal.classList.remove('alert-danger');
    alertModal.classList.remove('alert-warning');
  }
}

function loginInUser(){
  if (loginForm) {
   
      Alert.remove_alert();
      const email = document.getElementById("email").value;
      const password = document.getElementById("password").value;
  
      // started the loading indicator
      loader.start();

       fetch(`${apiBase}/login`, {
        method: "POST",
        body: JSON.stringify({
          email,
          password,
        }),
        headers: { "Content-Type": "application/json" },
      })
        .then((response) => response.json())
        .then(response  =>  {
          loader.stop();
            if (response.code === 200) {
              // save the token in the localstroage and redirect users here
              window.localStorage.setItem('token' , response.token);
              // check if the users tried to access a route using web storage before but was redirected here

              // else redirect to all tasks page
              window.location.href = "/feed";
            }else if(response.status === 'bad request'){
              // display incorrect username and password
              return Alert.add_danger({message : 'Incorrect username or password'})
            }else{
              return Alert.add_warning({message: 'something went wrong, please try again'});
            }
          }
        )
        .catch((err) => {
          loader.stop()
          if(err.message.indexOf('Failed to fetch') === 0){
            // display internet error message
            return Alert.add_warning({message : 'Could not connect to the internet, looks like you are offline'})
          }else{
            // display something went wrong message
            return Alert.add_warning({message : 'something went wrong, please try again'})
            // console.log("An error occur while connecting to our servers" + err);
          }
          // console.log('the real error message', err.message)
        });
  }
}


// ---------------------------------- FROM VALIDATION BEGINS ---------------

const validate = {
  email(){
    if (!email.value) {
      throwError(email, emailErrorSpan, 'Input cannot be empty');
    }else if(!checkEmailValidity(email.value)){
       return throwError(email, emailErrorSpan, 'Invalid Email!');
    }else if (checkEmailValidity(email.value)){
      throwSuccess(email, emailErrorSpan);
      return true;
    }
  },
  password(){
   if (!password) {
    throwError(password, passwordErrorSpan, 'Input cannot be empty');
    }else if (password.value.trim().length < 4) {
    throwError(password, passwordErrorSpan, 'password must be more than 4 characters');
    }else if (password.value.trim().length > 4) {
    throwSuccess(password, passwordErrorSpan);
    return true;
   }
  }
}

loginInputs.forEach((input) => {
    input.addEventListener('keyup', (e) => {
        const currentInputType = e.currentTarget.type;
      
        if (currentInputType === 'email') {
            validate.email();
        } else if (currentInputType === 'password') {
           validate.password();
        }
    })
});

loginButton.addEventListener('click', (e) => {
    e.preventDefault();
    validate.email();
    validate.password();
    (validate.email() && validate.password()) && loginInUser();
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

function checkEmailValidity(email){
  const regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  return regex.test(String(email).toLowerCase());
}