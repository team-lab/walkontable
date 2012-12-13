function WalkontableScroll(instance) {
  this.instance = instance;
  this.wtScrollbarV = new WalkontableScrollbar(instance, 'vertical');
  this.wtScrollbarH = new WalkontableScrollbar(instance, 'horizontal');
}

WalkontableScroll.prototype.refreshScrollbars = function () {
  this.wtScrollbarV.refresh();
  this.wtScrollbarH.refresh();
};

WalkontableScroll.prototype.scrollVertical = function (delta) {
  var offsetRow = this.instance.getSetting('offsetRow')
    , newOffsetRow
    , max = this.instance.getSetting('totalRows') - this.instance.getSetting('displayRows');
  if (max < 0) {
    max = 0;
  }
  newOffsetRow = offsetRow + delta;
  if (newOffsetRow < 0) {
    newOffsetRow = 0;
  }
  else if (newOffsetRow >= max) {
    newOffsetRow = max;
  }

  if (newOffsetRow !== offsetRow) {
    this.instance.update('offsetRow', newOffsetRow);
  }
  return this.instance;
};

WalkontableScroll.prototype.scrollHorizontal = function (delta, force) {
  var displayColumns = this.instance.getSetting('displayColumns');
  if (displayColumns !== null) {
    var offsetColumn = this.instance.getSetting('offsetColumn')
      , newOffsetColumn
      , max = this.instance.getSetting('totalColumns') - displayColumns;
    if (max < 0) {
      max = 0;
    }
    newOffsetColumn = offsetColumn + delta;
    if (newOffsetColumn < 0) {
      newOffsetColumn = 0;
    }
    else if (newOffsetColumn >= max && !force) {
      newOffsetColumn = max;
    }
    if (newOffsetColumn !== offsetColumn) {
      this.instance.update('offsetColumn', newOffsetColumn);
    }
  }
  return this.instance;
};

/**
 * Scrolls viewport to a cell by minimum number of cells
 */
WalkontableScroll.prototype.scrollViewport = function (coords) {
  var offsetRow = this.instance.getSetting('offsetRow')
    , offsetColumn = this.instance.getSetting('offsetColumn')
    , displayRows = this.instance.getSetting('displayRows')
    , displayColumns = this.instance.getSetting('displayColumns')
    , totalRows = this.instance.getSetting('totalRows')
    , totalColumns = this.instance.getSetting('totalColumns');

  if (coords[0] < 0 || coords[0] > totalRows - 1) {
    throw new Error('row ' + coords[0] + ' does not exist');
  }
  else if (coords[1] < 0 || coords[1] > totalColumns - 1) {
    throw new Error('column ' + coords[1] + ' does not exist');
  }

  if (this.instance.wtTable.visibilityEdgeRow) {
    displayRows = this.instance.wtTable.visibilityEdgeRow - offsetRow;
  }

  if (this.instance.wtTable.visibilityEdgeColumn) {
    displayColumns = this.instance.wtTable.visibilityEdgeColumn - offsetColumn;
  }

  if (displayRows < totalRows) {
    if (coords[0] > offsetRow + displayRows - 1) {
      this.scrollVertical(coords[0] - (offsetRow + displayRows - 1));
    }
    else if (coords[0] < offsetRow) {
      this.scrollVertical(coords[0] - offsetRow);
    }
    else {
      this.scrollVertical(0); //Craig's issue: remove row from the last scroll page should scroll viewport a row up if needed
    }
  }
  else {
    this.scrollVertical(0); //Craig's issue
  }

  if (displayColumns > 0 && displayColumns < totalColumns) {
    if (coords[1] > offsetColumn + displayColumns - 1) {
      this.scrollHorizontal(coords[1] - (offsetColumn + displayColumns - 1), !!this.instance.wtTable.visibilityEdgeColumn);
    }
    else if (coords[1] < offsetColumn) {
      this.scrollHorizontal(coords[1] - offsetColumn);
    }
    else {
      this.scrollHorizontal(0); //Craig's issue
    }
  }
  else {
    this.scrollHorizontal(0); //Craig's issue
  }

  return this.instance;
};