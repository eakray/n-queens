/*           _
   ___  ___ | |_   _____ _ __ ___
  / __|/ _ \| \ \ / / _ \ '__/ __|
  \__ \ (_) | |\ V /  __/ |  \__ \
  |___/\___/|_| \_/ \___|_|  |___/

*/

// hint: you'll need to do a full-search of all possible arrangements of pieces!
// (There are also optimizations that will allow you to skip a lot of the dead search space)
// take a look at solversSpec.js to see what the tests are expecting


window.findNRooksSolution = function(n) {
  var solutionBoard = new Board({n:n});

  var getSolutions = function(board, row) {
    for (var x = 0; x < n; x++) {
      board.togglePiece(x, row);
      // end of board
      if (row === n-1) {
        if (!(board.hasAnyRooksConflicts())) {
          return board;
        }
      } else {
        if (!(board.hasAnyRooksConflicts())) {
          // solution
          return getSolutions(board, row+1);
        }
      }
      board.togglePiece(x, row);
    }
  }

  var solution = getSolutions(solutionBoard, 0);

  return solution.rows();
};

// return the number of nxn chessboards that exist, with n rooks placed such that none of them can attack each other
window.countNRooksSolutions = function(n) {
  // start empty
  var solutionBoard = new Board({n: n});
  var solutionCount = 0;

  var getSolutions = function(board, row) {
    for (var x = 0; x < n; x++) {
      board.togglePiece(x, row);
      // end of board
      if (row === n-1) {
        if (!(board.hasAnyRowConflicts() || board.hasAnyColConflicts())) {
          solutionCount++;
        }
      } else {
        if (!(board.hasAnyRowConflicts() || board.hasAnyColConflicts())) {
          getSolutions(board, row+1);
        }
      }
      board.togglePiece(x, row);
    }
  }
  getSolutions(solutionBoard, 0);
  
  // call Solution with an empty board
  console.log('Number of solutions for ' + n + ' rooks:', solutionCount);
  return solutionCount;
};



// return a matrix (an array of arrays) representing a single nxn chessboard, with n queens placed such that none of them can attack each other
window.findNQueensSolution = function(n) {
  var solutionBoard = new Board({n: n});
  var solution;
  var found = false;

  if (n === 0) {
    return solutionBoard.rows(); 
  }

  var getSolutions = function(board, row) {
    if (!found) {
      for (var x = 0; x < n; x++) {
        if (!found) {
          board.togglePiece(x, row);
        }
        // end of board
        if (row === n-1) {
          if (!(board.hasAnyQueensConflicts())) {
            found = true;
            solution = board.rows().slice();
          }
        } else {
          if (!(board.hasAnyQueensConflicts())) {
            getSolutions(board, row+1);
          }
        }
        if (!found) {
          board.togglePiece(x, row);
        }
      }
    }
  }
  getSolutions(solutionBoard, 0);

  if (!solution) {
    var blank = new Board({n: n});
    solution = blank.rows();
  }
  console.log('n:' + n + ' soluton: ' + solution);
  return solution;
};


// return the number of nxn chessboards that exist, with n queens placed such that none of them can attack each other
window.countNQueensSolutions = function(n) {
  if ( n === 0) {
    return 1;
  }
  var solutionBoard = new Board({n: n});
  var solutionCount = 0; //fixme

  var getSolutions = function(board, row) {
    for (var x = 0; x < n; x++) {
      board.togglePiece(x, row);
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
      board.togglePiece(x, row);
    }
  }
  getSolutions(solutionBoard, 0);
  return solutionCount;
};

window.countNQueensSolutionsWithWorkers = function(n) {
  var firstWorkerStartIndex = 0;
  var firstWorkerEndIndex;
  var secondWorkerStartIndex;
  var secondWorkerEndIndex = n-1;
  if (n%2 === 1) {
    // first one gets (n-1)/2
    firstWorkerEndIndex = (n-1)/2;
    // second gets (n+1)/2
    secondWorkerStartIndex = (n+1)/2;
  } else {
    // first one gets 0-((n/2)-1)
    firstWorkerEndIndex = (n/2)-1;
    // second one gets (n/2)-(length-1)
    secondWorkerStartIndex = (n/2);
  }
  var firstWorkerBoards = [];
  var secondWorkerBoards = [];

  for ( var i = 0; i <= firstWorkerEndIndex; i++) {
    var board = new Board({n:n});
    board.togglePiece(0, i);
    firstWorkerBoards.push(board.rows());
  }
  for ( var i = secondWorkerStartIndex; i <= secondWorkerEndIndex; i++) {
    var board = new Board({n:n});
    board.togglePiece(0, i);
    secondWorkerBoards.push(board.rows());
  }  

  var firstWorker = new Worker("src/CountQueensWorker.js");
  var secondWorker = new Worker("src/CountQueensWorker.js");

  window.solutionCount = 0;
  firstWorker.onmessage = function(e) {
    console.log('count: ' + e.data);
    // debugger;
    window.solutionCount += e.data;
  }
  secondWorker.onmessage = function(e) {
    window.solutionCount += e.data;
    console.log('count: ' + e.data);
  }
  console.log('count: ' + solutionCount);

  firstWorker.postMessage(firstWorkerBoards);
  secondWorker.postMessage(secondWorkerBoards);
  // while workers are alive
  
  return window.solutionCount;
}
