/**
 * http://javascriptweblog.wordpress.com/2011/05/31/a-fresh-look-at-javascript-mixins/
 *
 * @param destination
 * @param source
 * @returns destination
 */
module.exports = function (destination, source) {
	for (var k in source) {
		if (!destination.hasOwnProperty(k)) {
			destination[k] = source[k];
		}
	}
	return destination;
};