// Simple, client-side carbon footprint estimates.
// Factors (approximate, in kg CO2):
const FACTORS = {
  car_per_km: 0.192,        // kg CO2 per km (average petrol car)
  electricity_per_kwh: 0.475, // kg CO2 per kWh (grid average - varies by region)
  flight_per_roundtrip: 250, // kg CO2 per short/medium-haul round trip (estimate)
  meat_meal: 2.5,           // kg CO2 per meat-heavy meal (average)
  heating_per_kwh: 0.185,   // kg CO2 per kWh for typical gas heating (approx)
  transit_per_km: 0.06      // kg CO2 per passenger-km for public transit (avg)
};

const CATEGORY_UI = {
  car: {
    label: 'Car',
    icon: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M5 13h14l1.5 4H3.5L5 13zm0-1.5L4 8h16l-1 3.5H5zM7 18.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zm10 0a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z"/></svg>',
    class: 'row-car'
  },
  electricity: {
    label: 'Electricity',
    icon: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M13 2L3 14h6v8l10-12h-6z"/></svg>',
    class: 'row-electricity'
  },
  flights: {
    label: 'Flights',
    icon: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M2 12l19-7-7 7 7 7-19-7z"/></svg>',
    class: 'row-flights'
  },
  food: {
    label: 'Food (meat)',
    icon: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M4 6c0-1.1.9-2 2-2h12c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H6c-1.1 0-2-.9-2-2V6zm4 1.5c0 .83.67 1.5 1.5 1.5S11 8.33 11 7.5 10.33 6 9.5 6 8 6.67 8 7.5zm5 8.5c1.38 0 2.5-1.12 2.5-2.5S14.88 11 13.5 11 11 12.12 11 13.5 12.12 16 13.5 16z"/></svg>',
    class: 'row-food'
  },
  heating: {
    label: 'Heating',
    icon: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2C8 7 9 10 9 12a3 3 0 1 0 6 0c0-2-1-5-3-10z"/></svg>',
    class: 'row-heating'
  },
  transit: {
    label: 'Transit',
    icon: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M4 6h16a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2h-8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2zm2 3h4v3H6V9zm8 0h4v3h-4V9zM7.5 17a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zm9 0a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z"/></svg>',
    class: 'row-transit'
  }
};

function formatKgToTonnes(kg){
  const t = kg/1000;
  return `${t.toFixed(2)} t CO₂ / year`;
}

function calculate(){
  const carKmWeek = Number(document.getElementById('carKmWeek')?.value) || 0;
  const elecKwhMonth = Number(document.getElementById('elecKwhMonth')?.value) || 0;
  const flightsPerYear = Number(document.getElementById('flightsPerYear')?.value) || 0;
  const meatMealsWeek = Number(document.getElementById('meatMealsWeek')?.value) || 0;

  // Annualize inputs
  const carKmYear = carKmWeek * 52;
  const elecKwhYear = elecKwhMonth * 12;
  const meatMealsYear = meatMealsWeek * 52;

  // Compute emissions (kg CO2 per year)
  const carKg = carKmYear * FACTORS.car_per_km;
  const elecKg = elecKwhYear * FACTORS.electricity_per_kwh;
  const flightsKg = flightsPerYear * FACTORS.flight_per_roundtrip;
  const foodKg = meatMealsYear * FACTORS.meat_meal;
  const heatingKg = elecKwhYear /* placeholder */;
  // heating input is monthly kWh (separate field)
  const heatingKwhMonth = Number(document.getElementById('heatingKwhMonth')?.value) || 0;
  const heatingKwhYear = heatingKwhMonth * 12;
  const heatingKgComputed = heatingKwhYear * FACTORS.heating_per_kwh;
  const transitKmWeek = Number(document.getElementById('transitKmWeek')?.value) || 0;
  const transitKmYear = transitKmWeek * 52;
  const transitKg = transitKmYear * FACTORS.transit_per_km;

  // household size for per-person estimate
  const householdSize = Math.max(1, Number(document.getElementById('householdSize')?.value) || 1);

  const totalKg = carKg + elecKg + flightsKg + foodKg + heatingKgComputed + transitKg;

  const resultsDiv = document.getElementById('results');
  const perPersonKg = totalKg / householdSize;
  const resultRows = [
    {key: 'car', amount: carKg, detail: `${carKmYear.toLocaleString()} km/year`},
    {key: 'electricity', amount: elecKg, detail: `${elecKwhYear.toLocaleString()} kWh/year`},
    {key: 'heating', amount: heatingKgComputed, detail: `${heatingKwhYear.toLocaleString()} kWh/year`},
    {key: 'transit', amount: transitKg, detail: `${transitKmYear.toLocaleString()} km/year`},
    {key: 'flights', amount: flightsKg, detail: `${flightsPerYear} round trips/year`},
    {key: 'food', amount: foodKg, detail: `${meatMealsYear} meat meals/year`}
  ];

  const resultItems = resultRows.map(row => {
    const meta = CATEGORY_UI[row.key];
    return `
      <li class="result-item ${meta.class}">
        <span class="result-icon">${meta.icon}</span>
        <span class="result-text">
          <span class="result-label">${meta.label}</span>
          <span class="result-value">${formatKgToTonnes(row.amount)} <span class="result-detail">(${row.detail})</span></span>
        </span>
      </li>`;
  }).join('');

  if (resultsDiv) {
    resultsDiv.innerHTML = `
      <div class="summary"><strong>Total estimate:</strong> ${formatKgToTonnes(totalKg)} — <small>~${formatKgToTonnes(perPersonKg)} per person</small></div>
      <ul class="result-list">
        ${resultItems}
      </ul>
    `;

    // Guidance message and badge
    const tonnes = totalKg/1000;
    let guidance = '';
    let colorClass = '';
    if (tonnes < 2) { guidance = 'Low — keep it up!'; colorClass = 'low'; }
    else if (tonnes < 8) { guidance = 'Moderate — good opportunities to reduce.'; colorClass = 'moderate'; }
    else { guidance = 'High — consider changes to travel, diet, and energy.'; colorClass = 'high'; }
    resultsDiv.classList.remove('low','moderate','high');
    resultsDiv.classList.add(colorClass);
    resultsDiv.innerHTML += `<p class="guidance ${colorClass}"><em>${guidance}</em></p>`;
  }

  // Update gauge: show percentage of a 10 t (10000 kg) baseline
  const gaugeFill = document.querySelector('.gauge-fill');
  const percent = Math.min(100, Math.round((perPersonKg / 10000) * 100));
  if (gaugeFill) gaugeFill.style.width = percent + '%';
}

function resetForm(){
  const car = document.getElementById('carKmWeek');
  if (car) car.value = 150;
  const elec = document.getElementById('elecKwhMonth');
  if (elec) elec.value = 300;
  const flights = document.getElementById('flightsPerYear');
  if (flights) flights.value = 1;
  const meat = document.getElementById('meatMealsWeek');
  if (meat) meat.value = 8;
  const heating = document.getElementById('heatingKwhMonth');
  if (heating) heating.value = 220;
  const transit = document.getElementById('transitKmWeek');
  if (transit) transit.value = 40;
  const household = document.getElementById('householdSize');
  if (household) household.value = 2;
  const results = document.getElementById('results');
  if (results) results.innerHTML = '';
}


function init() {
  const calcBtn = document.getElementById('calcBtn');
  if (calcBtn) calcBtn.addEventListener('click', calculate);
  
  const resetBtn = document.getElementById('resetBtn');
  if (resetBtn) resetBtn.addEventListener('click', resetForm);

  calculate();

  const y = new Date().getFullYear();
  const el = document.getElementById('year');
  if (el) el.textContent = y;
}

if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    FACTORS,
    CATEGORY_UI,
    formatKgToTonnes,
    calculate,
    resetForm,
    init
  };
}

