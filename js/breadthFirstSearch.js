
var getMax = function(arrayC)
{
  var MAX = arrayC[0];
  for(var i = 0; i<arrayC.length;i++)
  {
    if(arrayC[i]>MAX)
      MAX = arrayC[i];
  }
  return MAX;
}
var getMin = function(arrayC)
{
  var MIN = arrayC[0];
  for(var i = 0; i<arrayC.length;i++)
  {
    if(arrayC[i]<MIN)
      MIN = arrayC[i];
  }
  return MIN;
}

var breadthFirstSearch = function(game, depth, isMaximizingPlayer)
  {
    //boardPosition = game.fen() which returns a new board  
    var possibleMoves = game.moves();
    var boardValues = [[0, 0, 0, 0, 0, 0, 0, 0], 
      [0, 0, 0, 0, 0, 0, 0, 0], 
      [0, 0, 0, 0, 0, 0, 0, 0], 
      [0, 0, 0, 0, 0, 0, 0, 0], 
      [0, 0, 0, 0, 0, 0, 0, 0], 
      [0, 0, 0, 0, 0, 0, 0, 0], 
      [0, 0, 0, 0, 0, 0, 0, 0], 
      [0, 0, 0, 0, 0, 0, 0, 0]];
    var totalEvaluation, valueMoves, bestValue;
    var nextMoves= []
    var finalMoves = [];
    //this will be an array of moves converted to values; i.e.
    //from this: ["Kg6","Rh5","Rh4","Rh3","Be1"]
    //to this: ["10","0","50","90","-10"]

    //Goal: find the max value for a given move in the array from it's child state spaces; 
    //When completed, return the best move

    for(i = 0; i < possibleMoves.length; i++)
    {
      game.move(possibleMoves[i]);
      nextMoves[i] = game;
      game.undo();
    }
    var k = 0;
    for(i = 0; i < nextMoves.length; i++)
    {
      var nextMoves2 = nextMoves[i].moves();
      for(var j = 0; j < nextMoves2.length; j++)
      {
        nextMoves[i].move(nextMoves2[j]);
        finalMoves[k] = nextMoves[i];
        nextMoves[i].undo();
        k++;
      }
    }
    console.log("finalmoves: ", finalMoves);
    var bestMove = [-9999, -1];
    var bestMovesArray = [];
    k = 0;
    for(i = 0; i < finalMoves.length; i++)
    {
      totalEvaluation = evaluateBoard(finalMoves[k].board(), boardValues);
      valueMoves = evaluateMoves(finalMoves[k], boardValues);
      console.log("boardvalues",boardValues);
      bestMovesArray.push(getMax(valueMoves));
      k++;
    }
    console.log("valueMoves", valueMoves);

    for(var i = 0; i < possibleMoves.length; i++)
    {
      if(bestMovesArray[i][0] > bestMove[0])
      {
        bestMove[0] = bestMovesArray[i][0];
        bestMove[1] = i;
      }
    }
    return bestMove;
    

    //Goal: find the max value for a given move in the array from it's child state spaces; 
    //When completed, return the best move
    if(isMaximizingPlayer == true)
    {
        if(depth <= 0)
      {
        //a blank board; will be filled in with values in evaluateBoard then used
        //to fill in values for valueMoves using evaluateMoves
        totalEvaluation = evaluateBoard(game.board(), boardValues);
        valueMoves = evaluateMoves(game, boardValues);
        bestValue = getMin(valueMoves);
        // console.log(boardValues, valueMoves);
        // console.log("Fringe best value for white: ", bestValue)
        return [bestValue, 0];
      }
      var bestMove = [-9999, -1];
      var bestMovesArray = [];
      for(var i = 0; i < possibleMoves.length; i++)
      {
          //Iterate to the next move
          game.move(possibleMoves[i]);
          //Search node i in possiblemoves
          valueMoves = evaluateMoves(game, boardValues);
          bestValue = getMax(valueMoves);
          bestMovesArray.push([bestValue, 0]);
          //undo the move to maintain the board state and move onto the next move
          game.undo();
      }
      bestMovesArray.push(breadthFirstSearch(game, depth - 1, false));
      console.log("best max moves array: ", bestMovesArray);
      for(var i = 0; i < possibleMoves.length; i++)
      {
        if(bestMovesArray[i][0] > bestMove[0])
        {
          bestMove[0] = bestMovesArray[i][0];
          bestMove[1] = i;
        }
      }
        console.log("best max move: ", bestMove);
        //console.log("Best maximized move depth ", depth, ": ", bestMove);
        return bestMove;
    }
    //trying to minimize this value
    else if(isMaximizingPlayer == false)
    {
      if(depth <= 0)
      {
        //use total evaluation as the end then add evaluateMoves in during the list to determine max point value
        //rn evaluatemoves does not take the future move and therefore returns nothing for depth 1
        totalEvaluation = evaluateBoard(game.board(), boardValues);
        valueMoves = evaluateMoves(game, boardValues);
        bestValue = getMax(valueMoves);
        // console.log(boardValues, valueMoves);
        // console.log("Fringe best value for black: ", bestValue)
        return [bestValue, 0];
      }

      var bestMove = [-9999, -1];
      var bestMovesArray = [];
      for(var i = 0; i < possibleMoves.length; i++)
      {
          //Iterate to the next move
          game.move(possibleMoves[i]);
          valueMoves = evaluateMoves(game, boardValues);
          bestValue = getMax(valueMoves);
          bestMovesArray.push([bestValue, 0]);
          console.log("possible moves: ", possibleMoves);
          game.undo();
      }
      for(var i = 0; i < possibleMoves.length; i++)
      {
        game.move(possibleMoves[i]);
        bestMovesArray.push(breadthFirstSearch(game, depth - 1, true));
        game.undo();
      }
      console.log("best min moves array: ", bestMovesArray);
      for(var i = 0; i < possibleMoves.length; i++)
      {
        if(bestMovesArray[i][0] > bestMove[0])
        {
          bestMove[0] = bestMovesArray[i][0];
          bestMove[1] = i;
        }
        //console.log("best move overwritten: ", bestMove);
      }
        console.log("best min move: ", bestMove);
        return bestMove;
    }
  }


