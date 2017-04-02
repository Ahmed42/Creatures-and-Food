import flask
import GAModule.population_manager
import sys
app = flask.Flask(__name__)
app.config.from_object(__name__)

app.config.update(dict(

))
app.config.from_envvar('WEB_METHODS_SETTINGS', silent = True)

#population_manager.initialize_toolbox()


@app.route('/')
def main():
    #return flask.render_template("front/front.html");
    return flask.render_template("front/index.html")
    #return "hello";

@app.route('/getInitialPopulation/<pop_size>/<individual_size>/<min_xy_val>/<max_xy_val>', methods = ['GET'])
def getInitialPopulation(pop_size, individual_size, min_xy_val, max_xy_val):
    pop = GAModule.population_manager.get_initial_population(int(pop_size), individual_size, min_xy_val, max_xy_val)
    return flask.jsonify(pop)

@app.route('/getPopulationOffsprings', methods = ['POST'])
def getPopulationOffsprings():
    
    json = flask.request.get_json()
    #print(json, file=sys.stderr)
    population = json['population']
    scores = json['scores']
    min_xy_val = json['min_xy_val']
    max_xy_val = json['max_xy_val']

    offsprings = GAModule.population_manager.get_population_offsprings(population, scores, min_xy_val, max_xy_val)
    return flask.jsonify(offsprings)

if __name__ == "__main__":
    app.run()
