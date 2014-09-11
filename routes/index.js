var MappingHandler = require('./mapping');

module.exports = exports = function (app, db) {
	var mappingHandler = new MappingHandler(db);
	
	app.get('/', mappingHandler.list);
	app.get('/list', mappingHandler.list);
	app.get('/add', mappingHandler.add);
	app.post('/loadProviderList', mappingHandler.loadProviderList);
	app.get('/loadProviderInfo', mappingHandler.loadProviderInfo);
	app.post('/updateProvider', mappingHandler.updateProvider);
	app.post('/deleteProvider', mappingHandler.deleteProvider);
//	app.get('/list/:providerID', mappingHandler.listProvider);
}