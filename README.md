# Install project
```
docker compose up -d
```
```
docker compose exec php composer install
```
```
docker compose exec php drush site:install --existing-config --account-pass=1234
```
```
docker compose exec php drush cim
```
Open in Browser
http://bksi.docker.localhost:8000/

## Markup Repository:
https://github.com/Chkhikvadzeg/BKSI

## Custom theme uses Tailwind Starter Kit
https://www.drupal.org/project/tailwindcss
To re-compile the CSS:
```
npm install
npm run build
```
