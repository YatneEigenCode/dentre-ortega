import webapp2
import urllib2
import base64
# 9-29-2015 JChoy v0.123 replace spaces in MimeRelay64
# mimerelay.py 9-26-2015 JChoy relay text data with specified mimetype, store locally instead of using urllib2

class MimeRelay(webapp2.RequestHandler):
    def get(self):
        ct = 'text/plain'
        if self.request.get('type')=='svg':
            ct = 'image/svg+xml'
        if self.request.get('type')=='manifest':
            ct = 'text/cache-manifest'
        self.response.headers['Content-Type'] = ct

        url = self.request.get('url')
        if self.request.get('ts') != '':
            url= 'http://rip.okdaily.com/mad/textStore.php?f=text&i=%s' % self.request.get('ts')
        response = urllib2.urlopen( url )
        self.response.write(response.read())

class MimeRelay64(webapp2.RequestHandler):
    def get(self):
        self.response.headers['Content-Type'] = 'image/jpeg'

        url= "http://127.0.0.1:8080/mb?i=9"
        if self.request.get('ts') != '':
            url= 'http://rip.okdaily.com/mad/textStore.php?f=text&i=%s' % self.request.get('ts')
        response = urllib2.urlopen( url )
        s = response.read().replace(" ","+")
        self.response.write( base64.b64decode(s) )

class MimeText64(webapp2.RequestHandler):
    def get(self):
        ct = 'image/jpeg'
        self.response.headers['Content-Type'] = ct;

        fn= 'ts/mt101.txt'
        if self.request.get('i') in ['2','3','4','5','6','7','8','9']:
            fn= 'ts/mt/mt10%s.txt' % self.request.get('i')
        with open (fn,'r') as fileInput:
            self.response.write( base64.b64decode(fileInput.read()))
    
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
            fileOutput.write( "%s" % (self.request.get('data')) )
        self.response.write('ok')

class MimeTextSave64(webapp2.RequestHandler):
    def get(self):
        fn= 'ts/mt101.txt'
        if self.request.get('i') in ['2','3','4','5','6','7','8','9']:
            fn= 'ts/mt/mt10%s.txt' % self.request.get('i')
        with open (fn,'w') as fileOutput:
            fileOutput.write( "%s" % (self.request.get('data').replace(" ","+")) )
        self.response.write('ok')
