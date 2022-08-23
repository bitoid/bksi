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
composer install
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
---------------------------------------------------------------------------------------------------------------------------------------------------------
## Configure Your Environment for Drupal Development. ##

## Enable developer/debug mode. ##
Uncommenting the following lines in the `settings.php` file. Make sure this code is at the bottom of your `settings.php` file so that local settings can override default settings.
```
if (file_exists(__DIR__ . '/settings.local.php')) {
  include __DIR__ . '/settings.local.php';
}
```
and then copying the file `example.settings.local.php` from `web/sites` folder to `web/sites/default` folder and rename it to `settings.local.php`
```
cp web/sites/example.settings.local.php web/sites/default/settings.local.php
```
It adds a few settings which will help you in debugging and making development easier. If you don't want any of them in particular, you can always comment them out.
_Note : If you think adding a `file_exists` call to each page will slow down the site, you can always remove it in the production code._

 **Disable render caching and JavaScript/CSS aggregation**
* Uncomment lines in settings.local.php
1. Ensure that the following lines are uncommented by removing the # character from the beginning of the line.

This first set disables the CSS and JavaScript aggregation features.
```
$config['system.performance']['css']['preprocess'] = FALSE;
$config['system.performance']['js']['preprocess'] = FALSE;
```
2. And uncommenting this line effectively disables, or rather, bypasses the Render API cache:
```
$settings['cache']['bins']['render'] = 'cache.backend.null';
```
3. You can also disable the Dynamic Page Cache by uncommenting this line:
```
$settings['cache']['bins']['dynamic_page_cache'] = 'cache.backend.null';
```
**Enable Twig debugging options**
* Edit the following variables under the `twig.config:` section.

If you're placing this into your `sites/development.services.yml` file, add the `twig.config` configuration indented under the `parameters:` line. Ensure that your code additions are appropriately indented with 2 spaces, not the tab character (_or an error will result_).
```
parameters:
  twig.config:
    debug: true
    auto_reload: true
    cache: false
```
---------------------------------------------------------------------------------------------------------------------------------------------------------



