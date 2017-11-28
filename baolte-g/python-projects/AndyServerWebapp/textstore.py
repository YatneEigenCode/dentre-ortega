# 11/27/2017 jchoy v0.645 import get, request
import shelve
import cgi
from bottle import get, route, request

soPath = '/sdcard/andyServer/pyws/so/'
dbName = 'dbNoname'

def setDbName(s):
    global dbName
    dbName = s

def setDbPath(s):
    global soPath
    soPath = s

def dbname():
    return soPath+dbName

@get('/ts/save/<key:path>')
def textstore_set1(key):
    fs= cgi.FieldStorage()
    db= shelve.open(dbname())
    for k in fs.keys():
      db[key]= fs[k].value
    db[key]= request.query.get('data')
    db.close()
    return 'ok'
    
@route('/ts/set/<key:path>/<val:path>')
def textstore_set2(key,val):
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