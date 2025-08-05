let draggedItem = null;
let offsetX = 0;
let offsetY = 0;

const playarea = document.getElementById("playarea");

// Drag từ sidebox sang playarea
document.querySelectorAll(".item-list li").forEach(li => {
    li.addEventListener("dragstart", (e) => {
        draggedItem = li.innerText;
    });
});

playarea.addEventListener("dragover", (e) => {
    e.preventDefault();
});

playarea.addEventListener("drop", (e) => {
    e.preventDefault();
    if (draggedItem) {
        createPlayItem(draggedItem, e.offsetX, e.offsetY);
        draggedItem = null;
    }
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

