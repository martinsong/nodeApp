var MappingsDAO = require('../model/mappingsDAO').MappingsDAO

function MappingHandler (db) {
	"use strict";

	var mappings = new MappingsDAO(db);

	//load list of existed data providers
	this.list = function(req, res, next) {
		"use strict";
		res.render('list.html');
	}
//
//	this.listProvider = function(req, res, next) {
//		"use strict";
//	}

	//load add new data provider page
	this.add = function(req, res, next) {
		"use strict";
		res.render('add.html');
	}

	//load existed data provider list
	this.loadProviderList = function(req, res, next) {
		"use strict";
		mappings.getProviderList(req.body, function(err, results) {
			if (err) return next(err);
			res.json({"providerList" : results});
		});
	}

	//load provider data mapping info for specific data provider:
	this.loadProviderInfo = function(req, res, next) {
		"use strict";
		var providerName = req.query.providerName;
		mappings.getProviderInfo(providerName, function(err, result) {
			if (err) return next(err);
			res.json(result);
		});
	}

	this.updateProvider = function(req, res, next) {
		"use strict";
		mappings.updateProvider(req.body, function(err, results) {
			if (err) return next(err);
			res.json(results);
		}); 
	}

	this.deleteProvider = function(req, res, next) {
		"use strict";
		mappings.deleteProvider(req.body, function(err, results) {
			if (err) return next(err);
			res.json(results);
		});
	}
}

module.exports = MappingHandler;