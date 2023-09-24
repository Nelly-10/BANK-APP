'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,

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

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

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

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

////////////////////////////////
//Functions
const formatMovementDate = function(date) {
  const calcDaysPassed = (date1, date2) => 
  Math.round(Math.abs(date2 - date1) / (1000 * 60 * 60 * 24));

  const daysPassed = calcDaysPassed(new Date(), date);
  // console.log(daysPassed);

  if(daysPassed === 0) return 'Today';
  if(daysPassed === 1) return 'Yesterday';
  if(daysPassed <= 7) return `${daysPassed} days ago`;
  else {
    const day = `${date.getDate()}`.padStart(2); 
    const month = `${date.getMonth( + 1)}`.padStart(2, 0);
    const year = date.getFullYear(); 
    return `${day}/${month}/${year}`;
  }
}

const displayMovements = function(acc, sort = false) {
  containerMovements.innerHTML = '';

    const  movs = sort ? acc.movements.slice().sort((a, b) => a - b) : acc. movements;


    movs.forEach(function(mov, i) {
      const type = mov > 0 ? 'deposit' : 'withdrawal';

      const date = new Date(acc.movementsDates[i]);   
      const displayDate = formatMovementDate(date);   


      const html = `
        <div class="movements__row">
            <div class="movements__type movements__type--${type}">${i + 1} ${type}</div>
            <div class="movements__date">${displayDate}</div>
            <div class="movements__value">${mov}💶</div>
        </div>
      `;

      containerMovements.insertAdjacentHTML('afterbegin', html);
    })
}


const calcDisplayBalance = function(acc) {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
  labelBalance.textContent = `${acc.balance} EUR`;
}

const calcDisplaySummary = function(acc) {
    const incomes = acc.movements.filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
    labelSumIn.textContent = `${incomes}💶`;

    const out = acc.movements.filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
    labelSumOut.textContent = `${Math.abs(out)}💶`;

    const intrest = acc.movements.filter(mov => mov > 0)
    .map(deposit => deposit * acc.interestRate)
    .filter((int, i, arr) => int >= 1)
    .reduce((acc, int) => acc + int, 0);
    labelSumInterest.textContent = `${intrest}💶`;
}

const createUsernames = function(accs) {
      accs.forEach(function(acc) {
        acc.username = acc.owner
        .toLowerCase()
        .split(' ')
        .map(name => name[0])
        .join('');  
        // return acc.username;
      });
}

createUsernames(accounts);

const updateUI = function(acc) {

    // display movement
    displayMovements(acc);

    // balance
    calcDisplayBalance(acc);

    // display summary
    calcDisplaySummary(acc);
}

// Event handler 
let currentAccount, timer;

const startLogOutTimer = function() {
    const tick = function() {
      const min = String(Math.trunc(time / 60)).padStart(2, 0);
      const sec = String(time % 60).padStart(2, 0);

      // In each call, print the remaining time to Ui
        labelTimer.textContent = `${min}:${sec}`;

        
        // when 0 seconds, stop the timer and log out.
        if(time === 0) {
          clearInterval(timer);
          // display UI and message
          labelWelcome.textContent = `Log in to get staretd`;
          containerApp.style.opacity = 0;
      }
      // /decrease
      time--;
    }   

    // set time to 5 minutes
      let time  = 30; 


    // Call the timer every second
    tick();
    const timer = setInterval(tick, 1000);

    return timer;


}

// Fake Login
// currentAccount = account1;
// updateUI(currentAccount);
// containerApp.style.opacity = 100;



// labelDate.textContent = `${day}/${month}/${year}, ${hour}:${min}:${sec} `;


btnLogin.addEventListener('click', function (e) {
     e.preventDefault();

    currentAccount = accounts.find(acc => acc.username === inputLoginUsername.value);
    //  console.log(currentAccount);

      if(currentAccount?.pin === Number(inputLoginPin.value)) {
          // console.log('LOGIN');

          // display UI and message
          labelWelcome.textContent = `Welcome back, ${currentAccount.owner.split(' ')[0]}`;
          containerApp.style.opacity = 100;

          // Create current date and time
          const now = new Date();
          const day = `${now.getDate()}`.padStart(2);
          const month = `${now.getMonth( + 1)}`.padStart(2, 0);
          const year = now.getFullYear();
          const hour = now.getHours();
          const min = `${now.getMinutes()}`.padStart(2, 0);
          labelDate.textContent = `${day}/${month}/${year}, ${hour}:${min}`;

          // clear input field
          inputLoginUsername.value = inputLoginPin.value = '';
          inputLoginPin.blur();

          if (timer) clearInterval(timer);
          timer = startLogOutTimer();

          updateUI(currentAccount)

      }
})


btnTransfer.addEventListener('click', function(e) {
       e.preventDefault();
       const amount = Number(inputTransferAmount.value);
       const recieverAcc = accounts.find(
        acc => acc.username === inputTransferTo.value);

         // clear field
         inputTransferTo.value = inputTransferAmount.value = '';
         inputTransferAmount.blur();

        console.log(amount, recieverAcc);

        if (amount > 0 && recieverAcc && currentAccount.balance >= amount && recieverAcc?.username !== currentAccount.username)  {
          // Doing the transfer
            currentAccount.movements.push(-amount);
            recieverAcc.movements.push(amount);


            // create current date and time
            // const now = new Date();
            // const day = `${now.getDate()}`.padStart(2);
            // const month = `${now.getMonth( + 1)}`.padStart(2, 0);
            // const year = now.getFullYear();
            // const hours = now.getHours();
            // const min = now.getMinutes();
            // labelDate.textContent = `${day}/${month}/${year}, ${hours}:${min}`;
            currentAccount.movementsDates.push(new Date().toISOString());
            recieverAcc.movementsDates.push(new Date().toISOString());


            // update UI
            updateUI(currentAccount);

            // rest timer
            clearInterval(timer);
            timer = startLogOutTimer();
        }
})

btnLoan.addEventListener('click', function(e) {
  e.preventDefault();

  const amount = Number(inputLoanAmount.value);

    if(amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
          // add the movement
          setTimeout(function() {

            currentAccount.movements.push(amount);
  
            // add date
            currentAccount.movementsDates.push(new Date().toISOString());
  
            updateUI(currentAccount);
          }, 2500);
    }
    // clear field
    inputLoanAmount.value = '';
    
})

btnClose.addEventListener('click', function(e) {
    e.preventDefault();

    // console.log('Delete!!!');

    if(inputCloseUsername.value === currentAccount.username && Number(inputClosePin.value) === currentAccount.pin) {
          const index = accounts.findIndex(acc => acc.username === currentAccount.username);

          // delete account
          accounts.splice(index, 1);

          // Hide Ui
          containerApp.style.opacity = 0;      
    }

      // clear field
      inputCloseUsername.value = inputClosePin.value = '';
      inputClosePin.blur();
});

let sorted = false;
btnSort.addEventListener('click', function(e) {
      e.preventDefault();
      displayMovements(acc.movements, !sorted);
      sorted = !sorted;
})




/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

// const owners = ['Jonas', 'Zach', 'Adam', 'Martha'];
// console.log(owners.sort());

// ascending
movements.sort((a, b) => a - b);
console.log(movements);

// descending
movements.sort((a, b) => b - a);
console.log(movements);


// FLATMAP
// const arr = [[1, 2, 3], [4, 5, 6], 7, 8];
// console.log(arr.flat());

// const arrDeep = [[[1, 2], 3], [4, [5, 6]], 7, 8];
// console.log(arrDeep.flat(2));

// const accountMovement = accounts.map(acc => acc.movements);
// console.log(accountMovement);
// const allMovement = accountMovement.flat();
// console.log(allMovement);

// // const overalBalance = allMovement.reduce((acc, mov) => acc + mov, 0);

// // const overalBalance =  accounts.map(acc => acc.movements).flat().reduce((acc, mov) => acc + mov, 0);
// const overalBalance2 =  accounts.flatMap(acc => acc.movements).reduce((acc, mov) => acc + mov, 0);

// console.log(overalBalance2);



// Every
// console.log(movements.every(mov => mov >= -650));

// console.log(movements.includes(-130));

// const anyDeposit = movements.some(mov => mov > 1500);
// console.log(anyDeposit);

// const euroToUsd = 1.1;
// const totalDepositsUSD = movements.filter(mov => mov > 0)
// .map(mov => mov * euroToUsd)
//     .reduce((acc, mov) => acc + mov, 0);
// console.log(totalDepositsUSD)

// console.log(movements);

// //accumulator -> SNOWBALL
// const balance = movements.reduce((acc, cur) =>  acc + cur, 0);
// console.log(balance);

// let balance2 = 0;
// for(const mov of movements) balance2 += mov;
// console.log(balance2);

// //---------- MAXIMUM ---------------
// const min = movements.reduce((acc, mov) => {
//   if (acc < mov) return acc;
//   else return mov;
// }, movements[0]);
// console.log(min);


// const deposits = movements.filter(function(mov) {
//   return mov > 0;
// })
// console.log(movements);
// console.log(deposits);

// const depositsFor = [];
// for (const mov of movements) if (mov > 0) depositsFor.push(mov);


// const withdrawals = movements.filter(mov => mov < 0);
// console.log(withdrawals);

// const euroToUsd = 1.1;

// const movementsUSD = movements.map(function(mov) {
//     return mov * euroToUsd;
// });

// console.log(movements);
// console.log(movementsUSD);



/////////////////////////////////////////////////
// const currenciesUnique = new Set(['USD', 'GBP', 'USD', 'EUR', 'EUR']);
// console.log(currenciesUnique);
// currenciesUnique.forEach(function(value, _, map) {
//   console.log(`${value}: ${value}`);
// })

// const firstWithdrawal = movements.find(mov => mov < 0);
// console.log(firstWithdrawal);

// console.log(accounts);
// const account = accounts.find(acc => acc.owner === 'Sarah Smith');
// console.log(account);


// const z = Array.from({length: 7}, (_, i) => i + 1);
// console.log(z);

// const movementsUI = Array.from(document.querySelector)

// conversion
// console.log(Number('23'));
// console.log(+'23');

// // parsing
// console.log(Number.parseInt('30px', 10));
// console.log(Number.parseInt('e23'));

// console.log(Number.isNaN(20));
// console.log(Number.isNaN(+'20X'));

// Date
// const now = new Date();
// console.log(now);
// console.log(new Date(account1.movementsDates[0]));

// working with date
// const future = new Date(2037, 10, 19, 15, 23);
// console.log(future);
// console.log(future.getFullYear());
// console.log(future.getDate());
// console.log(future.getDay());
// console.log(future.getHours());
// console.log(future.getMinutes());
// console.log(future.getSeconds()); 
// console.log(future.toISOString());
// console.log(future.getTime());

// console.log(Date.now());


// const days1 = calcDaysPassed(new Date(2037, 3, 14), new Date(2037, 3, 4));

// console.log(days1);
