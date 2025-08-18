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
const playerNameEl = document.querySelector("#playerName");
if (playerNameEl) {
    const name = localStorage.getItem("playerName");
    playerNameEl.textContent = name || "gardener";

    // Load Inventory
    const inventoryEl = document.getElementById("seeds")
    let selectedSeed = null;
    let inventory = JSON.parse(localStorage.getItem("inventory")) || [];

    function loadInventory() {
        if (!inventoryEl) return;
        inventoryEl.innerHTML = "";

        let inventory = JSON.parse(localStorage.getItem("inventory")) || [];

        // Check if user has seeds
        if (inventory.length === 0) {
            const li = document.createElement("li");
            li.textContent = "You don't have any seeds. Go to the shop!";
            li.style.fontStyle = "italic";
            li.style.listStyle = "none";
            inventoryEl.appendChild(li);
            return;
        }

        // Dynamically create list of seeds to plant or remove 
        inventory.forEach((seed, index) => {
            const li = document.createElement("li");

            li.textContent = seed + " ";
            li.style.listStyle = "none";

            // Added plant button
            const plantBtn = document.createElement("button");
            plantBtn.textContent = "Plant";
            plantBtn.style.marginLeft = "10px";
            plantBtn.addEventListener("click", () => {
                selectedSeed = seed;
                showToast(`Selected ${seed} to plant! Now click a plot.`, "success")
            })
            li.appendChild(plantBtn);

            // Added remove button
            const removeBtn = document.createElement("button");
            removeBtn.textContent = "Remove";
            removeBtn.style.marginLeft = "10px";

            // Remove seed list from inventory
            removeBtn.addEventListener("click", () => {
                inventory.splice(index, 1);
                localStorage.setItem("inventory", JSON.stringify(inventory));
                loadInventory();
            });
            li.appendChild(removeBtn);
            inventoryEl.appendChild(li);
        });

        // Make first seed bold
        if (inventoryEl.firstChild) {
            inventoryEl.firstChild.style.fontWeight = "bold";
        }
    }

    loadInventory();

    // Dynamically create garden 
    const gardenGrid = document.getElementById("gardenGrid");
    const rows = 8;
    const cols = 8;
    const growthStages = {
        Carrot: {
            stages: ["🌱", "🥕"],
            timePerStage: 3000
        },
        Tomato: {
            stages: ["🌱", "🌿", "🍅"],
            timePerStage: 5000
        },
        Sunflower: {
            stages: ["🌱", "🌿", "🌻"],
            timePerStage: 8000
        }
    };

    // Replaced alerts with a toast 
    function showToast(message, type = "success") {
        const notifications = document.getElementById("notifications");
        const toast = document.createElement("div");
        toast.className = `toast ${type}`;
        toast.textContent = message;

        notifications.appendChild(toast);

        setTimeout(() => {
            toast.remove();
        }, 3500);
    }

    // Garden plots
    const fragment = document.createDocumentFragment();
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            const cell = document.createElement("div");
            cell.classList.add("cell");
            fragment.appendChild(cell);

            // Plant seed when clicking cell
            cell.addEventListener('click', () => {
                // If user doesn't have seeds, they can't plant
                if (!inventory.length) {
                    showToast("You don't own any seeds! Buy some from the shop.", "error");
                    return;
                }
                // If user hasn't selected a seed to plant they won't be able to plant
                if (!selectedSeed) {
                    showToast("Please select a seed from your inventory first!", "error");
                    return;
                }
                // If plot already has a seed planted, user can't plant another seed in that plot
                if (cell.dataset.seed) {
                    showToast("This plot already has a plant!", "error");
                    return;
                }

                const plant = growthStages[selectedSeed];
                let stage = 0;

                cell.textContent = plant.stages[stage];
                cell.dataset.seed = selectedSeed;
                cell.dataset.stage = stage;

                // Growth 
                const grow = setInterval(() => {
                    stage++;
                    if (stage < plant.stages.length) {
                        cell.textContent = plant.stages[stage];
                        cell.dataset.stage = stage;
                    } else {
                        clearInterval(grow);
                        cell.classList.add("harvestRdy");
                    }
                }, plant.timePerStage)
            })
        }
        gardenGrid.appendChild(fragment);
    }

    // Show / Hide Shop Modal
    const shopBtn = document.getElementById("shopBtn");
    const shopModal = document.getElementById("shopModal");
    const closeShop = document.getElementById("closeShop");

    if (shopBtn && shopModal && closeShop) {
        shopBtn.style.cursor = "pointer";

        // Open
        shopBtn.addEventListener("click", () => {
            shopModal.classList.add("show");
        });

        // Close
        closeShop.addEventListener("click", () => {
            shopModal.classList.remove("show");
        });

        // Close when clicking outside shop
        window.addEventListener("click", (event) => {
            if (event.target.classList.contains("overlay")) {
                shopModal.classList.remove("show");
            }
        });
    }

    // Seed catalog
    const seedCatalog = [
        { seed: "Carrot", stages: ["🌱", "🥕"] },
        { seed: "Tomato", stages: ["🌱", "🌿", "🍅"] },
        { seed: "Sunflower", stages: ["🌱", "🌿", "🌻"] }
    ];

    // Dynamically create shop catalog as buttons
    const catalogEl = document.getElementById("catalog");
    if (catalogEl) {
        catalogEl.innerHTML = "";
        seedCatalog.forEach(seed => {
            const btn = document.createElement("button");
            btn.classList.add("shop-item");
            btn.dataset.seed = seed.seed;
            btn.textContent = `Buy ${seed.seed} ${seed.stages[0]}`;

            // Clicking on button to add seed to inventory
            btn.addEventListener("click", () => {
                let inventory = JSON.parse(localStorage.getItem("inventory")) || [];
                if (!inventory.includes(seed.seed)) {
                    inventory.push(seed.seed);
                    localStorage.setItem("inventory", JSON.stringify(inventory));
                    showToast(`${seed.seed} added to your inventory!`, "success");
                } else {
                    showToast(`You already own ${seed.seed}`, "error");
                }
                loadInventory();
            });

            catalogEl.appendChild(btn);
        });
    }
}