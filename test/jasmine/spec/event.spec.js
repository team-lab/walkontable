describe('WalkontableEvent', function () {
  var $table
    , data;

  var debug = false;

  beforeEach(function () {
    $table = $('<table><thead><th></th><th></th></thead><tbody></tbody></table>'); //create a table that is not attached to document
    data = [];
    for (var i = 0; i < 100; i++) {
      data.push([i, "a", "b", "c"]);
    }
  });

  afterEach(function () {
    if (debug) {
      $table.appendTo('body');
    }
  });

  it("should call `onCurrentChange` callback", function () {
    var clicked = false;
    var wt = new Walkontable({
      table: $table[0],
      data: data,
      offsetRow: 10,
      offsetColumn: 2,
      displayRows: 10,
      displayColumns: 2,
      onCurrentChange: function (coords) {
        clicked = coords;
      }
    });
    wt.draw();

    var $td = $table.find('tbody tr:first td:first');
    $td.trigger('mousedown');

    expect(clicked).toEqual([10, 2]);
  });
});