# pravosleva-blog-frontend-nextjs

## Bundle analysis

### `yarn analyze`

## Development

`.env.dev`

```
REACT_APP_API_ENDPOINT=http://localhost:1337
REACT_APP_SOCKET_ENDPOINT=http://localhost:1337
```

```bash
pm2 start ecosystem.dev.config.js
```

## Production

`.env.prod`

```
REACT_APP_API_ENDPOINT=http://80.87.194.181/api
REACT_APP_SOCKET_ENDPOINT=http://80.87.194.181/api

GA_TRACKING_ID=UA-xxxxxxxxx-x
YANDEX_COUNTER_ID=xxxxxxxx
RECAPTCHAV3_CLIENT_KEY=xxxxxxxxxxxxxxxxxxxxxxxxxxxxx-xxxxxxxxxx
```

```bash
pm2 start ecosystem.prod.config.js
```
