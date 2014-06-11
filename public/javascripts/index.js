$('#createNew').click(function(event){
    window.location.assign('/' + encodeURIComponent($('#newName').val()));
});

// when Enter is pressed, e.which === 13
$('#newName').on('keypress', function(e){
    console.info('YA');
    if (e.which === 13){
        // "this" is the <input>
        li = $(this).parents('li');
        var txt = $(this).val();
        if (txt === ""){
            return;
        }
        window.location.assign('/' + encodeURIComponent($('#newName').val()));
    }
});
