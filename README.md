# bjax

bjax is a tiny universal HTTP client for node and the browser. It has a similar interface to `window.fetch` but is 
focused on JSON requests and responses.

## Why not just use `window.fetch`?

`bjax` uses Bluebird promises and will handle cancellation. Currently `window.fetch` does not support cancellation.


