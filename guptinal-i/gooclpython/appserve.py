import webapp2
import os
from haqabob import (Haqabob, Manifest, TextStore)
from webappWform import (HelloWebapp2, AppWform)

# appserve.py 9-10-2015 v0.115 JChoy use webapp2 to serve python webapp from py imports
# this works, but you need to run "sudo easy_install webapp2" in c9 terminal once.

app = webapp2.WSGIApplication([
    ('/', HelloWebapp2),
    ('/save', AppWform),
    ('/haqabob', Haqabob),
    ('/generic.manifest', Manifest),
    ('/ts|/TS|/np', TextStore),
], debug=True)

def main():
    from paste import httpserver
    httpserver.serve(app, host=os.getenv("IP",'0.0.0.0'), port=os.getenv("PORT",8080) )

if __name__ == '__main__':
    main()
    
# this was copied from https://webapp-improved.appspot.com/tutorials/quickstart.nogae.html
