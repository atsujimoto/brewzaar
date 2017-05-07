$(document).ready(function() {

    $('#owned-btn').on('click', function() {
        $('#owned').removeClass('hide');
        $('#wanted').addClass('hide');
    });

    $('#wanted-btn').on('click', function() {
        $('#wanted').removeClass('hide');
        $('#owned').addClass('hide');
    });
});
