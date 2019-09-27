$(document).ready(() => {
  $("[name='deleteList']").click(function deleteList() {
    const listId = $(this).data('id');
    $.post('/user/list/delete', { listId }, () => {
      window.location.reload();
    });
  });

  $('#deleteListModal').on('show.bs.modal', function deleteListModal(event) {
    const button = $(event.relatedTarget); // Button that triggered the modal
    const listid = button.data('listid');
    const listname = button.data('listname');
    const modal = $(this);
    modal.find('.modal-body p').text(`Are you sure you want to delete the list ${listname}?`);
    modal.find('#deleteListId').val(listid);
  });

  $('a.list-group-item').click(function toggleSelected() {
    $(this).toggleClass('list-group-item-success');
  });

  $("[name='removeItems']").click(function removeItems() {
    const listId = $(this).data('listid');
    const toRemove = $(`[name='${listId}-item']`)
      .filter(function isNotSelected() {
        return $(this).hasClass('list-group-item-success');
      })
      .map(function getData() {
        return $(this).data('id');
      })
      .get();

    $.post('/user/list/remove', { toRemove, listId }, (_data, status) => {
      if (status === 'success') window.location.href = '/user';
    });
  });
});
