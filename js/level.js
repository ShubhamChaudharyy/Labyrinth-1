/*jshint esversion: 6 */

// defined in /js/tiles.js
/* global NullTile */

const tileWidth = 429.544; // px, real width
const tileHeight = 256.314; // px

// Level is used in /js/levels.js ignoring the error
// ignore JSHintBear

function getLevelsContainer() {
  return document.getElementById("tiles");
}

function createTilesContainer(name) {
  var tilesContainer = document.createElement("div");
  tilesContainer.classList.add("tileContainer");
  tilesContainer.id = "level-" + name;
  return tilesContainer;
}

function Level(name, specification)
{
  this.name = name;
  this.scale = 0.5;
  this.startTile = null;
  this.tilesContainer = createTilesContainer(this.name);
  this.setTilesFromSpecification(specification);
  this.showTilesIn(this.tilesContainer);
  this.hide();
}

Level.prototype.setTilesFromSpecification = function(specification) {
  var me = this;
  this.tiles = specification.map(function(row, y){
    return row.map(function(tileSpecification, x){
      const position = {"x": x, "y": y};
      if (!tileSpecification) {
        alert("ERROR: Tile is " + tileSpecification + " at row " + (y + 1) + " column " + (x + 1) + " in level \"" + me.name + "\". Please see levels.js and correct the problem.");
      }
      return tileSpecification.placeAtIn(position, me);
    });
  });
  if (this.startTile === null) {
    this.startTile = this.tiles[0][0];
  }
};

Level.prototype.indexToPosition = function(position) {
  return {
    "x": tileWidth * (position.x + position.y) * this.scale,
    "y": tileHeight * (-position.x + position.y) * this.scale,
    "scale": this.scale,
    "tileWidth" : tileWidth * this.scale,
    "tileHeight" : tileHeight * this.scale,
  };
};

Level.prototype.showTilesIn = function(container){
  var minX = 0;
  var minY = 0;
  var me = this;
  this.tiles.forEach(function(row, y){
    row.forEach(function(tile, x){
      const position = {"x": x, "y": y};
      const pixelPosition = me.indexToPosition(position);
      minY = pixelPosition.y < minY ? pixelPosition.y : minY;
      minX = pixelPosition.x < minX ? pixelPosition.x : minX;
      return tile.showIn(container);
    });
  });
  // add width of left column to prevent its elements from overlapping tiles
  container.style.left = (-minX + $('.left-column').width()) + "px";
  // add height of top navbar to prevent it from overlapping tiles
  container.style.top = (-minY + $('.navbar-fixed').height()) + "px";
};

Level.prototype.getTileAt = function(x, y){
  if (x < 0 || y < 0 || y >= this.tiles.length || x >= this.tiles[y].length) {
    return NullTile;
  }
  return this.tiles[y][x];
};

Level.prototype.setStartTile = function(startTile) {
  this.startTile = startTile;
};

Level.prototype.addPlayer = function(player) {
  player.startAt(this.startTile);
};

Level.prototype.visit = function() {
  this.tiles.forEach(function(row){
    row.forEach(function(tile){
      tile.visit();
    });
  });
};

Level.prototype.hide = function() {
  this.show();
  getLevelsContainer().removeChild(this.tilesContainer);
};

Level.prototype.show = function() {
  getLevelsContainer().appendChild(this.tilesContainer);
};

Level.prototype.removePlayer = function(player) {
};

