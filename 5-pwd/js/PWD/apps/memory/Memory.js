"use strict";


/*global document, window, RandomGenerator, PWD*/

PWD.apps.Memory = function (params) {

  var that            = this,
      id              = params.id,
      cols            = params.cols || 2,
      rows            = params.rows || 2,
      pictures        = [],
      turnedPics      = [],
      appSettings     = {},
      windowSettings  = {},
      numberOfTries   = 0,
      possibleMatches = (function () { return cols * rows / 2; })(),
      node;


  appSettings.picFolder = "js/PWD/apps/memory/pics/";

  windowSettings.id           = id;
  windowSettings.icon         = "pics/icons/Memory.svg";
  windowSettings.titleBarText = "Memory 0.2";
  windowSettings.width        = 200;
  windowSettings.height       = 200;

  this.window = new PWD.Window(windowSettings);
  node = this.window.node.querySelector(".app");

  this.getNode        = function () { return node; };
  this.getColumns     = function () { return cols; };
  this.getTurnedPics  = function () { return turnedPics; };
  this.getTries       = function () { return numberOfTries / 2; };
  this.setPicAsTurned = function (pic) { turnedPics.push(pic); };
  this.clearTurned    = function () { turnedPics = []; };
  this.getPicFolder      = (function () { return appSettings.picFolder; })();

  this.addMatch = function () {
    possibleMatches -= 1;
    if (possibleMatches === 0) {
     this.victory();

    }
  };

  this.addTry = function () {
    numberOfTries += 1;
    if ( numberOfTries % 2 === 0) {
      this.checkMatch();
    }
  };


  this.getPictureLink = function (img) {
    var index = Array.prototype.indexOf.call(node.querySelectorAll("img"), img);

    return this.getPicFolder + pictures[index] + ".png";

  };

  this.start = (function () {
    pictures = PWD.randomGenerator.getPictureArray({rows: rows, cols: cols});
    that.buildBoard(pictures);
    PWD.Window.prototype.events.appLoaded(that.window.node);

  })();
};


PWD.apps.Memory.prototype.buildBoard = function (pics) {

  var oldBoard,
      gameNode  = this.getNode(),
      newBoard  = document.createElement("div"),
      game      = this.generateTable(pics, this.getColumns());

  newBoard.classList.add("board");
  newBoard.appendChild(game);

  if(gameNode.hasChildNodes()) {
    oldBoard = this.node.querySelector(".board");
    gameNode.replaceChild(oldBoard, newBoard);

  } else {
    gameNode.appendChild(newBoard);

  }
};



PWD.apps.Memory.prototype.generateTable = function (picArray, cols) {

  var that        = this,
      rowMembers  = 0,
      tr          = document.createElement("tr"),
      table       = document.createElement("table");

  // For each member in picArray create a cell containing a
  // a href and an image. Append this to the current table row.
  // If the table row cells then matches the cols parameter in members
  // Add the row to the table.
  picArray.forEach( function (pic) {

    var a   = document.createElement("a"),
        td  = document.createElement("td"),
        img = document.createElement("img");

    img.src = that.getPicFolder + "0.png";

    a.setAttribute("href", "#");
    a.appendChild(img);
    td.appendChild(a);
    tr.appendChild(td);
    rowMembers += 1;

    if (rowMembers === cols) {
      table.appendChild(tr);
      tr = document.createElement("tr");
      rowMembers = 0;
    }

  });

  table.addEventListener("mousedown", function (e) {
   that.clickEvent(e);
  }, true);

  return table;
};



 PWD.apps.Memory.prototype.clickEvent = function (e) {
    var target = e.target,
        turned = this.getTurnedPics().length;


  // If target node is the a-element go to its firstChild.
  // Should move everything from the img-element to the a-element.
  if (target.tagName !== "IMG") {
    target = target.firstChild;
  }

  if (turned < 2 && target.tagName === "IMG" && target.src.indexOf("pics/0.png") !== -1) {
    this.setPicAsTurned(target);
    target.setAttribute("src", this.getPictureLink(target));
    this.addTry();

  }
};


PWD.apps.Memory.prototype.checkMatch = function () {
  var that = this,
      pics = this.getTurnedPics();

    if (pics[0].src === pics[1].src) {
      this.addMatch();
      this.clearTurned();

    } else {
     window.setTimeout(function () { that.resetGuess(that.getTurnedPics()); }, 1000);

    }

};


PWD.apps.Memory.prototype.resetGuess = function (pics) {
  var that = this;

  pics.forEach( function (pic) {
    pic.setAttribute("src", that.getPicFolder + "0.png");

  });

  this.clearTurned();
};



PWD.apps.Memory.prototype.victory = function () {
  var div = this.window.node.querySelector(".board"),
      replacement = document.createElement("div"),
      p = document.createElement("p");

  p.innerHTML = "Grattis du vann! Det tog dig " + this.getTries() + " försök.";

 replacement.appendChild(p);
 replacement.classList.add("board");

div.parentNode.replaceChild(replacement, div);

};
