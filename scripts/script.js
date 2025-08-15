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
}

