// create variable to hold db connection
let db;
// establish a connection to IndexedDB database called 'pizza_hunt' and set it to version 1
const request = indexedDB.open("bassoon", 1);

request.onupgradeneeded = function (event) {
  const db = event.target.result;

  db.createObjectStore("transactions", { autoIncrement: true });
};

request.onsuccess = function (event) {
  db = event.target.result;
  if (navigator.onLine) {
    uploadTransactions();
  }
};

request.onerror = function (event) {
  console.log(event.target.errorCode);
};

// save transaction to indexedDB if no internet connection
const saveRecord = (queryData) => {
  console.log(queryData);
  const transaction = db.transaction(["transactions"], "readwrite");
  const transactionObjectStore = transaction.objectStore("transactions");
  transactionObjectStore.add(queryData);
};

const uploadTransactions = (query) => {
  const transaction = db.transaction(["transactions"], "readwrite");

  const transactionObjectStore = transaction.objectStore("transactions");

  const getAll = transactionObjectStore.getAll();
  getAll.onsuccess = function () {
    if (getAll.result.length > 0) {
      fetch("/api/transaction", {
        method: "POST",
        body: JSON.stringify(getAll.result),
        headers: {
          Accept: "application/json, text/plain, */*",
          "Content-Type": "application/json",
        },
      })
        .then((response) => response.json())
        .then((serverResponse) => {
          if (serverResponse.message) {
            throw new Error(serverResponse);
          }
          const transaction = db.transaction(["transactions"], "readwrite");
          const transactionObjectStore =
            transaction.objectStore("transactions");

          transactionObjectStore.clear();

          alert("All saved transactions have been submitted!");
        })
        .catch((err) => console.log(err));
    }
  };
};
window.addEventListener("online", function () {
  uploadTransactions();
});
