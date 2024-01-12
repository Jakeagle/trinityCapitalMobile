'use strict';
import {
  currentAccount,
  currentProfile,
  updateUI,
  displayBalance,
  displayTransactions,
  displayBillList,
  getInfoProfiles,
} from './script.js';

const loginButton = document.querySelector('.login__btn');
const accountBTNs = document.querySelectorAll('.form__btn--accountSwitch');
const accountContainer = document.querySelector('.accountListBg');
const testServerProfiles = 'http://localhost:3000/profiles';

let btnNum = 0;

loginButton.addEventListener('click', function () {
  let accounts = [];

  accounts.push(currentProfile.checkingAccount);
  accounts.push(currentProfile.savingsAccount);

  console.log(accounts);

  accounts.forEach(account => {
    const html = [
      ` <li class="account">
       ${account.accountType} ------------- ${account.accountNumber.slice(-4)}
       <span>
         <button
           class="form__btn form__btn--transfer form__btn--accountSwitch ${
             account.accountType
           }"
         >
           Switch to account
         </button></span
       >
     </li>`,
    ];
    accountContainer.insertAdjacentHTML('beforeEnd', html);
  });
  let checking = document.querySelector('.Checking');
  let savings = document.querySelector('.Savings');

  checking.addEventListener('click', async function () {
    const accountNumber = document.querySelector('.accountNumber');
    const accountType = document.querySelector('.accountType');
    let newProfile;
    let Profiles = await getInfoProfiles();

    Profiles.forEach(profile => {
      if (profile.memberName === currentProfile.memberName) {
        newProfile = profile;
      }
    });

    updateUI(newProfile.checkingAccount);

    accountNumber.textContent = newProfile.checkingAccount.accountNumber;
    accountType.textContent = `${newProfile.checkingAccount.accountType} account`;
    console.log(Profiles);
  });

  savings.addEventListener('click', async function () {
    const accountNumber = document.querySelector('.accountNumber');
    const accountType = document.querySelector('.accountType');
    let newProfile;
    let Profiles = await getInfoProfiles();

    Profiles.forEach(profile => {
      if (profile.memberName === currentProfile.memberName) {
        newProfile = profile;
      }
    });

    updateUI(newProfile.savingsAccount);

    accountNumber.textContent = newProfile.savingsAccount.accountNumber;
    accountType.textContent = `${newProfile.savingsAccount.accountType} account`;
    console.log(Profiles);
  });
});
