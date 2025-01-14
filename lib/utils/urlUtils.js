/**
 * get protocol and host from a given url
 * @param {string} url the url we want to get protocol and host
 * @returns {object} an object with protocol and host
 */
function getProtocolAndHost(url) {
  const urlSplitted = url.split('//'),
    hasProtocol = urlSplitted.length > 1,
    getHost = (pathWithoutProtocol) => {
      const pathSplitted = pathWithoutProtocol.split('/');
      return pathSplitted[0];
    };
  let protocol = hasProtocol ? `${urlSplitted[0]}//` : '',
    host = hasProtocol ? getHost(urlSplitted[1]) : getHost(urlSplitted[0]);
  return {
    protocol,
    host
  };
}

/**
 * get the rest of the url lesss protocol and host
 * @param {Array} pathWithoutProtocol splitted url array
 * @returns {object} an object with protocol and host
 */
function getRestOfURL(pathWithoutProtocol) {
  const pathSplitted = pathWithoutProtocol.split('/');
  pathSplitted.shift();
  return pathSplitted.join('/');
}

/**
 * get the rest of the url lesss protocol and host
 * @param {string} url the url we want to get protocol and host
 * @returns {object} an object with protocol and host
 */
function getAllButProtocolAndHost(url) {
  const urlSplitted = url.split('//'),
    hasProtocol = urlSplitted.length > 1;
  let rest = hasProtocol ? getRestOfURL(urlSplitted[1]) : getRestOfURL(urlSplitted[0]);
  return rest;
}

module.exports = {
  getProtocolAndHost,
  getAllButProtocolAndHost
};
