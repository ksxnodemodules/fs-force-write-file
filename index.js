
((module) => {
	'use strict';

	var {stat, writeFile} = require('fs');
	var path = require('path');
	var justTry = require('try-promise').try;
	var _mkdir = require('fs-force-mkdir').withoutPromise;
	var _rm = require('fs-force-delete').withoutPromise;
	var {addPromise} = require('fs-force-utils/promise');
	var Info = require('fs-force-utils/info');
	var Action = require('fs-force-utils/action');
	var _throwif = require('fs-force-utils/throw-if');
	var _donothing = require('fs-force-utils/do-nothing');
	var flatArray = require('fs-force-utils/flat-array');
	var _getdesc = require('fs-force-utils/write-file-desc');

	var resolvePath = path.resolve;
	var getParent = path.dirname;

	var __writeFile = (filename, {data, options}, onfinish, onaction) => {
		var callOnFinish = (...action) =>
			onfinish(null, new Info('mkfile', filename, action));
		_mkdir(getParent(filename), (error, mkdirinfo) => {
			if (error) {
				return onfinish(error, null);
			}
			stat(filename, (error, statinfo) => {
				if (error) {
					return write('create');
				}
				if (statinfo.isDirectory()) {
					return _rm(filename, (error, rminfo) => {
						if (error) {
							return onfinish(error, null);
						}
						write('create', ...flatArray(rminfo.action));
					}, onaction);
				}
				if (statinfo.isFile()) {
					return write('edit');
				}
				onfinish(new Error(`Can't write "${filename}" as a file`));
				function write(type, ...nextact) {
					writeFile(filename, data, options, (error) => {
						if (error) {
							return onfinish(error, null);
						}
						var action = new Action(type, filename, 'file');
						justTry(onaction, [action]);
						callOnFinish(...flatArray(mkdirinfo.action), ...nextact, action);
					});
				}
			});
		}, onaction);
	}

	var _writeFile = (file, descriptor, onfinish, onaction) =>
		addPromise((resolve) => __writeFile(file, descriptor, (...errinf) => resolve(errinf), onaction))
			.onfinish((errinf) => onfinish(...errinf));

	var __ = module.exports = (filename, descriptor, onfinish = _throwif, onaction = _donothing) =>
		_writeFile(resolvePath(filename), _getdesc(descriptor), onfinish, onaction);

	__.withoutPromise = __writeFile;

})(module);
