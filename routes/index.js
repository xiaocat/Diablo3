var needle = require('needle');

var battle_host = 'http://tw.battle.net';

module.exports = function(app){
  app.get('/', function(req, res){
    var lag = req.query.lag || 'fire-1173';
    get_tag(lag, function(resp){
      res.render('./blizzard', {data: resp});
    });
  });

  app.get('/item', function(req, res){
    get_item(req.query.data, function(resp){
      res.json(resp);
    });
  });

  function get_tag(lag, callback){
    needle.get(battle_host + '/api/d3/profile/' + lag + '/index', {'json': true}, function(err, resp){
      if(err) throw err;
      if(resp.body && resp.body.code == 'NOTFOUND'){
        callback(null);
        return;
      }
      // console.log(util.inspect(resp, {colors: true}));
      resp.body.heroesData = {};
      var num = 0;

      resp.body.heroes.forEach(function(i){
        get_hero(i.id, lag, function(id, data){
          resp.body.heroesData[id] = data;
          if(++num == resp.body.heroes.length) callback(resp.body);
        });
      });
    });
  }

  function get_hero(id, lag, callback){
    needle.get(battle_host + '/api/d3/profile/' + lag + '/hero/' + id, {'json': true}, function(err, resp){
      if(err) throw err;
      callback(id, resp.body);
    });
  }

  function get_item(data, callback){
    needle.get(battle_host + '/api/d3/data/' + data, {'json': true}, function(err, resp){
      if(err) throw err;
      callback(resp.body);
    });
  }
};