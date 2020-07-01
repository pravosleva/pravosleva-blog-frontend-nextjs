# pravosleva-blog-frontend-nextjs

## Bundle analysis

### `yarn analyze`

## Development

`.env.dev`

```
REACT_APP_API_ENDPOINT=http://localhost:1337
REACT_APP_SOCKET_ENDPOINT=http://localhost:1337

RECAPTCHAV3_VERIFY_URL=http://pravosleva.ru/express-helper/recaptcha-v3/verify
```

```bash
pm2 start ecosystem.dev.config.js
```

## Production

`.env.prod`

```
REACT_APP_API_ENDPOINT=http://80.87.194.181/api
REACT_APP_SOCKET_ENDPOINT=http://80.87.194.181

GA_TRACKING_ID=UA-xxxxxxxxx-x
YANDEX_COUNTER_ID=xxxxxxxx
RECAPTCHAV3_CLIENT_KEY=xxxxxxxxxxxxxxxxxxxxxxxxxxxxx-xxxxxxxxxx
RECAPTCHAV3_VERIFY_URL=http://pravosleva.ru/express-helper/recaptcha-v3/verify
```

```bash
pm2 start ecosystem.prod.config.js
```

## Deploy

### `yarn deploy:prod`

`deploy-app-config.json`

```
{
  "prod": {
    "user": "<USER>",
    "host": "<HOST>",
    "port": "<PORT>",
    "files": "./.next/*",
    "path": "/home/path-to-dir/frontend/.next",
    "pre-deploy-local": "yarn build",
    "pre-deploy-remote": "pm2 stop all",
    "post-deploy": "pm2 delete all; pm2 resurrect --update-env"
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
