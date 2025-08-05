let draggedText = null;
let offsetX = 0;
let offsetY = 0;
const playarea = document.getElementById("playarea");

// Khi bắt đầu kéo từ sidebox
document.querySelectorAll(".item-list li").forEach(li => {
    li.addEventListener("dragstart", (e) => {
        draggedText = li.innerText;
        e.dataTransfer.setData("text/plain", li.innerText); // bắt buộc cho Chrome mới
    });
});

// Cho phép thả vào playarea
playarea.addEventListener("dragover", (e) => {
    e.preventDefault();
});

// Khi thả vào playarea
playarea.addEventListener("drop", (e) => {
    e.preventDefault();
    const text = draggedText || e.dataTransfer.getData("text/plain");
    if (text) {
        createPlayItem(text, e.offsetX, e.offsetY);
    }
    draggedText = null;
});

// Tạo item trong playarea
function createPlayItem(text, x, y) {
    const el = document.createElement("div");
    el.classList.add("play-item");
    el.innerText = text;
    el.style.left = x + "px";
    el.style.top = y + "px";

    makeDraggable(el);
    playarea.appendChild(el);
}

// Cho phép kéo item bên trong playarea
function makeDraggable(el) {
    let isDragging = false;

    el.addEventListener("mousedown", (e) => {
        isDragging = true;
        offsetX = e.offsetX;
        offsetY = e.offsetY;
        el.style.cursor = "grabbing";
    });

    document.addEventListener("mousemove", (e) => {
        if (isDragging) {
            const rect = playarea.getBoundingClientRect();
            el.style.left = (e.clientX - rect.left - offsetX) + "px";
            el.style.top = (e.clientY - rect.top - offsetY) + "px";
        }
    });

    document.addEventListener("mouseup", () => {
        isDragging = false;
        el.style.cursor = "grab";
    });
}
