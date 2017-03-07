var svg_width = 500;
var svg_height = 500;

var artist = new Artist(svg_width, svg_height, 0, 10, 0, 10);

var new_world = new World(artist);

var c1 = new_world.spawn_creature("c1", 3, 3);
var c2 = new_world.spawn_creature("c2", 5, 5);

var f1 = new_world.grow_food("f1", 2, 3);
var f2 = new_world.grow_food("f2", 6, 3);
var f3 = new_world.grow_food("f3", 2, 2);
var f4 = new_world.grow_food("f4", 9, 7);
var f5 = new_world.grow_food("f5", 4, 9);


c1.move(4,4);
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