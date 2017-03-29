from deap import creator, base, tools, algorithms
import random
import sys

def initialize_toolbox(individual_size, min_xy_val, max_xy_val):
    creator.create("FitnessMax", base.Fitness, weights=(1.0,))
    creator.create("Individual", list, fitness=creator.FitnessMax)
    
    # number of an individual attributes
    # number of points (= number of moves * 2)
    # MIN_VAL the min x,y and similar to MAX_VAL
    # MIN_VAL, MAX_VAL, and IND_SIZE should all be paramterized 
    
    IND_SIZE = individual_size#20
    MIN_VAL = min_xy_val#0
    MAX_VAL = max_xy_val#20
    toolbox = base.Toolbox()
    
    # fresh population
    toolbox.register("rand_attribute", random.randint, MIN_VAL, MAX_VAL)
    toolbox.register("new_individual", tools.initRepeat, creator.Individual, toolbox.rand_attribute, n=IND_SIZE)
    toolbox.register("new_population", tools.initRepeat, list, toolbox.new_individual)
    
    # selection and mutation
    toolbox.register("select", tools.selRoulette)
    toolbox.register("crossover", tools.cxTwoPoint)
    toolbox.register("mutate", tools.mutGaussian, mu=0, sigma=1, indpb=0.1)

    return (creator,toolbox)

def get_initial_population(pop_size, individual_size, min_xy_val, max_xy_val):
    creator, toolbox = initialize_toolbox(int(individual_size), int(min_xy_val), int(max_xy_val));
    pop = toolbox.new_population(n=int(pop_size))
    return pop

def get_population_offsprings(population, scores, min_xy_val, max_xy_val):
    creator, toolbox = initialize_toolbox(len(population[0]), min_xy_val, max_xy_val);
    # 2. evaluate
    POP_SIZE = len(population)
    #print("SIZE AT START: " + str(POP_SIZE), file=sys.stderr)
    pop = []
    for individual_list, fitness in zip(population, scores):
        individual = creator.Individual(individual_list)
        individual.fitness.values = (fitness,)
        pop.append(individual)

    PARENS_NUM = int(POP_SIZE/2)
    #print("NUM OF PARENS: " + str(PARENS_NUM), file=sys.stderr)
    CHILD_PER_PAREN = int(POP_SIZE/PARENS_NUM)
    #print(pop, file=sys.stderr)
    # 3. Select M best
    #print("NUM OF CHILDREN PER PAREN: " + str(CHILD_PER_PAREN), file=sys.stderr)
    parents = toolbox.select(pop, PARENS_NUM)

    # 4. Make N clones
    offsprings = []
    for cloning_cycle in range(CHILD_PER_PAREN):
        offsprings += map(toolbox.clone, parents)
    
    #print("NUM OF OFFSPRINGS: " + str(len(offsprings)), file=sys.stderr)
    #print("Debug!", file=sys.stderr)
    #print(offsprings, file=sys.stderr)
    #print(offsprings)

    # 5. Crossover
    for child1, child2 in zip(offsprings[::2], offsprings[1::2]):
        toolbox.crossover(child1, child2)
        del child1.fitness.values
        del child2.fitness.values
        
    # 6. Mutate
    for mutant in offsprings:
        toolbox.mutate(mutant)
    
    #print("SIZE IN THE END: " + str(len(offsprings)), file=sys.stderr)
    # 7. Population = mutants
    #pop[:] = offsprings
    return offsprings

'''
The Generation Cycle:
1. Initial population with size N

2. Evaluate
3. Select M best from the population
5. Make N clones. N/M clone from each one.
4. Crossover
6. Mutate
7. Population = mutants
8. Goto 2
'''
'''
def new_generation(pop):
    # 2. evaluate
    fitnesses = map(toolbox.evaluate, pop)
    for individual, fitness in zip(pop, fitnesses):
        individual.fitness.values = fitness
        
    # 3. Select M best
    parents = toolbox.select(pop, PARENS_NUM)
    
    # 4. Make N clones
    offsprings = []
    for cloning_cycle in range(CHILD_PER_PAREN):
        offsprings += map(toolbox.clone, parents)
        
    # 5. Crossover
    for child1, child2 in zip(offsprings[::2], offsprings[1::2]):
        toolbox.crossover(child1, child2)
        del child1.fitness.values
        del child2.fitness.values
        
    # 6. Mutate
    for mutant in offsprings:
        toolbox.mutate(mutant)
        
    # 7. Population = mutants
    #pop[:] = offsprings
    return offsprings
'''

#initialize_toolbox()