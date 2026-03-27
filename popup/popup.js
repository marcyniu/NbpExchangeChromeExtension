// Dark mode logic
function setDarkMode(isDark) {
  if (isDark) {
    document.documentElement.classList.add('dark');
    document.getElementById('themeToggleLightIcon').classList.remove('hidden');
    document.getElementById('themeToggleDarkIcon').classList.add('hidden');
  } else {
    document.documentElement.classList.remove('dark');
    document.getElementById('themeToggleLightIcon').classList.add('hidden');
    document.getElementById('themeToggleDarkIcon').classList.remove('hidden');
  }
}

document.addEventListener('DOMContentLoaded', function() {
  const themeToggle = document.getElementById('themeToggle');

  // Load saved theme preference from chrome.storage or fallback to matchMedia
  if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.sync) {
    chrome.storage.sync.get(['darkMode'], function(result) {
      // Default to system preference if not set
      let isDark = result.darkMode;
      if (isDark === undefined) {
        isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      }
      setDarkMode(isDark);
    });
  } else {
    // Fallback for testing outside extension environment
    let isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setDarkMode(isDark);
  }

  themeToggle.addEventListener('click', () => {
    const isDark = document.documentElement.classList.contains('dark');
    const newMode = !isDark;
    setDarkMode(newMode);
    if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.sync) {
      chrome.storage.sync.set({ darkMode: newMode });
    }
  });

  const rateType = document.getElementById('rateType');
  const currencySelect = document.getElementById('currencySelect');
  const fetchBtn = document.getElementById('fetchBtn');
  const result = document.getElementById('result');
  const dateInput = document.getElementById('date');

  // Set date picker to current date
  const today = new Date();
  dateInput.value = today.toISOString().split('T')[0];

  rateType.addEventListener('change', function() {
    currencySelect.style.display = rateType.value === 'single' ? 'block' : 'none';
  });

  fetchBtn.addEventListener('click', async function() {
    result.innerHTML = '<div class="flex justify-center items-center w-full py-4"><div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 dark:border-blue-400"></div></div>';
    result.className = 'w-full';
    let url = '';
    const selectedDate = dateInput.value;
    let data = null;
    let html = '';
    if (rateType.value === 'single') {
      const currency = document.getElementById('currency').value;
      if (!currency) {
        result.textContent = 'Please select a currency code.';
        return;
      }
      url = `https://api.nbp.pl/api/exchangerates/rates/A/${currency}/${selectedDate}/?format=json`;
      let response = await fetch(url);
      if (!response.ok) {
        // fallback to last available date
        response = await fetch(`https://api.nbp.pl/api/exchangerates/rates/A/${currency}/last/1/?format=json`);
      }
      if (!response.ok) throw new Error('API error');
      data = await response.json();
    } else {
      url = `https://api.nbp.pl/api/exchangerates/tables/${rateType.value}/${selectedDate}/?format=json`;
      let response = await fetch(url);
      if (!response.ok) {
        // fallback to last available date
        response = await fetch(`https://api.nbp.pl/api/exchangerates/tables/${rateType.value}/last/1/?format=json`);
      }
      if (!response.ok) throw new Error('API error');
      data = await response.json();
    }
    try {
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
          html = `<div class='bg-white dark:bg-slate-800 shadow rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700 max-w-md mx-auto w-full'>
            <div class='px-4 py-5 sm:p-6'>
              <div class='flex items-center space-x-3 mb-4'>
                <span class='text-3xl' role='img' aria-label='Flag'>${getFlag(data.code, data.currency)}</span>
                <div>
                  <h3 class='text-lg leading-6 font-medium text-slate-900 dark:text-slate-100'>${data.currency}</h3>
                  <p class='text-sm text-slate-500 dark:text-slate-400'>${data.code}</p>
                </div>
              </div>
              <div class='border-t border-slate-200 dark:border-slate-700 pt-4'>
                <dl class='grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-2'>
                  <div class='sm:col-span-1'>
                    <dt class='text-sm font-medium text-slate-500 dark:text-slate-400'>Date</dt>
                    <dd class='mt-1 text-sm text-slate-900 dark:text-slate-100'>${data.rates[0].effectiveDate}</dd>
                  </div>
                  <div class='sm:col-span-1'>
                    <dt class='text-sm font-medium text-slate-500 dark:text-slate-400'>Rate</dt>
                    <dd class='mt-1 text-2xl font-semibold text-blue-600 dark:text-blue-400'>${data.rates[0].mid}</dd>
                  </div>
                </dl>
              </div>
            </div>
          </div>`;
        } else {
          html = '<div class="text-red-600 dark:text-red-400 p-4 bg-red-50 dark:bg-red-900/20 rounded-md border border-red-200 dark:border-red-800 text-center">No data found for this currency.</div>';
        }
      } else {
        // Table of rates
        if (Array.isArray(data) && data.length > 0 && data[0].rates) {
          html = `<div class='bg-white dark:bg-slate-800 shadow rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700 w-full'>
            <div class='px-4 py-5 sm:px-6 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center'>
              <h3 class='text-lg leading-6 font-medium text-slate-900 dark:text-slate-100'>Table ${data[0].table}</h3>
              <span class='text-sm text-slate-500 dark:text-slate-400'>${data[0].effectiveDate}</span>
            </div>
            <div class='overflow-x-auto'>
              <table class='min-w-full divide-y divide-slate-200 dark:divide-slate-700'>
                <thead class='bg-slate-50 dark:bg-slate-800/50'>
                  <tr>
                    <th scope='col' class='px-3 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider w-16'>Flag</th>
                    <th scope='col' class='px-3 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider'>Currency</th>
                    <th scope='col' class='px-3 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider w-24'>Code</th>
                    <th scope='col' class='px-3 py-3 text-right text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider w-32'>Rate</th>
                  </tr>
                </thead>
                <tbody class='bg-white dark:bg-slate-800 divide-y divide-slate-200 dark:divide-slate-700'>`;
          data[0].rates.forEach(rate => {
            const val = rate.mid !== undefined ? rate.mid : (rate.bid !== undefined ? `${rate.bid} / ${rate.ask}` : '');
            html += `<tr class='hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors'>
              <td class='px-3 py-4 whitespace-nowrap text-xl text-center'>${getFlag(rate.code, rate.currency)}</td>
              <td class='px-3 py-4 whitespace-nowrap text-sm text-slate-900 dark:text-slate-100'>${rate.currency}</td>
              <td class='px-3 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400 font-mono'>${rate.code}</td>
              <td class='px-3 py-4 whitespace-nowrap text-sm font-medium text-blue-600 dark:text-blue-400 text-right'>${val}</td>
            </tr>`;
          });
          html += '</tbody></table></div></div>';
        } else {
          html = '<div class="text-red-600 dark:text-red-400 p-4 bg-red-50 dark:bg-red-900/20 rounded-md border border-red-200 dark:border-red-800 text-center">No table data found.</div>';
        }
      }
      result.innerHTML = html;
    } catch (e) {
      result.innerHTML = '<div class="text-red-600 dark:text-red-400 p-4 bg-red-50 dark:bg-red-900/20 rounded-md border border-red-200 dark:border-red-800 text-center">Error fetching data. Check your connection or API availability.</div>';
    }
  });
});
