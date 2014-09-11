function MappingsDAO(db) {
	"use strict";

	if (false === (this instanceof MappingsDAO)) {
		console.log('Warning: MappingsDAO constructor called without "new" operator');
	}

	var mappingConfigs = db.collection("mapping_config");

    this.getProviderList = function (appName, callback) {
        var providerList = [];
        var cursor = mappingConfigs.find(appName);
        cursor.each(function(err, doc) {
            if (err) throw err;

            if (doc == null) {
                return callback(err, providerList);
            }

            if (doc.providerName) {
                providerList.push(doc.providerName);
            }
        });
    }

    this.getProviderInfo = function (providerName, callback) {
        var query = {'providerName' : providerName};
        mappingConfigs.findOne(query, function (err, doc) {
            return callback(err, doc);
        });
    }

    this.updateProvider = function (data, callback) {
        mappingConfigs.update(
            {"providerID": data.providerID},
            data,
            {upsert: true},
            function (err, result) {
                if (err) return callback(err, null);
                callback(err, data.providerID);
            }
        );
    }

    this.deleteProvider = function (query, callback) {
        mappingConfigs.remove(query, function (err, result) {
            if (err) return callback(err, null);
            callback(err, result);
        });
    }
}

module.exports.MappingsDAO = MappingsDAO;