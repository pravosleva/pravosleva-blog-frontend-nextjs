# Local NGINX:

- [ANYWAY](#anyway)
- [WAY 1](#way-1): Local images
- [WAY 2](#way-2): With image filter usage (In progress)

_See also [https://www.nginx.com/blog/responsive-images-without-headaches-nginx-plus/](https://www.nginx.com/blog/responsive-images-without-headaches-nginx-plus/)_

## anyway

`/etc/nginx/nginx.conf`

```
{
  # ...
  http {
    ##
    # Virtual Host Configs
    ##

    include /etc/nginx/conf.d/*.conf;
  }
}
```

## way-1

`/etc/nginx/nginx.conf`

```
{
  # ...
  http {
    ##
    # Like pravosleva-blog
    ##

    server {
      listen	localhost:80;
      location /api/uploads {
        rewrite ^/api/(.*)$ /$1 break;
        root /home/den/projects/pravosleva-blog/backend/public;
      }
      location /api {
        rewrite ^/api/(.*)$ /$1 break;
        proxy_pass	http://127.0.0.1:1337;
      }
    }
  }
}
```

## way-2

`/etc/nginx/nginx.conf`

```
  # Should be included:
  load_module modules/ngx_http_image_filter_module.so;

  http {
    ##
    # Like pravosleva-blog
    ##

    server {
      listen	localhost:80;
      location /api/uploads/img([0-9]+)(?:/(.*))?$ {
        proxy_pass        http://127.0.0.1:9001;
        proxy_cache       resized;
        proxy_cache_valid 180m;
      }
      location /api {
        rewrite ^/api/(.*)$ /$1 break;
        proxy_pass	http://127.0.0.1:1337;
      }
    }
  }
```

`/etc/nginx/conf.d/pravosleva-blog.local.conf`

```
limit_req_zone "1" zone=2persec:32k rate=2r/s;

server {
  listen 9001;
  allow 127.0.0.1;
  deny all;
  limit_req zone=2persec burst=10;

  location ~ ^/img([0-9]+)(?:/(.*))?$ {
      alias /home/den/projects/pravosleva-blog/backend/public/$2;
      image_filter_buffer 10M;
      image_filter resize $1 -;
  }
}
```
