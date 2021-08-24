# Transactional Mailing Microservice

A Dapr-wrapped Node/TypeScript-based microservice that simplifies transactional emailing, with templates, throttling, SMTP relaying, etc.

## Features
- Dynamic mail compilation (using [mailgen](https://npmjs.com/package/mailgen) for templating and [micromustache](https://npmjs.com/package/micromustache) for variable injection)
- Durability (using RabbitMQ) + Throttling
- Relaying (via SMTP)

## Configuration
There's three parts to it:
- Secrets: For a start, secrets are kept in JSON files, but you should change that in production. The secrets are imported as `config/secrets.json`. Make a copy of `config/secrets.json.example` and modify as required.
- Environment config: This is less sensitive, so [config](https://npmjs.com/package/config) is used. Simply add a `config/local.json` with a structure that matches `config/default.json` to override. On production, it should be `config/production.json`.
- Dapr components: You might not need to tweak this to run locally, but for production, you definitely need to go through `dapr/components/*`.

## Usage
First, run the app with Dapr:
```bash
dapr run --app-id mailer --app-port 3550 --dapr-http-port 3500 --components-path ./dapr/components/ npm run start
```

After bootstrapping, proceed to send (or more accurately, queue) a mail by invoking the relevant endpoint:
```bash
curl -i -X POST \
  -H "Content-Type: application/json" \
  -d "{\"to\":\"me@dystopian.dev\",\"templateId\":\"account-activation\",\"variables\":{\"actionUri\":\"https://dystopian.dev/?origin=https://github.com/dystopiandev/transactional-mailing-microservice\",\"name\":\"Redhart Azul\"}}" \
  http://localhost:3500/v1.0/invoke/mailer/method/mail
```

## Recommendations
- Avoid file-based secrets on production. If you're deploying to Kubernetes, then Kubernetes Secrets with Dapr Secrets Building Block abstraction makes perfect sense.
- [Mailtrap](https://mailtrap.io) is recommended for testing.
- Use a GUI test suite like Postman to flexibly send requests.

## Bug Reports & Contributions
- Open an issue if you find a bug.
- Send a PR if you wish to add a feature or perhaps polish/fix something.

Both are super welcome.