// Common HTTP status codes with a short description — used by HttpStatusCodesPage.jsx as a
// searchable developer reference. Not exhaustive (skips rarely-used WebDAV/experimental
// codes) but covers everything a working developer encounters day to day.
const httpStatusCodes = [
  { code: 100, text: 'Continue', category: '1xx Informational', desc: 'The server has received the request headers and the client should proceed to send the request body.' },
  { code: 101, text: 'Switching Protocols', category: '1xx Informational', desc: 'The server is switching protocols as requested by the client (e.g. to WebSocket).' },
  { code: 200, text: 'OK', category: '2xx Success', desc: 'The request succeeded.' },
  { code: 201, text: 'Created', category: '2xx Success', desc: 'The request succeeded and a new resource was created.' },
  { code: 202, text: 'Accepted', category: '2xx Success', desc: 'The request was accepted for processing, but processing isn\'t complete.' },
  { code: 204, text: 'No Content', category: '2xx Success', desc: 'The request succeeded but there\'s no content to return.' },
  { code: 206, text: 'Partial Content', category: '2xx Success', desc: 'The server is delivering only part of the resource due to a range header.' },
  { code: 301, text: 'Moved Permanently', category: '3xx Redirection', desc: 'The resource has permanently moved to a new URL.' },
  { code: 302, text: 'Found', category: '3xx Redirection', desc: 'The resource temporarily resides at a different URL.' },
  { code: 304, text: 'Not Modified', category: '3xx Redirection', desc: 'The cached version of the resource is still valid.' },
  { code: 307, text: 'Temporary Redirect', category: '3xx Redirection', desc: 'Like 302, but the request method must not change.' },
  { code: 308, text: 'Permanent Redirect', category: '3xx Redirection', desc: 'Like 301, but the request method must not change.' },
  { code: 400, text: 'Bad Request', category: '4xx Client Error', desc: 'The server can\'t process the request due to a client error (malformed syntax, invalid data).' },
  { code: 401, text: 'Unauthorized', category: '4xx Client Error', desc: 'Authentication is required and has failed or not been provided.' },
  { code: 403, text: 'Forbidden', category: '4xx Client Error', desc: 'The server understood the request but refuses to authorize it.' },
  { code: 404, text: 'Not Found', category: '4xx Client Error', desc: 'The requested resource could not be found.' },
  { code: 405, text: 'Method Not Allowed', category: '4xx Client Error', desc: 'The request method isn\'t supported for this resource.' },
  { code: 408, text: 'Request Timeout', category: '4xx Client Error', desc: 'The server timed out waiting for the request.' },
  { code: 409, text: 'Conflict', category: '4xx Client Error', desc: 'The request conflicts with the current state of the resource.' },
  { code: 410, text: 'Gone', category: '4xx Client Error', desc: 'The resource is no longer available and won\'t be available again.' },
  { code: 413, text: 'Payload Too Large', category: '4xx Client Error', desc: 'The request body is larger than the server is willing to process.' },
  { code: 415, text: 'Unsupported Media Type', category: '4xx Client Error', desc: 'The request payload format isn\'t supported by the server.' },
  { code: 422, text: 'Unprocessable Entity', category: '4xx Client Error', desc: 'The request was well-formed but contains semantic errors.' },
  { code: 429, text: 'Too Many Requests', category: '4xx Client Error', desc: 'The client has sent too many requests in a given time — rate limited.' },
  { code: 500, text: 'Internal Server Error', category: '5xx Server Error', desc: 'The server encountered an unexpected condition it couldn\'t handle.' },
  { code: 501, text: 'Not Implemented', category: '5xx Server Error', desc: 'The server doesn\'t support the functionality required to fulfill the request.' },
  { code: 502, text: 'Bad Gateway', category: '5xx Server Error', desc: 'The server, acting as a gateway, got an invalid response from an upstream server.' },
  { code: 503, text: 'Service Unavailable', category: '5xx Server Error', desc: 'The server is temporarily unable to handle the request (overload or maintenance).' },
  { code: 504, text: 'Gateway Timeout', category: '5xx Server Error', desc: 'The server, acting as a gateway, didn\'t get a response in time from an upstream server.' },
]

export default httpStatusCodes
