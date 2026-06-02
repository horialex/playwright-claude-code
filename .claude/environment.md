## Environment

Configuration lives in `.env`

| Variable              | Purpose                                                                                                   |
| --------------------- | --------------------------------------------------------------------------------------------------------- |
| `BASE_URL`            | App under test URL                                                                                        |
| `FIWARE_URL`          | FIWARE backend base URL                                                                                   |
| `API_URL`             | Citizen Connect API base URL (e.g. `http://api-citizen-connect.dev.evozon.com`)                           |
| `CITIZEN_EMAIL`       | Test user email                                                                                           |
| `CITIZEN_PASS`        | Test user password                                                                                        |
| `CITIZEN_USERNAME`    | Test user display name                                                                                    |
| `CITIZEN_EMAI_PREFIX` | Email prefix for dynamic user generation                                                                  |
| `LOG_API`             | Set to `true` to enable ApiHelper request/response logging                                                |
| `PROXY_SERVER`        | Optional. Set to enable HTTP proxy (e.g. `http://127.0.0.1:8080` for Burp Suite). Leave unset to disable. |
