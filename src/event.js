function WalkontableEvent(instance) {
  var that = this;

  //reference to instance
  this.instance = instance;

  this.wtDom = new WalkontableDom();

  var dblClickOrigin = [null, null, null, null]
    , dblClickTimeout = null;

  var onMouseDown = function (event) {
    var cell = that.parentCell(event.target);

    if (cell.TD && cell.TD.nodeName === 'TD') {
      if (that.instance.settings.onCellMouseDown) {
        that.instance.getSetting('onCellMouseDown', event, cell.coords, cell.TD);
      }
    }
    else if (that.wtDom.hasClass(event.target, 'corner')) {
      that.instance.getSetting('onCellCornerMouseDown', event, event.target);
    }

    if (event.button !== 2) { //if not right mouse button
      if (cell.TD && cell.TD.nodeName === 'TD') {
        dblClickOrigin.shift();
        dblClickOrigin.push(cell.TD);
      }
      else if (that.wtDom.hasClass(event.target, 'corner')) {
        dblClickOrigin.shift();
        dblClickOrigin.push(event.target);
      }
    }
  };

  var lastMouseOver;
  var onMouseOver = function (event) {
    if (that.instance.settings.onCellMouseOver) {
      var TD = that.wtDom.closest(event.target, ['TD', 'TH']);
      if (TD && TD !== lastMouseOver) {
        lastMouseOver = TD;
        if (TD.nodeName === 'TD') {
          that.instance.getSetting('onCellMouseOver', event, that.instance.wtTable.getCoords(TD), TD);
        }
      }
    }
  };

  var onMouseUp = function (event) {
    if (event.button !== 2) { //if not right mouse button
      var cell = that.parentCell(event.target);

      if (cell.TD && cell.TD.nodeName === 'TD') {
        dblClickOrigin.shift();
        dblClickOrigin.push(cell.TD);
      }
      else {
        dblClickOrigin.shift();
        dblClickOrigin.push(event.target);
      }

      if (dblClickOrigin[3] !== null && dblClickOrigin[3] === dblClickOrigin[2]) {
        if (dblClickTimeout && dblClickOrigin[2] === dblClickOrigin[1] && dblClickOrigin[1] === dblClickOrigin[0]) {
          if (cell.TD) {
            that.instance.getSetting('onCellDblClick', event, cell.coords, cell.TD);
          }
          else if (that.wtDom.hasClass(event.target, 'corner')) {
            that.instance.getSetting('onCellCornerDblClick', event, cell.coords, cell.TD);
          }

          clearTimeout(dblClickTimeout);
          dblClickTimeout = null;
        }
        else {
          clearTimeout(dblClickTimeout);
          dblClickTimeout = setTimeout(function () {
            dblClickTimeout = null;
          }, 500);
        }
      }
    }
  };

  $(this.instance.wtTable.parent).on('mousedown', onMouseDown);
  $(this.instance.settings.table).on('mouseover', onMouseOver);
  $(this.instance.wtTable.parent).on('mouseup', onMouseUp);
}

WalkontableEvent.prototype.parentCell = function (elem) {
  var cell = {};
  cell.TD = this.wtDom.closest(elem, ['TD', 'TH']);
  if (cell.TD) {
    cell.coords = this.instance.wtTable.getCoords(cell.TD);
  }
  else if (!cell.TD && this.wtDom.hasClass(elem, 'wtBorder') && this.wtDom.hasClass(elem, 'current') && !this.wtDom.hasClass(elem, 'corner')) {
    cell.coords = this.instance.selections.current.selected[0];
    cell.TD = this.instance.wtTable.getCell(cell.coords);
  }
  return cell;
};