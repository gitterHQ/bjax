# bjax

bjax is a tiny universal HTTP client for node and the browser. It's interface is
inspired by `window.fetch` but the

## Why not just use `window.fetch`?

`bjax` uses Bluebird promises and will handle cancellation. Currently `window.fetch` does not support cancellation.


## Usage

### Installation

```shell
npm i bjax --save
```

### Basic Example

```js
var bjax = require('bjax');

bjax('https://api.github.com/repos/gitterHQ/bjax')
  .then(function(response) {
    console.log(response.name); // --> 'bjax'
    console.log(response.owner.login); // --> 'gitterHQ'
  })
  .catch(bjax.NetworkFailureError, function(err) {
    // The network request failed
  })
  .catch(bjax.HttpError, function(error) {
    console.log(error.status); // 401
    console.log(error.statusText); // 'Not Found'
    console.log(error.method); // 'GET'
    console.log(error.url); // 'https://api.github.com/repos/gitterHQ/bjax'
    console.log(error.response);
  });
```

### Example with Options

```js
var bjax = require('bjax');

bjax('https://api.github.com/repos/gitterHQ/bjax', {
    method: 'POST',      // POST, PUT, GET, DELETE supported
    body: { hello: 1 }   // String or object
    headers: {           // Hash of headers to send
      'X-Access-Token': 'secretvalue'
    },
    responseType: 'json' // Supports json and text
  })
  .then(function(response) {
    console.log(response.name); // --> 'bjax'
    console.log(response.owner.login); // --> 'gitterHQ'
  })
  .catch(bjax.NetworkFailureError, function(err) {
    // The network request failed
  })
  .catch(bjax.HttpError, function(error) {
    console.log(error.status); // 401
    console.log(error.statusText); // 'Not Found'
    console.log(error.method); // 'GET'
    console.log(error.url); // 'https://api.github.com/repos/gitterHQ/bjax'
    console.log(error.response);
  });
```
