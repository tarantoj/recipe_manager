$(document).ready(() => {
  // toggleSelected
  $('a.list-group-item').click(function toggleSelected() {
    $(this).toggleClass('list-group-item-success');
  });

  // Remove items
  $('button.remove-items').click(() => {
    const toRemove = $('a.list-group-item-success').map(function getId() {
      return $(this).data('id');
    }).get();

    // eslint-disable-next-line jquery/no-ajax
    $.post('/user/list/remove', { toRemove }, () => {
      window.location.reload();
    });
  });
});
