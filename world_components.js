// Rewrite this such that redrawing commands come from the World, not the Creatures.
// Might be better if logic (movement and eating) is coded separately from visualization. 
// Should write code to compute the x and y components for the speed such that the creatures selects the shortest path.
// When a creature/food die, remove it from the world instead of flagging it.
class Creature {
    constructor(id, xi, yi, world) {
        //this.mother_g = mother_g;
        this.id = id;
        this.x = xi;
        this.y = yi;
        this.world = world;
        this.effective_speed = 10; // actual distance traversed in a s
        this.delay = 1; // time between each frame and another
        this.speed = (this.effective_speed * this.delay) / 1000.0; // amount increment/decremented per delay
        this.epsilon = 0.1; // precision
        this.radius = 0.15;
        this.is_alive = true;
        this.food_eaten = 0;
        //this.currentInterval = null;
        artist.draw_circle(this.id, this.x, this.y, this.radius);
    }

    move(x, y) {
        /*var move_promise = new Promise(function(resolve, reject) {
            resolve();
        });*/

        var self = this;
        return new Promise(function (resolve, reject) {

            var interval_id = setInterval(function (creature, x, y) {
                if (creature.almost_equal(creature.x, x) && creature.almost_equal(creature.y, y)) {
                    clearInterval(interval_id);
                    resolve();
                    return;
                }

                if (!creature.almost_equal(creature.x, x)) {
                    creature.x += creature.speed * (x - creature.x) / Math.abs(x - creature.x);
                }

                if (!creature.almost_equal(creature.y, y)) {
                    creature.y += creature.speed * (y - creature.y) / Math.abs(y - creature.y);
                }

                creature.world.artist.clear(creature.id);
                creature.world.artist.draw_circle(creature.id, creature.x, creature.y, creature.radius);

                /*for (var i = 0; i < creature.world.foods.length; i++) {
                    if (creature.world.foods[i].does_exist(creature.x, creature.y)) {
                        creature.eat(creature.world.foods[i]);
                    }
                }*/

                for (var food_id in creature.world.foods) {
                    if (!creature.world.foods.hasOwnProperty(food_id)) {
                        //The current property is not a direct property
                        continue;
                    }

                    if (creature.world.foods[food_id].does_exist(creature.x, creature.y)) {
                        creature.eat(creature.world.foods[food_id]);
                    }
                }

            }, self.delay, self, x, y);
        });
    }


    does_exist(x, y) {
        return this.is_alive && this.x == x && this.y == y;
    }

    eat(food) {
        food.die();
        this.food_eaten++;
    }

    advance(delta_x, delta_y) {
        this.move(this.x + delta_x, this.y + delta_y);
    }

    die() {
        this.is_alive = false;
        this.world.artist.clear(this.id);
    }

    respawn(x, y) {
        this.x = x;
        this.y = y;
        this.world.artist.draw_circle(this.id, this.x, this.y, this.radius);
        this.is_alive = true;
    }

    almost_equal(value1, value2) {
        return (Math.abs(value1 - value2) <= this.epsilon);
    }


    execute_moves(moves) {
        var m = this.move(this.x, this.y);
        var moves_index = 0;
        for (var loop_index = 0; loop_index < moves.length; loop_index++) {
            m = m.then(() => {
                var r = this.move(moves[moves_index][0], moves[moves_index][1]);
                moves_index++; // A bit hacky, but it works. 'then' execution is delayed and its context is different than that of the for loop. 
                return r;
            });
        }
        return m;
    }

    execute_actions(actions) {

    }
}

// We'll start with static food. But we might make them move later on.
class Food {
    constructor(id, xi, yi, world) {
        //this.mother_g = mother_g;
        this.id = id;
        this.x = xi;
        this.y = yi;
        this.world = world;
        //this.effective_speed = 30; // actual distance traversed in a s
        //this.delay = 1; // time between each frame and another
        //this.speed = (this.effective_speed * this.delay) / 1000.0; // amount increment/decremented per delay
        this.epsilon = 0.1; // precision
        //this.radius = 0.15;
        //this.currentInterval = null;
        this.is_alive = true;
        this.side = 0.1;
        artist.draw_square(this.id, this.x, this.y, this.side);
    }

    does_exist(x, y) {
        return this.is_alive && this.almost_equal(this.x, x) && this.almost_equal(this.y, y);
    }

    die() {
        this.is_alive = false;
        this.world.artist.clear(this.id);
    }

    almost_equal(value1, value2) {
        return (Math.abs(value1 - value2) <= this.epsilon);
    }
}

class World {
    constructor(artist) {
        this.artist = artist;
        this.creatures = {};
        this.foods = {};
    }

    spawn_creature(id, xi, yi) {
        if (this.creatures.hasOwnProperty(id)) {
            return null;
        }
        var new_creature = new Creature(id, xi, yi, this);
        this.creatures[id] = new_creature;

        return new_creature;
    }

    grow_food(id, xi, yi) {
        if (this.foods.hasOwnProperty(id)) {
            return null;
        }
        var new_food = new Food(id, xi, yi, this);
        this.foods[id] = new_food;

        return new_food;
    }

    apocalypse() {
        for (var id in this.creatures) {
            if (!this.creatures.hasOwnProperty(id)) {
                //The current property is not a direct property of p
                continue;
            }

            this.creatures[id].die();
        }
    }
}