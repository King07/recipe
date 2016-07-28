var recipe = require('./models/recipe');

module.exports = {
    configure: function(app) {
        app.get('/recipes/', function(req, res) {
            recipe.getAll(res);
            console.log("get all recipe request /recipe/");
        });
        app.get('/user/recipes/:id/', function(req, res) {
            recipe.getUserAll(req.params.id,res);
           // console.log("get recipe for a specific user request /user/recipe/ "+req.params.id);
        });
        app.get('/user/recipes/favourites/:id/', function(req, res) {
            //recipe.getUserAll(req.params.id,res);
            recipe.getUserAllLikesActicon(req.params.id,res);
           // console.log("get recipe for a specific user request /user/recipe/ "+req.params.id);
        });

        app.get('/user/email/:email', function(req, res) {
            recipe.getUserByEmail(req.params.email,res);
            console.log("get /user/email "+req.params.email);
        });

        app.get('/user/id/:id/', function(req, res) {
            recipe.getUserById(req.params.id,res);
            console.log("get /user/ id");
        });

        app.post('/user/new', function(req, res) {
            recipe.createUser(req.body,res);
            console.log("put /user/");
        });

        app.put('/user/update', function(req, res) {
            recipe.updateUser(req.body,res);
            console.log("put /user/");
        });

        app.delete('/recipes/favourite/:id/', function(req, res) {
            recipe.deleteAction(req.params.id, res);
            console.log("delete /recipe/favourite/:id/");
        });
    }
};
