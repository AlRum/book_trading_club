var request = require('request');

/*request.post({url:'https://api.yelp.com/oauth2/token', form: {grant_type:'client_credentials', 
client_id:'cIrme2NJcTTduqvDk7QHvA',client_secret:'b8rem0aLjO9Vy5n9KJVdXOeb5zEgSQcRaSS7BU9UCXR35WtHwCfvDAKbGUScZjbi' }}, function(err,httpResponse,body)
{ if (err) {console.log('idiot')} console.log(httpResponse)  })*/

var options = {
  url: 'https://api.yelp.com/v3/businesses/search?location=boston&term=bars&limit=1',
  headers: {
    'Authorization': 'Bearer b_r3MK0t7GU_ObYe3yZaEnBfEoU7eJF-W0jj8ovwwN1G1ddJrdMX6EeQQjhnCNNyBJ13bBuO2iiM71NXW0Ib38ooyXCG0EHlzvM-ZTsKm98zS1YikUnc_8-gWMs5WXYx'
  }
};

request.get(options, function(err,httpResponse,body)
{ if (err) {console.log('idiot')} 
var obj=JSON.parse(httpResponse.body);
console.log(obj.businesses[0].location)  })


/*var request=require('request');

request.get('https://someplace',options,function(err,res,body){
  if(err) //TODO: handle err
  if(res.statusCode !== 200 ) //etc
  //TODO Do something with response
});*/