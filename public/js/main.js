$(document).ready(function() {

    $('select').material_select();

    $('#owned-btn').on('click', function() {
        $('#owned-btn').addClass('active');
        $('#wanted-btn').removeClass('active');
        $('#owned').removeClass('hide');
        $('#wanted').addClass('hide');
    });

    $('#wanted-btn').on('click', function() {
        $('#wanted-btn').addClass('active');
        $('#owned-btn').removeClass('active');
        $('#wanted').removeClass('hide');
        $('#owned').addClass('hide');
    });

    function locationPathname() {
        var path = window.location.pathname.split('/');
        var index = path.length - 1;

        if (path[index] === 'home') {
            $('#container').removeClass('container');
        } else {
            $('#container').addClass('container');
        }
    }

    locationPathname();
});
