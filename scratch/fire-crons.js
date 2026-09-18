async function fire() {
  const endpoints = [
    'https://mivaj.com/api/cron/telegram-morning',
    'https://mivaj.com/api/cron/telegram-live-settle',
    'https://mivaj.com/api/cron/telegram-settle'
  ];

  for (const url of endpoints) {
    console.log(`Firing ${url}...`);
    try {
      const res = await fetch(url, {
        headers: { 'Authorization': 'Bearer mivaj_secure_cron_2026' },
      });
      console.log('Status:', res.status);
      const text = await res.text();
      console.log('Response:', text);
    } catch (e) {
      console.error('Error firing', url, e);
    }
    console.log('---------------------');
  }
}

fire();
