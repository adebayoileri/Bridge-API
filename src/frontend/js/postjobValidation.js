// const apiBase = "https://bridgetaskerapi.herokuapp.com/api/v1";
// const apiBase = "http://localhost:3000/api/v1";

const apiBase = "https://bridge-task-test-api.herokuapp.com/api/v1/"
const token = window.localStorage.getItem('token')
const checkToken = () => {
    if (token) {
        return token;
    }
    window.location.href = './login.html';
};

const jobTitle = document.getElementById('job-title');
const jobCategory = document.getElementById('job-category');
// const jobAddress = document.getElementById('address');
const jobState = document.getElementById('state');
const localGovernment = document.getElementById('local-government');
const jobType = document.getElementById('job-type');
const jobDueDate = document.getElementById('due-date');
const jobConditions = document.getElementById('job-conditions');
const priceRange = document.querySelectorAll('[name=price-range]');
const minimumPriceRange = document.getElementById('minimum-price-range');
const maximumPriceRange = document.getElementById('maximum-price-range');
const durationOfPayment = document.getElementById('duration-of-payment');
const fixedPriceInput = document.getElementById('fixed-price-input');
const projectDescription = document.getElementById('project-description');
const jobPicture = document.getElementById('bannerImg');

const formButton = document.getElementById('submit-form');
const form = document.getElementById('post-task-form');

const priceRangeContainer = document.querySelector('.job-price-range-container');

// price range input container
const priceRangeInputDivContainer = document.getElementById('price-range-input-container');

// fixed price input container
const fixedPriceInputDivContainer = document.getElementById('fixed-price-input-container');

const projectDescriptionErrorSpan = document.querySelector('.error-span');

let priceRangeValue;

// ----------------- only allow valid dates
var dtToday = new Date();
var month = dtToday.getMonth() + 1;
var day = dtToday.getDate();
var year = dtToday.getFullYear();
if (month < 10)
    month = '0' + month.toString();
if (day < 10)
    day = '0' + day.toString();

var maxDate = year + '-' + month + '-' + day;
jobDueDate.setAttribute('min', maxDate);


const validate = {
    jobTitleInput() {
        if (!jobTitle.value.trim() || jobTitle.value.trim().length < 2) {
            jobTitle.style.border = '1px solid red';
        } else {
            jobTitle.style.border = '1px solid #e0e0e0';
            return true;
        }
    },
    // jobAddressFunction() {
    //     if (!jobAddress.value.trim() || jobAddress.value.trim().length < 2) {
    //         jobAddress.style.border = '1px solid red';
    //     } else {
    //         jobAddress.style.border = '1px solid #e0e0e0';
    //         return true;
    //     }
    // },
    jobState() {
        if (!jobState.value || jobState.value === 'Select state') {
            jobState.style.border = '1px solid red';
        } else {
            jobState.style.border = '1px solid #e0e0e0';
            return true;
        }
    },
    localGovernment() {
        if (!localGovernment.value.trim() || localGovernment.value.trim().length < 2) {
            localGovernment.style.border = '1px solid red';
        } else {
            localGovernment.style.border = '1px solid #e0e0e0';
            return true;
        }
    },
    jobType() {
        if (!jobType.value || jobType.value === 'Select job type') {
            jobType.style.border = '1px solid red';
        } else {
            jobType.style.border = '1px solid #e0e0e0';
            return true;
        }
    },
    jobDueDate() {
        if (!jobDueDate.value.trim()) {
            jobDueDate.style.border = '1px solid red';
        } else {
            jobDueDate.style.border = '1px solid #e0e0e0';
            return true;
        }
    },
    jobPriceRange() {
        if (!priceRangeValue) {
            priceRangeContainer.style.border = '1px solid red';
        } else if (priceRangeValue === 'fixed-price') {
            priceRangeContainer.style.border = '1px solid #e0e0e0';
            // validate for fixed price input
            if (validateFixedPriceInput()) return true

        } else if (priceRangeValue === 'price-range') {
            priceRangeContainer.style.border = '1px solid #e0e0e0';
            // validate for price range input
            if (validatePriceRangeInput()) return true;
        } else {
            return false;
        }
    },
    projectDescription() {
        if (!projectDescription.value.trim()) {
            projectDescriptionErrorSpan.innerText = 'Input cannot be empty';
            projectDescriptionErrorSpan.classList.add('is-error-active');
            projectDescription.style.border = '1px solid red';
        } else if (projectDescription.value.trim().length < 50) {
            projectDescriptionErrorSpan.innerText = 'Description should be more than 50 characters long';
            projectDescriptionErrorSpan.classList.add('is-error-active');
            projectDescription.style.border = '1px solid red';
        } else {
            projectDescriptionErrorSpan.classList.remove('is-error-active');
            projectDescription.style.border = '1px solid #e0e0e0';
            return true;
        }
    }
}

// added event listners to the price range radio buttons
priceRange.forEach((radio) =>
    radio.addEventListener('change', function () {
        priceRangeValue ? document.getElementById(`${priceRangeValue}-input-container`).style.display = 'none' : ''
        priceRangeValue = radio.value;
        document.getElementById(`${priceRangeValue}-input-container`).style.display = 'flex';
        validate.jobPriceRange();
    }))


form.addEventListener('submit', submmission_handler)

formButton.addEventListener('click', submmission_handler)

function submmission_handler(e) {
    e.preventDefault();
    const
        jobTitleInput = validate.jobTitleInput,
        // jobAddressFunction = validate.jobAddressFunction,
        jobStateFunction = validate.jobState,
        localGovernmentFunction = validate.localGovernment,
        jobTypeFunction = validate.jobType,
        jobDueDateFunction = validate.jobDueDate,
        jobPriceRangeFunction = validate.jobPriceRange,
        projectDescriptionFunction = validate.projectDescription

    jobTitleInput()
    // jobAddressFunction()
    jobStateFunction()
    localGovernmentFunction()
    jobTypeFunction()
    jobDueDateFunction()
    jobPriceRangeFunction()
    projectDescriptionFunction()
    if (jobTitleInput() && jobStateFunction() && localGovernmentFunction() && jobTypeFunction() && jobDueDateFunction() && jobPriceRangeFunction() && projectDescriptionFunction()) {
        uploadImageToCloudinary_And_submit_form()
    }
}

// event listners for individual inputs
projectDescription.addEventListener('keyup', validate.projectDescription);
jobTitle.addEventListener('keyup', validate.jobTitleInput);
localGovernment.addEventListener('keyup', validate.localGovernment);
fixedPriceInput.addEventListener('keyup', validate.jobPriceRange)
jobType.addEventListener('change', validate.jobType);
jobDueDate.addEventListener('change', validate.jobDueDate);
jobState.addEventListener('change', validate.jobState);
// jobAddress.addEventListener('keyup', validate.jobAddressFunction)
minimumPriceRange.addEventListener('keyup', validate.jobPriceRange);
maximumPriceRange.addEventListener('keyup', validate.jobPriceRange);

// ----------------------------PHOTO UPLOAD FUNCTION STARTS ---------------------
// const photoUploadInput = document.getElementById('photo-upload-input');
const uploadLoader = document.querySelector('.upload-spinner');
const imageDiv = document.querySelector('.preview-pics-container');

var snackbarContainer = document.querySelector('#post-a-job-snackbar');


jobPicture.addEventListener('change', function () {
    uploadLoader.classList.add('is-active');
    if (this.files && this.files[0]) {
        // Make sure `file.name` matches our extensions criteria
        if (!/\.(jpe?g|png|gif)$/i.test(this.files[0].name)) {
            uploadLoader.classList.remove('is-active');
            const data = {
                message: `Upload error: ${this.files[0].name} is not an image`,
                timeout: 3500
            }
            return snackbarContainer.MaterialSnackbar.showSnackbar(data);
        } // else...

        var reader = new FileReader();
        reader.addEventListener("load", (e) => {
            uploadLoader.classList.remove('is-active');
            const fileSize = formatBytes(this.files[0].size);
            imageDiv.classList.add('preview-pics-container-is-active');
            imageDiv.innerHTML = `
                      <img src="${e.target.result}" title="${this.files[0].name}" alt="${this.files[0].name}">
                      <div class="pics-details">${fileSize}</div>
                      <button style="background-color: #ff0000c9; position: absolute; bottom: -64px; margin: 0px 15px;" onclick="cancelUpload()" class="mdl-button mdl-js-button mdl-button--raised mdl-button--colored">
                         Cancel Upload
                      </button>`
        });

        reader.readAsDataURL(this.files[0]);
    }
})


function cancelUpload() {
    var emptyFile = document.createElement('input');
    emptyFile.type = 'file';
    jobPicture.files = emptyFile.files;
    imageDiv.classList.remove('preview-pics-container-is-active');
    imageDiv.innerHTML = ''
}


function validateFixedPriceInput() {
    if (!fixedPriceInput.value || fixedPriceInput.value.length < 2) {
        fixedPriceInput.style.border = '1px solid red';
    } else {
        fixedPriceInput.style.border = '1px solid #e0e0e0';
        return true;
    }
}

function validatePriceRangeInput() {
    const state = {
        minimumPriceRange: false,
        maximumPriceRange: false
    }

    if (!minimumPriceRange.value && minimumPriceRange.value.length < 2) {
        state.minimumPriceRange = false;
        minimumPriceRange.style.border = '1px solid red';
    } else if (minimumPriceRange.value) {
        state.minimumPriceRange = true;
        minimumPriceRange.style.border = '1px solid #e0e0e0';
    }

    if (!maximumPriceRange.value && maximumPriceRange.value.length < 2) {
        state.minimumPriceRange = false;
        maximumPriceRange.style.border = '1px solid red';
    } else if (maximumPriceRange.value) {
        state.maximumPriceRange = true;
        maximumPriceRange.style.border = '1px solid #e0e0e0';
    }
    if (state.minimumPriceRange && state.maximumPriceRange) {
        return true
    }
}

function formatBytes(bytes, decimals = 2) {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}



// ------------------------- FETCHING CATEGORIES ------
const jobCategoryDropdown = document.getElementById('job-category');

const categoryStorage = JSON.parse(window.sessionStorage.getItem('categories'));

if (!categoryStorage) {

    fetch(`${apiBase}/category`, {
            method: "GET",
            headers: {
                "content-type": "application/json"
            }
        })
        .then((response) => response.json())
        .then(response => {
            if (response.code === 200) {
                window.sessionStorage.setItem('categories', JSON.stringify(response))
                response.data.forEach((response) => {
                    var newOption = document.createElement("option");
                    newOption.innerText = `${response.name}`;
                    jobCategoryDropdown.appendChild(newOption);
                })
            } else {
                return console.log({
                    message: 'something went wrong, please try again'
                });
            }
        })
        .catch((err) => {
            if (err.message.indexOf('Failed to fetch') === 0) {
                // display internet error message
                return console.log({
                    message: 'Could not connect to the internet, looks like you are offline'
                })
            } else {
                // display something went wrong message
                // return console.log({
                //     message: 'something went wrong, please try again'
                // })
                // console.log("An error occur while connecting to our servers" + err);
            }
        })
} else {
    categoryStorage.data.forEach((response) => {
        var newOption = document.createElement("option");
        newOption.innerText = `${response.name}`;
        jobCategoryDropdown.appendChild(newOption);
    })
}

// ---------------------- UPLOADING task TO DB ----
const formSpinner = document.querySelector('.form-spinner');
const formLoaderRetryBtn = document.querySelector('.retry-btn');
const errorMessage = document.querySelector('.error-message');
const formLoaderOverlay = document.querySelector('.form-loader-overlay');

const formSpinLoader = {
    show() {
        errorMessage.innerHTML = '';
        formLoaderOverlay.style.display = 'flex';
        // formLoaderRetryBtn.classList.remove('is-retry-button-active');
        formSpinner.classList.add('is-active');
    },
    hide() {
        formLoaderOverlay.style.display = 'none';
        formSpinner.classList.remove('is-active');
    }
}

const formErrorMessage = {
    show({message: message}) {
        errorMessage.innerHTML = `<p style="font-weight: bold">${message}</p>`;
        // formLoaderOverlay.style.display = 'flex';
        // formLoaderRetryBtn.classList.add('is-retry-button-active');
    },
    hide() {
        errorMessage.innerHTML = '';
        formLoaderOverlay.style.display = 'none';
        // formLoaderRetryBtn.classList.remove('is-retry-button-active');
    }
}

function uploadImageToCloudinary_And_submit_form() {
    
    formErrorMessage.hide()
    formSpinLoader.show()
    // upload picture if present
    if (jobPicture.files[0]) {
        const formData = new FormData();
        formData.append('image', jobPicture.files[0]);

        fetch(`${apiBase}/upload`, {
                method: "POST",
                body: formData,
                headers: {
                    'authorization': `bearer ${checkToken()}`
                },
            })
            .then((response) => response.json())
            .then(response => {
                if (response.status === 'Ok') {
                    uploadTask(response.data.secure_url);
                }else if(response.code === 403){
                    return window.location.href = './login.html';
                } else {
                    formSpinLoader.hide();
                    formErrorMessage.show({message: 'something went wrong while uploading your image, please try again'});
                    // return console.log({
                    //     message: 'something went wrong while uploading your image, please try again'
                    // });
                }
            })
            .catch((err) => {

                if (err.message.indexOf('Failed to fetch') === 0) {
                    formSpinLoader.hide();
                    formErrorMessage.show({message: 'Could not connect to the internet, looks like you are offline'})
                    // display internet error message
                    // return console.log({
                    //     message: 'Could not connect to the internet, looks like you are offline'
                    // })
                } else {
                    formSpinLoader.hide();
                    formErrorMessage.show({message: 'something went wrong, please try again'})
                    // display something went wrong message
                    // return console.log({
                    //     message: 'something went wrong, please try again'
                    // })
                    // console.log("An error occur while connecting to our servers" + err);
                }
            });
    } else {
        uploadTask();
    }
}

// function to upload task
function uploadTask(uploadedImage = 'null') {
    let formValues = {};

    if (priceRangeValue == 'fixed-price') {
        formValues = {
            title: jobTitle.value,
            bannerImg: uploadedImage,
            description: projectDescription.value,
            category: jobCategory.value,
            location: `${localGovernment.value}, ${jobState.value}`,
            jobtype: jobType.value,
            pricetype: 'Fixed price',
            fixedprice: fixedPriceInput.value,
            startdate: new Date(),
            enddate: jobDueDate.value
        }
    } else {
        formValues = {
            title: jobTitle.value,
            bannerImg: uploadedImage,
            description: projectDescription.value,
            category: jobCategory.value,
            location: `${localGovernment.value}, ${jobState.value}`,
            jobtype: jobType.value,
            pricetype: 'Price range',
            minbudget: minimumPriceRange.value,
            maxbudget: maximumPriceRange.value,
            startdate: new Date(),
            enddate: jobDueDate.value
        }
    }
    console.log(formValues)

    fetch(`${apiBase}/tasks/create`, {
            method: "POST",
            body: JSON.stringify(formValues),
            headers: {
                "Content-Type": "application/json",
                'authorization': `bearer ${checkToken()}`
            },
        })
        .then((response) => response.json())
        .then(response => {
            if (response.code === 201) {
                return window.location.href = './index.html';
            }else if(response.code === 403){
                return window.location.href = './login.html';
            } else {
                formSpinLoader.hide();
                formErrorMessage.show({message: 'something went wrong while uploading your task, please try again'});
                // return console.log({
                //     message: 'something went wrong while uploading your task, please try again'
                // });
            }
        })
        .catch((err) => {

            if (err.message.indexOf('Failed to fetch') === 0) {
                formSpinLoader.hide();
                // display internet error message
                formErrorMessage.show({message: 'Could not connect to the internet, looks like you are offline'});
                // return console.log({
                //     message: 'Could not connect to the internet, looks like you are offline'
                // })
            } else {
                formSpinLoader.hide();
                formErrorMessage({message: 'something went wrong, please try again'})
                // display something went wrong message
                // return console.log({
                //     message: 'something went wrong, please try again'
                // })
                // console.log("An error occur while connecting to our servers" + err);
            }
        });
}