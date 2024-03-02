const { test, after, beforeEach } = require('node:test')
const Blog = require('../models/blog')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)

const initialBlog = [
    {

        "title": "Harry Potter",
        "author": "Jim Carrey",
        "url": "text",
        "likes": 10
        ,
        "important": false
    }, {

        "title": "Barrsss Potter",
        "author": " Carrey",
        "url": "textestt",
        "likes": 2323
        ,
        "important": true
    }
]


beforeEach(async () => {
    await Blog.deleteMany({})
    let blogObj = new Blog(initialBlog[0])
    await blogObj.save()
    blogObj = new Blog(initialBlog[1])
    await blogObj.save()
})

test('blogs return json', async () => {
    await api
        .get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/)
})

test('blogs list amount', async () => {

    const response = await api.get('/api/blogs')
    assert.strictEqual(response.body.length, 2)

})

test('first object returns "id" key', async () => {
    const response = await api.get('/api/blogs')
    assert.strictEqual(response.body[0].hasOwnProperty('id'), true)
})

test('valid blog is added', async () => {

    const validBlog =
    {

        "title": "Barrsss Potter",
        "author": " Carrey",
        "url": "textestt",
        "likes": 2323233
        ,
        "important": true
    }


    await api
        .post('/api/blogs')
        .send(validBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

    const response = await api.get('/api/blogs')

    assert.strictEqual(response.body.length, initialBlog.length + 1)
})

test('blog is missing likes', async () => {

    const noLikesBlog =
    {

        "title": "Barrsss Potter",
        "author": " Carre23333y",
        "url": "textestt",


        "important": true
    }


    await api
        .post('/api/blogs')
        .send(noLikesBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

    const response = await api.get('/api/blogs')
    console.log(response.body, "my log");
    assert.strictEqual(response.body[response.body.length - 1].likes, 0)
})

after(async () => {
    await mongoose.connection.close()
})

