'use strict';

import { currentProfile } from './script.js';

const pullBtn = document.querySelector('.pullBtn');
const lowerSection = document.querySelector('.accountContainer');
const transactionBlock = document.querySelector('.transactionBlock');
const transactionTitle = document.querySelector('.transactionTitleText');
const totalBalance = document.querySelector('.totalBalance');
const loginBTN = document.querySelector('.login__btn');
let balance;
let down = true;

transactionBlock.style.display = 'none';
transactionTitle.style.display = 'none';
if (pullBtn) {
  pullBtn.addEventListener('click', function () {
    if (down) {
      down = false;
      lowerSection.style.position = 'absolute';
      lowerSection.style.transform = 'translateY(-23rem)';
      lowerSection.style.height = '100vh';
      lowerSection.style.transition = 'all 1s';
      transactionBlock.style.display = 'block';
      transactionTitle.style.display = 'block';
    } else if (!down) {
      down = true;
      lowerSection.style.position = 'relative';
      lowerSection.style.transform = 'translateY(1.5rem)';
      lowerSection.style.height = '23rem';
      lowerSection.style.transition = 'all 1s';
      transactionBlock.style.display = 'none';
      transactionTitle.style.display = 'none';
    }
  });
}

loginBTN.addEventListener('click', function () {
  balance =
    currentProfile.checkingAccount.balanceTotal +
    currentProfile.savingsAccount.balanceTotal;

  totalBalance.textContent = `$${balance}.00`;
});
