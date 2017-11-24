# 11/23/2017 jchoy textstore
import shelve
from bottle import route

def myPath(s):
    return '/sdcard/andyServer/pyws/'+s;

def dbname():
    return myPath('so/dbPyandy');

@route('/ts/save/<key:path>/<val:path>')
def textstore_set(key, val):
    db= shelve.open(dbname())
    db[key]= val
    db.close()
    return 'ok'

@route('/ts/get/<key:path>')
def textstore_get(key):
    db= shelve.open(dbname())
    res = db[key]
    db.close()
    return res