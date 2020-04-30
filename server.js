var express = require('express');
var expressGraphQL = require('express-graphql');
var graphql = require('graphql');

const _db = {
    users: [
        {
            id: 1,
            name: "John Doe"
        }
    ],
    posts: [
        {
            user_id: 1,
            text: "Hello World! This is my first post."
        }
    ]
}

const userHandler = {
    getUser(id) {
        for(let i = 0; i < _db.users.length; i++) {
            if(_db.users[i].id === id) {
                return _db.users[i];
            }
        }
    },
    getPosts(userId) {
        const userPosts = [];
        for(let i = 0; i < _db.posts.length; i++) {
            if(_db.posts[i].user_id === userId) {
                userPosts.push(_db.posts[i]);
            }
        }
        return userPosts;
    }
}

var schema = graphql.buildSchema(`
    type Post {
        text: String
    }
    type User {
        name: String
        posts: [Post]
    }
    type Query {
        user(id: Int!): User
    }
`);


var rootResolver = {
    user: (args) => {
        const user_id = args.id;
        const user = userHandler.getUser(user_id);
        console.log(userHandler.getUser(user_id));
        const posts = userHandler.getPosts(user_id);
        return {
            name: user.name,
            posts: posts
        }
    }
};

var app = express();
app.use('/graphql', expressGraphQL({
    schema: schema,
    rootValue: rootResolver,
    graphiql: true,
}));
app.listen(3000);
console.log('GraphQL server listening at localhost:3000/graphql');