"use strict";


/*global document, window, RandomGenerator*/

function Memory (cols, rows, nodeName, picsFolder) {

  var that            = this,
      pictures        = [],
      turnedPics      = [],
      node            = document.querySelector("#" + nodeName),
      numberOfTries   = 0,
      possibleMatches = (function () { return cols * rows / 2; })();

  this.getNode        = function () { return node; };
  this.getColumns     = function () { return cols; };
  this.getTurnedPics  = function () { return turnedPics; };
  this.getTries       = function () { return numberOfTries / 2; };
  this.setPicAsTurned = function (pic) { turnedPics.push(pic); };
  this.clearTurned    = function () { turnedPics = []; };
  this.picFolder      = (function () { return picsFolder || "pics/"; })();

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

    return this.picFolder + pictures[index] + ".png";

  };

  this.start = (function () {
    pictures = RandomGenerator.getPictureArray({rows: rows, cols: cols});
    that.buildBoard(pictures);

  })();
}


Memory.prototype.buildBoard = function (pics) {

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



Memory.prototype.generateTable = function (picArray, cols) {

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

    img.src = that.picFolder + "0.png";

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

  table.addEventListener("click", function (e) {
   that.clickEvent(e);
  });

  return table;
};



Memory.prototype.clickEvent = function (e) {
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


Memory.prototype.checkMatch = function () {
  var that = this,
      pics = this.getTurnedPics();

    if (pics[0].src === pics[1].src) {
      this.addMatch();
      this.clearTurned();

    } else {
     window.setTimeout(function () { that.resetGuess(that.getTurnedPics()); }, 1000);

    }

};


Memory.prototype.resetGuess = function (pics) {
  var that = this;

  pics.forEach( function (pic) {
    pic.setAttribute("src", that.picFolder + "0.png");

  });

  this.clearTurned();
};



Memory.prototype.victory = function () {
  var p = document.createElement("p");

  p.innerHTML = "Grattis du vann! Det tog dig " + this.getTries() + " försök.";
  this.getNode().appendChild(p);
};
