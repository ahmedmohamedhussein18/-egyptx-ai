
async function run() {
  const res = await fetch('http://localhost:3000/api/generate-itinerary', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      country: 'US',
      duration: 3,
      budget: 1000,
      interests: ['ancient'],
      travelStyle: 'solo',
      arrivalDate: '2026-10-01',
      travelers: 1,
      pace: 'balanced'
    })
  });
  console.log('STATUS:', res.status);
  const text = await res.text();
  console.log('RESPONSE:', text);
}
run();
