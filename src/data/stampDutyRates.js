// Approximate, commonly-cited stamp duty + registration rates by state (male buyer, urban
// property, standard sale deed) — these vary by gender, rural/urban location, property
// type, and change periodically by state notification. Reference starting point only —
// always confirm the current rate with your state's sub-registrar office before a
// transaction, as used by StampDutyCalculatorPage.jsx.
const stampDutyRates = [
  { state: 'Maharashtra', stampDuty: 6, registration: 1 },
  { state: 'Delhi', stampDuty: 6, registration: 1 },
  { state: 'Karnataka', stampDuty: 5, registration: 1 },
  { state: 'Tamil Nadu', stampDuty: 7, registration: 4 },
  { state: 'Telangana', stampDuty: 5.5, registration: 0.5 },
  { state: 'Andhra Pradesh', stampDuty: 5, registration: 1 },
  { state: 'Gujarat', stampDuty: 4.9, registration: 1 },
  { state: 'Rajasthan', stampDuty: 6, registration: 1 },
  { state: 'Uttar Pradesh', stampDuty: 7, registration: 1 },
  { state: 'West Bengal', stampDuty: 6, registration: 1 },
  { state: 'Madhya Pradesh', stampDuty: 7.5, registration: 3 },
  { state: 'Kerala', stampDuty: 8, registration: 2 },
  { state: 'Punjab', stampDuty: 7, registration: 1 },
  { state: 'Haryana', stampDuty: 7, registration: 0.5 },
  { state: 'Bihar', stampDuty: 5.7, registration: 1.9 },
  { state: 'Odisha', stampDuty: 5, registration: 2 },
]

export default stampDutyRates
