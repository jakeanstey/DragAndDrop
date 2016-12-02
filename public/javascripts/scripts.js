/**
 * Created by JakeAnstey on 2016-12-01.
 */
$(document).ready(function() {
    $('#sortable').sortable({
        axis: 'y',
        onDrop: function($item, container, _super) {
            console.log('hle');
            updateList();
            _super($item, container);
        }
    });

    function updateList() {
        var tasks = [];
        //JQUERY LOOP OF ELEMENTS
        $(".task").each(function(index) {
            //ADD TO THE ARRAY OF TASKS BASED ON HOW THEY ARE DISPLAYED TO THE USER -- CORRECT ORDER
            console.log(index);
            //DATA('id) IS THE data-id TAG ON THE LI ELEMENT
            tasks[index] = {"id": $(this).data('id')};
        });

        //USE AJAX TO SEND A POST REQUEST TO NODE APP
        $.ajax({
            url: '/rearrange',
            type: 'POST',
            data: JSON.stringify(tasks), // STRINGIFY THE ARRAY TO JSON
            contentType: 'application/json'
        });
    }
});