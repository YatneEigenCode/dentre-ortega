import webapp2
import os
# webappWform.py 9-8-2015 JChoy
# this works, but you need to run "sudo easy_install webapp2" in c9 terminal once.

class HelloWebapp2(webapp2.RequestHandler):
    def get(self):
        with open ('html/inputform.html','r') as fileInput:
            self.response.write(fileInput.read())
            
#this works to read data submitted in html form
class AppWform(webapp2.RequestHandler):
    def get(self):
        with open ('ts/fileToWrite.txt','a') as fileOutput:
            fileOutput.write( "%s\n" % (self.request.get('name')) )
        print  "%s saved to fileToWrite.txt" % (self.request.get('name'))
        greeting = "Hello, %s" % (self.request.get('name'))
        self.response.write(greeting)

app = webapp2.WSGIApplication([
    ('/', HelloWebapp2),
    ('/save', AppWform),
], debug=True)

def main():
    from paste import httpserver
    httpserver.serve(app, host=os.getenv("IP",'0.0.0.0'), port=os.getenv("PORT",8080) )

if __name__ == '__main__':
    main()
    
# this was copied from https://webapp-improved.appspot.com/tutorials/quickstart.nogae.html
