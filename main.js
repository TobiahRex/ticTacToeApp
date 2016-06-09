'use strict';


$(document).ready(init);

// Global Variables
var CLICK_COUNT = 0;
var player1img = '"assets/ttt_O.png"';
var player2img = '"assets/ttt_X.png"';
var boardStatus = {
  size      : 0,
  generated : false,
  inProgress: false,
  answers   : {
    vertical   : [],
    horizontal : [],
    diagonal   : []
  },
  player1   : {
    moves     : [],
    possible  : [],
  },
  player2   : {
    moves     : [],
    possible  : []
  }
};

// Init listener
function init(){
  $('.square').on('click', newMove);
  $('.new-game-btn').on('click', newGame);
};

function newGame(){
  // Generate Board
  boardStatus.size = $('input').val();
  boardStatus.answers.vertical = [];
  boardStatus.answers.horizontal = [];
  boardStatus.answers.diagonal = [];
  boardStatus.player1.moves = [];
  boardStatus.player2.moves = [];
  boardStatus.player1.possible = [];
  boardStatus.player2.possible = [];
  boardStatus.inProgress = true;

  // colorize Each player
  $('div.player-1').css('color', 'blue');
  $('div.player-2').css('color', 'black');
  // reInitialize Board
  $('.square').css('background-image', '');
  // reInitialize CLICK_COUNT
  CLICK_COUNT = 0;

  if(!boardStatus.generate) boardGenerator(boardStatus);
}

function newMove(e){
  if(!boardStatus.inProgress) return alert('Please choose "New Game"');
  CLICK_COUNT++;

  // insert background image based on players move.
  // change player.
  // check for win.

  if(CLICK_COUNT % 2 !== 0){
    $(this).css('background-image', `url(${player1img})`);
    $(this).addClass('p1-move');
    $('div.player-1').css('color', 'black');
    $('div.player-2').css('color', 'red');
    boardStatus.player1.moves.splice(($(this).attr('id')-1), 1, $(this).attr('id'));
    outcome(boardStatus, $(this).attr('id'), boardStatus.player1, 1);
  } else {
    $(this).css('background-image', `url(${player2img})`);
    $(this).addClass('p2-move')
    $('div.player-2').css('color', 'black');
    $('div.player-1').css('color', 'blue');
    boardStatus.player2.moves.splice(($(this).attr('id')-1), 1, $(this).attr('id'));
    outcome(boardStatus, $(this).attr('id'), boardStatus.player2, 2);
  }
}

function outcome(boardStatus, $this, playerObj, playerId){
  let thisMove = $this;
  console.log('index: ', $this);

  // run $(this).attr('id') through a switchblock.  Depending whether or not it's diagonal or edge,
  // you'll know what pops there are.

  // Remove possible Answers

  if(playerId === 1){
    boardStatus.player2.possible.forEach(group => {
      let match = group.indexOf(parseInt($this));
      if(match > -1) console.log('P2 del: ', JSON.stringify(boardStatus.player2.possible.splice((match), 1)));
    });

  } else {
    boardStatus.player1.possible.forEach(group => {
    let match = group.indexOf(parseInt($this));
    if(match > -1) console.log('P1 del: ', JSON.stringify(boardStatus.player1.possible.splice((match), 1)));
    });
  };


  // Push in possible Answers
  switch(parseInt($this)) {
    case 0 : playerObj.possible.push(boardStatus.answers.vertical[0], boardStatus.answers.horizontal[0], boardStatus.answers.diagonal[0]); break;
    case 1 : playerObj.possible.push(boardStatus.answers.vertical[1], boardStatus.answers.horizontal[0]); break;
    case 2 : playerObj.possible.push(boardStatus.answers.vertical[2], boardStatus.answers.horizontal[0], boardStatus.answers.diagonal[1]); break;
    case 3 : playerObj.possible.push(boardStatus.answers.vertical[0], boardStatus.answers.horizontal[1]); break;
    case 4 : playerObj.possible.push(boardStatus.answers.vertical[1], boardStatus.answers.horizontal[1], boardStatus.answers.diagonal[0], boardStatus.answers.diagonal[1]); break;
    case 5 : playerObj.possible.push(boardStatus.answers.vertical[2], boardStatus.answers.horizontal[1]); break;
    case 6 : playerObj.possible.push(boardStatus.answers.vertical[0], boardStatus.answers.horizontal[2], boardStatus.answers.diagonal[1]); break;
    case 7 : playerObj.possible.push(boardStatus.answers.vertical[1], boardStatus.answers.horizontal[2]); break;
    case 8 : playerObj.possible.push(boardStatus.answers.vertical[2], boardStatus.answers.horizontal[2], boardStatus.answers.diagonal[0]); break;
  }




  console.log('O mvs: ',JSON.stringify(boardStatus.player1.possible));
  console.log('X mvs: ',JSON.stringify(boardStatus.player2.possible));

  // Remove impossible answers;
}

function boardGenerator(boardStatus){
  console.log('generating board');
  var n = parseInt(boardStatus.size);

  //Vertical Answers
  for(let j = 0 ; j < n ; j++){
    boardStatus.answers.vertical.push([]);
    for(let i = 0 ; i < n ; i++){
      boardStatus.answers.vertical[j][i]  = ((i*n)+j);
    }
  }

  //Horizontal boardStatus.answers
  for(let j = 0 ; j < n ; j++){
    boardStatus.answers.horizontal.push([]);
    for(let i = 0 ; i < n ; i++){
      boardStatus.answers.horizontal[j][i] = ((j*n)+i);
    };
  };

  //Diagonal boardStatus.answers
  for(let j = 0 ; j < 2 ; j++){
    boardStatus.answers.diagonal.push([]);
    for(let i = 0 ; i < n ; i++){
      if(j === 0){
        boardStatus.answers.diagonal[j][i] = ((n*i)+i);
      } else if(j === 1){
        boardStatus.answers.diagonal[j][0] = n - 1;
        boardStatus.answers.diagonal[j][i] = (boardStatus.answers.diagonal[j][0] * (i+1));
      };
    };
  };

  boardStatus.generated = true;
  return boardStatus.answers;
};
