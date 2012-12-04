describe('WalkontableScrollbar', function () {
  var $table
    , debug = 1;

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

  it("should table in DIV.wtHolder that contains 2 scrollbars", function () {
    var wt = new Walkontable({
      table: $table[0],
      data: getData,
      totalRows: getTotalRows,
      totalColumns: getTotalColumns,
      offsetRow: 0,
      offsetColumn: 0,
      displayRows: 10,
      displayColumns: 2
    });
    wt.draw();

    expect($table.parents('div.wtHolder').length).toEqual(1);
    expect($table.parents('div.wtHolder:eq(0)').children('div.dragdealer').length).toEqual(2);
  });

  it("handle should have the size of scrollbar if totalRows is smaller or equal displayRows", function () {
    this.data.splice(5, this.data.length - 5);

    var wt = new Walkontable({
      table: $table[0],
      data: getData,
      totalRows: getTotalRows,
      totalColumns: getTotalColumns,
      offsetRow: 0,
      offsetColumn: 0,
      displayRows: 10,
      displayColumns: 2
    });
    wt.draw();

    var slider = $table.parent().find('.dragdealer.vertical');
    var handle = slider.find('.handle');
    expect(slider.height()).toBeGreaterThan(0);
    expect(slider.height()).toEqual(handle.height());
  });

  it("scrolling should have no effect when totalRows/Columns is smaller than displayRows/Columns", function () {
    this.data.splice(5, this.data.length - 5);

    try {
      var wt = new Walkontable({
        table: $table[0],
        data: getData,
        totalRows: getTotalRows,
        totalColumns: getTotalColumns,
        offsetRow: 0,
        offsetColumn: 0,
        displayRows: 10,
        displayColumns: 10
      });
      wt.draw();

      wt.wtScroll.wtScrollbarH.onScroll(1);
      expect(wt.getSetting('offsetColumn')).toEqual(0);
      wt.wtScroll.wtScrollbarH.onScroll(-1);
      expect(wt.getSetting('offsetColumn') + 1).toEqual(1); //+1 so it can be distinguished from previous one

      wt.wtScroll.wtScrollbarV.onScroll(1);
      expect(wt.getSetting('offsetRow') + 2).toEqual(2); //+2 so it can be distinguished from previous one
      wt.wtScroll.wtScrollbarV.onScroll(-1);
      expect(wt.getSetting('offsetRow') + 3).toEqual(3); //+3 so it can be distinguished from previous one
    }
    catch (e) {
      expect(e).toBeUndefined();
    }
  });

  it("vertical scrollbar position should change if table is scrolled using API", function () {
    this.data.splice(20, this.data.length - 20);

    var wt = new Walkontable({
      table: $table[0],
      data: getData,
      totalRows: getTotalRows,
      totalColumns: getTotalColumns,
      offsetRow: 0,
      offsetColumn: 0,
      displayRows: 10,
      displayColumns: 2
    });
    wt.draw();

    var bar = $table.parent().find('.dragdealer.vertical .handle');
    var originalPosition = bar.css('top');

    wt.scrollVertical(10).draw();
    expect(bar.css('top')).toBeGreaterThan(originalPosition);
  });

  it("horizontal scrollbar position should change if table is scrolled using API", function () {
    this.data.splice(20, this.data.length - 20);

    var wt = new Walkontable({
      table: $table[0],
      data: getData,
      totalRows: getTotalRows,
      totalColumns: getTotalColumns,
      offsetRow: 0,
      offsetColumn: 0,
      displayRows: 10,
      displayColumns: 2
    });
    wt.draw();

    var bar = $table.parent().find('.dragdealer.horizontal .handle');
    var originalPosition = bar.css('left');

    wt.scrollHorizontal(10).draw();
    expect(bar.css('left')).toBeGreaterThan(originalPosition);
  });
});