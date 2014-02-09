# Stream Sync

## Dependencies
Stream Sync is built upon multiple frameworks. Most importantly the Stream Sync back-end depends on all of the following:
* [NodeJS](nodejs.org)
* [Node Package Manager](npmjs.org)
* [Sails JS](sailsjs.org)

It may also be important to note that the Stream Sync front-end depends on [AngularJS](http://angularjs.org/) to create dynamic pages.

## Installation
After you have downloaded the repository you must run

```bash
user@linux:~/path/to/stream-sync$ npm install
```

to install and

```bash
user@linux:~/path/to/stream-sync$ sails lift
```

to run server.

## The Structure
Stream Sync is set up in a standard Model View Controller Architecture. The controller and the model objects are stored in the [api](api) folder. Here the interaction with the server takes place. The connection between the server and the views are found in [config/routes.js](config/routes.js). Server generated views are found in the [views](views) folder including error pages and the index page which holds the logic for grabbing templates. 

The majority of work done on the front end is through angularjs. Angular lives in the [assets](assets) directory. In particular most of the logic can be found in the [assets/js](assets/js) folder and the views and partials can be found in the [assets/templates](assets/templates) directory.