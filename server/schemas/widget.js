 var WidgetSchema = function(mongoose) {
 	var schema = new mongoose.Schema({
 		name: String
 	});
 }

module.exports = WidgetSchema;
//exports.WidgetModel  = mongoose.model('widget', WidgetSchema);