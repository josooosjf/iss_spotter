const request = require('request');

const fetchMyIP = function(callback) {
  request('https://api.ipify.org?format=json', (error, response, body) => {
    if (error) {
      callback(error);
    }
    
    if (response.statusCode !== 200) {
      callback(Error(`Status Code ${response.statusCode} when fetching IP: ${body}`), null);
      return;
    }

    const ip = JSON.parse(body).ip;

    callback(null, ip);
  });
};

const fetchCoordsByIP = function(ip, callback) {
  request((`https://ipvigilante.com/${ip}`), (error, response, body) => {
    if (error) {
      callback(error);
    }

    if (response.statusCode !== 200) {
      callback(Error(`Status Code ${response.statusCode} when fetching IP: ${body}`), null);
      return;
    }


    const {latitude, longitude} = JSON.parse(body).data;

    callback(null, {latitude, longitude});
  });
};

const fetchISSFlyOverTimes = function(coords, callback) {
  
  request(`http://api.open-notify.org/iss-pass.json?lat=${coords.latitude}&lon=${coords.longitude}`, (error, response, body) => {

    if (error) {
      callback(error);
    }

    if (response.statusCode !== 200) {
      callback(Error(`Status Code ${response.statusCode} when fetching IP: ${body}`), null);
    }

    const passes = JSON.parse(body).response;

    callback(null, passes);


  });
};

const nextISSTimesForMyLocation = function(callback) {
  fetchMyIP((error, ip) => {
    if (error) {
      return callback(error);
    }
    
    fetchCoordsByIP(ip,(error, loc) => {
      if (error) {
        return callback(error);
      }

      fetchISSFlyOverTimes(loc, (error, nextPasses) => {
        if (error) {
          return callback(error);
        }
        callback(null, nextPasses);
      });
    });
  });
};




module.exports = { nextISSTimesForMyLocation };