var app = require("./app.js");
var request = require("supertest").agent(app.listen());
var co = require("co");
var users = require("./userRoutes").users;

describe("Simple user http crud api", function(){
    var aUser = { };
    
    beforeEach(function(done){
        aUser = {name: "Stas", age: 21};
        removeAll(done);
    });
    
    afterEach(function(done){
        removeAll(done);
    });
    
    var removeAll = function(done){
        co(function *(){yield users.remove({});
        }).then(done);
    };
    
    it("should add new users", function(done){
        request
            .post("/user")
            .send(aUser)
            .expect("location", /^\/user\/[0-9a-fA-F]{24}$/)
            .expect(200, done);
    });
    
    it("should fail validation for users without name", function(done){
        delete aUser.name;
        request
            .post("/user")
            .send(aUser)
            .expect("name required")
            .expect(400, done);
    });
    
    it("should get existing user by id", function(done){
       co(function *(){
           var insertedUser = yield users.insert(aUser); 
           
           var url = "/user/" + insertedUser._id;
           request
                .get(url)
                .set("Accept", "application/json")
                .expect("Content-type", /json/)
                .expect(/Stas/)
                .expect(/21/)
                .expect(200, done);
       });
       
    });
    
    it("should update existing user", function(done) {
        co(function* (){
            var insertedUser = yield users.insert(aUser); 
            var url = "/user/" + insertedUser._id;
            
            request
                .put(url)
                .send({name: "Older Stas", age: 28})
                .expect("location", url)
                .expect(204, done);
                
        });
    });
    
    it("should delete existing user", function(done) {
        co(function* (){
            var insertedUser = yield users.insert(aUser); 
            var url = "/user/" + insertedUser._id;
            
            request
                .del(url)
                .expect(200, done);
                
        });
    })
})