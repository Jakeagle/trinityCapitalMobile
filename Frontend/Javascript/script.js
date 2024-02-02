'use strict';

var url = window.location.pathname;
var filename = url.substring(url.lastIndexOf('/') + 1);
var mobilePage = '.html';
if (
  !/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|OperaMini/i.test(
    navigator.userAgent
  )
) {
  window.location.replace('https://trinitycapitalsimulation.netlify.app');
} else {
  console.log('Were on MOBILE!');
}

/********************************************Modal control*************************************/
const mainApp = document.querySelector('.mainApp');
const loginBox = document.querySelector('.signOnBox');
const startPage = document.querySelector('.startPage');
const mobileLoginBox = document.querySelector('.mobileSignOnBox');
const billsModal = document.querySelector('.billsAndPaymentsModal');
const transferModal = document.querySelector('.transferModal');
const accountSwitchModal = document.querySelector('.accountSwitchModal');
const accountSwitchBTN = document.querySelector('.accountSwitchBTN');

const transferModalBTN = document.querySelector('.transferBTN');
const closeTransferModal = document.querySelector('.transferExitButton');
const billsModalBTN = document.querySelector('.billsModalBTN');
const closeBillModal = document.querySelector('.closeBills');
const closeAccountModal = document.querySelector('.closeAccounts');
const logOutBTN = document.querySelector('.logOutBTN');
if (logOutBTN) {
  logOutBTN.addEventListener('click', function () {
    location.reload();
  });
}

billsModalBTN.addEventListener('click', function () {
  billsModal.showModal();
});

closeBillModal.addEventListener('click', function () {
  billsModal.close();
});

transferModalBTN.addEventListener('click', function () {
  transferModal.showModal();
});

closeTransferModal.addEventListener('click', function () {
  transferModal.close();
});

accountSwitchBTN.addEventListener('click', function () {
  accountSwitchModal.showModal();
});

closeAccountModal.addEventListener('click', function () {
  accountSwitchModal.close();
});

if (mainApp) mainApp.style.display = 'none';

mobileLoginBox.showModal();

/***********************************************************Server Listeners**********************************************/

export const socket = io('https://trinitycapitaltestserver-2.azurewebsites.net');

console.log('User connected:' + socket.id);
socket.on('checkingAccountUpdate', updatedChecking => {
  // Access the checkingAccount data from updatedUserProfile
  const checkingAccount = updatedChecking;

  // Call your existing updateUI function with the updated checking account data
  displayBalance(checkingAccount);
  displayTransactions(checkingAccount);
});

socket.on('accountsUpdate', updatedCards => {
  cardShift(updatedCards);
});

/***********************************************************Server Functions**********************************************/
const testServerProfiles = 'https://trinitycapitaltestserver-2.azurewebsites.net/profiles';

const loanURL = 'https://trinitycapitaltestserver-2.azurewebsites.net/loans';

const donationURL = 'https://trinitycapitaltestserver-2.azurewebsites.net/donations';

const donationSavingsURL = 'https://trinitycapitaltestserver-2.azurewebsites.net/donationsSavings';

const balanceURL = 'https://trinitycapitaltestserver-2.azurewebsites.net/initialBalance';

// Store the received profiles in a global variable or a state variable if you're using a front-end framework
let Profiles = [];

export async function getInfoProfiles() {
  try {
    const res = await fetch(testServerProfiles, {
      method: 'GET',
    });

    if (res.ok) {
      Profiles = await res.json();

      // Log the initial profiles

      // Now, listen for updates from the Socket.IO server
      socket.on('profiles', updatedProfiles => {
        // Update your UI with the updated profiles
        console.log('Received updated profiles:', updatedProfiles);

        // For example, you can update a list of profiles
        // Assuming you have a function to update the UI
      });
      return Profiles;
    } else {
      console.error('Failed to fetch profiles:', res.statusText);
    }
  } catch (error) {
    console.error(error.message);
  }
}

export async function initialBalance() {
  const res = await fetch(balanceURL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      parcel: currentProfile,
    }),
  });
}

async function loanPush() {
  const res = await fetch(loanURL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      parcel: [currentProfile, parseInt(loanAmount.value)],
    }),
  });
}

async function donationPush() {
  const res = await fetch(donationURL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      parcel: [currentAccount, parseInt(donateAmount.value)],
    }),
  });
}

async function donationPushSavings() {
  const res = await fetch(donationSavingsURL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      parcel: [currentAccount, parseInt(donateAmount.value)],
    }),
  });
}

export let profiles = await getInfoProfiles();

/******************************************Variables ***************************************************/

export let currentAccount;
export let currentProfile;
let currentTime;
let accPIN;
let accUser;
//Currency codes for formatting
const currencyCodeMap = {
  840: 'USD',
  978: 'EUR',
  // add more currency codes here as needed
};

const closeT1 = document.querySelector('.closeBtn');
const signOnForm = document.querySelector('signOnForm');
const signOnText = document.querySelector('.signOntext');
const loginButton = document.querySelector('.login__btn');
const mobileLoginButton = document.querySelector('.mobileLoginBtn');

const formDiv = document.querySelector('.formDiv');
export let balance;

const lastUpdated = document.querySelector('.updateDate');
const transActionsDate = document.querySelector('.transactions__date');
const balanceValue = document.querySelector('.actualBalanceText');
const balanceLabel = document.querySelector('.balance__label');
const accNumSwitch = document.querySelector('.form__input--user--switch');
const accPinSwitch = document.querySelector('.form__input--pin--switch');
const nextSwitch = document.querySelector('.nextBtn');
const prevSwitch = document.querySelector('.prevBtn');
const btnClose = document.querySelector('.form__btn--close');
const userClose = document.querySelector('.form__input--user--close');
const userClosePin = document.querySelector('.form__input--pin--close');
const transactionContainer = document.querySelector('.transactions');
const requestLoanbtn = document.querySelector('.form__btn--loan');
const loanAmount = document.querySelector('.form__input--loan-amount');
const donateBtn = document.querySelector('.form__btn--donate');
const donateAmount = document.querySelector('.form__input--donate--amount');
const donatePin = document.querySelector('.form__input--pin--donate');
const accNumHTML = document.querySelector('.accountNumber');
const balanceDate = document.querySelector(`.dateText`);
const totalBalance = document.querySelector('.totalBalance');
const now = new Date();

//Used for formatting dates
const options = {
  hour: 'numeric',
  minute: 'numeric',
  day: 'numeric',
  month: 'numeric',
  year: 'numeric',
  // weekday: 'long',
};

/*****************************************Event Listeners ******************************************/

//login event listener (used to login to the app)

if (mobileLoginButton) {
  mobileLoginButton.addEventListener('click', function (event) {
    event.preventDefault();
    const mobileLoginPIN = document.querySelector('.mobile_login__input--pin');
    const mobileLoginText = document.querySelector(
      '.mobile_login__input--user'
    );
    loginFunc(mobileLoginPIN, mobileLoginText, mobileLoginBox);
  });
}

const loginFunc = function (PIN, user, screen) {
  const pin = parseInt(PIN.value);

  for (let i = 0; i < profiles.length; i++) {
    if (user.value === profiles[i].userName && pin === profiles[i].pin) {
      currentProfile = profiles[i];
    } else if (user.value === profiles[i].userName && pin !== profiles[i].pin) {
      alert('incorrect PIN');
    } else if (user.value !== profiles[i].userName && pin === profiles[i].pin) {
      alert('incorrect Username');
    }
  }

  if (currentProfile) {
    initialBalance();

    let accounts = [
      currentProfile.checkingAccount,
      currentProfile.savingsAccount,
    ];

    totalBalance.textContent =
      currentProfile.checkingAccount.balanceTotal +
      currentProfile.savingsAccount.balanceTotal;

    // Retrieve saved transactions for current account

    screen.close();

    mobileLoginBox.close();
    mobileLoginBox.style.display = 'none';

    // Display welcome message

    // Hide login form and display main app
    const formDiv = document.querySelector('.formDiv');
    const mainApp = document.querySelector('.mainApp');

    mainApp.style.display = 'inline';
    mainApp.style.opacity = 100;

    currentAccount = currentProfile.checkingAccount;
    if (currentAccount) {
      //Add currentAccount here
      // Update the UI with the first account's information
      updateUI(currentAccount);
      cardShift(accounts);
      //Starts loop function that displays the current Accounts bills

      //Displays the "Current Balanace for "x" string
      // balanceLabel.textContent = `**** ${currentAccount.accountNumber.slice(
      //   -4
      // )}`;

      // //Displays the "As of" portion with the current date
      // updateTime();
      // balanceDate.textContent = `${new Intl.DateTimeFormat(
      //   currentProfile.locale,
      //   options
      // ).format(currentTime)}`;
      //Display saved transactions for current account
      displayTransactions(currentAccount);
    } else {
      alert('No checking account found. Please contact customer service.');
    }
  }
};

//Switch accounts
let currentIndex = 0;
nextSwitch.addEventListener('click', function () {
  if (currentIndex === 0) {
    currentIndex = currentIndex + 1;
  } else if (currentIndex === 1) {
    currentIndex = currentIndex - 1;
  }
  console.log(currentIndex);
  accountSwitch(currentIndex);
});
//requesting loans
prevSwitch.addEventListener('click', function () {
  if (currentIndex === 0) {
    currentIndex = currentIndex + 1;
  } else if (currentIndex === 1) {
    currentIndex = currentIndex - 1;
  }
  console.log(currentIndex);
  accountSwitch(currentIndex);
});
const accountSwitch = function (i) {
  const accountsList = [
    currentProfile.checkingAccount,
    currentProfile.savingsAccount,
  ];

  displayTransactions(accountsList[i]);
};

//checks if button exists
if (requestLoanbtn) {
  requestLoanbtn.addEventListener('click', function (e) {
    //prevents default action
    e.preventDefault();

    loanPush();

    loanAmount.value = '';

    //Declares the amount as the user entered amount.
  });
}

//Donating money
if (donateBtn) {
  donateBtn.addEventListener('click', function (e) {
    e.preventDefault();
    //How much a user donates

    if (currentAccount.accountType === 'Checking') {
      donationPush();
    } else if (currentAccount.accountType === 'Savings') {
      donationPushSavings();
    }

    donatePin.value = '';
    donateAmount.value = '';
  });
}

/********************************************Functions *********************************************/
if (mainApp) {
  mainApp.style.opacity = 0;
}

const createUsername = function (prfs) {
  for (let i = 0; i < prfs.length; i++) {
    prfs[i].userName = prfs[i].memberName
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  }
};
createUsername(profiles);

//createUsername(profiles);
//updates current time
const updateTime = function () {
  currentTime = new Date();
};

//This function updates local storage with any new data (Mainly transactions)

//Displays Currently Logged in profile's accounts sorted in order of checking first, then in order of most recently created.
const displayAccounts = function (currentAccount) {
  const accountContainer = document.querySelector('.accountContainer');
  accountContainer.innerHTML = '';

  //Shows no accounts if there are no accounts int the current profile

  //Sort the accounts by type (checking first) and creation date

  let balance = formatCur(
    currentProfile.locale,

    currentProfile.currency
  );

  let lastTransactionDate = new Date(
    currentProfile.checkingAccount.movementsDates[
      currentProfile.checkingAccount.movementsDates.length - 1
    ]
  ).toLocaleDateString(currentProfile.locale);

  let lastTransactionDateSavings = new Date(
    currentProfile.savingsAccount.movementsDates[
      currentProfile.savingsAccount.movementsDates.length - 1
    ]
  ).toLocaleDateString(currentProfile.locale);

  const html1 = [
    `
        <div class="row accountsRow">
          <div class="col accountType">${
            currentProfile.checkingAccount.accountType
          }</div>
          <div class="col accountNumber">${currentProfile.checkingAccount.accountNumber.slice(
            -4
          )}</div>
          <div class="col updateDate">${lastTransactionDate}</div>
        </div>
      
      <div class="row accountsRow">
        <div class="col accountType">${
          currentProfile.savingsAccount.accountType
        }</div>
        <div class="col accountNumber">${currentProfile.savingsAccount.accountNumber.slice(
          -4
        )}</div>
        <div class="col updateDate">${lastTransactionDateSavings}</div>
      </div>
      `,
  ];

  accountContainer.insertAdjacentHTML('beforeEnd', html1);
};

//Display Transactions
export const displayTransactions = function (currentAccount) {
  let movs;

  //selects the transactions HTML element
  const transactionContainer = document.querySelector('.transactionsColumn');
  transactionContainer.innerHTML = '';

  //Variable set for the transactions themselves

  movs = currentAccount.transactions;

  //A loop that runs through each transaction in the current account object
  movs.forEach(function (mov, i) {
    //ternerary to determine whether a transaction is a deposit or withdrawal

    let date;

    //Sets the date for each transaction according to the date set in the current Account object

    //Sets up the date variable for the transactions
    date = new Date(currentAccount.movementsDates[i]);

    //displays date next to transactions
    const displayDate = formatMovementDate(date, currentAccount.locale);
    //Formats transactions for user locale
    const formattedMov = formatCur(
      mov.amount,
      currentAccount.locale,
      currentAccount.currency
    );
    let transType;
    let transName = mov.Name;

    let movIcon;

    if (mov.Category === 'Transfer') {
      movIcon = `<i class="fa-solid fa-money-bill-transfer transImg"></i>`;
    }

    if (mov.Category === 'car-note') {
      movIcon = `<i class="fa-solid fa-car transImg"></i>`;
    }
    if (mov.Category === 'rent') {
      movIcon = `<i class="fa-solid fa-house transImg"></i>`;
    }
    if (mov.Category === 'car-insurance') {
      movIcon = `<i class="fa-solid fa-car-burst transImg"></i>`;
    }
    if (mov.Category === 'home-insurance') {
      movIcon = `<i class="fa-solid fa-house-crack transImg"></i>`;
    }
    if (mov.Category === 'food') {
      movIcon = `<i class="fa-solid fa-utensils transImg"></i>`;
    }
    if (mov.Category === 'electric') {
      movIcon = `<i class="fa-solid fa-bolt transImg"></i>`;
    }

    if (mov.Category === 'gas') {
      movIcon = `<i class="fa-solid fa-fire-flame-simple transImg"></i>`;
    }

    if (mov.Category === 'water') {
      movIcon = `<i class="fa-solid fa-droplet transImg"></i>`;
    }

    if (mov.Category === 'trash-collection') {
      movIcon = `<i class="fa-solid fa-dumpster transImg"></i>`;
    }

    if (mov.Category === 'phone-bill') {
      movIcon = `<i class="fa-solid fa-phone transImg"></i>`;
    }

    if (mov.Category === 'internet') {
      movIcon = `<i class="fa-solid fa-wifi transImg"></i>`;
    }

    if (mov.Category === 'custom-expense') {
      movIcon = `<i class="fa-solid fa-screwdriver-wrench transImg"></i>`;
    }

    if (mov.Category === 'paycheck') {
      movIcon = `<i class="fa-solid fa-dollar-sign transImg dollarSignImg"></i>`;
    }
    //HTML for transactions
    if (mov.amount < 0) {
      transType = 'negTrans';
    } else if (mov.amount > 0) {
      transType = 'posTrans';
    }
    const html = `<div class="transaction row">
                    <div class="transIcon col-4">
                      ${movIcon}
                    </div>
                    <div class="transNameAndDate col">
                      <p class="transName">${transName} (${mov.Category})</p>
                     
                    </div>
                    <div class="transNameAndDate col">
                    
                    <p class="transDate">${displayDate}</p>
                  </div>
                    <div class="transAmount col">
                      <p class="transAmountText ${transType}">${formattedMov}</p>
                    </div>
                  </div>`;
    //Inserts HTML with required data
    transactionContainer.insertAdjacentHTML('afterbegin', html);
    displayBillList(currentAccount);
  });
};

export const displayBillList = function (currentAccount) {
  let bills;

  //selects the transactions HTML element
  const billListContainer = document.querySelector('.bills');
  billListContainer.innerHTML = '';

  //Variable set for the transactions themselves

  bills = currentAccount.bills;

  //A loop that runs through each transaction in the current account object
  if (currentAccount.accountType != 'Savings') {
    bills.forEach(function (bill, i) {
      //ternerary to determine whether a transaction is a deposit or withdrawal

      let currentDate;
      let advancedDate;

      //Sets the date for each transaction according to the date set in the current Account object

      //Sets up the date variable for the transactions
      currentDate = new Date();

      if (bill.interval === 'weekly') {
        advancedDate = currentDate.setUTCDate(currentDate.getUTCDate() + 7);
      }

      if (bill.interval === 'bi-weekly') {
        advancedDate = currentDate.setUTCDate(currentDate.getUTCDate() + 14);
      }

      if (bill.interval === 'monthly') {
        advancedDate = currentDate.setUTCDate(currentDate.getUTCDate() + 30);
      }

      if (bill.interval === 'yearly') {
        advancedDate = currentDate.setUTCDate(currentDate.getUTCDate() + 365);
      }

      //displays date next to transactions
      const displayDate = formatMovementDate(
        advancedDate,
        currentAccount.locale
      );

      //Formats transactions for user locale
      const formattedMov = formatCur(
        bill.amount,
        currentAccount.locale,
        currentAccount.currency
      );
      let transType;
      let transName = bill.Name;

      let billIcon;

      if (bill.Category === 'car-note') {
        billIcon = `<i class="fa-solid fa-car "></i>`;
      }
      if (bill.Category === 'rent') {
        billIcon = `<i class="fa-solid fa-house "></i>`;
      }
      if (bill.Category === 'car-insurance') {
        billIcon = `<i class="fa-solid fa-car-burst "></i>`;
      }
      if (bill.Category === 'home-insurance') {
        billIcon = `<i class="fa-solid fa-house-crack "></i>`;
      }
      if (bill.Category === 'food') {
        billIcon = `<i class="fa-solid fa-utensils "></i>`;
      }
      if (bill.Category === 'electric') {
        billIcon = `<i class="fa-solid fa-bolt "></i>`;
      }

      if (bill.Category === 'gas') {
        billIcon = `<i class="fa-solid fa-fire-flame-simple "></i>`;
      }

      if (bill.Category === 'water') {
        billIcon = `<i class="fa-solid fa-droplet "></i>`;
      }

      if (bill.Category === 'trash-collection') {
        billIcon = `<i class="fa-solid fa-dumpster "></i>`;
      }

      if (bill.Category === 'phone-bill') {
        billIcon = `<i class="fa-solid fa-phone "></i>`;
      }

      if (bill.Category === 'internet') {
        billIcon = `<i class="fa-solid fa-wifi wifiIcon "></i>`;
      }

      if (bill.Category === 'custom-expense') {
        billIcon = `<i class="fa-solid fa-screwdriver-wrench billListCustom "></i>`;
      }

      if (bill.Category === 'paycheck') {
        billIcon = `<i class="fa-solid fa-dollar-sign  "></i>`;
      }
      //HTML for transactions

      const html = `<div class="billsRow row">
      <div class="icon col-4">
        ${billIcon}
      </div>
      <div class="billName col-4">
        <p class="billText">${bill.Name}($${bill.amount})</p>
      </div>
      <div class="col-4 billDate">
        <p>Reoccurs: ${displayDate}</p>
      </div>
    </div>`;
      //Inserts HTML with required data
      billListContainer.insertAdjacentHTML('afterbegin', html);
    });
  }
};

//formats the transactions dates to the users locale
export const formatMovementDate = function (date, locale) {
  //international time format based on the date given in this fuction
  return new Intl.DateTimeFormat(locale).format(date);
};
//formats currency based on user locale
function formatCur(value, currency, locale) {
  //Sets currency based on locale currency code. (Defaults to USD if no locale can be found)
  const currencyCode = currencyCodeMap[currency] || 'USD';
  //Sets style and code, and formats the transaction
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currencyCode,
  }).format(value);
}

//Displays the current balance based on the transactions array
export const displayBalance = function (acc) {
  //calculates the balance based on the transaction array
  let dualBalance =
    currentProfile.checkingAccount.balanceTotal +
    currentProfile.savingsAccount.balanceTotal;
  //displays balance
  balanceValue.textContent = formatCur(
    acc.balanceTotal,
    acc.locale,
    acc.currency
  );
};

export const cardShift = function (cards) {
  const container = document.querySelector('.carousel-inner');
  container.innerHTML = '';
  let accountList = [];

  let cardNum = 0;

  console.log(cards);
  cards.forEach(card => {
    cardNum++;
    const html = [
      `<div class="carousel-item accountCard${cardNum} active">
    <div class="accountCard ">
      <div class="accountHead row">
        <div class="col numCol"> <h4 class="accountNumber col-6">**** ${card.accountNumber.slice(
          -4
        )}</h4></div>
        <div class="col numCol bankCol"> <h4 class="bankName accountNumber col-6">Trinity Capital</h4></div>
      </div>
      <div class="balanceSection row">
        <div class="col -6"><h6 class="balanceText ">Balance as of  </h6></div>
        <div class="col -6"><h6 class="balanceText balanceDateText"> ${new Intl.DateTimeFormat(
          currentProfile.locale,
          options
        ).format(currentTime)}</h6></div>
        
      </div>
      <div class="actualBalance">
        <h1 class="actualBalanceText">$${card.balanceTotal}.00</h1>
      </div>
      <div class="accountType">${card.accountType} Account</div>
    </div>
  </div>`,
    ];

    container.insertAdjacentHTML('beforeEnd', html);
  });

  const card2 = document.querySelector('.accountCard2');
  card2.classList.remove('active');

  updateTime();
};

//Updates the webpage UI with all of the needed data
export const updateUI = function (acc) {
  //Displays the Transactions data
  displayTransactions(acc);
  //Displays the balance with correct data
  displayBalance(acc);
  //Displays the users bill list
  displayBillList(acc);
};
