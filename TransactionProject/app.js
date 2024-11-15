const transactionList = document.querySelector(".transaction-list");
fetch('https://acb-api.algoritmika.org/api/transaction')
  .then((response) => response.json())
  .then((data) => {
    if (Array.isArray(data)) {
      data.forEach((transaction) => {
        const li = document.createElement("li");
        const template = `
          <span>From: ${transaction.from}</span>
          <span>To: ${transaction.to}</span>
          <span>Amount: ${transaction.amount}</span>
        `;
        li.innerHTML = template;
        transactionList.appendChild(li);
      });
    } else {
      console.error("Data massiv deyil");
    }
  })
  .catch((error) => console.error(error));