var TicTacJoe = TicTacJoe || {};

var dbRef = new Firebase ('https://astoellistictactoe.firebaseio.com/');

//Function to grant ownership to a square
function addOwner (domEl,playerNum) {

  //If it's player one, add x, else give it o
  if (playerNum === 1){
    $(domEl).addClass('x');
  } else {
    $(domEl).addClass('o');
  }
}


//Function to create an alert div. Constructs appropriate div with prefix and suffix
function getAlertDiv (playerNum, turnNumber, xcoord, ycoord) {
  var ending = "<strong>Move " + turnNumber + "</strong>: " + "Player " + playerNum + " selected square at position [" + xcoord + "," + ycoord + "]" + "</div>";
  if (playerNum === 1) {
    //Green for Player 1
    var prefix = '<div class="alert alert-success">';
    return prefix + ending;
  } else if (playerNum === 2){
    //Red for Player 2
    var prefix = '<div class="alert alert-danger">'
    return  prefix + ending;
  } else if (playerNum === 0){
    //No win gets a yellow alert
    return '<div class="alert alert-warning">Neither Player Was Victorious</div>';
  }
}


//Initiate Doc Readiness

$(document).ready(function() {

//Declar a bunch of variables, starting with turn 1, player 1, and the domEl to be passed within a few functions here.
  var turnNumber = 1, playerNum = 1, domEl = $('#gameboard'), logEl = $('#log'), xcoord, ycoord;

  $('#start').click(function () {
    turnNumber = 1;
    playerNum = 1;
    game = TicTacJoe.Game;
    game.init(domEl, logEl);
    $(this).toggleClass('hidden');
    $(this).html('Play Again?');

    $('#spacer').html('Turn ' + turnNumber + '<br>Player ' + playerNum);
    $('#spacer').toggleClass('hidden');
  });



  $('#gameboard').on('click', '.square',function() {
    //Set X and Y Coordinates for the square that was clicked
    xcoord = $(this).data('x'), ycoord = $(this).data('y');

    //Verify that nothing exists on the game board at this time
    if (game.checkBoard(ycoord,xcoord)) {

      //Make a div that contains all the necessary information for the Log
      var alertContents = getAlertDiv(playerNum, turnNumber, xcoord, ycoord);
      $('#log').prepend(alertContents);
      //Dope animation
      $('.alert').fadeIn('slow');

      //Check if this is the last possible turn
      //  if not, then go ahead and test winner (I know you could wait until the
      //  5th turn, but I decided it's a low cost operation)
      if (turnNumber < 9) {
        game.setBoard(ycoord,xcoord,playerNum);

        addOwner($(this),playerNum);
        game.testWinner(playerNum);

      }
      else {

        // Otherwise, go ahead and add this piece to the board
        game.setBoard(ycoord,xcoord,playerNum);

        addOwner($(this),playerNum);

        // Then check whether that resulted in a victory.
        if (!game.testWinner(playerNum)) {
          alert('No Winner!');
          $('button:hidden').toggleClass('hidden');

          //Alert Sadness that there's no winner
          var alertContents = getAlertDiv(0,turnNumber,xcoord,ycoord);
          $('#log').prepend(alertContents);
          $('.alert').fadeIn('slow');
        }

        //Reset the hidden button to be visible!
        $('button:hidden').toggleClass('hidden');
        //Hide the Div that was saving the button's space
        $('#spacer').toggleClass('hidden');

      }
      //As long as any move was made, go ahead and iterate the turn Number
      turnNumber++;

      //Why is this here?



    //Test if turn number is even, if not, switch
    if (turnNumber%2 === 0){
      playerNum = 2;
    } else {
      playerNum = 1;
    }
    //After turn is over, update the Turn number within the Spacer Div
    $('#spacer').html('Turn ' + turnNumber + '<br>Player Number: ' + playerNum);


  } else {

    alert('Someone already played there...');
  }

});
});


