
module.exports = function(socket, Widget){

    function nextId(){
        console.log('enter nextId()')
        Widget.find({id : 1},function(err,results){
            console.log('enter callback');
            if (err) throw err;
            console.log('count : '+ results.length);
        });
        var maxid = 0;
        //console.log ('count : '+maxid)
        if (maxid == 0) return 1;
        return maxid+1;
    }

    this.create = function (model){
        var wid= new Widget(model);
        wid.id = nextId();
        wid.save();
        console.log(wid);
        return wid._id;
        //socket.emit(); wid._id
    };

    this.update=function(model){
        Widget.findOneAndUpdate({id : model.id},model);
        console.log('updated');
        console.log(model);

    }

    socket.on('create:widget',this.create);
    socket.on('update:widget',this.update);
    return this;
}