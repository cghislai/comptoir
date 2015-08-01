# Comptoir

Un frontend pour la gestion de stock/client.

Quelques lignes gardées du README du seed project d'angular 2:

**Note:** Angular 2.0 is not production ready yet! This seed project is perfect for playing around with the latest versions but do not start new projects with it since a lot of new changes are going to be introduced until the framework is officially released.

# How to start

```bash
git clone https://github.com/cghislai/comptoir.git
cd comptoir
npm install
# If you don't have gulp already installed
npm install -g gulp
# dev
gulp serve.dev
# prod
gulp serve.prod
```

# To generate CSS files
gem install sass

Configure your app base if you serve the app from another directory than root in `gulpfile.js`.
Defaults to `var APP_BASE = '/'`

# Now to extend?

If you want to use your custom libraries:

```bash
npm install my-library --save
vim gulpfile.js
```
Add reference to the installed library in `PATH.src.lib`.

# License

To be defined
