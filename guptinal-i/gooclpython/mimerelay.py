import webapp2
import urllib2
# mimerelay.py 9-26-2015 JChoy relay text data with specified mimetype, store locally instead of using urllib2

class MimeRelay_DoesntWork(webapp2.RequestHandler):
    def get(self):
        url = 'http://rip.okdaily.com/mad/textStore.php?f=text&i=2236'
        data = urllib2.open( url )
        self.response.write(data)
            
class MimeText(webapp2.RequestHandler):
    def get(self):
        ct = 'image/svg+xml'
        if self.request.get('type')=='svg':
            ct = 'image/svg+xml'
        if self.request.get('type')=='manifest':
            ct = 'text/cache-manifest'
        self.response.headers['Content-Type'] = ct

        fn= 'ts/mt101.txt'
        if self.request.get('i') in ['2','3','4','5','6','7','8','9']:
            fn= 'ts/mt/mt10%s.txt' % self.request.get('i')
        with open (fn,'r') as fileInput:
            self.response.write(fileInput.read())

class MimeTextSave(webapp2.RequestHandler):
    def get(self):
        fn= 'ts/mt101.txt'
        if self.request.get('i') in ['2','3','4','5','6','7','8','9']:
            fn= 'ts/mt/mt10%s.txt' % self.request.get('i')
        with open (fn,'w') as fileOutput:
            fileOutput.write( "%s\n" % (self.request.get('data')) )
        self.response.write('ok')
