let divi = document.querySelector('.divi');
let stepOne = document.querySelector('.step-one');
let modalContent = document.querySelector('.modal-content');
let scrollBoy = document.querySelector('.mdl-layout__content');

/*Move to question 1 button*/
let next = document.querySelector('.next');

// first button to trigger the modal
let post = document.querySelector('.makeoffer');
post.addEventListener('click', show);
/*show*/

// first modal function -- Tell us what you want [MODAL]
function show() {
    document.querySelector('.bg-modal').style.display = "flex";
    /*show 2nd child*/
    divi.style.display = "block";
    scrollBoy.style.overflow = "hidden";

    modalContent.style.display = "flex";
    stepOne.style.display = "none";
    /*end*/
    window.scrollTo(0, 0);
    document.querySelector('body').style.overflow = "hidden";
    console.log('show');

    // added event listener to the button that moves to the next question
    next.addEventListener('click', () => {
            goNext()
    })
}

/*cancel*/
let cancel = document.querySelector('#plus');
console.log('cancel');
cancel.addEventListener('click', close);

/*close*/
function close(e) {
    document.querySelector('.bg-modal').style.display = "none";
    document.querySelector('body').style.overflow = "scroll";
    scrollBoy.style.overflow = "scroll";
    console.log('close');
}

function goNext() {
    modalContent.style.display = "block";

    //make current page fade & new ppae appear
    modalContent.style.display = "block";
    divi.style.display = "none";
    stepOne.style.display = "block";

}