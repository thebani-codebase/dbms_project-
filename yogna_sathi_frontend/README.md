# Yogna Saathi Working Website

## Run On Localhost

Open two terminals in this folder.

Terminal 1:

```powershell
npm run start:website
```

Terminal 2:

```powershell
npm run start:oracle-api
```

Then open:

- Website: `http://127.0.0.1:5173`
- Oracle API health: `http://127.0.0.1:5174/health`
- Database workbench: `http://127.0.0.1:5173/#/database`

No npm install is required because the project uses only built-in browser APIs and Node's built-in `http` module.

For live database-style sync, run the local Oracle API bridge:

```powershell
node oracle_api_server.js
```

Then open:

- Website: `http://127.0.0.1:5173`
- Oracle API health: `http://127.0.0.1:5174/health`

The API bridge stores demo rows in `oracle_mock_db.json`. Add/delete a scheme from the Admin DBMS page and the citizen eligibility page will update from API data. In production, replace `oracle_api_server.js` with `oracle_backend_example.js` using `node-oracledb`.

## Important Pages

- `/` Home
- `#/login` Role login
- `#/citizen` Citizen voice and eligibility assistant
- `#/documents` Multimodal document AI
- `#/awareness` Large policy awareness dashboard
- `#/oracle` Oracle live integration page
- `#/database` DBMS workbench: insert, delete, query, triggers
- `#/government` Government dashboard
- `#/ngo` NGO field dashboard
- `#/admin` Admin DBMS console
- `#/pipeline` Full project pipeline

## Demo Login IDs

| Role | Login ID | Password | Page |
| --- | --- | --- | --- |
| Senior Citizen | `senior@yognasaathi.in` | `senior123` | Citizen voice assistant |
| Student / Youth | `student@yognasaathi.in` | `student123` | Citizen voice assistant |
| Women & Child | `woman@yognasaathi.in` | `woman123` | Citizen voice assistant |
| Government Officer | `officer@yognasaathi.gov` | `gov123` | Government dashboard |
| NGO Field Worker | `ngo@yognasaathi.org` | `ngo123` | NGO field dashboard |
| Admin | `admin@yognasaathi.in` | `admin123` | Admin DBMS console |

## Included Features

- Multi-page website using hash routing.
- Role-based login and protected dashboards.
- Citizen eligibility matching for different age groups.
- Multimodal document AI page for Aadhaar, ration card, certificates, handwritten forms, photos, PDFs, and voice notes.
- Document extraction demo masks Aadhaar, extracts age/gender/location/income/BPL/caste/disability signals, then recommends yojanas.
- Voice input through browser speech recognition where supported.
- Text-to-speech answer through browser speech synthesis.
- Simulated LLM extraction from text or Punjabi sample query.
- Large policy awareness dashboard with existing policies, awareness %, coverage %, barriers, and campaign recommendations.
- Government gap analysis dashboard and CSV report export.
- NGO field report upload, AI extraction demo, and volunteer routing.
- Admin DBMS page showing entities, safe query layer, and Oracle migration path.
- Live Oracle API sync demo: add/delete scheme rows through an API and watch website data update.
- Separate Database Workbench page with POLICY_SCHEME, BENEFICIARY, ENROLLMENT tables, insert/delete actions, SQL query runner, and trigger/audit log.
