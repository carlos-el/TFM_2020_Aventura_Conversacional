module.exports = class Notification {
    constructor(data){
        this.user = "";
        this.time = "";
        this.title = "";
        this.body = "";
        
        this.setUser(data.user);
        this.setTime(data.time);
        this.setTitle(data.title);
        this.setBody(data.body);
    }

    setUser(user){
        if(!(typeof user === "string"))
            throw new Error('Attribute "user" must be string.')

        // if(user.length > 225 || 225 > user.length)
        //     throw new Error('Attribute "user" length must be 225.')

        this.user = user;
    }

    setTime(time){
        if(!(typeof time === "string"))
            throw new Error('Attribute "time" must be string.')
            
        try {
            var date = new Date(time)
        } catch (error) {
            throw new Error('Invalid date in attribute "time".')
        }

        if (new Date(time) < new Date(Date.now()+300000))
            throw new Error('Attribute "time" must be and schedule for at least 5 minuttes in the future')

        this.time = time;
    }

    setTitle(title){
        if(!(typeof title === "string"))
            throw new Error('Attribute "title" must be string.')

        if(title.length > 40)
            throw new Error('Attribute "title" length must be less than 40.')

        this.title = title;
    }

    setBody(body){
        if(!(typeof body === "string"))
            throw new Error('Attribute "body" must be string.')

        if(body.length > 200)
            throw new Error('Attribute "body" length must be less than 40.')

        this.body = body;
    }
}