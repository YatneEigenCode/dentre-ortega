# 11/25/2017 jchoy v0.161 get ip

import mainws
from bottle import run
from mainws import getIp, pyPath, cfg

run(host=getIp(), port=cfg('port'))
