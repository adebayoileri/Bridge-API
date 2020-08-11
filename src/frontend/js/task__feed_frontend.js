// const apiBase = "https://bridgetaskerapi.herokuapp.com/api/v1";
// const apiBase = "http://localhost:5000/api/v1";
let fullPageBody = document.querySelector('body');

const apiBase = "https://bridge-task-test-api.herokuapp.com/api/v1"
const token = window.localStorage.getItem('token')

const recommendationContainer = document.querySelector('.recommendation-container');

// ----------------------- FUNCTION TO CHECK IF USER IS LOGGED IN
const topNav = document.querySelector('.top-task-feed-nav');
const logoutBtnContainer = document.querySelector('.android-navigation-container');
const taskFeedSideBarContainer = document.querySelector('.task-feed-side-bar');

const currentUserDetails = {
  userId: null,
  currentUserName: null
};

MicroModal.init();

const handleNav = {
  showLoginAndSignupButtons() {
    topNav.innerHTML = `
   <a class="mdl-navigation__link mdl-typography--text-uppercase post-job post-a-job-with-auth" onClick="postAjob()" href="#">Post a job</a>
    <a class="mdl-navigation__link mdl-typography--text-uppercase auth-nav-btn" href="/signup">sign up</a>
    <a class="mdl-navigation__link mdl-typography--text-uppercase auth-nav-btn" href="/login">login in</a>`

  },
  showLoggedInProfilePics({
    image: image,
    name: name
  }) {
    topNav.innerHTML = `
    <a class="mdl-navigation__link mdl-typography--text-uppercase post-job" onClick="postAjob()" href="#">Post a job</a>
    <div title="logged in as ${name}"  class="user-image">
    <img src="${image}"/>
    </div>`
    logoutBtnContainer.innerHTML = `<a title="logout" class="mdl-navigation__link"
            style="height: 26px; line-height: 13px; margin: 0; padding: 5px; width: 18px; display: flex; justify-content: center;
            align-items: center;
            font-size: 17px;
            color: #ff000099;
            cursor: pointer;"
        onClick="logout()"><i class="fa fa-power-off" aria-hidden="true"></i>
   </a>`

    const logoutLink = document.createElement('a');
    logoutLink.classList.add('mdl-navigation__link');
    logoutLink.setAttribute('onClick', 'logout()');
    logoutLink.innerHTML = 'Log out'
    taskFeedSideBarContainer.appendChild(logoutLink);
  }
}

const checkToken = () => {
  if (token) {
    fetch(`${apiBase}/user`, {
        method: "GET",
        headers: {
          "content-type": "application/json",
          "authorization": `Bearer ${token}`
        }
      }).then((response) => response.json())
      .then(response => {
        if (response.code === 200) {
          currentUserDetails.userId = response.data.id;
          currentUserDetails.currentUserName = `${response.data.first_name} ${response.data.last_name}`;
          return handleNav.showLoggedInProfilePics({
            image: `${response.data.profileimg}`,
            name: `${response.data.first_name} ${response.data.last_name}`
          })
        } else {
          handleNav.showLoginAndSignupButtons();
        }
      }).catch((err) => {
        // tasksDetailsLoaderMethod.hide();

        if (err.message.indexOf('Failed to fetch') === 0) {
          handleNav.showLoginAndSignupButtons();
          // console.log('no network from user is logged in')
          setTimeout(() => checkToken(), 8000)
        } else {
          // display something went wrong message
          // taskDetailsError.classList.add('active')
          // return taskDetailsError.innerHTML = '<p>something went wrong, please try again</p>';
          // console.log("An error occur while connecting to our servers" + err);
        }
      })
  } else {
    handleNav.showLoginAndSignupButtons();
  }
};

checkToken()


// -----------------fetching all tasks -------

const feedContainer = document.getElementById('feed-container');

const feedLoaderDiv = document.querySelector('.mdl-js-progress');
// this variable is to track if the browser is newly loaded
let initialLoad = true;
// variable for counting pages
let loadTaskPageCount = 0;

let allowFetch = true;
const infiniteScrollSpinner = document.querySelector('.infinite-scroll-spinner');

const feedLoader = {
  showFeedLoader() {
    feedLoaderDiv.classList.add('mdl-progress');
  },
  hideFeedLoader() {
    feedLoaderDiv.classList.remove('mdl-progress');
  }
}

const infiniteScrollLoader = {
  show() {
    infiniteScrollErrorMessage.innerHTML = '';
    infiniteScrollRetryButton.setAttribute('onClick', 'fetchTask()');
    infiniteScrollRetryButton.classList.remove('is-retry-button-active');
    infiniteScrollSpinner.classList.add('is-active');
  },
  hide() {
    infiniteScrollSpinner.classList.remove('is-active');
  }
}

const infiniteScrollErrorMessage = document.querySelector('.error-message');
const infiniteScrollRetryButton = document.querySelector('.retry-btn');

const infiniteScrollError = {
  show({
    message: message
  }) {
    infiniteScrollErrorMessage.innerHTML = message;
    infiniteScrollRetryButton.classList.add('is-retry-button-active');
  },
  hide() {
    infiniteScrollErrorMessage.innerHTML = '';
    infiniteScrollRetryButton.classList.remove('is-retry-button-active');
  }
}

// added onscroll to feed container
feedContainer.addEventListener("scroll", (event) => {
  addTask()
});

const addTask = function () {
  let scrollHeight = feedContainer.scrollHeight;
  let scrollTop = feedContainer.scrollTop;
  let clientHeight = feedContainer.clientHeight;

  if (scrollHeight - scrollTop == clientHeight && allowFetch) {
    // fetch data
    fetchTask();
    infiniteScrollLoader.show();
  }
};

fetchTask();

function fetchTask() {

  // check if the browser is just loading [for the purpose of showing diffrent loaders]
  if (initialLoad) {
    // started the loading indicator for fresh page load
    feedLoader.showFeedLoader();
    initialLoad = false;
  } else {
    // started infiniteScrollLoader for infinite scroll loading indication
    infiniteScrollLoader.show()
  }

  // disble scroll event for fetching data while former data is still loading
  allowFetch = false;

  fetch(`${apiBase}/tasks?start=${loadTaskPageCount}&count=30`, {
      method: "GET",
      headers: {
        "content-type": "application/json"
      }
    })
    .then((response) => response.json())
    .then(response => {
      feedLoader.hideFeedLoader();
      infiniteScrollLoader.hide();
      if (response.code === 200 && response.data.length !== 0) {
        allowFetch = true;
        infiniteScrollError.hide()
        response.data.forEach((response) => {
          var newDiv = document.createElement("div");
          newDiv.classList.add('jobpost-card');

          const startdate = moment(response.createdat);
          const enddate = moment(response.enddate);

          const formmatedEndDate = enddate.from(startdate);
          newDiv.innerHTML += `
                  <div class="jobpost-title">
                  <span onClick="fetchWithId(this)" data-id="${response.id}"  class="jobpost-card-overlay ${formmatedEndDate.indexOf('in') !== 0 ? "task-expired" : ''}"></span>
                  <h4>${response.title}</h4>
                   </div>
                  <div class="jobpost-details">
                    <p> ${response.description}</p>
                  </div>
                  <div class="sub-jobpost">

                   <div class="sub-jobpost-cover">
                       <div class="sub-jobpost-image"> <img src="../assets/images/location.svg" /> </div>
                       <div class="sub-jobpost-text">${response.location}</div>
                   </div>
                   <div class="sub-jobpost-cover">
                       <div class="sub-jobpost-image"> <img src="../assets/images/wallet.svg" /> </div>
                       <div class="sub-jobpost-text"> ${response.pricetype === 'Fixed price' ? `₦ ${numeral(response.fixedprice).format('0,0')}`: `<span>Min : ₦ ${numeral(response.minbudget).format('0,0')} - Max : ₦ ${numeral(response.maxbudget).format('0,0')} </span>`}</div>
                   </div>
                   <div class="sub-jobpost-cover">
                       <div class="sub-jobpost-image"> <img src="../assets/images/briefcase.svg" /> </div>
                       <div class="sub-jobpost-text">${response.jobtype === 'Full time' ? 'Full time' : 'Part time' }</div>
                   </div>
                   <div class="sub-jobpost-cover">
                       <div class="sub-jobpost-image"> <img src="../assets/images/time.svg" /> </div>
                       <div class="sub-jobpost-text">posted ${moment(response.createdat).fromNow()}</div>
                   </div>
                    <div class="sub-jobpost-cover">
                      <div class="sub-jobpost-image expire-div"></div>
                      <div class="sub-jobpost-text">${formmatedEndDate.indexOf('in') === 0 ? 'Expries' : 'Expired'} ${formmatedEndDate}</div>
                    </div>
                   <div class="status">${formmatedEndDate.indexOf('in') !== 0 ? '<button class="closed-status" style="background-color: #f44336a3">Expired</button>' : response.status === 'pending' ? '<button class="open-status">Open</button>' : '<button class="closed-status">closed<button>'}</div>
                  </div>

                  </div>
                `;
          document.querySelector(".jobpost-card-parent").appendChild(newDiv);
        })
        return loadTaskPageCount = loadTaskPageCount + 30;
      } else if (response.code === 200 && response.data.length === 0) {
        allowFetch = false;
        infiniteScrollError.show({
          message: 'No post found'
        });
        return infiniteScrollRetryButton.classList.remove('is-retry-button-active');
      } else {
        return infiniteScrollError.show({
          message: 'something went wrong, please try again'
        });
      }
    })
    .catch((err) => {
      feedLoader.hideFeedLoader();
      infiniteScrollLoader.hide();
      if (err.message.indexOf('Failed to fetch') === 0) {
        // display internet error message
        return infiniteScrollError.show({
          message: 'Could not connect to the internet, looks like you are offline'
        })
      } else {
        // display something went wrong message
        return infiniteScrollError.show({
          message: 'something went wrong, please try again'
        })
        // console.log("An error occur while connecting to our servers" + err);
      }
    });
}


function refreshTask() {
  loadTaskPageCount = 0;
  allowFetch = true;
  initialLoad = true;
  document.querySelector(".jobpost-card-parent").innerHTML = ''
  fetchTask();
}

// -------------- -- - -fetching single task details arena --------------

const jobdetailsContainer = document.querySelector('.job-details-container');
// back icon to close job details container
const backIcon = document.querySelector('.back-icon');

const taskdetailsSpinner = document.querySelector('.job-details-spinner');
const taskDetailsTitle = document.getElementById('task-details-title')
const taskDetailsDescription = document.querySelector('.job-description-text');
const jobSummaryContainer = document.querySelector('.jd-two');
const imagegalleryContainer = document.querySelector('.job-picture-gallery');
const taskDetailsError = document.getElementById('task-details-error');

const tasksDetailsLoaderMethod = {
  show() {
    taskdetailsSpinner.classList.add('is-active')
  },
  hide() {
    taskdetailsSpinner.classList.remove('is-active')
  }
}

function fetchWithId(task) {
  if(!task.getAttribute('data-id') || !task) return console.log('error');

  jobdetailsContainer.style.display = 'block';
  setTimeout(() => jobdetailsContainer.classList.add('open-jobdetails-modal'), 200)
  const taskid = task.getAttribute('data-id');
  taskDetailsError.innerHTML = '';
  taskDetailsError.classList.remove('active')
  // loader
  taskDetailsError.classList.add('active')
  tasksDetailsLoaderMethod.show();

  fetch(`${apiBase}/tasks/${taskid}`, {
      method: "GET",
      headers: {
        "content-type": "application/json"
      }
    })
    .then((response) => response.json())
    .then(response => {
      taskDetailsError.classList.remove('active')
      tasksDetailsLoaderMethod.hide();

      if (response.code === 200 && response.data.length !== 0) {
        const startdate = moment(response.data.createdat);
        const enddate = moment(response.data.enddate);

        const formmatedEndDate = enddate.from(startdate);

        recommendation();

        // function isTaskExpired({startdate: startDate}){
        //   return function({enddate: endDate}){
        //     const startdate = moment(startDate);
        //     const enddate = moment(endDate);
        //     const formmatedEndDate = enddate.from(startdate);
        //     return formmatedEndDate.indexOf('in') !== 0 ? true : false;
        //   }
        // }

        taskDetailsTitle.innerText = response.data.title;
        imagegalleryContainer.innerHTML = response.data.bannerimg !== 'null' ? `<img src="${response.data.bannerimg}" style="width: 80%; height: auto; border-radius: 15px;" alt="description picture posted by ${response.user.first_name}"/>` : ''
        taskDetailsDescription.innerHTML = `<span> Job description</span>
              <p style="margin-top: 30px; word-break: break-word;">${response.data.description}</p>`
        jobSummaryContainer.innerHTML = `
                <!--deadline countdown-->
              <div class="jd-btn-one"><button>${formmatedEndDate.indexOf('in') === 0 ? 'Expries' : 'Expired'}  ${formmatedEndDate}</button></div>
             <div class="jd-btn-two">
             ${formmatedEndDate.indexOf('in') !== 0 
                ? '<button style="background-color: #ff00008a; cursor: not-allowed;" disabled>Expired</button>'
                : currentUserDetails.userId === response.user.id
                ? ''
                : response.data.status === 'pending'
                ? `<button style="cursor: pointer"
                       data-id="${response.data.id}"
                       data-posterName="${response.user.first_name} ${response.user.last_name}"
                        onClick="showApplyModal(this)"
                        data-title="${response.data.title}"
                        data-posterId="${response.user.id}"
                         data-poster-email="${response.user.email}"
                         data-dueDate="${moment(response.data.enddate).format("dddd, MMMM Do YYYY")}"
                         data-budget="${response.data.pricetype === 'Fixed price' ? `₦ ${numeral(response.data.fixedprice).format('0,0')}`: `<span>Min : ₦ ${numeral(response.data.minbudget).format('0,0')} - Max : ₦ ${numeral(response.data.maxbudget).format('0,0')} </span>`}">Apply now</button>` 
                : `<button style="background-color: gray; cursor: not-allowed;" disabled>Closed</button>`}</div>
              
             <!--job summary details-->
              <div class="js-parent">
                <div class="js-title">Job Summary</div>
                <!--icon and details-->
                <div class="js-details">
                  <div> <img src="../assets/images/location.svg"/> </div>
                  <div class="js-icon-info"> 
                    <div class="js-icon-info-one">Location</div>
                    <div class="js-icon-info-two">${response.data.location}</div>
                  </div>
                </div> <!--end-->
                <!--icon and details-->
                <div class="js-details">
                  <div> <img src="../assets/images/briefcase.svg"/> </div>
                  <div class="js-icon-info"> 
                    <div class="js-icon-info-one">Job Type</div>
                    <div class="js-icon-info-two">${response.data.jobtype === 'Full Time' ? 'Full Time' : 'Part Time'}</div>
                  </div>
                </div> <!--end-->
              <!--icon and details-->
                <div class="js-details">
                  <div> <img src="../assets/images/wallet.svg"/> </div>
                  <div class="js-icon-info"> 
                    <div class="js-icon-info-one">Budget</div>
                    <div class="js-icon-info-two">
                      ${response.data.pricetype === 'Fixed price' ? `₦ ${numeral(response.data.fixedprice).format('0,0')}`: `<span>Min : ₦ ${numeral(response.data.minbudget).format('0,0')} <br> <br> Max : ₦ ${numeral(response.data.maxbudget).format('0,0')} </span>`}
                    </div>
                  </div>
                </div> <!--end-->
                
                <!--icon and details-->
                <div class="js-details">
                  <div> <img src="../assets/images/time.svg"/> </div>
                  <div class="js-icon-info"> 
                    <div class="js-icon-info-one">Closing Date</div>
                    <div class="js-icon-info-two">${moment(response.data.enddate).format("dddd, MMMM Do YYYY")}</div>
                  </div>
                </div> <!--end-->
                
                <!--icon and details-->
                <div class="js-details">
                  <div> <img src="../assets/images/account-circle.svg"/> </div>
                  <div class="js-icon-info"> 
                    <div class="js-icon-info-one">Posted By</div>
                    <div class="js-icon-info-two">${currentUserDetails.userId === response.user.id ? "<span>You</span>" : `<span>${response.user.first_name} ${response.user.last_name} </span>` }</div>
                  </div>
                </div> <!--end-->
      
                <!--icon and details-->
                <div class="js-details">
                  <div> <img src="../assets/images/location.svg"/> </div>
                  <div class="js-icon-info"> 
                    <div class="js-icon-info-one">Date Posted</div>
                    <div class="js-icon-info-two">${moment(response.data.createdat).fromNow()} <br> <br> ${moment(response.data.createdat).format("dddd, MMMM Do YYYY [at] h:mm a")}</div>
                  </div>
                </div> <!--end-->
              </div>`
      } else {
        return taskDetailsError.innerHTML = '<p>sorry, something went wrong</p>';
      }
    })
    .catch((err) => {
      tasksDetailsLoaderMethod.hide();

      if (err.message.indexOf('Failed to fetch') === 0) {
        // display internet error message
        taskDetailsError.classList.add('active')
        return taskDetailsError.innerHTML = `<p>Could not connect to the internet, looks like you are offline</p> <button class="task-details-retry-btn" onClick="fetchWithId(${taskId})">Retry</button>`;
      } else {
        // display something went wrong message
        taskDetailsError.classList.add('active')
        return taskDetailsError.innerHTML = '<p>something went wrong, please try again</p>';
        // console.log("An error occur while connecting to our servers" + err);
      }
    });
}

backIcon.addEventListener('click', () => {

  jobdetailsContainer.classList.remove('open-jobdetails-modal')
  setTimeout(() => jobdetailsContainer.style.display = 'none', 300)

})


// -------------------------------------------------------- RECOMMENDATION PART ---------

function recommendation() {

  // clear recommendation container before inserting another data
  recommendationContainer.innerHTML = '';

  fetch(`${apiBase}/tasks?start=0&count=2`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      },
    })
    .then((response) => response.json())
    .then(response => {
      if (response.code === 200) {
        response.data.forEach((response) => {
          const startdate = moment(response.createdat);
          const enddate = moment(response.enddate);

          const formmatedEndDate = enddate.from(startdate);

          const aLink = document.createElement('a');
          aLink.classList.add('job-link');
          aLink.setAttribute('onClick', `fetchWithId(this)`);
          aLink.setAttribute('data-id', `${response.id}`);
          aLink.innerHTML += `
              <div class="jobpost-card">
                  <div class="jobpost-title"> <h4>${response.title}</h4> </div>
                  <div class="jobpost-details"> <p>${response.description}</p> </div>
                 <!--other details-->
                 <div class="sub-jobpost">
                     <!--location-->
                     <div class="sub-jobpost-cover">
                         <div class="sub-jobpost-image"> <img src="../assets/images/location.svg" /> </div>
                         <div class="sub-jobpost-text">${response.location}</div>
                     </div>
                     <!--budget-->
                     <div class="sub-jobpost-cover">
                         <div class="sub-jobpost-image"> <img src="../assets/images/wallet.svg" /> </div>
                         <div class="sub-jobpost-text"> ${response.pricetype === 'Fixed price' ? `₦ ${numeral(response.fixedprice).format('0,0')}`: `<span>Min : ₦ ${numeral(response.minbudget).format('0,0')} -  Max : ₦ ${numeral(response.maxbudget).format('0,0')} </span>`}</div>
                     </div>
                     <!--duration-->
                     <div class="sub-jobpost-cover">
                         <div class="sub-jobpost-image"> <img src="../assets/images/briefcase.svg" /> </div>
                         <div class="sub-jobpost-text">${response.jobtype === 'Full time' ? 'Full time' : 'Part time' }</div>
                     </div>
                     <!--due date-->
                     <div class="sub-jobpost-cover">
                         <div class="sub-jobpost-image"> <img src="../assets/images/time.svg" /> </div>
                         <div class="sub-jobpost-text">${moment(response.createdat).fromNow()}</div>
                     </div>

                     <div class="status">${formmatedEndDate.indexOf('in') !== 0 ? '<button class="closed-status">Expired</button>' : response.status === 'pending' ? '<button class="open-status">open</button>' : '<button class="closed-status">closed<button>'}</div>
                 </div>
             </div> `
          recommendationContainer.appendChild(aLink);
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
        return console.log({
          message: 'something went wrong, please try again'
        })
        // console.log("An error occur while connecting to our servers" + err);
      }
      // console.log('the real error message', err.message)
    });
}

// ----------Logout function starts ---
function logout() {
  window.localStorage.removeItem('token');
  window.location.href = '/login';
}


//  -------------------- apply for job arena ----

let successModal = document.querySelector('.success-modal');
let mainModal = document.getElementById('apply-for-job-main');
// let scrollBoy = document.querySelector('.mdl-layout__content');

const applyOverlayLoader = document.querySelector('.overlay-apply-loader');
const applyOverlaySpinner = document.querySelector('.apply-spinner');
const applyForJobErrorDiv = document.querySelector('.apply-job-error-div');

const textArea = document.querySelector('.apply-text');
textArea.addEventListener('keyup', validateApplyTextArea);

const applyForJobLoader = {
  open() {
    applyOverlayLoader.classList.add('overlay-apply-loader-active')
    applyOverlaySpinner.classList.add('is-active');
  },
  close() {
    applyOverlayLoader.classList.remove('overlay-apply-loader-active')
    applyOverlaySpinner.classList.remove('is-active');
  }
}

/*Move to question 1 button*/
let next = document.querySelector('.next');

// first button to trigger the modal
// let post = document.querySelector('.makeoffer');
// post.addEventListener('click', show);
/*show*/
let taskToApply;
// first modal function -- Tell us what you want [MODAL]
function showApplyModal(task) {
  taskToApply = task;
  if (!currentUserDetails.currentUserName && !currentUserDetails.userId) {

    return  MicroModal.show('login-warning-modal')

  } else {
    const taskTitleDisplayForApplyForTask = document.querySelector('.task-title');
    taskTitleDisplayForApplyForTask.innerText = task.getAttribute('data-title');
    /*show 2nd child*/
    // divi.style.display = "block";
    // scrollBoy.style.overflow = "hidden";

    // modalContent.style.display = "flex";
    // stepOne.style.display = "none";
    // /*end*/
    // window.scrollTo(0, 0);
    mainModal.style.display = 'block';
    successModal.style.display = 'none';
    applyForJobErrorDiv.innerText = '';
    // document.querySelector('body').style.overflow = "hidden";
    // document.querySelector('.bg-modal').style.display = "flex";
    MicroModal.show('apply-for-job-modal')
  }

  /*make body unscrollable*/
  fullPageBody.style.overflow = "hidden";
}


// added event listener to the button that moves to the next question
next.addEventListener('click', function () {
  applyForTask(taskToApply)
})

/*cancel*/
let cancel = document.querySelectorAll('.plus');
cancel.forEach((cancelbtn)=> cancelbtn.addEventListener('click', close))

/*close*/
function close(e) {

  if (textArea.value.trim().length > 0) {
    const ask = confirm('are you sure you want to exit? changes are not saved');
    if (ask) {
      document.querySelector('.apply-text').value = '';
      MicroModal.close('apply-for-job-modal')
      // document.querySelector('.bg-modal').style.display = "none";
      // document.querySelector('body').style.overflow = "auto";
      // scrollBoy.style.overflow = "auto";
    }
  } else {
    MicroModal.close('apply-for-job-modal')
    document.querySelector('.apply-text').value = '';
    // document.querySelector('.bg-modal').style.display = "none";
    // document.querySelector('body').style.overflow = "auto";
    // scrollBoy.style.overflow = "auto";
  }

  /*change body overflow*/
  fullPageBody.style.overflow = "unset";
}

function goNext() {

  mainModal.style.display = "none";

  //make current page fade & new ppae appear
  successModal.style.display = "block";
}


function validateApplyTextArea() {
  applyForJobErrorDiv.innerText = '';

  const applyErrorSpan = document.querySelector('.apply-error-span');

  if (!textArea.value.trim() || textArea.value.trim().length < 10) {
    textArea.style.border = '1px solid red';
    applyErrorSpan.classList.add('apply-error-active')
    applyErrorSpan.innerText = '* Minimum of 10 characters required';
    return false;
  } else if (textArea.value.trim().length === 250) {
    applyErrorSpan.innerText = '* Maximum of 250 characters reached';
    textArea.style.border = '.5px solid #9e9e9e9e';
    applyErrorSpan.classList.add('apply-error-active');
    return true
  } else {
    textArea.style.border = '.5px solid #9e9e9e9e';
    applyErrorSpan.classList.remove('apply-error-active');
    return true
  }

}

function applyForTask(task) {
  if (validateApplyTextArea()) {


    applyForJobLoader.open();

    const applySuccessText = document.querySelector('.apply-success');

    const taskId = parseInt(task.getAttribute('data-id'));
    const posterId = task.getAttribute('data-posterId');
    const posterEmail = task.getAttribute('data-poster-email');
    const posterName = task.getAttribute('data-posterName');
    const taskDueDate = task.getAttribute('data-dueDate');
    const taskBudget = task.getAttribute('data-budget');
    const applicantName = currentUserDetails.currentUserName;
    const proposal = textArea.value.trim();

    const bodyValues = {
      posterId,
      posterEmail,
      posterName,
      taskBudget,
      taskDueDate,
      applicantName,
      proposal
    }

    fetch(`${apiBase}/tasks/apply/${taskId}`, {
        method: "POST",
        body: JSON.stringify(bodyValues),
        headers: {
          "Content-Type": "application/json",
          'authorization': `bearer ${token}`
        },
      })
      .then((response) => response.json())
      .then(response => {
        applyForJobLoader.close();
        if (response.code === 200) {
          textArea.value = '';
          applySuccessText.innerHTML = `Your application has been sent successfully, you will recieve a response email from <span style="color: #2196F3">${posterName}</span> if your application has been accepted.`;
          goNext()
        } else if (response.code === 403) {
          applyForJobErrorDiv.innerText = 'you are not authorized, you will need to log in';
        } else if (response.message === 'user already applied for task') {
          applyForJobErrorDiv.innerText = 'you have already applied for this task';
        } else {
          // formSpinLoader.hide();
          applyForJobErrorDiv.innerText = 'something went wrong while uploading your offer, please try again';

        }
      })
      .catch((err) => {
        applyForJobLoader.close();
        if (err.message.indexOf('Failed to fetch') === 0) {
          // formSpinLoader.hide();
          // display internet error message
          applyForJobErrorDiv.innerText = 'Could not connect to the internet, looks like you are offline';
        } else {
          // formSpinLoader.hide();
          applyForJobErrorDiv.innerText = 'something went wrong, please try again'
        }
      });
  }
}


/**** search for task arena
 * 
 * @description search for task
 * 
 *****/

const searchInput = document.getElementById('search-task-input');
const searchForm = document.getElementById('search-form');

searchForm.addEventListener('submit', getSearchKeyWord)

function getSearchKeyWord(e) {
  e.preventDefault()
  if (searchInput.value.trim()) {
    loadTaskPageCount = 0;
    allowFetch = true;
    document.querySelector(".jobpost-card-parent").innerHTML = ''
    const keyword = searchInput.value.trim().split(" ", 10);
    //  keyword.forEach((keyword)=> ke)
    searchTask({
      keyword: keyword
    });
  }
}

const infiniteScrollErrorForSearch = {
  show({
    message: message,
    keyword: keyword
  }) {
    infiniteScrollErrorMessage.innerHTML = message;
    infiniteScrollRetryButton.setAttribute('onClick', `searchTask({keyword: "${keyword}"})`);
    infiniteScrollRetryButton.classList.add('is-retry-button-active');
  },
  hide() {
    infiniteScrollErrorMessage.innerHTML = '';
    infiniteScrollRetryButton.classList.remove('is-retry-button-active');
  }
}


function searchTask({
  keyword: keyword
}) {

  // started infiniteScrollLoader for infinite scroll loading indication
  infiniteScrollLoader.show()


  // disble scroll event for fetching data while former data is still loading
  allowFetch = false;

  fetch(`${apiBase}/tasks/search?keyword=${keyword}&start=${loadTaskPageCount}&count=30`, {
      method: "GET",
      headers: {
        "content-type": "application/json"
      }
    })
    .then((response) => response.json())
    .then(response => {
      feedLoader.hideFeedLoader();
      infiniteScrollLoader.hide();
      if (response.code === 200 && response.data.length !== 0) {

        allowFetch = true;
        infiniteScrollErrorForSearch.hide()

        response.data.forEach((response) => {
          var newDiv = document.createElement("div");
          newDiv.classList.add('jobpost-card');

          const startdate = moment(response.createdat);
          const enddate = moment(response.enddate);

          const formmatedEndDate = enddate.from(startdate);
          newDiv.innerHTML += `
                  <div class="jobpost-title">
                  <span onClick="fetchWithId(${response.id})" data-id="${response.id}"  class="jobpost-card-overlay ${formmatedEndDate.indexOf('in') !== 0 ? "task-expired" : ''}"></span>
                  <h4 class="search-result">${response.title}</h4>
                   </div>
                  <div class="jobpost-details">
                    <p class="search-result"> ${response.description}</p>
                  </div>
                  <div class="sub-jobpost">
                   <div class="sub-jobpost-cover">
                       <div class="sub-jobpost-image"> <img src="../assets/images/location.svg" /> </div>
                       <div class="search-result sub-jobpost-text">${response.location}</div>
                   </div>
                   <div class="sub-jobpost-cover">
                       <div class="sub-jobpost-image"> <img src="../assets/images/wallet.svg" /> </div>
                       <div class="sub-jobpost-text"> ${response.pricetype === 'Fixed price' ? `₦ ${numeral(response.fixedprice).format('0,0')}`: `<span>Min : ₦ ${numeral(response.minbudget).format('0,0')} - Max : ₦ ${numeral(response.maxbudget).format('0,0')} </span>`}</div>
                   </div>
                   <div class="sub-jobpost-cover">
                       <div class="sub-jobpost-image"> <img src="../assets/images/briefcase.svg" /> </div>
                       <div class="sub-jobpost-text">${response.jobtype === 'Full time' ? 'Full time' : 'Part time' }</div>
                   </div>
                   <div class="sub-jobpost-cover">
                       <div class="sub-jobpost-image"> <img src="../assets/images/time.svg" /> </div>
                       <div class="sub-jobpost-text">${moment(response.createdat).fromNow()}</div>
                   </div>
                    <div class="sub-jobpost-cover">
                      <div class="sub-jobpost-image expire-div"></div>
                      <div class="sub-jobpost-text">${formmatedEndDate.indexOf('in') === 0 ? 'Expries' : 'Expired'} ${formmatedEndDate}</div>
                    </div>
                   <div class="status">${formmatedEndDate.indexOf('in') !== 0 ? '<button class="closed-status" style="background-color: #f44336a3">Expired</button>' : response.status === 'pending' ? '<button class="open-status">open</button>' : '<button class="closed-status">closed<button>'}</div>
                  </div>

                  </div>
                `;
          document.querySelector(".jobpost-card-parent").appendChild(newDiv);

          var context = document.querySelectorAll(".search-result");
          var instance = new Mark(context);
          instance.mark(keyword);
        })
        return loadTaskPageCount = loadTaskPageCount + 30;
      } else if (response.code === 200 && response.data.length === 0) {
        allowFetch = false;
        infiniteScrollErrorForSearch.show({
          message: 'No task found',
          keyword: keyword
        });
        return infiniteScrollRetryButton.classList.remove('is-retry-button-active');
      } else {
        return infiniteScrollErrorForSearch.show({
          message: 'something went wrong, please try again',
          keyword: keyword
        });
      }
    })
    .catch((err) => {
      feedLoader.hideFeedLoader();
      infiniteScrollLoader.hide();
      if (err.message.indexOf('Failed to fetch') === 0) {
        // display internet error message
        return infiniteScrollErrorForSearch.show({
          message: 'Could not connect to the internet, looks like you are offline',
          keyword: keyword
        })
      } else {
        // display something went wrong message
        return infiniteScrollErrorForSearch.show({
          message: 'something went wrong, please try again',
          keyword: keyword
        })
        // console.log("An error occur while connecting to our servers" + err);
      }
    });
}





/********** POST A JOB
 *  @description post a job arena
 * 
 * 
 * 
 *********/

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


form.addEventListener('submit', submmission_handler)

formButton.addEventListener('click', submmission_handler)

function postAjob() {
  if (!currentUserDetails.userId) {
    return  MicroModal.show('login-warning-modal')
  }

  MicroModal.show('modal-1');
}


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

// const categoryStorage = JSON.parse(window.sessionStorage.getItem('categories'));

// if (!categoryStorage) {

function fetchCategory(){

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
      } 
      // else {
      //   return console.log({
      //     message: 'something went wrong, please try again'
      //   });
      // }
    })
    .catch((err) => {
      if (err.message.indexOf('Failed to fetch') === 0) {
        // display internet error message
        // return console.log({
        //   message: 'Could not connect to the internet, looks like you are offline'
        // })
        setTimeout(() => fetchCategory(), 4000)
      } else {
        // display something went wrong message
        // return console.log({
        //     message: 'something went wrong, please try again'
        // })
        // console.log("An error occur while connecting to our servers" + err);
      }
    })
// }
//  else {
  // categoryStorage.data.forEach((response) => {
//     var newOption = document.createElement("option");
//     newOption.innerText = `${response.name}`;
//     jobCategoryDropdown.appendChild(newOption);
//   })
// }
}

fetchCategory()

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
  show({
    message: message
  }) {
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
          'authorization': `bearer ${token}`
        },
      })
      .then((response) => response.json())
      .then(response => {
        if (response.status === 'Ok') {
          uploadTask(response.data.secure_url);
        } else if (response.code === 403) {
          return window.location.href = '/login';
        } else {
          formSpinLoader.hide();
          formErrorMessage.show({
            message: 'something went wrong while uploading your image, please try again'
          });
          // return console.log({
          //     message: 'something went wrong while uploading your image, please try again'
          // });
        }
      })
      .catch((err) => {

        if (err.message.indexOf('Failed to fetch') === 0) {
          formSpinLoader.hide();
          formErrorMessage.show({
            message: 'Could not connect to the internet, looks like you are offline'
          })
          // display internet error message
          // return console.log({
          //     message: 'Could not connect to the internet, looks like you are offline'
          // })
        } else {
          formSpinLoader.hide();
          formErrorMessage.show({
            message: 'something went wrong, please try again'
          })
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
  let formValues;

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


  fetch(`${apiBase}/tasks/create`, {
      method: "POST",
      body: JSON.stringify(formValues),
      headers: {
        "Content-Type": "application/json",
        'authorization': `bearer ${token}`
      },
    })
    .then((response) => response.json())
    .then(response => {
      if (response.code === 201) {
        MicroModal.close('modal-1');
        refreshPostAjobForm()
        return refreshTask();
      } else if (response.code === 403) {
        return window.location.href = '/login';
      } else {
        formSpinLoader.hide();
        formErrorMessage.show({
          message: 'something went wrong while uploading your task, please try again'
        });
        // return console.log({
        //     message: 'something went wrong while uploading your task, please try again'
        // });
      }
    })
    .catch((err) => {

      if (err.message.indexOf('Failed to fetch') === 0) {
        formSpinLoader.hide();
        // display internet error message
        formErrorMessage.show({
          message: 'Could not connect to the internet, looks like you are offline'
        });
        // return console.log({
        //     message: 'Could not connect to the internet, looks like you are offline'
        // })
      } else {
        formSpinLoader.hide();
        formErrorMessage({
          message: 'something went wrong, please try again'
        })
        // display something went wrong message
        // return console.log({
        //     message: 'something went wrong, please try again'
        // })
        // console.log("An error occur while connecting to our servers" + err);
      }
    });
}



// function to refresh post a job form
function refreshPostAjobForm(){
  formSpinLoader.hide();
   formErrorMessage.hide();
   jobTitle.value = '';
    minimumPriceRange.value = '';
   maximumPriceRange.value = '';
   fixedPriceInput.value = '';
   localGovernment.value = '';
   projectDescription.value = '';
   cancelUpload();
}
