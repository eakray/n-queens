/*           _
   ___  ___ | |_   _____ _ __ ___
  / __|/ _ \| \ \ / / _ \ '__/ __|
  \__ \ (_) | |\ V /  __/ |  \__ \
  |___/\___/|_| \_/ \___|_|  |___/

*/

// hint: you'll need to do a full-search of all possible arrangements of pieces!
// (There are also optimizations that will allow you to skip a lot of the dead search space)
// take a look at solversSpec.js to see what the tests are expecting


// return a matrix (an array of arrays) representing a single nxn chessboard, with n rooks placed such that none of them can attack each other
// var solution = function(board, pieceCount){
//   var pieceCount = pieceCount || 0;
  // this.board = board;
  // this.children = [];
  // this.n = board.get('n');
  // // if there are pieces left
  //   console.log('n:' + this.n + ' p:' + pieceCount);
  // if(pieceCount < this.n){
  //   // go through every possibility for the new row
  //   for (var i=0; i < this.n; i++){
  //     var childBoard = new Board(board.rows());
  //     // add piece
  //     childBoard.togglePiece(pieceCount, i);
  //     // if its valid
  //     if( (!childBoard.hasAnyRowConflicts()) && (!childBoard.hasAnyColConflicts()) ) {
  //       var child = new solution(childBoard, pieceCount+1);
  //       this.children.push(child);
  //     } else {
  //       childBoard.togglePiece(pieceCount, i);
  //     }
  //   }
  // }
// }

// var testSolution = function() {
//   var b = new Board({n: 5});
//   var s = new solution(b);
//   _.each(s.children, function(child){
//     console.log(JSON.stringify(child.board.rows()));
//     _.each(child.children, function(child){
//       console.log(JSON.stringify(child.board.rows()));
//     });
//   });
// }


// var b = new Board({n: 5})
// var s = new solution(b)
// s.children.length // 1
// "[[1,1,1,1,1],[1,1,1,1,1],[0,0,0,0,0],[0,0,0,0,0],[0,0,0,0,0]]"
// -----------i
// 1 0 0 0 0  
// 1 1 0 0 0 
// 0 0 0 0 0
// 0 0 0 0 0

// solution.prototype.validChildren = function() {
//   // push all valid children into an array and return it
//   var valid = [];
//   var checkChildren = function(children) {
//     for (var i = 0; i < children.length; i++) {
//       if (children[i].children.length > 0) {
//         checkChildren(children[i]);
//       } else {
//         valid.push(children[i].board.rows());
//       }
//     }
//   }

//   checkChildren(this.children);
  
//   return valid;
// };



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
  var solutionCount = 0; //fixme

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
          // solution
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
  var solutionCount = 0; //fixme
  var solution;
  var found = false;

  console.log('n' + n);
  if (n === 0) {
  return solutionBoard.rows(); 
  }
  if (n === 1) {
    var board = new Board({n: 1});
    board.togglePiece(0,0);
    return board.rows();
  }
  if ( n === 2 || n === 3) {
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
            // solutions.push(board.rows().slice());
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
  return solution;
  // console.log(JSON.stringify(solutions[0]));
  // return solutions;
};


// return the number of nxn chessboards that exist, with n queens placed such that none of them can attack each other
window.countNQueensSolutions = function(n) {
  // start empty

  if ( n === 0) {
    return 1; // because tests
  }
  var solutionBoard = new Board({n: n});
  var solutionCount = 0; //fixme

  var getSolutions = function(board, row) {
    for (var x = 0; x < n; x++) {
      board.togglePiece(x, row);
      // end of board
      if (row === n-1) {
        if (!(board.hasAnyQueensConflicts())) {
  console.log(JSON.stringify(board.rows()));
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
