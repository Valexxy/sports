const https = require('https');

const PROJECT_REF = 'wpspjtsrvvmlceizdzci';
const ACCESS_TOKEN = process.argv[2] || process.env.SUPABASE_ACCESS_TOKEN || '';

const sqlScript = `
-- GRANT SCHEMA & TABLE PERMISSIONS TO POSTGRES, ANON, AUTHENTICATED, AND SERVICE_ROLE
GRANT USAGE ON SCHEMA public TO postgres, anon, authenticated, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA public TO postgres, anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO postgres, anon, authenticated, service_role;
GRANT ALL ON ALL ROUTINES IN SCHEMA public TO postgres, anon, authenticated, service_role;

ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO postgres, anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO postgres, anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON ROUTINES TO postgres, anon, authenticated, service_role;
`;

async function runGrantQuery() {
  console.log(`Granting permissions in Supabase for project: ${PROJECT_REF}...`);

  const payload = JSON.stringify({ query: sqlScript });

  const options = {
    hostname: 'api.supabase.com',
    port: 443,
    path: `/v1/projects/${PROJECT_REF}/database/query`,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${ACCESS_TOKEN}`,
      'Content-Length': Buffer.byteLength(payload),
    },
  };

  const req = https.request(options, (res) => {
    let body = '';
    res.on('data', (chunk) => body += chunk);
    res.on('end', () => {
      console.log('Status Code:', res.statusCode);
      if (res.statusCode === 200 || res.statusCode === 201) {
        console.log('✅ Permissions granted successfully to anon, authenticated, and service_role!');
      } else {
        console.log('Response body:', body);
      }
    });
  });

  req.on('error', (err) => {
    console.error('Request error:', err);
  });

  req.write(payload);
  req.end();
}

runGrantQuery();
