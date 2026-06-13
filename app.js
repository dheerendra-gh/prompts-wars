// Simple, client-side carbon footprint estimates.
// Factors (approximate, in kg CO2):
const FACTORS = {
  car_per_km: 0.192,        // kg CO2 per km (average petrol car)
  electricity_per_kwh: 0.475, // kg CO2 per kWh (grid average - varies by region)
  flight_per_roundtrip: 250, // kg CO2 per short/medium-haul round trip (estimate)
  meat_meal: 2.5,           // kg CO2 per meat-heavy meal (average)
};

function formatKgToTonnes(kg){
  const t = kg/1000;
  return `${t.toFixed(2)} t CO₂ / year`;
}

function calculate(){
  const carKmWeek = Number(document.getElementById('carKmWeek').value) || 0;
  const elecKwhMonth = Number(document.getElementById('elecKwhMonth').value) || 0;
  const flightsPerYear = Number(document.getElementById('flightsPerYear').value) || 0;
  const meatMealsWeek = Number(document.getElementById('meatMealsWeek').value) || 0;

  // Annualize inputs
  const carKmYear = carKmWeek * 52;
  const elecKwhYear = elecKwhMonth * 12;
  const meatMealsYear = meatMealsWeek * 52;

  // Compute emissions (kg CO2 per year)
  const carKg = carKmYear * FACTORS.car_per_km;
  const elecKg = elecKwhYear * FACTORS.electricity_per_kwh;
  const flightsKg = flightsPerYear * FACTORS.flight_per_roundtrip;
  const foodKg = meatMealsYear * FACTORS.meat_meal;

  const totalKg = carKg + elecKg + flightsKg + foodKg;

  const resultsDiv = document.getElementById('results');
  resultsDiv.innerHTML = `\n+    <strong>Total estimate:</strong> ${formatKgToTonnes(totalKg)}\n+    <ul>\n+      <li>Car: ${formatKgToTonnes(carKg)} (${carKmYear.toLocaleString()} km/year)</li>\n+      <li>Electricity: ${formatKgToTonnes(elecKg)} (${elecKwhYear.toLocaleString()} kWh/year)</li>\n+      <li>Flights: ${formatKgToTonnes(flightsKg)} (${flightsPerYear} round trips/year)</li>\n+      <li>Food (meat): ${formatKgToTonnes(foodKg)} (${meatMealsYear} meat meals/year)</li>\n+    </ul>\n+  `;

  // Simple guidance message
  const tonnes = totalKg/1000;
  const guidance = tonnes < 2 ? 'Low — keep it up!' : tonnes < 8 ? 'Moderate — good opportunities to reduce.' : 'High — consider changes to travel, diet, and energy.';
  resultsDiv.innerHTML += `<p><em>${guidance}</em></p>`;
}

function resetForm(){
  document.getElementById('carKmWeek').value = 150;
  document.getElementById('elecKwhMonth').value = 250;
  document.getElementById('flightsPerYear').value = 1;
  document.getElementById('meatMealsWeek').value = 7;
  document.getElementById('results').innerHTML = '';
}

document.getElementById('calcBtn').addEventListener('click', calculate);
document.getElementById('resetBtn').addEventListener('click', resetForm);

// Run initial calculation to show defaults
calculate();
