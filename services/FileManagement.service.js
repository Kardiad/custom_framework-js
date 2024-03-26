export class FileManagement{
    filename;
    path;
    constructor(path, filename){
        this.filename = filename; 
        this.path = path;
    }
    openFile = async (callback) => {
        return fetch(this.path+'/'+this.filename)
            .then(response => response.text())
            .then(callback);
    }
}