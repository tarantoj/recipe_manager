function deleteRecipe(id) {
  if (confirm('Are you sure you want to delete this recipe?')) {
    $.post(`/cookbook/recipe/${id}/delete`, { id }, (data, status) => {
      window.location.assign('/cookbook/recipes');
    });
  }
}
