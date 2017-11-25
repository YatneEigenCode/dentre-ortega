# 11/24/2017 jchoy v0.145 cfg
#-*-coding:utf8;-*-
#qpy:3
#qpy:webapp:AndyServerWebapp
#qpy://localhost:8081/
"""
qpython webapp with text store
"""
from bottle import run, route, template, static_file
import textstore

cfgData = {'port':8081, 'path':'/sdcard/devand/scriptOx/pyox1/'}

def cfg(k):
    return cfgData[k]

def pyPath(s):
    return cfg('path')+s
    
@route('/a')
def about():
    return "py Andy svr v0.145e"

@route('/t/<val:path>')
def use_template(val):
    return template( 
       	pyPath('so/use.tpl'),val=val)
    	  
@route('/ws/<filepath:path>')
def server_static(filepath):
    return static_file(filepath, root=pyPath('pub'))

@route('/')
def home_static():
    return static_file('rootindex.html', root=pyPath('pub'))

textstore.setDbName( 'dbPy' )
textstore.setDbPath( pyPath('so/') )
run(host='localhost', port=cfg('port'))
