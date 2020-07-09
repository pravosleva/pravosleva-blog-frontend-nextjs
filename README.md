# pravosleva-blog-frontend-nextjs

## Development

### `pm2 start ecosystem.dev.config.js`

`.env.dev`

```bash
REACT_APP_API_ENDPOINT=http://localhost:1337
REACT_APP_SOCKET_ENDPOINT=http://localhost:1337

RECAPTCHAV3_VERIFY_URL=http://pravosleva.ru/express-helper/recaptcha-v3/verify
LOCAL_NGINX_IS_ENABLED=1
```

### `yarn storybook`

_Run storybook on [localhost:6006](http://localhost:6006)_

### `yarn build-storybook`

_Build storybook to `.next/storybook/` as static_

### `yarn analyze`

_Generate bundle size analysis to `.next/analyze/` as static_

## Production

### `pm2 start ecosystem.prod.config.js`

`.env.prod`

```bash
REACT_APP_API_ENDPOINT=http://80.87.194.181/api
REACT_APP_SOCKET_ENDPOINT=http://80.87.194.181
REACT_APP_AUTH_COOKIE_EXPIRES_IN_DAYS=1
REACT_APP_LANG_COOKIE_EXPIRES_IN_DAYS=30
REACT_APP_THEME_COOKIE_EXPIRES_IN_DAYS=30
REACT_APP_CONFIRM_COOKIE_EXPIRES_IN_DAYS=14

GA_TRACKING_ID=UA-xxxxxxxxx-x
YANDEX_COUNTER_ID=xxxxxxxx
RECAPTCHAV3_CLIENT_KEY=xxxxxxxxxxxxxxxxxxxxxxxxxxxxx-xxxxxxxxxx
RECAPTCHAV3_VERIFY_URL=http://pravosleva.ru/express-helper/recaptcha-v3/verify
```

## Deploy

### `yarn deploy:prod:build-send-restart-all`

_Local build then deploy and restart all current pm2 processes remotely_

### `yarn deploy:prod:build-send-restart-front`

_Local build then deploy and run `pm2 restart 1` remotely_

### `yarn deploy:prod:send-restart-front`

_Send `./.next/*` files and run `pm2 restart 1` remotely_

### `yarn deploy:prod:send-storybook`

_Local build new storybook then deploy [http://pravosleva.ru/storybook/index.html](http://pravosleva.ru/storybook/index.html). **Remote `./storybook` dir should be created manually!**_

`deploy-app-config.json`

```json
{
  "prod:update-restart-all": {
    "user": "<USER>",
    "host": "<HOST>",
    "port": "<PORT>",
    "files": "./.next/*",
    "path": "/home/path-to-dir/pravosleva-blog/frontend/.next",
    "pre-deploy-local": "yarn local:cleanup; yarn build",
    "pre-deploy-remote": "pm2 stop all",
    "post-deploy": "pm2 delete all; pm2 resurrect --update-env"
  },
  "prod:update-restart-front": {
    "user": "<USER>",
    "host": "<HOST>",
    "port": "<PORT>",
    "files": "./.next/*",
    "path": "/home/path-to-dir/pravosleva-blog/frontend/.next",
    "pre-deploy-local": "yarn local:cleanup; yarn build",
    "post-deploy": "pm2 restart 1 --update-env"
  },
  "prod:update-storybook": {
    "user": "<USER>",
    "host": "<HOST>",
    "port": "<PORT>",
    "files": "./.next/storybook/*",
    "path": "/home/path-to-dir/pravosleva-blog/frontend/.next/storybook",
    "pre-deploy-local": "yarn build-storybook"
  },
  "dev": {},
  "staging": {}
}
```

### NGINX

```
upstream nextjs_upstream {
    server nextjs:9000;
}
server {
    listen       80;
    client_max_body_size 32m;
    server_tokens off;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_cache_bypass $http_upgrade;

    # Special for nextjs

    location /_next/static {
        proxy_pass http://nextjs_upstream;
        # For testing cache - remove before deploying to production
        add_header X-Cache-Status $upstream_cache_status;
    }
    location /article {
        proxy_cache STATIC;
        proxy_pass http://nextjs_upstream;
        # For testing cache - remove before deploying to production
        # add_header X-Cache-Status $upstream_cache_status;
    }
    location /favicon.ico {
         root /home/pravosleva/pravosleva-blog/frontend/public;
    }
    location / {
        if ($request_method = 'POST') {
           add_header 'Access-Control-Allow-Origin' '*';
           add_header 'Access-Control-Allow-Methods' 'GET, POST, OPTIONS';
           add_header 'Access-Control-Allow-Headers' 'DNT,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,Range';
           add_header 'Access-Control-Expose-Headers' 'Content-Length,Content-Range';
        }
        if ($request_method = 'GET') {
           add_header 'Access-Control-Allow-Origin' '*';
           add_header 'Access-Control-Allow-Methods' 'GET, POST, OPTIONS';
           add_header 'Access-Control-Allow-Headers' 'DNT,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,Range';
           add_header 'Access-Control-Expose-Headers' 'Content-Length,Content-Range';
        }
        # proxy_pass          http://127.0.0.1:9000;
        proxy_pass http://nextjs_upstream;
        proxy_http_version  1.1;
    }

    # Special for images (which placed in backend/uploads):

    location /api/uploads {
        rewrite ^/api/(.*)$ /$1 break;
        root /home/pravosleva/pravosleva-blog/backend/public;
        # So, files by /api/uploads fill be searched in (root) ~/uploads
        # See also: https://stackoverflow.com/questions/18954827/how-to-serve-images-with-nginx
    }

    # Special for other static files:

    location /static {
      root /home/pravosleva/pravosleva-blog/frontend/public;
    }
    location /storybook {
      rewrite ^/storybook/(.*)$ /$1 break;
      root /home/pravosleva/pravosleva-blog/frontend/.next/storybook;
      # expires 1d;
    }

    # All /api rqs should be redirected to Strapi powered backend:

    location /api {
        rewrite ^/api/(.*)$ /$1 break;
        proxy_pass          http://127.0.0.1:1337;
    }

    # Others API rqs (admin):

    location /admin {
        proxy_pass          http://127.0.0.1:1337;
    }
    location /users-permissions {
        proxy_pass          http://127.0.0.1:1337;
    }
    location /content-manager {
        proxy_pass          http://127.0.0.1:1337;
    }
    location /upload {
        proxy_pass          http://127.0.0.1:1337;
    }

    # Additional services:

    location /express-helper {
        rewrite ^/express-helper/(.*)$ /$1 break;
        proxy_pass          http://127.0.0.1:5000;
    }
}
```

## Precommit hook

_`Install deps:`_

```bash
yarn add -D husky
yarn add -D prettier lint-staged
yarn add -D @typescript-eslint/eslint-plugin@latest
yarn add -D eslint-plugin-react-hooks@latest
yarn add -D eslint-config-react-app
yarn add -D eslint-plugin-import@latest
yarn add -D eslint-plugin-flowtype@latest
yarn add -D eslint-plugin-jsx-a11y@latest
yarn add -D eslint-plugin-react-hooks
```

_`package.json`_

```js
{
  "lint-staged": {
    "*.{js, jsx, ts, tsx}": [
    // With Storybook in project:
    // "*.{js, jsx, ts, tsx} !.storybook/*": [
      "node_modules/.bin/eslint --max-warnings=0",
      "prettier --write"
    ]
  },
  "husky": {
    "hooks": {
      // ...
      "pre-commit": "lint-staged"
    }
  },
}
```

_Unnecessary, but could be interested:_

```js
{
  "scripts": {
    // ...
    "lint": "eslint --debug src/**/*.js*",
    "lint:fix": "eslint src/**/*.ts* --fix"
  }
}
```
