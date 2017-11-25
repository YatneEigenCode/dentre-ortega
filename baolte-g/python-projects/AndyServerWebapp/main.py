# 11/25/2017 jchoy v0.161 get ip
#-*-coding:utf8;-*-
#qpy:3
#qpy:webapp:AndyServerWebapp
#qpy://localhost:8081/
"""
qpython webapp with text store
"""

import mainws
from bottle import run
from mainws import getIp, pyPath, cfg

run(host='localhost', port=cfg('port'))
