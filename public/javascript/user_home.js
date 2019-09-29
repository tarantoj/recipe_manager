$(document).ready(() => {
  // Delete list
  $("[name='deleteList']").click(function deleteList() {
    const listId = $(this).data('id');
    // eslint-disable-next-line jquery/no-ajax
    $.post('/user/list/delete', { listId }, () => {
      window.location.reload();
    });
  });
  // Delete list modal
  $('#addItemModal').on('show.bs.modal', function addItemModal(event) {
    const button = $(event.relatedTarget); // Button that triggered the modal
    const listid = button.data('listid');
    const listname = button.data('listname');
    const modal = $(this);
    modal.find('.modal-body p').text(`Are you sure you want to delete the list ${listname}?`);
    modal.find('#addItemListId').val(listid);
  });

  $('#deleteListModal').on('show.bs.modal', function deleteListModal(event) {
    const button = $(event.relatedTarget); // Button that triggered the modal
    const listid = button.data('listid');
    const listname = button.data('listname');
    const modal = $(this);
    modal.find('.modal-body p').text(`Are you sure you want to delete the list ${listname}?`);
    modal.find('#deleteListId').val(listid);
  });

  // Toggle list items
  $('a.list-group-item').click(function toggleSelected() {
    $(this).toggleClass('list-group-item-success');
  });

  // Remove list items
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

    // eslint-disable-next-line jquery/no-ajax
    $.post('/user/list/remove', { toRemove, listId }, (_data, status) => {
      if (status === 'success') window.location.href = '/user';
    });
  });

  // Search users to share with
  $('#searchUserButton').click(() => {
    const name = $('#searchUsers').val();

    function fillSearchResults(data, status) {
      const searchResultsDiv = $('#search-results');
      if (status === 'success') {
        searchResultsDiv.html(data);
        $("[name='shareListButton']").click(function shareListButton() {
          const listId = $('#search-results').data('listid');
          const userId = $(this).data('userid');
          // eslint-disable-next-line jquery/no-ajax
          $.post('/user/list/share', { listId, userId }, (_data, postStatus) => {
            if (postStatus === 'success') {
              window.location.href = '/user';
            }
          });
        });
      }
    }
    // eslint-disable-next-line jquery/no-ajax
    $.get('/user/search', { name }, fillSearchResults, 'html');
  });

  // Add listid to share button
  $('#shareListModal').on('show.bs.modal', function shareListModal(event) {
    const button = $(event.relatedTarget); // Button that triggered the modal
    const listid = button.data('listid');
    const modal = $(this);
    modal.find('#search-results').data({ listid });
  });
});
