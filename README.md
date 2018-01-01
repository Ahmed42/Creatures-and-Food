# <a href="https://ga-simulation.herokuapp.com/">Creatures and Food</a>
Experimenting with evolutionary algorithms using the <a href="https://deap.readthedocs.io/en/master/">DEAP framework</a>.

We start with a number of creatures (black dots) and food (green dots). Each creature is characterized by the points it visits, and a score that increases as it eats food. After all creatures exhaust their movements, they are all killed and a new generation of offsprings is created, according the following steps:
1. Evaluate each creature by reading its eating score
3. Select M best from the population
5. Make N clones. N/M clone from each one
4. Crossover
6. Mutate
7. New population = mutants

TODO
1. Current management of entities and their events is based on JS promises, is a mess, and is buggy. <a href="https://phaser.io/">Phaser</a> seems to be a better choice for that.
