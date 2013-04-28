 var WidgetSchema = function(mongoose) {
 	var schema = new mongoose.Schema({
 		width: Number,
        height: Number,
        x: Number,
        y: Number,
        cid: Number,
        id: Number,
        data: String
    });
     return schema;
 }

module.exports = WidgetSchema;