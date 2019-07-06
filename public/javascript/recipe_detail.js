$('.delete').click(function () {
    var id = (this).attr("id");
    if (confirm("Are you sure?")) {
        console.log(id);
        // do delete; use var id to delete data
  }
});