import webapp2
import os
# haqabob 9-8-2015 v1.113 JChoy server manifest with content-type
#         9-9-2015 v1.114 JChoy TextStore
# this works, but you need to run "sudo easy_install webapp2" in c9 terminal once.


class Haqabob(webapp2.RequestHandler):
    def get(self):
        with open ('../../html/jsto/pageoff.html','r') as fileInput:
            self.response.write(fileInput.read())

class Manifest(webapp2.RequestHandler):
    def get(self):
        self.response.headers['Content-Type'] = 'text/cache-manifest'
        with open ('../../html/jsto/generic.manifest','r') as fileInput:
            self.response.write(fileInput.read())

class TextStore(webapp2.RequestHandler):
    def get(self):
        filename = "ts/ts%s.txt" % (self.request.get('i'))
        with open (filename,'r') as fileInput:
            self.response.write(fileInput.read())
        
        
app = webapp2.WSGIApplication([
    ('/haqabob', Haqabob),
    ('/generic.manifest', Manifest),
    ('/ts', TextStore),
], debug=True)

def main():
    from paste import httpserver
    httpserver.serve(app, host=os.getenv("IP",'0.0.0.0'), port=os.getenv("PORT",8081) )

if __name__ == '__main__':
    main()
    
# this was copied from https://webapp-improved.appspot.com/tutorials/quickstart.nogae.html
