$(function() {
  $('#game_info > input[type=button]').click(function(event) {
    // ADD MAX VAL FOR INPUT and error handling for non integer input
    // tigers = $('#tiger').val();
    deer = $('#deer').val();
    trees = $('#tree').val();

    game = new Game(deer, trees);
  })

  $('#score_game').submit(function(event) {
    event.preventDefault();
    $('#game_info')[0].reset();

    var url = $(this).attr("action");
    var data = $(this).serialize();
    $.post(url, data);
  })
});

