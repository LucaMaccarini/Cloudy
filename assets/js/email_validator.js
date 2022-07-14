

if(typeof exports == "undefined"){
  exports = this;
}

validateEmail = function(email) {
  this.validate(email);
};

validateEmail.prototype = {
  validate: function(email) {

    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );

  }
};

exports.validateEmail = new validateEmail();