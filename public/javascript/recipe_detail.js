$(document).ready(() => {
  $('a.list-group-item').click(function toggleSelected() {
    $(this).toggleClass('list-group-item-success');
  });

  $("[name='addToList']").click(function addToList() {
    const listId = $(this).data('listid');
    const toAdd = $("[name='ingredient']")
      .filter(function isNotSelected() {
        return !$(this).hasClass('list-group-item-success');
      })
      .map(function getData() {
        return $(this).data();
      })
      .get();

    // eslint-disable-next-line jquery/no-ajax
    $.post('/user/list/add', { toAdd, listId }, (_data, status) => {
      if (status === 'success') window.location.href = '/user';
    });
  });

  $('#add').click(() => {
    const toAdd = $("[name='ingredient']")
      .filter(function isNotSelected() {
        return !$(this).hasClass('list-group-item-success');
      })
      .map(function getData() {
        return $(this).data();
      })
      .get();

    // eslint-disable-next-line jquery/no-ajax
    $.post('/user/list/add', { toAdd }, (_data, status) => {
      if (status === 'success') window.location.href = '/user';
    });
  });

  $("input[name='serves']").on('change', function modifyServes() {
    const oldServes = parseFloat($(this).attr('original'));
    const newServes = parseFloat(($(this).val()));
    const serveMultiplier = newServes / oldServes;
    const num = /^\d+(?:\.\d+)?$/;
    $("[name='ingredient']").each(function swapQuantity() {
      const i = $(this);
      if (i.data('quantity')) {
        i.text(i.text().replace(num, parseFloat((i.data('quantity')) * serveMultiplier).toString()));
      }
    });
  });
});
