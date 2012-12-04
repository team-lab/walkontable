describe('WalkontableSelection', function () {
  var $table
    , debug = false;

  beforeEach(function () {
    $table = $('<table></table>'); //create a table that is not attached to document
    $table.appendTo('body');
    createDataArray();
  });

  afterEach(function () {
    if (!debug) {
      $('.wtHolder').remove();
    }
  });

  it("should add/remove class to selection when cell is clicked", function () {
    var wt = new Walkontable({
      table: $table[0],
      data: getData,
      totalRows: getTotalRows,
      totalColumns: getTotalColumns,
      offsetRow: 0,
      offsetColumn: 0,
      displayRows: 10,
      displayColumns: 2,
      selections: {
        current: {
          className: 'current'
        }
      },
      onCellMouseDown: function (event, coords, TD) {
        wt.selections.current.clear();
        wt.selections.current.add(coords, TD);
      }
    });
    wt.draw();

    var $td1 = $table.find('tbody td:eq(0)');
    var $td2 = $table.find('tbody td:eq(1)');
    $td1.mousedown();
    expect($td1.hasClass('current')).toEqual(true);

    $td2.mousedown();
    expect($td1.hasClass('current')).toEqual(false);
    expect($td2.hasClass('current')).toEqual(true);
  });

  it("should add/remove border to selection when cell is clicked", function () {
    var wt = new Walkontable({
      table: $table[0],
      data: getData,
      totalRows: getTotalRows,
      totalColumns: getTotalColumns,
      offsetRow: 0,
      offsetColumn: 0,
      displayRows: 10,
      displayColumns: 2,
      selections: {
        current: {
          border: {
            width: 1,
            color: 'red',
            style: 'solid'
          }
        }
      },
      onCellMouseDown: function (event, coords, TD) {
        wt.selections.current.clear();
        wt.selections.current.add(coords, TD);
      }
    });
    wt.draw();

    var $td1 = $table.find('tbody td:eq(0)');
    var $td2 = $table.find('tbody td:eq(1)');
    $td1.mousedown();
    expect($td1.css('outline-width')).toEqual('1px');

    $td2.mousedown();
    expect($td1.css('outline-width')).not.toEqual('1px');
    expect($td2.css('outline-width')).toEqual('1px');
  });

  it("should move the selection when table is scrolled", function () {
    var wt = new Walkontable({
      table: $table[0],
      data: getData,
      totalRows: getTotalRows,
      totalColumns: getTotalColumns,
      offsetRow: 0,
      offsetColumn: 0,
      displayRows: 10,
      displayColumns: 3,
      selections: {
        current: {
          border: {
            width: 1,
            color: 'red',
            style: 'solid'
          }
        }
      },
      onCellMouseDown: function (event, coords, TD) {
        wt.selections.current.clear();
        wt.selections.current.add(coords, TD);
      }
    });
    wt.draw();

    var $td1 = $table.find('tbody tr:eq(1) td:eq(0)');
    var $td2 = $table.find('tbody tr:eq(2) td:eq(1)');
    $td2.mousedown();
    expect($td2.css('outline-width')).toEqual('1px');

    wt.update({
      offsetRow: 1,
      offsetColumn: 1
    });
    wt.draw();

    expect($td1.css('outline-width')).toEqual('1px');
    expect($td2.css('outline-width')).not.toEqual('1px');
  });

  it("should add a selection that is outside of the viewport", function () {
    var wt = new Walkontable({
      table: $table[0],
      data: getData,
      totalRows: getTotalRows,
      totalColumns: getTotalColumns,
      offsetRow: 0,
      offsetColumn: 0,
      displayRows: 10,
      displayColumns: 3,
      selections: {
        current: {
          border: {
            width: 1,
            color: 'red',
            style: 'solid'
          }
        }
      }
    });
    wt.draw();

    wt.selections.current.add([20, 0]);
    expect(wt.wtTable.getCoords($table.find('tbody tr:first td:first')[0])).toEqual([0, 0]);
  });

  it("should clear a selection that is outside of the viewport", function () {
    var wt = new Walkontable({
      table: $table[0],
      data: getData,
      totalRows: getTotalRows,
      totalColumns: getTotalColumns,
      offsetRow: 0,
      offsetColumn: 0,
      displayRows: 10,
      displayColumns: 3,
      selections: {
        current: {
          border: {
            width: 1,
            color: 'red',
            style: 'solid'
          }
        }
      }
    });
    wt.draw();

    wt.selections.current.add([0, 0]);
    wt.scrollVertical(10).draw();
    wt.selections.current.clear();
    expect(wt.wtTable.getCoords($table.find('tbody tr:first td:first')[0])).toEqual([10, 0]);
  });
});