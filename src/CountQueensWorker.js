var window = self;

importScripts('../lib/mustache.js');
importScripts('../lib/underscore.js');
importScripts('../lib/backbone.js');
importScripts('board.js');
onmessage = function(e) {
  var solutionCount = 0;
  var n;
  var getSolutions = function(board, row) {
    for (var x = 0; x < n; x++) {
      board.togglePiece(row, x);
      // end of board
      if (row === n-1) {
        if (!(board.hasAnyQueensConflicts())) {
          solutionCount++;
        }
      } else {
        if (!(board.hasAnyQueensConflicts())) {
          getSolutions(board, row+1);
        }
      }
      board.togglePiece(row, x);
    }
  }

  for (var i = 0; i < e.data.length; i++) {
    var board = new Board(e.data[i]);
    n = board.get('n');
    
    // console.log('n: ' + n);
    
    // console.log(JSON.stringify(board.rows()));
    getSolutions(board, 1);

  }
  postMessage(solutionCount);
  close();
}