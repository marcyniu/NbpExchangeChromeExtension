document.addEventListener('DOMContentLoaded', function() {
  const rateType = document.getElementById('rateType');
  const currencySelect = document.getElementById('currencySelect');
  const fetchBtn = document.getElementById('fetchBtn');
  const result = document.getElementById('result');

  rateType.addEventListener('change', function() {
    currencySelect.style.display = rateType.value === 'single' ? 'block' : 'none';
  });

  fetchBtn.addEventListener('click', async function() {
    result.textContent = 'Loading...';
    let url = '';
    if (rateType.value === 'single') {
      const currency = document.getElementById('currency').value.trim().toUpperCase();
      if (!currency) {
        result.textContent = 'Please enter a currency code.';
        return;
      }
      url = `https://api.nbp.pl/api/exchangerates/rates/A/${currency}/?format=json`;
    } else {
      url = `https://api.nbp.pl/api/exchangerates/tables/${rateType.value}/?format=json`;
    }
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error('API error');
      const data = await response.json();
      result.textContent = JSON.stringify(data, null, 2);
    } catch (e) {
      result.textContent = 'Error fetching data.';
    }
  });
});
