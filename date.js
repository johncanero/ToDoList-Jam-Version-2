//jshint es-version:6

//Export getDate function
exports.getDate = function () {
  const today = new Date();

  const options = {
    weekday: "long",
    month: "long",
    day: "numeric",
  };

  return today.toLocaleDateString("en-US", options);
};


// Export getDayfunction
exports.getDay = function () {
  const today = new Date();

  const options = {
    weekday: "long",
  };

  return today.toLocaleDateString("en-US", options);
};
