from urllib2 import urlopen, Request
from json import dumps

class Client (object):
    api_url = "http://api.carriots.com/streams"

    def __init__(self, api_key=None, client_type='json'):
        self.client_type = client_type
        self.api_key = api_key
        self.content_type = "application/vnd.carriots.api.v2+%s" % self.client_type
        self.headers = {'User-Agent': 'python-client-Carriots',
                        'Content-Type': self.content_type,
                        'Accept': self.content_type,
                        'Carriots.apikey': self.api_key}
        self.data = None
        self.response = None

    def send(self, data):
        self.data = dumps(data)
        request = Request(Client.api_url, self.data, self.headers)
        self.response = urlopen(request)
        return self.response

def main():
    device = ""  # Replace with the id_developer of your device
    apikey = ""  # Replace with your Carriots apikey

    client_carriots = Client(apikey)
    data = {"protocol": "v2", "device": device, "at": "now", "data": {"KeyTest":"ValueTest"}}
    carriots_response = client_carriots.send(data)
    print carriots_response.read()


if __name__ == '__main__':
    main()
