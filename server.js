var app = require('express')();
var bodyParser = require('body-parser');
var request = require('request');
const { Wit, log } = require('node-wit');
const templates = require('./actions/templates');


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

const client = new Wit({
  accessToken: '', // wit token
  logger: new log.Logger(log.DEBUG) // optional
});


var port = process.env.PORT || 8080;

var token = ""; // messenger token


function replyToSender({ sender, actionType, text }) {
  messageData = {
    text: text
  };

  request({
    url: 'https://graph.facebook.com/v2.6/me/messages',
    qs: { access_token: token },
    method: 'POST',
    json: {
      recipient: { id: sender },
      message: templates(actionType).listTemplate || messageData,
    }
  }, function (error, response, body) {
    if (error) {
      console.log('Error sending message: ', error);
    } else if (response.body.error) {
      console.log('Error: ', response.body.error);
    }
  });
};

let qty = 0;

const addCartQty = (count) => {
  qty += Number(count);
  return qty;
}


app.get('/webhook/', function (req, res) {
  if (req.query['hub.verify_token'] === 'cool') {
    res.send(req.query['hub.challenge']);
  }
  res.send('Error, wrong validation token');
});

app.post('/webhook/', function (req, res) {
  messaging_events = req.body.entry[0].messaging;

  for (i = 0; i < messaging_events.length; i++) {
    event = req.body.entry[0].messaging[i];
    sender = event.sender.id;
    if (event.message && event.message.text) {
      text = event.message.text;
      client.message(text, {})
        .then((data) => {
          const entity = data.entities;
          if (entity['order'] && entity['order'][0].value === 'order food') {
            replyToSender({ sender, text: "Can you tell me your location?" });
          } else if (entity['order'] && entity['order'][0].value === 'checkout') {
            replyToSender({ sender, text: `Ok, So I am placing order for ${qty} added in your cart. Check your email for order status.` })
            const orderStatus = placeOrder();
          }
          else if (entity['location']) {
            replyToSender({ sender, text: `We have an outlet serving in ${entity['location'][0].value}` });
            setTimeout(() => {
              replyToSender({ sender, text: "Cool! let's start creating your order. What would like to order?" });
            }, 200);

            setTimeout(() => {
              replyToSender({ sender, actionType: 'list' });
            }, 400);
          }
        })
        .catch(err => {
          replyToSender({ sender, text: `There is something wrong with me. Don't worry you can order online too.` });
        });
    } else if (event && event.postback) {
      const payload = JSON.parse(event.postback.payload);
      const itemsInCart = addCartQty(payload.quantity);
      replyToSender({ sender, text: `You have ${itemsInCart} in cart. Let me know whenever you want to checkout.` })
    }
  };

  res.sendStatus(200);
});

app.get('/', function (req, res) {
  res.sendStatus(200);
});

app.listen(port, function () {
  console.log('The webhook is running on port ' + port);
});

const options = {
  method: 'POST',
  uri: '', // create order url
  headers: {
    'Accept-Encoding': 'gzip, deflate',
    'Connection': 'keep-alive',
  },
  multipart:
    [{
      'content-type': 'application/json',
      body: {}
    }],
};

function callback(error, response, body) {
  if (!error && response.statusCode == 200) {
    const info = JSON.parse(body);
    return info;
  }
  console.log(error);
}

const placeOrder = () => {
  return request(options, callback);
}