neighborhood-map
================

This is my version of a JavaScript Neighborhood Map for Project 5 of the [Udacity Front-End Web Developer Nanodegree] (https://www.udacity.com/course/nd001).

This project provided experience with using design patterns to assist in developing a manageable codebase, utilizing frameworks to decrease the time required to develop an application, and implementing third-party APIs to enhance an application.

**Associated Udacity courses include:**

* [Intro to AJAX](https://www.udacity.com/course/ud110-nd)
* [JavaScript Design Patterns](https://www.udacity.com/course/ud989-nd)

**Goal of the Project:**

* To develop a single page application featuring a map of your neighborhood or a neighborhood you would like to visit. 
* Add a full-screen map using the [Google Maps API](https://developers.google.com/maps/).
* Add map markers identifying a number of locations your are interested in within this neighborhood.
* Implement a list view of the identified locations.
* Implement a search bar functionality to search and filter your existing map markers. 
* Add additional functionality using third-party APIs when a map marker, search result, or list view entry is clicked.  
* To utilize the [KnockoutJS](http://knockoutjs.com/) framework to manage the project complexity.
* Learn how to use design patterns to assist in developing a manageable codebase.
* Learn how to implement third-party API/'s valuable data sets to improve the quality of your application.


###Viewing the Map:

To view the map, clone it from my github account:

```
git clone https://github.com/benplant/neighborhood-map.git
```

and then open index.html in your browser.  It is not necessary to use the Gulp minified version of the application.

###Results:

* I went with [Gulp](http://gulpjs.com/) for the build system on this project.  I have used [Grunt](http://gruntjs.com/) on other projects and wanted to diversify my experience.
* I used [KnockoutJS](http://knockoutjs.com/) to develop a simple and manageable code base.

###Resources Used:

**Primary Courses**

* [Intro to AJAX](https://www.udacity.com/course/ud110-nd)
* [JavaScript Design Patterns](https://www.udacity.com/course/ud989-nd)

**Additional Resources**
* [Google Maps API Reference](https://developers.google.com/maps/documentation/javascript/reference) -- Google Maps JavaScript API Reference.
* [KnockoutJS](http://knockoutjs.com/) -- Simplify dynamic JavaScript UIs with the Model-View-View Model (MVVM).
* [Utility Functions in KnockoutJS](http://www.knockmeout.net/2011/04/utility-functions-in-knockoutjs.html)
* [Foursquare API](https://developer.foursquare.com/start)
* [GulpJS](http://gulpjs.com/) -- Automate and enhance your workflow.
* [GulpJS Recipes](https://github.com/gulpjs/gulp/tree/master/docs/recipes) -- Examples recipes for using Gulp.
* [Gulp Delete](https://github.com/gulpjs/gulp/blob/master/docs/recipes/delete-files-folder.md) -- Delete files/folders with Gulp.
* [Gulp Util](https://github.com/gulpjs/gulp-util) -- Utilities for gulp plugins.
* [Gulp JSHint](https://www.npmjs.com/package/gulp-jshint) -- JSHint plugin for gulp
* [gulp-uglify](https://www.npmjs.com/package/gulp-uglify/) -- Minify files with UglifyJS and Gulp.
* [To Do MVC Examples - Including KnockoutJS](http://todomvc.com/)
* [Udacity Style Guide](http://udacity.github.io/frontend-nanodegree-styleguide/javascript.html)
* [Have Google Map div take 100% of viewport](http://www.tutorialrepublic.com/faq/how-to-set-a-div-height-to-100-percent-using-css.php)
* [Add/Remove Google Markers](https://developers.google.com/maps/documentation/javascript/examples/marker-remove)
* [Animate Google Markers](https://developers.google.com/maps/documentation/javascript/examples/marker-animations-iteration)
* [jQuery](https://jquery.com/) -- JavaScript library, used to simplify Foursquare JSON request.
* [Bower](http://bower.io/) -- Package manager, used to install JavaScript dependencies.
* [Bootstrap](http://getbootstrap.com/) -- Used for responsive styling.
* [Toastr](https://github.com/CodeSeven/toastr) -- Used for Error Notifications.
* HTML & CSS, JavaScript & JQuery books by Jon Duckett

**Researched, but did not use**

* [gulp-concat](https://www.npmjs.com/package/gulp-concat) -- Concatenates files with Gulp.
* [RequireJS](http://requirejs.org/) -- JavaScript file and module loader.
* [Gulp Source Maps](https://www.npmjs.com/package/gulp-sourcemaps) -- Source map support for Gulp.js.
* [vinyl-source-stream](https://github.com/hughsk/vinyl-source-stream) -- Use conventional text streams at the start of your gulp pipeline.
* [vinyl-buffer](https://www.npmjs.com/package/vinyl-buffer) -- Convert streaming vinyl files to use buffers.
* [Browserify](http://browserify.org/) -- Browserify lets you require('modules') in the browser by bundling up all of your dependencies.
* [uglifyify](https://github.com/hughsk/uglifyify) -- A browserify transform which minifies your code using UglifyJS2.
* [watchify](https://github.com/substack/watchify) -- Watch mode for browserify builds.