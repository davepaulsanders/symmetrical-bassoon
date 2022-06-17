// create variable to hold db connection
let db;
// establish a connection to IndexedDB database called 'pizza_hunt' and set it to version 1
const request = indexedDB.open("bassoon", 1);

request.onupgradeneeded = function (event) {
  const db = event.target.result;

  db.createObjectStore("deposits", { autoIncrement: true });
  db.createObjectStore("expenses", { autoIncrement: true });
};

request.onsuccess = function (event) {
  db = event.target.result;

  if (navigator.onLine) {
    uploadDeposits();
    uploadExpenses();
  }
};

request.onerror = function (event) {
  console.log(event.target.errorCode);
};

// save deposit to indexedDB if no internet connection
const saveDeposit = (deposit) => {
  const transaction = db.transaction(["deposits"], "readwrite");
  const depositObjectStore = transaction.objectStore("deposits");
  depositObjectStore.add(deposit);
};

// save expense to indexedDB if no internet connection
const saveExpense = (expense) => {
  const transaction = db.transaction(["expenses"], "readwrite");
  const expenseObjectStore = transaction.objectStore("expenses");
  expenseObjectStore.add(expense);
};

const uploadDeposits = (deposit) => {};
const uploadExpenses = (expense) => {};

window.addEventListener("online", function () {
  uploadDeposits();
  uploadExpenses();
});
