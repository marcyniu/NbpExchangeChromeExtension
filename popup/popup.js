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
      const currency = document.getElementById('currency').value;
      if (!currency) {
        result.textContent = 'Please select a currency code.';
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
      let html = '';
      // Helper: get flag emoji by currency code
      function getFlag(code) {
        const flags = {
          AUD: '🇦🇺', BGN: '🇧🇬', BRL: '🇧🇷', CAD: '🇨🇦', CHF: '🇨🇭', CLP: '🇨🇱', CNY: '🇨🇳', CZK: '🇨🇿', DKK: '🇩🇰', EUR: '🇪🇺', GBP: '🇬🇧', HKD: '🇭🇰', HUF: '🇭🇺', IDR: '🇮🇩', ILS: '🇮🇱', INR: '🇮🇳', ISK: '🇮🇸', JPY: '🇯🇵', KRW: '🇰🇷', MXN: '🇲🇽', MYR: '🇲🇾', NOK: '🇳🇴', NZD: '🇳🇿', PHP: '🇵🇭', PLN: '🇵🇱', RON: '🇷🇴', RUB: '🇷🇺', SEK: '🇸🇪', SGD: '🇸🇬', THB: '🇹🇭', TRY: '🇹🇷', UAH: '🇺🇦', USD: '🇺🇸', ZAR: '🇿🇦'
        };
        return flags[code] || '';
      }
      if (rateType.value === 'single') {
        // Single currency rate
        if (data && data.rates && data.rates.length > 0) {
          html = `<div class='card'>
            <div class='card-body'>
              <h5 class='card-title'>${getFlag(data.code)} ${data.currency} (${data.code})</h5>
              <p class='card-text mb-1'>
                <strong>Date:</strong> ${data.rates[0].effectiveDate}<br>
                <strong>Rate:</strong> ${data.rates[0].mid}
              </p>
            </div>
          </div>`;
        } else {
          html = '<div class="text-danger">No data found for this currency.</div>';
        }
      } else {
        // Table of rates
        if (Array.isArray(data) && data.length > 0 && data[0].rates) {
          html = `<div class='card'>
            <div class='card-body'>
              <h5 class='card-title'>Table ${data[0].table} (${data[0].effectiveDate})</h5>
              <div class='table-responsive'><table class='table table-sm table-bordered'>
                <thead><tr><th>Flag</th><th>Currency</th><th>Code</th><th>Rate</th></tr></thead>
                <tbody>`;
          data[0].rates.forEach(rate => {
            html += `<tr><td>${getFlag(rate.code)}</td><td>${rate.currency}</td><td>${rate.code}</td><td>${rate.mid || rate.bid || rate.ask}</td></tr>`;
          });
          html += '</tbody></table></div></div></div>';
        } else {
          html = '<div class="text-danger">No table data found.</div>';
        }
      }
      result.innerHTML = html;
    } catch (e) {
      result.innerHTML = '<div class="text-danger">Error fetching data.</div>';
    }
  });
});
