# 11/23/2017 jchoy v0.142 setDbName
#-*-coding:utf8;-*-
#qpy:3
#qpy:webapp:AndyServerWebapp
#qpy://localhost:8081/
"""
qpython webapp with text store
"""
from bottle import run, route, template, static_file
import textstore

def pyPath(s):
    return '/sdcard/andyServer/pyws/'+s;
    
@route('/a')
def about():
    return "py Andy svr v0.142"

@route('/t/<val:path>')
def use_template(val):
    return template( 
       	pyPath('so/use.tpl'),val=val)
    	  
@route('/ws/<filepath:path>')
def server_static(filepath):
    return static_file(filepath, root=pyPath('pub'))

@route('/')
def home_static():
    return static_file('rootindex.html', root='/sdcard/andyServer/pyws/pub')

textstore.setDbName( 'dbPy' )
run(host='localhost', port=8081)
