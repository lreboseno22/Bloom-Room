// On Submit Form, save user's name and redirect them to the garden page
const form = document.getElementById("playerForm")
if (form) {
    form.addEventListener("submit", function (event) {
        event.preventDefault();
        const playerName = document.getElementById("fname").value.trim();

        localStorage.setItem("playerName", playerName);
        console.log("Saved to localStorage:", playerName);

        window.location.href = "./pages/garden.html";
    });
}

// Display Username in Garden
const playerNameEl = document.getElementById("playerName");
if (playerNameEl) {
    const name = localStorage.getItem("playerName");
    playerNameEl.textContent = name || "gardener";

    // Load Inventory
    const inventoryEl = document.getElementById("seeds")
    let inventory = JSON.parse(localStorage.getItem("inventory")) || [];

    function loadInventory() {
        if (!inventoryEl) return;
        inventoryEl.innerHTML = "";

        if (inventory.length === 0) {
            const li = document.createElement("li");
            li.textContent = "You don't have any seeds. Go to the shop!";
            li.style.fontStyle = "italic";
            li.style.listStyle = "none";
            inventoryEl.appendChild(li);
            return;
        }

        inventory.forEach(seed => {
            const li = document.createElement("li");
            li.textContent = seed;
            inventoryEl.appendChild(li);
        });
    }

    loadInventory();

    // Dynamically create garden 
    const gardenGrid = document.getElementById("gardenGrid");
    const rows = 8;
    const cols = 8;

    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            const cell = document.createElement("div");
            cell.classList.add("cell");
            cell.dataset.row = r;
            cell.dataset.col = c;

            // Plant seed when clicking cell
            cell.addEventListener('click', () => {
                if (!inventory.length) {
                    alert("You don't own any seeds! Buy some from the shop.");
                    return;
                }
            })
            gardenGrid.appendChild(cell);
        }
    }

    // Navigate to shop
    const shopBtn = document.getElementById("shopBtn");
    if (shopBtn) {
        shopBtn.style.cursor = "pointer";
        shopBtn.addEventListener("click", () => {
            window.location.href = "./shop.html";
        });
    }
}

const shop = document.getElementById("shop");
if (shop) {
    const seedCatalog = [
        { seed: "carrot", stages: ["🌱", "🥕"] },
        { seed: "tomato", stages: ["🌱", "🌿", "🍅"] },
        { seed: "sunflower", stages: ["🌱", "🌿", "🌻"] }
    ];

}