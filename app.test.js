const fs = require('fs');
const path = require('path');

// Load HTML content for DOM testing
const html = fs.readFileSync(path.resolve(__dirname, './index.html'), 'utf8');

describe('Carbon Footprint Awareness App', () => {
  let app;

  beforeEach(() => {
    // Set up our document body
    document.body.innerHTML = html;
    
    // Clear node cache for app.js so it runs clean each time
    jest.resetModules();
    
    // Load app.js
    app = require('./app.js');
  });

  test('constants FACTORS are defined with correct values', () => {
    expect(app.FACTORS).toBeDefined();
    expect(app.FACTORS.car_per_km).toBe(0.192);
    expect(app.FACTORS.electricity_per_kwh).toBe(0.475);
    expect(app.FACTORS.flight_per_roundtrip).toBe(250);
    expect(app.FACTORS.meat_meal).toBe(2.5);
    expect(app.FACTORS.heating_per_kwh).toBe(0.185);
    expect(app.FACTORS.transit_per_km).toBe(0.06);
  });

  test('formatKgToTonnes formats kg values properly', () => {
    expect(app.formatKgToTonnes(1000)).toBe('1.00 t CO₂ / year');
    expect(app.formatKgToTonnes(2500)).toBe('2.50 t CO₂ / year');
    expect(app.formatKgToTonnes(0)).toBe('0.00 t CO₂ / year');
    expect(app.formatKgToTonnes(9990)).toBe('9.99 t CO₂ / year');
  });

  test('initial calculation runs on load with default HTML values', () => {
    // HTML Defaults:
    // carKmWeek: 150
    // elecKwhMonth: 300
    // flightsPerYear: 1
    // meatMealsWeek: 8
    // heatingKwhMonth: 220
    // transitKmWeek: 40
    // householdSize: 2
    
    // Verification:
    // carKg = 150 * 52 * 0.192 = 1497.6
    // elecKg = 300 * 12 * 0.475 = 1710
    // flightsKg = 1 * 250 = 250
    // foodKg = 8 * 52 * 2.5 = 1040
    // heatingKgComputed = 220 * 12 * 0.185 = 488.4
    // transitKg = 40 * 52 * 0.06 = 124.8
    // Total = 1497.6 + 1710 + 250 + 1040 + 488.4 + 124.8 = 5110.8 kg
    // Per person = 5110.8 / 2 = 2555.4 kg = 2.56 tonnes
    
    const results = document.getElementById('results');
    expect(results).toBeDefined();
    expect(results.innerHTML).toContain('Total estimate:');
    expect(results.innerHTML).toContain('5.11 t CO₂ / year'); // 5110.8 kg / 1000 = 5.11 t
    expect(results.innerHTML).toContain('~2.56 t CO₂ / year per person'); // 2555.4 kg / 1000 = 2.56 t
    
    // Check dynamic year is set in the footer
    const yearEl = document.getElementById('year');
    expect(yearEl.textContent).toBe(new Date().getFullYear().toString());
  });

  test('re-calculates footprint when inputs are changed and button is clicked', () => {
    // Modify input values to very low emissions
    document.getElementById('carKmWeek').value = '20'; // <30 km/week option
    document.getElementById('elecKwhMonth').value = '80'; // <100 kWh/month option
    document.getElementById('flightsPerYear').value = '0'; // None
    document.getElementById('meatMealsWeek').value = '0'; // None
    document.getElementById('heatingKwhMonth').value = '0'; // None
    document.getElementById('transitKmWeek').value = '0'; // None
    document.getElementById('householdSize').value = '1'; // Single household
    
    // Trigger recalculation
    document.getElementById('calcBtn').click();
    
    // Verification:
    // carKg = 20 * 52 * 0.192 = 199.68
    // elecKg = 80 * 12 * 0.475 = 456
    // Total = 199.68 + 456 = 655.68 kg
    // Per person = 655.68 / 1 = 655.68 kg = 0.66 tonnes
    
    const results = document.getElementById('results');
    expect(results.innerHTML).toContain('0.66 t CO₂ / year');
    expect(results.classList.contains('low')).toBe(true);
    
    // Gauge: perPersonKg (655.68) / 10000 * 100 = 6.55% -> rounded to 7%
    const gaugeFill = document.querySelector('.gauge-fill');
    expect(gaugeFill.style.width).toBe('7%');
  });

  test('resetForm resets inputs to their default state', () => {
    // Modify input values to something different
    document.getElementById('carKmWeek').value = '500';
    document.getElementById('elecKwhMonth').value = '1000';
    document.getElementById('flightsPerYear').value = '8';
    document.getElementById('meatMealsWeek').value = '8';
    document.getElementById('heatingKwhMonth').value = '800';
    document.getElementById('transitKmWeek').value = '250';
    document.getElementById('householdSize').value = '4';
    
    // Trigger reset
    document.getElementById('resetBtn').click();
    
    // resetForm resets these specific fields to predefined valid values:
    expect(document.getElementById('carKmWeek').value).toBe('150');
    expect(document.getElementById('elecKwhMonth').value).toBe('300');
    expect(document.getElementById('flightsPerYear').value).toBe('1');
    expect(document.getElementById('meatMealsWeek').value).toBe('8');
    expect(document.getElementById('heatingKwhMonth').value).toBe('220');
    expect(document.getElementById('transitKmWeek').value).toBe('40');
    expect(document.getElementById('householdSize').value).toBe('2');
    expect(document.getElementById('results').innerHTML).toBe('');
  });

  test('categorizes high footprint correctly', () => {
    // Modify input values to very high emissions
    document.getElementById('carKmWeek').value = '500'; // High km/week
    document.getElementById('elecKwhMonth').value = '1000'; // High kWh/month
    document.getElementById('flightsPerYear').value = '8'; // High flights
    document.getElementById('meatMealsWeek').value = '8'; // High meat
    document.getElementById('heatingKwhMonth').value = '800'; // High heating
    document.getElementById('transitKmWeek').value = '250'; // High transit
    document.getElementById('householdSize').value = '1'; // Single household
    
    // Trigger recalculation
    document.getElementById('calcBtn').click();
    
    const results = document.getElementById('results');
    expect(results.classList.contains('high')).toBe(true);
    expect(results.innerHTML).toContain('High — consider changes');
  });

  test('attaches init to DOMContentLoaded when document is loading', () => {
    // Mock document.readyState
    Object.defineProperty(document, 'readyState', {
      value: 'loading',
      configurable: true
    });
    
    // Clear cache and reload app.js
    jest.resetModules();
    
    // We clear yearEl before loading the script
    const yearEl = document.getElementById('year');
    yearEl.textContent = '';
    
    // Load app.js while document is loading
    require('./app.js');
    
    // The init function shouldn't have run yet
    expect(yearEl.textContent).toBe('');
    
    // Now fire DOMContentLoaded
    document.dispatchEvent(new Event('DOMContentLoaded'));
    
    // Now it should be set
    expect(yearEl.textContent).toBe(new Date().getFullYear().toString());
  });
});
