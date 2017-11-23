# 11/23/2017 jchoy v0.139 pyPath
#-*-coding:utf8;-*-
#qpy:3
#qpy:webapp:Sample 
#qpy://localhost:8080/
"""
This is a sample for qpython webapp
"""
from bottle import run, route, template, static_file
import shelve

def dbname():
    return pyPath('so/dbPyandy');

def pyPath(s):
    return '/sdcard/andyServer/pyws/'+s;
    
@route('/a')
def about():
    return "py Andy svr v0.139"

@route('/t/<val:path>')
def use_template(val):
    return template( 
       	pyPath('so/use.tpl'),val=val)
    	  
@route('/ws/<filepath:path>')
def server_static(filepath):
    return static_file(filepath, root=pyPath('pub'))

@route('/ts/save/<key:path>/<val:path>')
def textstore_set(key, val):
    db= shelve.open(dbname())
    db[key]= val
    db.close()
    return 'ok'

@route('/ts/get/<key:path>')
def textstore_set(key):
    db= shelve.open(dbname())
    res = db[key]
    db.close()
    return res

@route('/')
def home_static():
    return static_file('rootindex.html', root='/sdcard/andyServer/pyws/pub')

run(host='localhost', port=8081)
