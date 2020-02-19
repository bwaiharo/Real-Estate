from flask import Flask, jsonify, render_template
from sqlalchemy import create_engine, or_, and_
from sqlalchemy.engine import reflection
from sqlalchemy.ext.automap import automap_base
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.orm import Session
import numpy as np
import pandas as pd

from config import POSTGRES_USER,POSTGRES_PW,POSTGRES_URL,POSTGRES_DB

app = Flask(__name__)


DB_URL = 'postgresql+psycopg2://{user}:{pw}@{url}/{db}'.format(user=POSTGRES_USER,pw=POSTGRES_PW,url=POSTGRES_URL,db=POSTGRES_DB)

app.config['SQLALCHEMY_DATABASE_URI'] = DB_URL
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False # silence the deprecation warning

db = SQLAlchemy(app)



# reflect an existing database into a new model
Base = automap_base()
# reflect the tables
Base.prepare(db.engine, reflect=True)

Restate_table = Base.classes.comprehensive

engine = create_engine(DB_URL)
insp = reflection.Inspector.from_engine(engine)
print(insp.get_table_names())

@app.route("/")
def index():
    """Return the homepage."""
    return render_template("index.html")


@app.route("/columnnames")
def columnnames():
 # Use Pandas to perform the sql query
    stmt = db.session.query(Restate_table).statement
    df = pd.read_sql_query(stmt, db.session.bind)

 # Return a list of the column names (sample names)
    return jsonify(list(df.columns))

@app.route("/towncountystate")
def towncountystate():
 # Use Pandas to perform the sql query
    results = db.session.query(Restate_table.town, Restate_table.county, Restate_table.state).distinct().all()
    tcs = list()
 # Return a list of the column names (sample names)
    for town, county, state in results:
        tcs_dict = {}
        tcs_dict["town"] = town
        tcs_dict["county"] = county
        tcs_dict["state"] = state
        tcs.append(tcs_dict)

    return jsonify(tcs)
  


@app.route('/town=/<town>')
@app.route('/town=/<town>/county=/<county>')
@app.route('/town=/<town>/county=/<county>/state=/<state>')
def search_metadata(town, county=None, state=None):
    """Return the MetaData for a given search."""
    sel = [
        Restate_table.town,
        Restate_table.county,
        Restate_table.state,
        Restate_table.date,
        Restate_table.activenum,
        Restate_table.avmp,
        Restate_table.avlp,
        Restate_table.newlavlp,
        Restate_table.newlnum,
        Restate_table.newlavmp,
        Restate_table.ucnewnum,
        Restate_table.ucavlp,
        Restate_table.ucavmp,
        Restate_table.ucavdom,
        Restate_table.soldnum,
        Restate_table.soldavlp,
        Restate_table.soldavmp,
        Restate_table.soldavdom,
        Restate_table.sp_lp,
        Restate_table.sp_olp,
    ]

    results2 = db.session.query(*sel).filter(and_(Restate_table.town == town,Restate_table.county == county,Restate_table.state == state)).all()
    
    search_metadata_arr = list()
    for result in results2:
        search_metadata = dict()
        search_metadata["town"] = result[0]
        search_metadata["county"] = result[1]
        search_metadata["state"] = result[2]
        search_metadata["date"] = result[3]
        search_metadata["activenum"] = result[4]
        search_metadata["avmp"] = result[5]
        search_metadata["avlp"] = result[6]
        search_metadata["newlavlp"] = result[7]
        search_metadata["newlnum"] = result[8]
        search_metadata["newlavmp"] = result[9]
        search_metadata["ucnewnum"] = result[10]
        search_metadata["ucavlp"] = result[11]
        search_metadata["ucavmp"] = result[12]
        search_metadata["ucavdom"] = result[13]
        search_metadata["soldnum"] = result[14]
        search_metadata["soldavlp"] = result[15]
        search_metadata["soldavmp"] = result[16]
        search_metadata["soldavdom"] = result[17]
        search_metadata["sp_lp"] = result[18]
        search_metadata["sp_olp"] = result[19]
        search_metadata_arr.append(search_metadata)
    return jsonify(search_metadata_arr)

if __name__ == "__main__":
    app.run()
