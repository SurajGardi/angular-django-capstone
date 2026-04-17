import logging
from datetime import datetime

logger = logging.getLogger(__name__)

class RequestLoggerMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        timestamp = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        client_type = request.headers.get('X-CLIENT-TYPE', 'unknown')

        print(f'[{timestamp}] {request.method} {request.path} | Client: {client_type}')
        logger.info(f'[{timestamp}] {request.method} {request.path} | Client: {client_type}')

        response = self.get_response(request)

        response['X-POWERED-BY'] = 'CapstoneAPI'
        response['X-TIMESTAMP'] = timestamp

        return response
