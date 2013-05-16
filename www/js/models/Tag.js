define(['util/Sync'], function(Sync) {
	return Sync.Model.extend({
        url: 'tags',
        
		defaults: {
			x: 0, 
			y: 0, 
			name: "Default tag name title"
		}
	});
});