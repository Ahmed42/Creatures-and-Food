import flask
import population_manager
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

@app.route('/getInitialPopulation/<pop_size>', methods = ['GET'])
def getInitialPopulation(pop_size):
    pop = population_manager.get_initial_population(int(pop_size))
    return flask.jsonify(pop)

@app.route('/getPopulationOffsprings', methods = ['POST'])
def getPopulationOffsprings():
    
    json = flask.request.get_json()
    #print(json, file=sys.stderr)
    population = json['population']
    scores = json['scores']
    offsprings = population_manager.get_population_offsprings(population, scores)
    return flask.jsonify(offsprings)

if __name__ == "__main__":
    app.run()