$(document).ready(function () {
    $('.flip').flip({
        trigger: 'manual'
    });

    $('#word').on('click', function () {
        $(this).text('Información').css('color', '#ff0000');
    })

    let active = false;

    let pair = 0;

    let cartas = 12;
    let isRepeated = false;
    let first = false;
    let stop = false;

    let par = false;
    let parOne;
    let parTwo;

    let win = false;
    let position = [];

    //Funciones para armar las posiciones
    let getRandomArray = function () {
        for (i = 0; i < 12; i++) {
            random = Math.floor(Math.random() * (cartas - 0) + 1);

            for (j = 0; j < position.length; j++) {
                if (position[j] === random) {
                    isRepeated = true;
                    break;
                }
            }

            if (!isRepeated) {
                position.push(random);
            }
            else {
                isRepeated = false;
                i--;
            }
        }
    }
    let mixCardImg = function (value, id) {
        switch (value) {
            case 1:
                $('#' + id).attr('src', 'img/Icono 1.jpg');
                break;
            case 2:
                $('#' + id).attr('src', 'img/Icono 2.jpg');
                break;
            case 3:
                $('#' + id).attr('src', 'img/Icono 3.jpg');
                break;
            case 4:
                $('#' + id).attr('src', 'img/Icono 4.jpg');
                break;
            case 5:
                $('#' + id).attr('src', 'img/Icono 5.jpg');
                break;
            case 6:
                $('#' + id).attr('src', 'img/Icono 6.jpg');
                break;
        }
    }
    let savePositions = function () {
        for (i = 0; i < position.length; i++) {
            if (position[i] > 6) {
                position[i] -= 6;
            }

            $('#c' + (i + 1)).val(position[i]);
        }

        for (i = 0; i < position.length; i++) {
            mixCardImg(position[i], (i + 1));
        }
    }

    //Rutinas
    let routines = function (id, n1) {
        if (n1 === 0) {
            switch (id) {
                case 'c1':
                    $('#f1').flip(true);
                    break;
                case 'c2':
                    $('#f2').flip(true);
                    break;
                case 'c3':
                    $('#f3').flip(true);
                    break;
                case 'c4':
                    $('#f4').flip(true);
                    break;
                case 'c5':
                    $('#f5').flip(true);
                    break;
                case 'c6':
                    $('#f6').flip(true);
                    break;
                case 'c7':
                    $('#f7').flip(true);
                    break;
                case 'c8':
                    $('#f8').flip(true);
                    break;
                case 'c9':
                    $('#f9').flip(true);
                    break;
                case 'c10':
                    $('#f10').flip(true);
                    break;
                case 'c11':
                    $('#f11').flip(true);
                    break;
                case 'c12':
                    $('#f12').flip(true);
                    break;
            }
        }

        if (n1 === 1) {
            switch (id) {
                case 'c1':
                    $('#f1').flip(false);
                    break;
                case 'c2':
                    $('#f2').flip(false);
                    break;
                case 'c3':
                    $('#f3').flip(false);
                    break;
                case 'c4':
                    $('#f4').flip(false);
                    break;
                case 'c5':
                    $('#f5').flip(false);
                    break;
                case 'c6':
                    $('#f6').flip(false);
                    break;
                case 'c7':
                    $('#f7').flip(false);
                    break;
                case 'c8':
                    $('#f8').flip(false);
                    break;
                case 'c9':
                    $('#f9').flip(false);
                    break;
                case 'c10':
                    $('#f10').flip(false);
                    break;
                case 'c11':
                    $('#f11').flip(false);
                    break;
                case 'c12':
                    $('#f12').flip(false);
                    break;
            }
        }
    }

    getRandomArray();
    savePositions();

    $('.front').on('click', function () {
        active = true;


        if (par) {
            setTimeout(function () {
                stop = false;
            }, 1300)
        }

        if (win == 0 && $('#' + this.id).is('[disabled=disabled]') == false && !stop) {
            if (!par) {
                routines(this.id, 0);

                $('#' + this.id).attr('disabled', 'disabled');
                parOne = $('#' + this.id).val();
            } else {
                routines(this.id, 0);

                $('#' + this.id).attr('disabled', 'disabled');
                parTwo = $('#' + this.id).val();

                stop = true;
            }

            par = !par;

            if (parOne == parTwo) {
                first = true;

                for (i = 0; i < position.length; i++) {
                    if (position[i] == parOne) {
                        if (first) {
                            let numberOne = i + 1;

                            setTimeout(function () {
                                $('#c' + numberOne).css('background-color', 'transparent');
                                $('#c' + numberOne).css('display', 'none');
                                $('#' + numberOne).css('display', 'none');
                            }, 1250);
                        }
                        else {
                            let numberTwo = i + 1;

                            setTimeout(function () {
                                $('#c' + numberTwo).css('background-color', 'transparent');
                                $('#c' + numberTwo).css('border', 'none');
                                $('#c' + numberTwo).css('display', '0 10px');
                                $('#' + numberTwo).css('display', 'none');
                            }, 1250);
                        }
                    }
                }

                pair++;

                if (pair === 6) {
                    setTimeout(function () {
                        for (i = 0; i < position.length; i++) {
                            $('#f' + (i + 1)).css('display', 'none');
                        }

                        $('#word').css('display', 'block');
                        $('#ml2').css('display', 'block');
                        $('#ml4').css('display', 'block');

                        active = true;
                    }, 1000);
                }
            }
            else if (!par) {
                id = this.id;
                first = true;

                for (i = 0; i < position.length; i++) {
                    if (position[i] == parOne) {
                        if (first) {
                            let numberOne = i + 1;

                            setTimeout(function () {
                                routines('c' + numberOne, 1);
                            }, 1000);

                            first = false;
                        }
                        else {
                            let numberTwo = i + 1;

                            setTimeout(function () {
                                routines('c' + numberTwo, 1);
                            }, 1000);
                        }

                        $('#c' + (i + 1)).removeAttr('disabled', 'disabled');
                    }
                }

                setTimeout(function () {
                    routines(this.id, 1);
                }, 1000);

                $('#' + id).removeAttr('disabled', 'disabled');

                parOne = 0;
                parTwo = 0;
            }
        }
    })
})

