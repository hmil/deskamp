idmax = 1;
module.exports = function(socket, Widget){
    function nextId(){
        return idmax++;
    }

    this.create = function (model){
        var wid= new Widget(model);
        wid.id = nextId();
        // console.log('create ' + wid);
        wid.save(); // doesn't work?
        // console.log(wid);
        //socket.broadcast.emit('create:widget',wid);
        return wid.id;
    };

    this.update=function(model){
        Widget.findOneAndUpdate({id : model.id},model);
        // console.log('updated');
        // console.log(model);

    }

    socket.on('create:widget',this.create);
    socket.on('update:widget',this.update);
    return this;
}