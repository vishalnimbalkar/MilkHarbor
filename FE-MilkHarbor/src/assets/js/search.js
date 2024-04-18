function row_filter1(cls, id) {
    $(document).ready(function () {
        $("#" + id).on("keyup", function () {
            var value = $(this).val().toLowerCase();
            $("." + cls + " .row_data1").filter(function () {
                $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
            });
        });
    });
}