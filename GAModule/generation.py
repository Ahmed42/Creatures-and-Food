def initialize_toolbox():
    creator.create("FitnessMax", base.Fitness, weights=(1.0,))
    creator.create("Individual", list, fitness=creator.FitnessMax)
    
    # number of an individual attributes
    # number of points (= number of moves * 2)
    IND_SIZE=30
    toolbox = base.Toolbox()
    toolbox.register("attribute", random.random)
    toolbox.register("individual", tools.initRepeat, creator.Individual, toolbox.attribute, n=IND_SIZE)
    toolbox.register("population", tools.initRepeat, list, toolbox.individual)
    
    def evaluate(individual):
        return sum(individual),
        
    toolbox.register("evaluate", evaluate)
    toolbox.register("select", tools.selRoulette)
    toolbox.register("crossover", tools.cxTwoPoint)
    toolbox.register("mutate", tools.mutGaussian, mu=0, sigma=1, indpb=0.1)

    # Total population size
    POP_SIZE = 10
    
    # Number of parents to be selected
    PARENS_NUM = int(POP_SIZE/2)
    
    # Number of clones per parent
    CHILD_PER_PAREN = int(POP_SIZE/PARENS_NUM)
    
    # Number of generations
    GENS_NUM = 50

def get_initial_population():
    pop = toolbox.population(n=POP_SIZE)
    return pop

def get_population_offsprings(pop, scores):
    # 2. evaluate
    for individual, fitness in zip(pop, scores):
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
    return mutants

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
    return mutants