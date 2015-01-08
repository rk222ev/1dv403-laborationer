/* global define, document */
"use strict";


define(
  [
    "require",
    "mustache",
    "pwd/helper/settings",
    "pwd/window/handlers",
    "pwd/window/window",
    "apps/imageViewer/ImageViewer",
    "apps/rssReader/RssReader",
    "apps/memory/Memory",
    "apps/labbyMezzage/labbyMezzage",
    "apps/mdn/mdn",
  ],

  function (require, Mustache, settings, handlers) {
    (function () {

      var apps = {};
      var pwdNode = document.querySelector('.pwd');

      pwdNode.style.width = settings.width + 'px';
      pwdNode.style.height = settings.height + 'px';

      // Add all apps to be loaded to the desktop.
      apps.ImageViewer = require("apps/imageViewer/ImageViewer");
      apps.Memory = require("apps/memory/Memory");
      apps.RssReader = require("apps/rssReader/RssReader");
      apps.LabbyMezzage = require("apps/labbyMezzage/labbyMezzage");
      apps.Mdn = require("apps/mdn/mdn");

      // Loops through all our apps.
      // Assigns apropriatehandlers.
      Object.keys(apps).forEach(function (app) {
        var icon = document.createElement('a'),
            img = document.createElement('img');

        icon.setAttribute('href', '#');
        img.classList.add('launcher');
        img.setAttribute('src', "pics/icons/" + app + ".svg");
        icon.appendChild(img);

        icon.addEventListener('click', function (e) { handlers.openWindow(apps[app]); } );

        document.querySelector('.pwd').appendChild(icon);
      });
    }());

  }
);


