"use strict";
var http = require('http');
var path = require('path');
var fs = require('fs');
var URL = require('url');
 
// This all runs in the browser
var clientSide = function() {
	// Grab reference to the commit button
	var buttons = Array.prototype.slice.call(document.body.getElementsByTagName('button')).filter(function(el) {
		return el.getAttribute('ng:disabled') === '!Script.dirty';
	});
	var commitButton = buttons[0];
 
	// Override lodash's cloneDeep which is called from inside the internal reset method
	var modules;
	_.cloneDeep = function(cloneDeep) {
		return function(obj) {
			if (typeof obj.main === 'string' && modules) {
				// Monkey patch!
				return modules;
			}
			return cloneDeep.apply(this, arguments);
		};
	}(_.cloneDeep);
 
	// Wait for changes to local filesystem
	function update(now) {
		var req = new XMLHttpRequest;
		req.onreadystatechange = function() {
			if (req.readyState === 4) {
				if (req.status === 200) {
					modules = JSON.parse(req.responseText);
					commitButton.disabled = false;
					commitButton.click();
				}
				setTimeout(update.bind(this, false), req.status === 200 ? 0 : 1000);
			}
		};
		req.open('GET', 'http://localhost:9090/'+ (now ? 'get' : 'wait'), true);
		req.send();
	};
	update(true);
 
	// Look for console messages
	var sconsole = document.body.getElementsByClassName('console-messages-list')[0];
	var lastMessage;
	setInterval(function() {
		var nodes = sconsole.getElementsByClassName('console-message');
		var messages = [];
		var found = false;
		for (var ii = 0; ii < nodes.length; ++ii) {
			var el = nodes[ii];
			if (el.innerHTML === lastMessage) {
				found = true;
			} else if (found) {
				var ts = el.getElementsByClassName('timestamp')[0];
				ts = ts && ts.firstChild.nodeValue;
				var msg = el.getElementsByTagName('span')[0].childNodes;
				var txt = '';
				for (var jj = 0; jj < msg.length; ++jj) {
					if (msg[jj].tagName === 'BR') {
						txt += '\n';
					} else {
						txt += msg[jj].nodeValue;
					}
				}
				messages.push([ts, txt]);
			}
		}
		if (messages.length) {
			var req = new XMLHttpRequest;
			req.open('GET', 'http://localhost:9090/log?log='+ encodeURIComponent(JSON.stringify(messages)), true);
			req.send();
		}
		lastMessage = nodes.length && nodes[nodes.length - 1].innerHTML;
	}, 100);
};
 
// Set up watch on directory changes
var modules = {};
var writeListener;
fs.readdirSync('.').forEach(function(file) {
	if (file !== 'sync.js' && /\.js$/.test(file)) {
		modules[file.replace(/\.js$/, '')] = fs.readFileSync(file, 'utf8');
	}
});
fs.watch(__dirname, function(ev, file) {
	if (file !== 'sync.js' && /\.js$/.test(file)) {
		modules[file.replace(/\.js$/, '')] = fs.readFileSync(file, 'utf8');
		if (writeListener) {
			process.nextTick(writeListener);
			writeListener = undefined;
		}
	}
});
 
// Localhost HTTP server
var server = http.createServer(function(req, res) {
	var path = URL.parse(req.url, true);
	switch (path.pathname) {
		case '/inject':
			res.writeHead(200, { 'Content-Type': 'text/javascript' });
			res.end('~'+ clientSide.toString()+ '()');
			break;
 
		case '/get':
		case '/wait':
			if (writeListener) {
				writeListener();
			}
			writeListener = function() {
				res.writeHead(200, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
				res.end(JSON.stringify(modules));
			};
			if (req.url === '/get') {
				writeListener();
			}
			break;
 
		case '/log':
			res.writeHead(200, { 'Access-Control-Allow-Origin': '*' });
			res.end();
			var messages = JSON.parse(path.query.log);
			for (var ii = 0; ii < messages.length; ++ii) {
				console.log(messages[ii][0], messages[ii][1]);
			}
			break;
 
		default:
			res.writeHead(400);
			res.end();
			break;
	}
});
server.timeout = 0;
server.listen(9090);
console.log(
	"Paste this into JS debug console in Screeps (*not* the Screeps console):\n"+
	"var s = document.createElement('script');s.src='http://localhost:9090/inject';document.body.appendChild(s);"
);
