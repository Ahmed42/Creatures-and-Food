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
var GEN_NUM = 30;

// Get fresh population
$.ajax({
    type: "GET",
    url: "http://127.0.0.1:5000/getInitialPopulation",
    success: function (population) {
        var new_world = generate_new_world(10);
        var scores_promise = execute_lifecycle(population, new_world, 0);
        var g_index = 0;

        for (var gen_index = 1; gen_index < GEN_NUM; gen_index++) {
            // For each generation, get new offsprings
            scores_promise = scores_promise.then((pops_scores) => $.ajax({
                type: "POST",
                url: "http://127.0.0.1:5000/getPopulationOffsprings",
                data: JSON.stringify({ "population": pops_scores[0], "scores": pops_scores[1] }),
                contentType: "application/json; charset=utf-8",
                dataType: "json",
            }))
            .then(function (new_pop) {
                g_index++;
                return execute_lifecycle(new_pop, new_world, g_index);
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
    for (var i = 0; i < food_amount; i++) {
        var xi = getRandomIntInclusive(0, 10);
        var yi = getRandomIntInclusive(0, 10);
        new_world.grow_food("food" + i, xi, yi);
    }

    return new_world;
}


// population is a 1D array
function execute_lifecycle(population, new_world, generation_index) {
    // prepare the world
    new_world.apocalypse();
    new_world.regrow_all_food();

    // prepare scores table
    var table = d3.select(".scores")
        .append("table")

    var thead = table.append("thead")
    var first_tr = thead.append("tr")
    var second_tr = thead.append("tr")

    first_tr.append("th").html("Gen " + generation_index);
    second_tr.append("th").html("Name")
    second_tr.append("th").html("Score")
    
    var tbody = table.append("tbody")
        .attr("class", generation_index)
        .attr("colspan", 2);
    
    creatures = [];
    grouped_population = [];
    for (var i = 0; i < population.length; i++) {
        grouped_population.push(group_points(population[i]));
        var creature_name = "g" + generation_index + "i" + i;
        creatures.push(new_world.spawn_creature(creature_name, grouped_population[i][0][0], grouped_population[i][0][1]));
        
        // add name and score cells
        var tr = tbody.append("tr");
        tr.append("td").html(creature_name);
        tr.append("td").attr("class", creature_name)
    }

    promises = [];
    for (var i = 0; i < creatures.length; i++) {
        promises.push(creatures[i].execute_moves(grouped_population[i]));
    }

    var scores = [];
    return Promise.all(promises).then(() => {
        for (var i = 0; i < creatures.length; i++) {
            scores.push(creatures[i].food_eaten);
        }
        return Promise.resolve([population, scores]);
    });
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