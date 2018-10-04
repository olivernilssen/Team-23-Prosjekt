

(function iniateGrid() {
    //"use strict";

    var grid = new Grid({
        rows: 25,
        cols: 25,
        render: {
            placeholder: ".grid"
        }
    });

    var player; 
    var start_X = 0;
    var start_Y = 0;
    player = grid.getCellAt(start_X, start_Y);
    player.$el.css('background', 'red');

}());

iniateGrid();