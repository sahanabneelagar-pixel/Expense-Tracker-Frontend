let expenses=JSON.parse(localStorage.getItem("expenses"))||[];
let editId=null;
const $=id=>document.getElementById(id);

function save(){localStorage.setItem("expenses",JSON.stringify(expenses));
    
}

function render(){
let search=$("search").value.toLowerCase(),filter=$("filter").value;
let list=expenses.filter(e=>e.name.toLowerCase().includes(search)&&
(filter==="All"||e.category===filter));
$("items").innerHTML=list.length?list.map(e=>`
<div class="item">
<span>${e.name}</span><span>${e.category}</span>
<span class="amount">₹${Number(e.amount).toFixed(2)}</span>
<span>${e.date}</span>
<span><button class="edit" onclick="edit(${e.id})">Edit</button>
<button class="delete" onclick="remove(${e.id})">Delete</button></span>
</div>`).join(""):`<div class="empty">No expenses found.</div>`;
$("total").textContent=expenses.reduce((s,e)=>s+Number(e.amount),0).toFixed(2);
save();
}

$("expenseForm").onsubmit=e=>{
e.preventDefault();
let name=$("name").value.trim(),amount=Number($("amount").value);
let category=$("category").value,date=$("date").value;
if(!name||amount<=0||!category||!date)return alert("Enter valid details.");
let item={id:editId||Date.now(),name,amount,category,date};
if(editId)expenses=expenses.map(e=>e.id===editId?item:e);
else expenses.push(item);
editId=null;e.target.reset();render();
};

function edit(id){
let e=expenses.find(x=>x.id===id);
$("name").value=e.name;$("amount").value=e.amount;
$("category").value=e.category;$("date").value=e.date;editId=id;
}

function remove(id){
if(confirm("Delete this expense?")){expenses=expenses.filter(e=>e.id!==id);render();}
}

$("search").oninput=render;
$("filter").onchange=render;
render();