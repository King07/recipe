var connection = require('../inc/connection');
var squel = require("squel");

function Recipe() {
    //noinspection JSUnresolvedFunction
    var initQuery = squel.select({ separator: "\n" })
        .field("recipe.id","recipe_id")
        .field("recipe.name","recipe_name")
        .field("recipe.image","recipe_image")
        .field("GROUP_CONCAT(DISTINCT ingredient.name ORDER BY ingredient.id ASC SEPARATOR ':::')","ingredients")
        .field("GROUP_CONCAT(DISTINCT direction.name ORDER BY direction.id ASC SEPARATOR ':::')","directions")
        .from("recipe")
        .left_join("ingredient", null, "ingredient.recipe_id = recipe.id")
        .left_join("direction", null, "direction.recipe_id = recipe.id");

    this.getAll = function(res) {
        connection.acquire(function(err, con) {
            con.query('select * from recipe', function(err, result) {
                con.release();
                res.send(result);
            });
        });
    };

    function formatResult(result) {
        for (var i = 0, len = result.length; i < len; i++) {
            result[i]["ingredients"] = result[i]["ingredients"].split(":::");
            result[i]["directions"] = result[i]["directions"].split(":::");
        }
    }

    this.getUserAll = function(id,res) {
        connection.acquire(function(err, con) {
            initQuery.where("recipe.id NOT IN ?",squel.select().field('recipe_id').from('user_action').where('user_id = ?',id))
                     .group("recipe.id");
            console.log(initQuery.toString());
            con.query(initQuery.toString(), function(err, result) {
                con.release();
                formatResult(result);
                res.send(result);
            });
        });
    };

    this.getUserAllLikesActicon = function(id,res) {
        connection.acquire(function(err, con) {
            initQuery.where("recipe.id IN ?",squel.select().field('recipe_id').from('user_action')
                .where('user_id = ?',id).where('is_like = 1'))
                .group("recipe.id");
            con.query(initQuery.toString(), function(err, result) {
                con.release();
                formatResult(result);
                res.send(result);
            });
        });
    };

    this.getUserById = function(id,res) {
        connection.acquire(function(err, con) {
            con.query(squel.select().from('user').where('id = ?',id).toString(), function(err, result) {
                con.release();
                res.send(result);
            });
        });
    };
    this.getUserByEmail = function(email,res) {
        connection.acquire(function(err, con) {
            con.query(squel.select().from('user').where('email = ?',email).toString(), function(err, result) {
                con.release();
                res.send(result);
            });
        });
    };

    this.createUser = function(user, res) {
        connection.acquire(function(err, con) {
            con.query('insert into user set ?', user, function(err, result) {
                con.release();
                if (err) {
                    res.send({status: 1, message: 'USER creation failed'});
                } else {
                    res.send({status: 0, message: 'USER created successfully'});
                }
            });
        });
    };

    this.updateUser = function(user, res) {
        connection.acquire(function(err, con) {
            con.query('update user set ? where id = ?', [user, user.id], function(err, result) {
                con.release();
                if (err) {
                    res.send({status: 1, message: 'USER update failed'});
                } else {
                    res.send({status: 0, message: 'USER updated successfully'});
                }
            });
        });
    };
    this.deleteAction = function(id, res) {
        connection.acquire(function(err, con) {
            con.query('delete from user_action where id = ?', [id], function(err, result) {
                con.release();
                if (err) {
                    res.send({status: 1, message: 'Failed to delete'});
                } else {
                    res.send({status: 0, message: 'Deleted successfully'});
                }
            });
        });
    };

   /* this.delete = function(id, res) {
        connection.acquire(function(err, con) {
            con.query('delete from todo_list where id = ?', [id], function(err, result) {
                con.release();
                if (err) {
                    res.send({status: 1, message: 'Failed to delete'});
                } else {
                    res.send({status: 0, message: 'Deleted successfully'});
                }
            });
        });
    };*/
}

module.exports = new Recipe();
