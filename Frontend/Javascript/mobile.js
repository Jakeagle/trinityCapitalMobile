'use strict';

const pullBtn = document.querySelector('.pullBtn');
const lowerSection = document.querySelector('.accountContainer');
let down = true;

if (pullBtn) {
  pullBtn.addEventListener('click', function () {
    if (down) {
      down = false;
      lowerSection.style.transform = 'translateY(-23rem)';
      lowerSection.style.height = '80rem';
      lowerSection.style.transition = 'all 1s';
    } else if (!down) {
      down = true;
      lowerSection.style.transform = 'translateY(1.5rem)';
      lowerSection.style.height = '23rem';
      lowerSection.style.transition = 'all 1s';
    }
  });
}
