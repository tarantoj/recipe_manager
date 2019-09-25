function deleteRecipe(id) {
  if (confirm('Are you sure you want to delete this recipe?')) {
    $.post(`/cookbook/recipe/${id}/delete`, { id }, (data, status) => {
      window.location.assign('/cookbook/recipes');
    });
  }
}

function addRecipe(id) {
  $.post(`/cookbook/recipe/${id}/add`, { id }, (data, status) => {
    alert("Recipe saved");
  });
}
