from os import *
import index
from http.server import HTTPServer, SimpleHTTPRequestHandler
import webbrowser

url = "http://localhost:8080"

index.run()
webbrowser.open(url, new=0, autoraise=True)
httpd = HTTPServer(('localhost', 8080), SimpleHTTPRequestHandler)
httpd.serve_forever()