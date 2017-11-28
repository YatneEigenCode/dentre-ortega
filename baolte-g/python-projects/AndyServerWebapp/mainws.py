# 11/27/2017 jchoy v0.645 http://ip
#-*-coding:utf8;-*-
#qpy:3
"""
qpython webapp with text store
"""
from bottle import run, route, template, static_file
import textstore
import socket

cfgData = {'port':8081, 'path':'/sdcard/devand/scriptOx/pyox1/'}

def cfg(k):
    return cfgData[k]

def pyPath(s):
    return cfg('path')+s

def getIp():
    s= socket.socket( socket.AF_INET, socket.SOCK_DGRAM);
    s.connect(('google.com',0))
    return s.getsockname()[0]

def bigFont(s,sz):
    return "<font size=%d>%s</font>" % (sz,s)

@route('/a')
def about():
    return "py Andy svr v0.642"+"<br><a href=/ip>show IP</a>"

@route('/ip')
def aboutip():
    rs= "http://%s:%s" % (getIp(),cfg('port'))
    return bigFont(rs, 36)

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
#run(host=getIp(), port=cfg('port'))
#run(host='localhost', port=cfg('port'))
