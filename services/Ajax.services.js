export class Ajax{

    url;
    method;
    formdata;
    headers;
    message;

    constructor(url, method, formdata, headers){
        this.url = url;
        this.method = method;
        this.formdata = formdata;
        if(headers == null){
            this.headers = {
                'Content-Type' : 'application/json'
            }
        }else{
            this.headers = headers
        }
        this._formDataConstructor();
    }

    _formDataConstructor(){
        const headersMessage = new Headers();
        const bodyMessage = JSON.stringify(this.formdata);
        for(let item of Object.keys(this.headers)){
            headersMessage.append(item, this.headers[item])
        }
        this.message = {
            method : this.method,
            headers : headersMessage,
            body : bodyMessage
        }
    }

    fetchResult(callback){
        return fetch(this.url, this.message)
            .then(res=>res.json())
            .then(callback)
            .catch(err=>console.error(err));
    }

}