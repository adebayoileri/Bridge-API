/*toggle icon*/
document.querySelector('#toggle').addEventListener('click', hamburger);

function hamburger() {
    let toggleCover = document.querySelector('#toggle-cover');
    
    if (toggleCover.classList == 'show') {
        toggleCover.classList.remove('show');
        toggleCover.classList = 'hide';
    }   else {
        toggleCover.classList = 'show';
     }
     
}

/*scroll effect*/
document.querySelector('#contactid').addEventListener('click', scrolldown);

function scrolldown() {
    window.scroll({
        top: 100,
        left: 0,
        duration: 1000,
        behavior: 'smooth'
    });
}
