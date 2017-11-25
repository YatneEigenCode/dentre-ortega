# 11/24/2017 jchoy soPath, setDbPath
import shelve
from bottle import route

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