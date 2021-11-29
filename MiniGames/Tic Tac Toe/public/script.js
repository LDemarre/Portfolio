$(document).ready(function () {
    let isXTurn = true;
    let win = 0;

    let oPosition = [];
    let xPosition = [];

    let turns = 0;

    $('#reset').on('click', function () {
        for (i = 1; i < 10; i++) {
            $('i').attr('class', '');
            $('#c' + i).val('');
            $('#c' + i).css('background-color', '');
        }

        win = 0;
        turns = 0;
        oPosition = [];
        xPosition = [];
        isXTurn = true;

        $('#aTurn').val('Turn: X');
        $('#aTurn').css('display', 'block');
        $('#winner').css('display', 'none');
    })

    $('.cell').on('click', function () {
        if (win == 0 && $(this).val() == '') {
            if (isXTurn) {
                $('#' + this.id).val('X');
                $('#' + this.id + ' i').attr('class', 'fa-solid fa-x');
                $('#aTurn').val('Turn: O');
            }
            else {
                $('#' + this.id).val('O');
                $('#' + this.id + ' i').attr('class', 'fa-solid fa-o');
                $('#aTurn').val('Turn: X');
            }

            isXTurn = !isXTurn;
            turns++;

            for (i = 0; i < 9; i++) {
                if ($('#c' + (i + 1)).val() == 'X') {
                    xPosition[i] = i + 1;
                }
                else if (($('#c' + (i + 1)).val() == 'O')) {
                    oPosition[i] = i + 1;
                }
            }

            for (i = 0; i < 2; i++) {
                tempPosition = i == 0 ? xPosition : oPosition;
                winner = isXTurn ? 'O' : 'X';

                if (tempPosition[0] == 1 && tempPosition[1] == 2 && tempPosition[2] == 3) {
                    $('#c' + tempPosition[0]).css('background-color', 'greenyellow');
                    $('#c' + tempPosition[1]).css('background-color', 'greenyellow');
                    $('#c' + tempPosition[2]).css('background-color', 'greenyellow');

                    $('#winner').css('display', 'block');
                    $('#winner').val('Winner: ' + winner);
                    $('#aTurn').css('display', 'none');
                    win = 1;
                }
                else if (tempPosition[3] == 4 && tempPosition[4] == 5 && tempPosition[5] == 6) {
                    $('#c' + tempPosition[3]).css('background-color', 'greenyellow');
                    $('#c' + tempPosition[4]).css('background-color', 'greenyellow');
                    $('#c' + tempPosition[5]).css('background-color', 'greenyellow');

                    $('#winner').css('display', 'block');
                    $('#winner').val('Winner: ' + winner);
                    $('#aTurn').css('display', 'none');
                    win = 1;
                }
                else if (tempPosition[6] == 7 && tempPosition[7] == 8 && tempPosition[8] == 9) {
                    $('#c' + tempPosition[6]).css('background-color', 'greenyellow');
                    $('#c' + tempPosition[7]).css('background-color', 'greenyellow');
                    $('#c' + tempPosition[8]).css('background-color', 'greenyellow');

                    $('#winner').css('display', 'block');
                    $('#winner').val('Winner: ' + winner);
                    $('#aTurn').css('display', 'none');
                    win = 1;
                }
                else if (tempPosition[0] == 1 && tempPosition[4] == 5 && tempPosition[8] == 9) {
                    $('#c' + tempPosition[0]).css('background-color', 'greenyellow');
                    $('#c' + tempPosition[4]).css('background-color', 'greenyellow');
                    $('#c' + tempPosition[8]).css('background-color', 'greenyellow');

                    $('#winner').css('display', 'block');
                    $('#winner').val('Winner: ' + winner);
                    $('#aTurn').css('display', 'none');
                    win = 1;
                }
                else if (tempPosition[2] == 3 && tempPosition[4] == 5 && tempPosition[6] == 7) {
                    $('#c' + tempPosition[2]).css('background-color', 'greenyellow');
                    $('#c' + tempPosition[4]).css('background-color', 'greenyellow');
                    $('#c' + tempPosition[6]).css('background-color', 'greenyellow');

                    $('#winner').css('display', 'block');
                    $('#winner').val('Winner: ' + winner);
                    $('#aTurn').css('display', 'none');
                    win = 1;
                }
                else if (tempPosition[0] == 1 && tempPosition[3] == 4 && tempPosition[6] == 7) {
                    $('#c' + tempPosition[0]).css('background-color', 'greenyellow');
                    $('#c' + tempPosition[3]).css('background-color', 'greenyellow');
                    $('#c' + tempPosition[6]).css('background-color', 'greenyellow');

                    $('#winner').css('display', 'block');
                    $('#winner').val('Winner: ' + winner);
                    $('#aTurn').css('display', 'none');
                    win = 1;
                }
                else if (tempPosition[1] == 2 && tempPosition[4] == 5 && tempPosition[7] == 8) {
                    $('#c' + tempPosition[1]).css('background-color', 'greenyellow');
                    $('#c' + tempPosition[4]).css('background-color', 'greenyellow');
                    $('#c' + tempPosition[7]).css('background-color', 'greenyellow');

                    $('#winner').css('display', 'block');
                    $('#winner').val('Winner: ' + winner);
                    $('#aTurn').css('display', 'none');
                    win = 1;
                }
                else if (tempPosition[2] == 3 && tempPosition[5] == 6 && tempPosition[8] == 9) {
                    $('#c' + tempPosition[2]).css('background-color', 'greenyellow');
                    $('#c' + tempPosition[5]).css('background-color', 'greenyellow');
                    $('#c' + tempPosition[8]).css('background-color', 'greenyellow');

                    $('#winner').css('display', 'block');
                    $('#winner').val('Winner: ' + winner);
                    $('#aTurn').css('display', 'none');
                    win = 1;
                }
            }

            if (turns == 9 && win != 1) {
                win = 2;

                $('#winner').css('display', 'block');
                $('#winner').val('Draw');
                $('#aTurn').css('display', 'none');
            }
        }
    })
})

