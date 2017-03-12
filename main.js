/*var svg_width = 500;
var svg_height = 500;

var artist = new Artist(svg_width, svg_height, 0, 10, 0, 10);

var new_world = new World(artist);

var c1 = new_world.spawn_creature("c1", 3, 3);
var c2 = new_world.spawn_creature("c2", 1, 4);
var c3 = new_world.spawn_creature("c3", 8, 9);
var c4 = new_world.spawn_creature("c4", 0, 2);

var f1 = new_world.grow_food("f1", 2, 3);
var f2 = new_world.grow_food("f2", 6, 3);
var f3 = new_world.grow_food("f3", 2, 2);
var f4 = new_world.grow_food("f4", 9, 7);
var f5 = new_world.grow_food("f5", 4, 9);
*/
var GEN_NUM = 10;


$.ajax({
    type: "GET",
    url: "localhost/getInitialPopulation",
    success: function (population) {
        var new_world = generate_new_world(10);
        var scores = execute_lifecycle(population, new_world);
        
        var new_pop = population;
        for(var i = 0; i < GEN_NUM; i++) {
            $.ajax({
                type: "GET",
                url: "localhost/getPopulationOffsprings",
                async: false, // might want to remove this and find a different way
                data: {"population" : new_pop, "scores" : scores},
                success : function (population) {
                    new_pop = population;
                    scores = execute_lifecycle(new_pop, new_world);                  
                }
            });
        }
    }
});

// Generate world with food
function generate_new_world(food_amount) {
    var svg_width = 500;
    var svg_height = 500;

    var artist = new Artist(svg_width, svg_height, 0, 10, 0, 10);
    var new_world = new World(artist);
    for(var i = 0; i < food_amount; i++) {
        var xi = getRandomIntInclusive(0, 10);
        var yi = getRandomIntInclusive(0, 10);
        new_world.grow_food("food" + i, xi, yi);
    }
}


// population is a 1D array
function execute_lifecycle(population, new_world) {
    creatures = [];
    grouped_population = [];
    for (var i = 0; i < population.length; i++) {
        grouped_population.push(group_points(population[i]));
        creatures.push(new_world.spawn_creature("c" + i, grouped_population[i][0][0], grouped_population[i][0][1]));
    }

    promises = [];
    for (var i = 0; i < creatures.length; i++) {
        promises.push(creatures[i].execute_moves(grouped_population[i]));
    }

    Promise.all(promises).then();

    scores = [];
        for(var i = 0; i < creatures.length; i++) {
            scores.push(creatures[i].food_eaten);
        }


    return scores;
}

//[1,2,3,4] => [[1,2], [3,4]]
function group_points(individual) {
    var grouped_individual = [];
    for (var i = 0; i < individual.length; i += 2) {
        grouped_individual.push([individual[i], individual[i + 1]]);
    }
    return grouped_individual;
}

// [[1,2], [3,4]] => [1,2,3,4]
function flatten_points(points) {
    var flatten_individual = [].concat.apply([], points);
    return flatten_individual;
}

function getRandomIntInclusive(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
//m = c1.execute_moves([[2,3], [6,3], [2,2]]);

//m.then(() => new_world.apocalypse());

//moves = [[1,2], [3,4], [5,5], [10,0], [0,10]];
//moves2 = [[0,1], [1,0], [2,0], [0,2]];
//moves2 = [[1,2], [3,4], [5,5], [10,0], [0,10]];

//c1.execute_moves(moves);
//c2.execute_moves(moves);
/*
var a = () => execute_moves(moves);

[
    {
        'action' : 'moves',
        'params' : {
            'points' : [[1,2], [3,4]]
        }
    },

    {
        'action' : 'die',
        'params' : {}
    }
]
*/



/*send_moves(c1, moves);

send_moves(c2, moves2);

c1.die();*/
/*
function send_moves(creature, moves) {
    var m = creature.move(creature.x, creature.y);
    var i = 0;
    for (var n = 0; n < moves.length; n++) {
        m = m.then(() => {
            r = creature.move(moves[i][0], moves[i][1]);
            i++; // A bit hacky, but it works. 'then' execution is delayed and its context is different than that of the for loop. 
            return r;
        });
    }
}
*/