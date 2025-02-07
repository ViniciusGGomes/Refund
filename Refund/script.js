// Elementos do formulario
const form = document.querySelector("form");
const amount = document.getElementById("amount");
const category = document.getElementById("category");
const expense = document.getElementById("expense");

// Elementos da lista
const expenseList = document.querySelector("ul");
const expenseQuantity = document.querySelector("aside header p span");
const expenseTotal = document.querySelector("aside header h2");

// Captura o evento de input para formatar o valor
amount.oninput = () => {
  let value = amount.value.replace(/\D/g, "");

  value = Number(value) / 100;

  amount.value = formatCurrencyBRL(value);
};

// Formata o valor no padrão BRL (real brasileiro)
function formatCurrencyBRL(value) {
  value = value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });

  return value;
}

// Captura o evento de submit do formulário para obter os valores
form.onsubmit = (event) => {
  event.preventDefault();

  // Cria um objeto com os detalhes da nova despesa
  const newExpense = {
    id: new Date().getTime(),
    expense: expense.value,
    category_id: category.value,
    category_name: category.options[category.selectedIndex].text,
    amount: amount.value,
    created_at: new Date(),
  };

  expenseAdd(newExpense);
};

// Adiciona um novo item na lista
function expenseAdd(newExpense) {
  try {
    const expenseItem = document.createElement("li");
    expenseItem.classList.add("expense");

    const expenseIcon = document.createElement("img");
    expenseIcon.setAttribute("src", `img/${newExpense.category_id}.svg`);
    expenseIcon.setAttribute("alt", newExpense.category_name);

    const expenseInfo = document.createElement("div");
    expenseInfo.classList.add("expense-info");

    const expenseName = document.createElement("strong");
    expenseName.textContent = newExpense.expense;

    const expenseCategory = document.createElement("span");
    expenseCategory.textContent = newExpense.category_name;

    expenseInfo.append(expenseName, expenseCategory);

    const expenseAmount = document.createElement("span");
    expenseAmount.classList.add("expense-amount");
    expenseAmount.innerHTML = `<small>R$</small>${newExpense.amount
      .toUpperCase()
      .replace("R$", "")}`;

    const removeIcon = document.createElement("img");
    removeIcon.classList.add("remove-icon");
    removeIcon.setAttribute("src", "img/remove.svg");
    removeIcon.setAttribute("alt", "remover");

    expenseItem.append(expenseIcon, expenseInfo, expenseAmount, removeIcon);

    expenseList.append(expenseItem);

    formClear();

    updateTotals();
  } catch (error) {
    alert("Não foi possivel adicionar o item na lista");
    console.log(error);
  }
}

// Atualiza a quantidade de itens da lista
function updateTotals() {
  try {
    const items = expenseList.children;
    expenseQuantity.textContent = `${items.length} ${
      items.length > 1 ? "despesas" : "despesa"
    }`;

    let total = 0;

    for (let item = 0; item < items.length; item++) {
      const itemAmount = items[item].querySelector(".expense-amount");

      let value = itemAmount.textContent
        .replace(/[^\d,]/g, "")
        .replace(",", ".");

      value = parseFloat(value);

      if (isNaN(value)) {
        return alert(
          "Não foi possível calcular o total. O valor não parece ser um número"
        );
      }

      total += Number(value);
    }
    const symbolBRL = document.createElement("small");
    symbolBRL.textContent = "R$";

    total = formatCurrencyBRL(total).toUpperCase().replace("R$", "");

    expenseTotal.innerHTML = "";

    expenseTotal.append(symbolBRL, total);
  } catch (error) {
    alert("Não foi possível atualizar a lista de totais");
    console.log(error);
  }
}

// Evento que captura o clique nos itens da lista
expenseList.onclick = (event) => {
  if (event.target.classList.contains("remove-icon")) {
    const item = event.target.closest(".expense");
    item.remove();
  }
};

// Limpa os inputs
function formClear() {
  expense.value = "";
  category.value = "";
  amount.value = "";

  expense.focus();
}
