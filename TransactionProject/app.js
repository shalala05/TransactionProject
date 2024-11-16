const modal = document.querySelector(".modal");
const transactionList = document.querySelector(".transaction-list");
const [fromInput, toInput, amountInput] = document.querySelectorAll(".from, .to, .amount");

const toggleModal = () => modal.classList.toggle("hidden");

const createTransactionElement = (transaction) => {
  const li = document.createElement("li");
  li.innerHTML = `
        <span>From: ${transaction.from}</span>
        <span>To: ${transaction.to}</span>
        <span>Amount: ${transaction.amount}</span>
        <div class="transaction-actions">
            <button class="edit-btn">Edit</button>
            <button class="delete-btn">Delete</button>
        </div>
    `;

  li.querySelector(".delete-btn").onclick = () => {
    fetch(`https://acb-api.algoritmika.org/api/transaction/${transaction.id}`, { method: "DELETE" })
      .then(() => li.remove())
      .catch(console.error);
  };

  li.querySelector(".edit-btn").onclick = () => {
    [fromInput.value, toInput.value, amountInput.value] = [transaction.from, transaction.to, transaction.amount];
    toggleModal();
    document.querySelector(".save-btn").onclick = () => {
      fetch(`https://acb-api.algoritmika.org/api/transaction/${transaction.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ from: fromInput.value, to: toInput.value, amount: amountInput.value }),
      })
        .then(() => {
          li.querySelector("span:nth-child(1)").textContent = `From: ${fromInput.value}`;
          li.querySelector("span:nth-child(2)").textContent = `To: ${toInput.value}`;
          li.querySelector("span:nth-child(3)").textContent = `Amount: ${amountInput.value}`;
          toggleModal();
        })
        .catch(console.error);
    };
  };

  return li;
};

fetch("https://acb-api.algoritmika.org/api/transaction")
  .then((res) => res.json())
  .then((data) => data.forEach((t) => transactionList.appendChild(createTransactionElement(t))))
  .catch(console.error);

document.querySelector(".add-btn").onclick = toggleModal;
document.querySelector(".close-btn").onclick = toggleModal;

document.querySelector(".save-btn").onclick = () => {
  const newTransaction = { from: fromInput.value, to: toInput.value, amount: amountInput.value };
  fetch("https://acb-api.algoritmika.org/api/transaction", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(newTransaction),
  })
    .then((res) => res.json())
    .then((data) => {
      transactionList.appendChild(createTransactionElement(data));
      toggleModal();
    })
    .catch(console.error);
};
