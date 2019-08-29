const url = require('url');
const request = require('request');


exports.importRecipe = (req, res, next) => {
  const myUrl = url.parse(req.body.url);
  const id = myUrl.path.match(/\/(\d+)\//)[1];
  const jsonUrl = `https://www.woolworths.com.au/apis/ui/recipes/${id}`;

  request({
    url: jsonUrl,
    json: true,
  }, (err, response, body) => {
    if (!err && response.statusCode === 200) {
      req.recipe = {
        title: body.Title.trim(),
        author: 'Woolworths',
        method: body.Instructions.split('\r\n'),
        ingredients: body.Ingredients.map(i => i.Description),
        serves: body.Servings,
        prepTime: body.PreparationDuration,
        cookTime: body.CookingDuration,
        image: body.LargeImageFilename,
      };
      next();
    } else {
      next(err);
    }
  });
};
