import http.server
import socketserver
import os
import sys

PORT = 5173
DIRECTORY = os.path.join(os.path.dirname(os.path.abspath(__file__)), "dist")

class SPARequestHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

    def do_GET(self):
        # Resolve requested path
        path = self.translate_path(self.path)
        if not os.path.exists(path) or os.path.isdir(path) and not os.path.exists(os.path.join(path, "index.html")):
            # Fallback to index.html for React Router SPA routes
            self.path = "/index.html"
        return super().do_GET()

if __name__ == "__main__":
    os.chdir(DIRECTORY)
    # Enable address reuse so restarts don't hit address already in use
    socketserver.TCPServer.allow_reuse_address = True
    with socketserver.TCPServer(("", PORT), SPARequestHandler) as httpd:
        print(f"CarePoint HMS frontend running at http://localhost:{PORT}")
        sys.stdout.flush()
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            httpd.shutdown()
