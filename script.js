let expenses = JSON.parse(localStorage.getItem("expenses")) || [];
let editId = null;

const form = document.getElementById("expenseForm");
const nameInput = document.getElementById("name");
const amountInput = document.getElementById("amount");
const categoryInput = document.getElementById("category");
const dateInput = document.getElementById("date");
const list = document.getElementById("expenseList");
const search = document.getElementById("search");
const filter = document.getElementById("filter");
const total = document.getElementById("total");
const count = document.getElementById("count");
const message = document.getElementById("message");
const submitBtn = document.getElementById("submitBtn");
const cancelBtn = document.getElementById("cancelBtn");

function saveData() {
    localStorage.setItem("expenses", JSON.stringify(expenses));
}

function showMessage(text, error = false) {
    message.textContent = text;
    message.style.color = error ? "red" : "green";
}

function renderExpenses() {
    const text = search.value.toLowerCase();
    const category = filter.value;

    const result = expenses.filter(e =>
        e.name.toLowerCase().includes(text) &&
        (category === "All" || e.category === category)
    );

    list.innerHTML = "";

    result.forEach(e => {
        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${e.name}</td>
            <td>${e.category}</td>
            <td>₹${Number(e.amount).toFixed(2)}</td>
            <td>${e.date}</td>
            <td>
                <button class="edit" onclick="editExpense(${e.id})">
                    Edit
                </button>
                <button class="delete" onclick="deleteExpense(${e.id})">
                    Delete
                </button>
            </td>
        `;

        list.appendChild(row);
    });

    document.getElementById("empty").style.display =
        result.length ? "none" : "block";

    updateTotal();
}

function updateTotal() {
    const sum = expenses.reduce(
        (total, expense) => total + Number(expense.amount), 0
    );

    total.textContent = "₹" + sum.toFixed(2);
    count.textContent = expenses.length;
}

form.addEventListener("submit", function(event) {
    event.preventDefault();

    const name = nameInput.value.trim();
    const amount = Number(amountInput.value);
    const category = categoryInput.value;
    const date = dateInput.value;

    if (!name || amount <= 0 || !category || !date) {
        showMessage("Please enter valid details.", true);
        return;
    }

    const expense = {
        id: editId || Date.now(),
        name: name,
        amount: amount,
        category: category,
        date: date
    };

    if (editId) {
        expenses = expenses.map(e =>
            e.id === editId ? expense : e
        );
        showMessage("Expense updated successfully.");
    } else {
        expenses.push(expense);
        showMessage("Expense added successfully.");
    }

    editId = null;
    submitBtn.textContent = "Add Expense";
    cancelBtn.style.display = "none";

    form.reset();
    saveData();
    renderExpenses();
});

function editExpense(id) {
    const expense = expenses.find(e => e.id === id);

    nameInput.value = expense.name;
    amountInput.value = expense.amount;
    categoryInput.value = expense.category;
    dateInput.value = expense.date;

    editId = id;
    submitBtn.textContent = "Update Expense";
    cancelBtn.style.display = "block";

    window.scrollTo({ top: 0, behavior: "smooth" });
}

function deleteExpense(id) {
    if (!confirm("Delete this expense?")) return;

    expenses = expenses.filter(e => e.id !== id);
    saveData();
    renderExpenses();
    showMessage("Expense deleted successfully.");
}

cancelBtn.addEventListener("click", function() {
    editId = null;
    form.reset();
    submitBtn.textContent = "Add Expense";
    cancelBtn.style.display = "none";
});

search.addEventListener("input", renderExpenses);
filter.addEventListener("change", renderExpenses);

cancelBtn.style.display = "none";
renderExpenses();