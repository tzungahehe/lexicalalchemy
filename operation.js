let unlocked = [];
let recipes = {};
let selected = [];

const itemsList = document.getElementById("itemsList");
const resultBox = document.getElementById("result");

// ==== Vẽ danh sách item ====
function renderItems() {
  itemsList.innerHTML = "";
  unlocked.sort().forEach(item => {
    const div = document.createElement("div");
    div.className = "item";
    if (selected.includes(item)) div.classList.add("selected");
    div.textContent = item;
    div.onclick = () => selectItem(item);
    itemsList.appendChild(div);
  });
}

// ==== Chọn item ====
function selectItem(item) {
  if (selected.includes(item)) {
    selected = selected.filter(i => i !== item);
  } else {
    if (selected.length < 2) {
      selected.push(item);
    } else {
      selected = [item];
    }
  }
  if (selected.length === 2) tryCombine();
  renderItems();
}

// ==== Thử kết hợp ====
function tryCombine() {
  const combo1 = selected[0] + "+" + selected[1];
  const combo2 = selected[1] + "+" + selected[0];
  const result = recipes[combo1] || recipes[combo2];

  if (result) {
    if (!unlocked.includes(result)) {
      unlocked.push(result);
      localStorage.setItem("unlockedItems", JSON.stringify(unlocked));
      resultBox.textContent = `🎉 Bạn đã mở khóa: ${result}!`;
    } else {
      resultBox.textContent = `✅ Kết hợp đúng nhưng bạn đã có: ${result}.`;
    }
  } else {
    resultBox.textContent = "❌ Không thể kết hợp!";
  }

  selected = [];
  renderItems();
}

// ==== Load dữ liệu từ file ====
Promise.all([
  fetch("items.txt").then(res => res.ok ? res.text() : Promise.reject()),
  fetch("recipes.txt").then(res => res.ok ? res.text() : Promise.reject())
]).then(([itemsText, recipesText]) => {
  
  // Xử lý items
  const defaultItems = itemsText.trim().split(/\r?\n/).map(i => i.trim()).filter(i => i);
  unlocked = JSON.parse(localStorage.getItem("unlockedItems")) || defaultItems;

  // Xử lý recipes
  recipesText.trim().split(/\r?\n/).forEach(line => {
    const [combo, result] = line.split("=");
    if (combo && result) {
      recipes[combo.trim()] = result.trim();
    }
  });

  renderItems();
}).catch(err => {
  console.error("Không thể load items.txt hoặc recipes.txt:", err);
  alert("⚠ Không thể load dữ liệu. Kiểm tra lại file .txt!");
});
document.getElementById("resetBtn").addEventListener("click", () => {
  if (confirm("Bạn có chắc muốn reset game về ban đầu?")) {
    localStorage.removeItem("unlockedItems"); // Xóa dữ liệu đã lưu
    location.reload(); // Tải lại trang để load lại items.txt gốc
  }
});
