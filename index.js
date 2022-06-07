"use strict";
// Data
const account1 = {
  owner: "Jonas Schmedtmann",
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: "Jessica Davis",
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: "Steven Thomas Williams",
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: "Sarah Smith",
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const account5 = {
  owner: "Zoran Janjic",
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1,
  pin: 1989,
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
let currentUser;
//* MAIN LOGIC

const updateUI = (acc) => {
  // display movements
  displayMovements(acc.movements);
  // display balance
  calculateTotalBalance(acc);
  // display summary
  calculateDisplaySummary(acc);
};
// display the movements from the account
const displayMovements = function (movementsArray, sort = false) {
  // make a copy of the array so we dont modify the original array

  const movs = sort
    ? movementsArray.slice().sort((a, b) => a - b)
    : movementsArray;

  // loop over the array and create the specific html for it
  movs.forEach((item, indx) => {
    const movementType = item > 0 ? "deposit" : "withdrawal";

    const movementWithdrawalHTML = `
      <div class="movements__row">
 <div class="movements__type movements__type--${movementType}">
 ${indx + 1}  ${movementType}
 </div>
                <div class="movements__date">3 days ago</div>
                <div class="movements__value">${item} €</div>
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
  labelBalance.textContent = `${account.balance} €`;
}

// * Calculate total deposit, withdrawal, interest
function calculateDisplaySummary(account) {
  const incomes = account.movements
    .filter((mov) => mov > 0)
    .reduce((acc, currEle) => acc + currEle);
  labelSumIn.textContent = `${incomes}€`;

  const spent = account.movements
    .filter((mov) => mov < 0)
    .reduce((acc, mov) => acc + mov);
  labelSumOut.textContent = `${spent}€`;

  const interest = account.movements
    .filter((mov) => mov > 0)
    .map((deposit) => (deposit * account.interestRate) / 100)
    .filter((interest) => interest >= 1)
    .reduce((acc, currEle) => acc + currEle, 0);
  labelSumInterest.textContent = `${interest}€`;
}

//* Login logic
btnLogin.addEventListener("click", (e) => {
  // prevent form submiting
  e.preventDefault();

  // find user account exist
  currentUser = allAccounts.find(
    (acc) => acc.userInitials === inputLoginUsername.value
  );

  // if user exist check if pin matches
  if (currentUser?.pin === Number(inputLoginPin.value)) {
    // dispaly ui and welcome message
    labelWelcome.textContent = `Welcome back ${
      currentUser.owner.split(" ")[0]
    }`;

    //  clear input fields
    inputLoginUsername.value = inputLoginPin.value = "";
    inputLoginPin.blur();

    containerApp.style.opacity = 100;
    updateUI(currentUser);
  }
});

//* Transfer logic
btnTransfer.addEventListener("click", (e) => {
  // prevent page reload on submit
  e.preventDefault();

  // get input values
  const transferAmmount = Number(inputTransferAmount.value);
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
    updateUI(currentUser);
    inputTransferAmount.value = inputTransferTo.value = "";
  } else {
    console.log("not valid");
  }
});

//* Close account
btnClose.addEventListener("click", (e) => {
  e.preventDefault();

  if (
    inputCloseUsername.value === currentUser.userInitials &&
    Number(inputClosePin.value) === currentUser.pin
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

  const requestedAmount = Number(inputLoanAmount.value);

  if (
    requestedAmount > 0 &&
    currentUser.movements.some((mov) => mov >= requestedAmount * 0.1)
  ) {
    currentUser.movements.push(requestedAmount);
    updateUI(currentUser);
  }
  inputLoanAmount.value = "";
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
const allAccountsMovements = allAccounts
  .map((acc) => acc.movements)
  .flat()
  .reduce((acc, ele) => acc + ele);
