const countryList = document.getElementById("countryList");
const searchInput = document.getElementById("searchInput");
const regionFilter = document.getElementById("regionFilter");
const loadingText = document.getElementById("loading");
const errorText = document.getElementById("error");


const favoritesModal = document.getElementById("favoritesModal");
const favoritesContent = document.getElementById("favoritesContent");
const showFavorites = document.getElementById("showFavorites");
const closeFavorites = document.getElementById("closeFavorites");


let allCountries = [];
// Fetch countries
async function fetchCountries() {
  loadingText.classList.remove("hidden");
  try {
    const res = await fetch("https://restcountries.com/v3.1/all?fields=name,flags,population,region,capital,languages,currencies,timezones,maps");
    const data = await res.json();
    allCountries = data;
    displayCountries(allCountries);
  } catch (error) {
    console.error("Error fetching countries:", error);
    errorText.classList.remove("hidden");
  } finally {
    loadingText.classList.add("hidden");
  }
}

// Display countries
function displayCountries(countries) {
  countryList.innerHTML = "";
  if (!countries.length) {
    errorText.classList.remove("hidden");
    return;
  }
  errorText.classList.add("hidden");

  countries.forEach(country => {
    const card = document.createElement("div");
    card.className = "bg-white dark:bg-gray-700 rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition cursor-pointer";

    card.innerHTML = `
      <img src="${country.flags.svg}" alt="Flag of ${country.name.common}" class="w-full h-40 object-cover">
      <div class="p-4">
        <h2 class="font-bold text-lg mb-2">${country.name.common}</h2>
        <p><strong>Region:</strong> ${country.region}</p>
        <p><strong>Population:</strong> ${country.population.toLocaleString()}</p>
        <p><strong>Capital:</strong> ${country.capital ? country.capital[0] : "N/A"}</p>
      </div>
    `;

    // Open modal on click
    card.addEventListener("click", () => showCountryDetails(country));
    countryList.appendChild(card);
  });
}

// Show detailed info in modal
function showCountryDetails(country) {
  modalContent.innerHTML = `
    <h2 class="text-2xl font-bold mb-4">${country.name.common}</h2>
    <img src="${country.flags.svg}" alt="Flag" class="w-32 h-20 mb-4">
    <p><strong>Capital:</strong> ${country.capital ? country.capital[0] : "N/A"}</p>
    <p><strong>Region:</strong> ${country.region}</p>
    <p><strong>Population:</strong> ${country.population.toLocaleString()}</p>
    <p><strong>Languages:</strong> ${country.languages ? Object.values(country.languages).join(", ") : "N/A"}</p>
    <p><strong>Currencies:</strong> ${country.currencies ? Object.values(country.currencies).map(c => c.name).join(", ") : "N/A"}</p>
    <p><strong>Timezones:</strong> ${country.timezones.join(", ")}</p>
    <a href="${country.maps.googleMaps}" target="_blank" class="text-blue-500 underline">🌍 View on Google Maps</a>
    <br><br>
    <button class="mt-3 px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition"
      onclick="addToFavorites('${country.name.common}')">
      ⭐ Add to Favorites
    </button>
  `;
  modal.classList.remove("hidden");
}

// Close country modal
closeModal.addEventListener("click", () => modal.classList.add("hidden"));
window.addEventListener("click", (e) => {
  if (e.target === modal) modal.classList.add("hidden");
});

// // Add to favorites
// function addToFavorites(countryName) {
//   if (!favorites.includes(countryName)) {
//     favorites.push(countryName);
//     localStorage.setItem("favorites", JSON.stringify(favorites));
//     alert(`${countryName} added to favorites!`);
//   } else {
//     alert(`${countryName} is already in favorites!`);
//   }
// }


let favorites = JSON.parse(localStorage.getItem("favorites")) || [];

// ✅ Add to favorites
function addToFavorites(countryName) {
  if (!favorites.includes(countryName)) {
    favorites.push(countryName);
    localStorage.setItem("favorites", JSON.stringify(favorites));
    alert(`${countryName} added to favorites!`);
  } else {
    alert(`${countryName} is already in favorites!`);
  }
}

// ✅ Show favorites modal
showFavorites.addEventListener("click", () => {
  favoritesContent.innerHTML = "";

  if (!favorites.length) {
    favoritesContent.innerHTML = `<p class="text-gray-500">No favorites yet.</p>`;
  } else {
    const ul = document.createElement("ul");
    ul.className = "list-disc pl-5 space-y-2";

    favorites.forEach(fav => {
      const li = document.createElement("li");
      li.textContent = fav;
      ul.appendChild(li);
    });

    favoritesContent.appendChild(ul);
  }

  favoritesModal.classList.remove("hidden");
});

// ✅ Close favorites modal
closeFavorites.addEventListener("click", () => favoritesModal.classList.add("hidden"));
window.addEventListener("click", (e) => {
  if (e.target === favoritesModal) favoritesModal.classList.add("hidden");
});



// Dark mode toggle
toggleDarkMode.addEventListener("click", () => {
  document.documentElement.classList.toggle("dark");
  if (document.documentElement.classList.contains("dark")) {
    toggleDarkMode.textContent = "☀️ Light Mode";
  } else {
    toggleDarkMode.textContent = "🌙 Dark Mode";
  }
});

// Search by name
searchInput.addEventListener("input", e => {
  const value = e.target.value.toLowerCase().trim();
  const filtered = allCountries.filter(c =>
    c.name.common.toLowerCase().includes(value)
  );
  displayCountries(filtered);
});

// Filter by region
regionFilter.addEventListener("change", e => {
  const region = e.target.value;
  const filtered = region
    ? allCountries.filter(c => c.region === region)
    : allCountries;
  displayCountries(filtered);
});

// Sort by population
sortSelect.addEventListener("change", e => {
  const sort = e.target.value;
  let sorted = [...allCountries];
  if (sort === "asc") sorted.sort((a, b) => a.population - b.population);
  if (sort === "desc") sorted.sort((a, b) => b.population - a.population);
  displayCountries(sorted);
});

// Initialize
fetchCountries();