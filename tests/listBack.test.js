const { test, after, beforeEach, describe  } = require('node:test')
const Blog = require('../models/blog')
const User = require('../models/user'); // Assuming you have a User model
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)

describe('test listBack', () => {

    let token;
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
        const savePromises = initialBlog.map(blog => {
            const blogObj = new Blog(blog)
            return blogObj.save()
        })
        await Promise.all(savePromises)

        const loginResponse = await api
            .post('/api/login')
            .send({
                username: 'testuser',
                password: 'testpassword'
            })

        token = loginResponse.body.token


     
    })

    test('blogs return json', async () => {
        await api
            .get('/api/blogs')
            .expect(200)
            .expect('Content-Type', /application\/json/)
    })

    test('blogs list amount', async () => {

        const response = await api.get('/api/blogs')
        assert.strictEqual(response.body.length, initialBlog.length)

    })

    test('first object returns "id" key', async () => {
        const response = await api.get('/api/blogs')
        assert.strictEqual(response.body[0].hasOwnProperty('id'), true)
    })

    test('a valid blog can be added ', async () => {



        // Check the response here


        const noLikesBlog =
        {

            "title": "Barrsss Potter",
            "author": " Carre23333y",
            "url": "textestt",
            "important": true
        }

        await api
            .post('/api/blogs')
            .set('Authorization', `Bearer ${token}`)
            .send(noLikesBlog)
            .expect(201)
            .expect('Content-Type', /application\/json/)



    })

    test('blog is missing likes , return 0', async () => {

        const noLikesBlog =
        {

            "title": "Barrsss Potter",
            "author": " Carre23333y",
            "url": "textestt",
            "important": true
        }

        await api
            .post('/api/blogs')
            .set('Authorization', `Bearer ${token}`)
            .send(noLikesBlog)
            .expect(201)
            .expect('Content-Type', /application\/json/)

        const response = await api.get('/api/blogs')
        assert.strictEqual(response.body[response.body.length - 1].likes, 0)
    })

    test('title or url missing returns 400', async () => {

        const noTitleAndUrl =
        {
            "author": " Carre23333y",
            "important": true
        }
        await api
            .post('/api/blogs')
            .set('Authorization', `Bearer ${token}`)
            .send(noTitleAndUrl)
            .expect(400)
    })


 

    test('update to 10 likes', async () => {
        const first = await api.get('/api/blogs')
        const id = first.body[0].id

        await api
            .put(`/api/blogs/${id}`)
            .set('Authorization', `Bearer ${token}`)
            .send({ "likes": 10 })
            .expect(200)

        const response = await api.get(`/api/blogs/`)
        assert.strictEqual(response.body[0].likes, 10)

    })


})

after(async () => {
    await mongoose.connection.close()
})

