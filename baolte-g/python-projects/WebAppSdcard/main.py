# 1/29/2018 jchoy v0.173 all sdcard
#-*-coding:utf8;-*-
#qpy:3
"""
qpython webapp all sdcard
"""
from bottle import run, route, template, static_file
import socket

cfgData = {'port':8081, 'path':'/sdcard/'}

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
    return "py Andy svr v0.173"+"<br><a href=/ip>show IP</a>"

@route('/ip')
def aboutip():
    rs= "http://%s:%s" % (getIp(),cfg('port'))
    return bigFont(rs, 36)

@route('/ws/<filepath:path>')
def server_static(filepath):
    return static_file(filepath, root=pyPath('pub'))

@route('/')
def home_static():
    return static_file('rootindex.html', root=pyPath('pub'))

#run(host=getIp(), port=cfg('port'))
run(host='localhost', port=cfg('port'))
