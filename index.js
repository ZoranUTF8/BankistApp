"use strict";
// Data
const account1 = {
  owner: "Jonas Schmedtmann",
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
  movementsDates: [
    "2022-11-01T13:15:33.035Z",
    "2022-11-30T09:48:16.867Z",
    "2022-12-25T06:04:23.907Z",
    "2022-01-25T14:18:46.235Z",
    "2022-02-05T16:33:06.386Z",
    "2022-04-03T14:43:26.374Z",
    "2022-06-08T18:49:59.371Z",
    "2022-06-09T12:01:20.894Z",
  ],
  currency: "EUR",
  locale: "pt-PT", // de-DE
};

const account2 = {
  owner: "Jessica Davis",
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
  movementsDates: [
    "2019-11-18T21:31:17.178Z",
    "2019-12-23T07:42:02.383Z",
    "2020-01-28T09:15:04.904Z",
    "2020-04-01T10:17:24.185Z",
    "2020-05-08T14:11:59.604Z",
    "2020-07-26T17:01:17.194Z",
    "2020-07-28T23:36:17.929Z",
    "2020-08-01T10:51:36.790Z",
  ],
  currency: "EUR",
  locale: "pt-PT", // de-DE
};

const account3 = {
  owner: "Steven Thomas Williams",
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
  movementsDates: [
    "2019-11-01T13:15:33.035Z",
    "2019-11-30T09:48:16.867Z",
    "2019-12-25T06:04:23.907Z",
    "2020-01-25T14:18:46.235Z",
    "2020-02-05T16:33:06.386Z",
    "2020-04-10T14:43:26.374Z",
    "2020-06-25T18:49:59.371Z",
    "2020-07-26T12:01:20.894Z",
  ],
  currency: "USD",
  locale: "en-US",
};

const account4 = {
  owner: "Sarah Smith",
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
  movementsDates: [
    "2019-11-18T21:31:17.178Z",
    "2019-12-23T07:42:02.383Z",
    "2020-01-28T09:15:04.904Z",
    "2020-04-01T10:17:24.185Z",
    "2020-05-08T14:11:59.604Z",
    "2020-07-26T17:01:17.194Z",
    "2020-07-28T23:36:17.929Z",
    "2020-08-01T10:51:36.790Z",
  ],
  currency: "EUR",
  locale: "pt-PT", // de-DE
};

const account5 = {
  owner: "Zoran Janjic",
  movements: [200, 450, -400, -231.32, 3000, -650, -130, 70],
  interestRate: 1,
  pin: 1989,
  movementsDates: [
    "2019-11-01T13:15:33.035Z",
    "2019-11-30T09:48:16.867Z",
    "2019-12-25T06:04:23.907Z",
    "2020-01-25T14:18:46.235Z",
    "2020-02-05T16:33:06.386Z",
    "2022-05-23T14:43:26.374Z",
    "2022-06-08T18:49:59.371Z",
    "2022-06-09T12:01:20.894Z",
  ],
  currency: "BAM",
  locale: "sr-BA",
};

const allAccounts = [account1, account2, account3, account4, account5];

//* Dom elements

const labelWelcome = document.querySelector(".welcome");
const labelDate = document.querySelector(".date");
const labelBalance = document.querySelector(".balance__value");
const labelSumIn = document.querySelector(".summary__value--in");
const labelSumOut = document.querySelector(".summary__value--out");
const labelSumInterest = document.querySelector(".summary__value--interest");
const labelTimer = document.querySelector(".timer");

const containerApp = document.querySelector(".app");
const containerMovements = document.querySelector(".movements");

const btnLogin = document.querySelector(".login__btn");
const btnTransfer = document.querySelector(".form__btn--transfer");
const btnLoan = document.querySelector(".form__btn--loan");
const btnClose = document.querySelector(".form__btn--close");
const btnSort = document.querySelector(".btn--sort");

const inputLoginUsername = document.querySelector(".login__input--user");
const inputLoginPin = document.querySelector(".login__input--pin");
const inputTransferTo = document.querySelector(".form__input--to");
const inputTransferAmount = document.querySelector(".form__input--amount");
const inputLoanAmount = document.querySelector(".form__input--loan-amount");
const inputCloseUsername = document.querySelector(".form__input--user");
const inputClosePin = document.querySelector(".form__input--pin");

/////////////////////////////////////////////////////////

// * APP VARS
let currentUser, timer;

const updateUI = (acc) => {
  // display movements
  displayMovements(acc);
  // display balance
  calculateTotalBalance(acc);
  // display summary
  calculateDisplaySummary(acc);
};

//* MAIN LOGIC

// start logout timer
const startLogoutTimer = () => {
  //  set time to 5 minutes
  let time = 350;

  const tick = () => {
    const min = String(Math.trunc(time / 60)).padStart(2, 0);
    const sec = String(time % 60).padStart(2, 0);

    labelTimer.textContent = `${min}:${sec}`;

    if (time === 0) {
      clearInterval(logoutTimer);
      containerApp.style.opacity = 0;
      labelWelcome.textContent = "Login";
    }

    time--;
  };

  // call timer every second
  tick();
  const logoutTimer = setInterval(tick, 1000);
  return logoutTimer;
};
// display  how many days ago
const displayDates = (date, locale) => {
  // calcualte how many days passed
  const calcDaysPassed = (d1, d2) =>
    Math.round(Math.abs(d2 - d1) / (1000 * 60 * 60 * 24));

  const daysPassed = calcDaysPassed(new Date(), date);

  if (daysPassed === 0) return "Today";
  if (daysPassed === 1) return "Yesterday";
  if (daysPassed >= 7) {
    const day = `${date.getDay()}`.padStart(2, 0);
    const month = `${date.getMonth()}`.padStart(2, 0);
    const year = date.getFullYear();

    return new Intl.DateTimeFormat(locale).format(date);

    // return `${daysPassed} days ago ${day}/${month}/${year}`;
  }

  // if we want hours
  // const hour = `${date.getHours()}`.padStart(2, 0);
  // const min = `${date.getMinutes()}`.padStart(2, 0);
};

// display the movements from the account
const displayMovements = function (acc, sort = false) {
  // make a copy of the array so we dont modify the original array

  const movs = sort
    ? acc.movements.slice().sort((a, b) => a - b)
    : acc.movements;

  // loop over the array and create the specific html for it
  movs.forEach((item, indx) => {
    const movementType = item > 0 ? "deposit" : "withdrawal";

    // format currency
    const formatedCurrency = new Intl.NumberFormat(acc.locale, {
      style: "currency",
      currency: acc.currency,
    }).format(item);
    // create current date
    // using the current index we get the data from the dates array
    const rawDateData = new Date(acc.movementsDates[indx]);
    const displayDate = displayDates(rawDateData, acc.locale);

    const movementWithdrawalHTML = `
      <div class="movements__row">
 <div class="movements__type movements__type--${movementType}">
 ${indx + 1}  ${movementType}
 </div>
                <div class="movements__date">${displayDate}</div>
                <div class="movements__value">${formatedCurrency}</div>
            </div>`;

    // insert the new html to the specified container
    containerMovements.insertAdjacentHTML("afterbegin", movementWithdrawalHTML);
  });
};
// run the displayMovements function

// * Create user initials based on username
function createUserInitials(users) {
  users.forEach((user) => {
    user.userInitials = user.owner
      .toLowerCase()
      .split(" ")
      .map((word) => word[0])
      .join("");
  });
}
// run create user initials on all accounts array
createUserInitials(allAccounts);

//* Calculate total movements balance and display in balance label

function calculateTotalBalance(account) {
  account.balance = account.movements.reduce((acc, ele) => {
    return acc + ele;
  }, 0);

  // format currency
  const formatedCurrency = new Intl.NumberFormat(account.locale, {
    style: "currency",
    currency: account.currency,
  }).format(account.balance);
  labelBalance.textContent = `${formatedCurrency}`;
}

// * Calculate total deposit, withdrawal, interest
function calculateDisplaySummary(account) {
  const incomes = account.movements
    .filter((mov) => mov > 0)
    .reduce((acc, currEle) => acc + currEle);
  labelSumIn.textContent = `${incomes.toFixed(2)}€`;

  const spent = account.movements
    .filter((mov) => mov < 0)
    .reduce((acc, mov) => acc + mov);
  labelSumOut.textContent = `${spent.toFixed(2)}€`;

  const interest = account.movements
    .filter((mov) => mov > 0)
    .map((deposit) => (deposit * account.interestRate) / 100)
    .filter((interest) => interest >= 1)
    .reduce((acc, currEle) => acc + currEle, 0);
  labelSumInterest.textContent = `${interest.toFixed(2)}€`;
}

//! fake logged in for testing
// currentUser = account5;
// updateUI(currentUser);
// containerApp.style.opacity = 100;

//* Login logic
btnLogin.addEventListener("click", (e) => {
  // prevent form submiting
  e.preventDefault();

  // find user account exist
  currentUser = allAccounts.find(
    (acc) => acc.userInitials === inputLoginUsername.value
  );

  // if user exist check if pin matches
  if (currentUser?.pin === +inputLoginPin.value) {
    // dispaly ui and welcome message
    labelWelcome.textContent = `Welcome back ${
      currentUser.owner.split(" ")[0]
    }`;

    //  clear input fields
    inputLoginUsername.value = inputLoginPin.value = "";
    inputLoginPin.blur();

    containerApp.style.opacity = 100;

    // Check for active timer and clear it
    if (timer) clearInterval(timer);

    timer = startLogoutTimer();

    updateUI(currentUser);
  }
});

//* Transfer logic
btnTransfer.addEventListener("click", (e) => {
  // prevent page reload on submit
  e.preventDefault();

  // get input values
  const transferAmmount = +inputTransferAmount.value;

  const transferToAccount = allAccounts.find(
    (acc) => acc.userInitials === inputTransferTo.value
  );

  if (
    transferAmmount > 0 &&
    transferToAccount &&
    currentUser.balance >= transferAmmount &&
    currentUser?.userInitials !== transferToAccount.userInitials
  ) {
    // do the transfer
    currentUser.movements.push(-transferAmmount);
    transferToAccount.movements.push(transferAmmount);

    currentUser.movementsDates.push(new Date().toISOString());
    transferToAccount.movementsDates.push(new Date().toISOString());

    updateUI(currentUser);
    inputTransferAmount.value = inputTransferTo.value = "";
    //Reset the time
    clearInterval(timer);
    startLogoutTimer();
  } else {
    console.log("not valid");
  }
});

//* Close account
btnClose.addEventListener("click", (e) => {
  e.preventDefault();

  if (
    inputCloseUsername.value === currentUser.userInitials &&
    +inputClosePin.value === currentUser.pin
  ) {
    const index = allAccounts.findIndex(
      (acc) => acc.userInitials === currentUser.userInitials
    );

    allAccounts.splice(index, 1);
    containerApp.style.opacity = 0;
    inputCloseUsername.value = inputLoginPin.value = "";
  } else {
    console.log(inputCloseUsername.value, inputClosePin.value);
    console.log("not same");
  }
});

// *  Request loan
btnLoan.addEventListener("click", (e) => {
  e.preventDefault();
  console.log("here");
  const requestedAmount = Math.floor(inputLoanAmount.value);

  if (
    requestedAmount > 0 &&
    currentUser.movements.some((mov) => mov >= requestedAmount * 0.1)
  ) {
    // run after 2.5 sec
    setTimeout(() => {
      // Add movement
      currentUser.movements.push(requestedAmount);
      // Add loan date
      currentUser.movementsDates.push(new Date().toISOString());

      // ipdate ui
      updateUI(currentUser);
    }, 2500);
  }
  inputLoanAmount.value = "";

  //Reset the time
  clearInterval(timer);
  startLogoutTimer();
});

// * SORT MOVEMENTS
//  var to store the sorting or not state
let sorted = false;
btnSort.addEventListener("click", function (e) {
  e.preventDefault();
  displayMovements(currentUser.movements, !sorted);
  sorted = !sorted;
});

// * EXTRA
// calculate all the movements from all accounts
// const allAccountsMovements = allAccounts
//   .map((acc) => acc.movements)
//   .flat()
//   .reduce((acc, ele) => acc + ele);

//* SET current date
// const now = new Date();
// const day = `${now.getDay()}`.padStart(2, 0);
// const month = `${now.getMonth()}`.padStart(2, 0);
// const year = now.getFullYear();
// const hour = `${now.getHours()}`.padStart(2, 0);
// const min = `${now.getMinutes()}`.padStart(2, 0);

// const displayDate = `${day}/${month}/${year} | ${hour}:${min}`;
// labelDate.textContent = displayDate;

//* Internatiolaziation API

const optionsObject = {
  day: "numeric",
  month: "long",
  weekday: "long",
  year: "numeric",
  hour: "numeric",
  minute: "numeric",
};

const now = new Date();

labelDate.textContent = new Intl.DateTimeFormat(
  currentUser.locale,
  optionsObject
).format(now);
