
define(['util/Sync'], function(Sync){
    /** 
     * Core object containing everything the user-defined models may use.
     * @exports Core
     * @namespace
     * @borrows Sync.Model as Model
     */
    var Core = {
        Model: Sync.Model
    };
    
    return Core;
});