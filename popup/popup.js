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
      function getFlag(code, currencyName) {
        // Use currency code for all tables, including Table B (e.g., AFN, MGA, XPF, etc.)
        const currencyFlags = {
          AUD: '🇦🇺', // Australian Dollar
          BGN: '🇧🇬', // Bulgarian Lev
          BRL: '🇧🇷', // Brazilian Real
          CAD: '🇨🇦', // Canadian Dollar
          CHF: '🇨🇭', // Swiss Franc
          CLP: '🇨🇱', // Chilean Peso
          CNY: '🇨🇳', // Chinese Yuan
          CZK: '🇨🇿', // Czech Koruna
          DKK: '🇩🇰', // Danish Krone
          EUR: '🇪🇺', // Euro
          GBP: '🇬🇧', // British Pound
          HKD: '🇭🇰', // Hong Kong Dollar
          HUF: '🇭🇺', // Hungarian Forint
          IDR: '🇮🇩', // Indonesian Rupiah
          ILS: '🇮🇱', // Israeli New Shekel
          INR: '🇮🇳', // Indian Rupee
          ISK: '🇮🇸', // Icelandic Króna
          JPY: '🇯🇵', // Japanese Yen
          KRW: '🇰🇷', // South Korean Won
          MXN: '🇲🇽', // Mexican Peso
          MYR: '🇲🇾', // Malaysian Ringgit
          NOK: '🇳🇴', // Norwegian Krone
          NZD: '🇳🇿', // New Zealand Dollar
          PHP: '🇵🇭', // Philippine Peso
          PLN: '🇵🇱', // Polish Zloty
          RON: '🇷🇴', // Romanian Leu
          RUB: '🇷🇺', // Russian Ruble
          SEK: '🇸🇪', // Swedish Krona
          SGD: '🇸🇬', // Singapore Dollar
          THB: '🇹🇭', // Thai Baht
          TRY: '🇹🇷', // Turkish Lira
          UAH: '🇺🇦', // Ukrainian Hryvnia
          USD: '🇺🇸', // United States Dollar
          ZAR: '🇿🇦', // South African Rand
          AFN: '🇦🇫', // Afghan Afghani
          MGA: '🇲🇬', // Malagasy Ariary
          XPF: '🇵🇫', // CFP Franc
          ALL: '🇦🇱', // Albanian Lek
          DZD: '🇩🇿', // Algerian Dinar
          AOA: '🇦🇴', // Angolan Kwanza
          ARS: '🇦🇷', // Argentine Peso
          AMD: '🇦🇲', // Armenian Dram
          BGN: '🇧🇬', // Bulgarian Lev
          BOB: '🇧🇴', // Bolivian Boliviano
          BUK: '🇧🇬', // Bulgarian Lev
          BIF: '🇧🇮', // Burundian Franc
          KHR: '🇰🇭', // Cambodian Riel
          CVE: '🇨🇻', // Cape Verdean Escudo
          KYD: '🇰🇾', // Cayman Islands Dollar
          KZT: '🇰🇿', // Kazakhstani Tenge
          XAF: '🇨🇫', // Central African CFA Franc
          XCD: '🇪🇨', // East Caribbean Dollar
          XOF: '🇫🇷', // West African CFA Franc
          XUA: '🇦🇴', // African Currency Unit
          XDR: '🇦🇴', // Special Drawing Rights
          XAG: '🥈', // Silver Ounce
          XAU: '🥇', // Gold Ounce
          XPT: '🇦🇴', // Platinum Ounce
          XPD: '🇦🇴', // Palladium Ounce
          XTS: '🇦🇴', // Tether Gold
          XBB: '🇦🇴', // Baskets of Currencies
          XBC: '🇦🇴', // Bitcoin Cash
          XBD: '🇦🇴', // Bitcoin Gold
          XBA: '🇦🇴', // Bitcoin SV
          XSU: '🌐', // Sucre
          XFO: '🌐', // French Gold Franc
          XFU: '🌐', // French UIC Franc
          XRE: '🌐', // RINET Funds
          XTS: '🌐', // Tether Gold
          XBC: '🌐', // Bitcoin Cash
          XBD: '🌐', // Bitcoin Gold
          XAU: '🥇', // Gold Ounce
          XAG: '🥈', // Silver Ounce
          XPT: '🇵🇫', // Platinum Ounce
          PAB: '🇵🇦', // Panamanian Balboa
          GMD: '🇬🇲', // Gambian Dalasi
          MKD: '🇲🇰', // Macedonian Denar
          NIO: '🇳🇮', // Nicaraguan Córdoba
          XPD: '🇵🇫', // Palladium Ounce
          ETB: '🇪🇹', // Ethiopian Birr
          VES: '🇻🇪', // Venezuelan Bolívar
          CRC: '🇨🇷', // Costa Rica
          SVC: '🇸🇻', // El Salvador
          BHD: '🇧🇭', // Bahrain
          IQD: '🇮🇶', // Iraq
          JOD: '🇯🇴', // Jordan
          KWD: '🇰🇼', // Kuwait
          LYD: '🇱🇾', // Libya
          RSD: '🇷🇸', // Serbia
          TND: '🇹🇳', // Tunisia
          MAD: '🇲🇦', // Morocco
          AED: '🇦🇪', // United Arab Emirates
          STN: '🇸🇹', // São Tomé and Príncipe
          BSD: '🇧🇸', // Bahamas
          BBD: '🇧🇧', // Barbados
          BZD: '🇧🇿', // Belize
          BND: '🇧🇳', // Brunei
          FJD: '🇫🇯', // Fiji
          GYD: '🇬🇾', // Guyana
          JMD: '🇯🇲', // Jamaica
          LRD: '🇱🇷', // Liberia
          NAD: '🇳🇦', // Namibia
          SRD: '🇸🇷', // Suriname
          TTD: '🇹🇹', // Trinidad and Tobago
          SBD: '🇸🇧', // Solomon Islands
          VND: '🇻🇳', // Vietnam
          AWG: '🇦🇼', // Aruba
          DJF: '🇩🇯', // Djibouti
          GNF: '🇬🇳', // Guinea
          KMF: '🇰🇲', // Comoros
          CDF: '🇨🇩', // Democratic Republic of the Congo
          RWF: '🇷🇼', // Rwanda
          EGP: '🇪🇬', // Egypt
          GIP: '🇬🇮', // Gibraltar
          SSP: '🇸🇸', // South Sudan
          SDG: '🇸🇩', // Sudan
          SYP: '🇸🇾', // Syria
          GHS: '🇬🇭', // Ghana
          HTG: '🇭🇹', // Haiti
          PYG: '🇵🇾', // Paraguay
          XSG: '🇸🇬', // Singapore (XSG is not a standard code, fallback to Singapore)
          PGK: '🇵🇬', // Papua New Guinea
          LAK: '🇱🇦', // Laos
          MWK: '🇲🇼', // Malawi
          ZMW: '🇿🇲', // Zambia
          MMK: '🇲🇲', // Myanmar
          GEL: '🇬🇪', // Georgia
          MDL: '🇲🇩', // Moldova
          HNL: '🇭🇳', // Honduras
          SLE: '🇸🇱', // Sierra Leone
          SZL: '🇸🇿', // Eswatini
          LSL: '🇱🇸', // Lesotho
          AZN: '🇦🇿', // Azerbaijan
          MZN: '🇲🇿', // Mozambique
          NGN: '🇳🇬', // Nigeria
          ERN: '🇪🇷', // Eritrea
          TWD: '🇹🇼', // Taiwan
          XCG: '🌐', // No official flag, generic globe
          TMT: '🇹🇲', // Turkmenistan
          MRU: '🇲🇷', // Mauritania
          TOP: '🇹🇴', // Tonga
          MOP: '🇲🇴', // Macau
          DOP: '🇩🇴', // Dominican Republic
          COP: '🇨🇴', // Colombia
          CUP: '🇨🇺', // Cuba
          UYU: '🇺🇾', // Uruguay
          BWP: '🇧🇼', // Botswana
          GTQ: '🇬🇹', // Guatemala
          IRR: '🇮🇷', // Iran
          YEN: '🇯🇵', // Japan (YEN is not a standard code, fallback to Japan)
          QAR: '🇶🇦', // Qatar
          OMR: '🇴🇲', // Oman
          SAR: '🇸🇦', // Saudi Arabia
          BYN: '🇧🇾', // Belarus
          LKR: '🇱🇰', // Sri Lanka
          MUR: '🇲🇺', // Mauritius
          MVR: '🇲🇻', // Maldives
          NPR: '🇳🇵', // Nepal
          PKR: '🇵🇰', // Pakistan
          SCR: '🇸🇨', // Seychelles
          PEN: '🇵🇪', // Peru
          KGS: '🇰🇬', // Kyrgyzstan
          TJS: '🇹🇯', // Tajikistan
          UZS: '🇺🇿', // Uzbekistan
          KES: '🇰🇪', // Kenya
          SOS: '🇸🇴', // Somalia
          TZS: '🇹🇿', // Tanzania
          UGX: '🇺🇬', // Uganda
          BDT: '🇧🇩', // Bangladesh
          WST: '🇼🇸', // Samoa
          MNT: '🇲🇳', // Mongolia
          VUV: '🇻🇺', // Vanuatu
          BAM: '🇧🇦', // Bosnia and Herzegovina
          ZWG: '🇿🇼', // Zimbabwe (ZWG is not a standard code, fallback to Zimbabwe)
          LBP: '🇱🇧', // Lebanon
          YER: '🇾🇪', // Yemen
        };
        return currencyFlags[code] || currencyFlags[currencyName] || '';
      }
      if (rateType.value === 'single') {
        // Single currency rate
        if (data && data.rates && data.rates.length > 0) {
          html = `<div class='card'>
            <div class='card-body p-2'>
              <ul class='list-group list-group-flush'>
                <li class='list-group-item px-2 py-1'><span style='font-size:1.2em;'>${getFlag(data.code, data.currency)}</span> <strong>${data.currency}</strong> <span class='text-muted'>(${data.code})</span></li>
                <li class='list-group-item px-2 py-1'><strong>Date:</strong> ${data.rates[0].effectiveDate}</li>
                <li class='list-group-item px-2 py-1'><strong>Rate:</strong> <span class='text-primary'>${data.rates[0].mid}</span></li>
              </ul>
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
            html += `<tr><td>${getFlag(rate.code, rate.currency)}</td><td>${rate.currency}</td><td>${rate.code}</td><td>${rate.mid !== undefined ? rate.mid : (rate.bid !== undefined ? rate.bid : (rate.ask !== undefined ? rate.ask : ''))}</td></tr>`;
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
