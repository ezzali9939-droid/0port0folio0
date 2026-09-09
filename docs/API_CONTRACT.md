# Contact API Contract

## `POST /api/contact`

JSON body:

```json
{
  "name": "Client Name",
  "email": "client@example.com",
  "projectType": "Brand Identity",
  "budgetRange": "10,000–25,000 EGP",
  "message": "A clear description containing at least twenty characters.",
  "companyWebsite": ""
}
```

Responses:

| Status | Meaning |
| --- | --- |
| 201 | Inquiry stored successfully |
| 202 | Honeypot submission silently accepted |
| 400 | Invalid JSON |
| 413 | Payload larger than 16 KiB |
| 422 | Field validation failed |
| 429 | Five submissions already received from this fingerprint in one hour |
| 503 | Supabase is not configured or temporarily unavailable |

The endpoint never returns secrets, database errors or internal stack traces.
