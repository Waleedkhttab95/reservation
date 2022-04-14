const request = require('supertest')
const {app} = require('../../app')



describe('Auth API' , () =>{

    it('should sign up new Employee', async () => {
        const res = await request(app).post('/api/new-employee').send({
            employeeNumber: 1111,
            password: "123456" ,
            employeeName: "waleed" , 
            roles: 'Employee'
        })
    expect(res.statusCode).toEqual(201)

    })
    
    it('should return this employee already exist ', async () => {
        const res = await request(app).post('/api/new-employee').send({
            employeeNumber: 1111,
            password: "123456" ,
            employeeName: "waleed" , 
            roles: 'Employee'
        })
    expect(res.statusCode).toEqual(400)

    })

    it('should return err password at least 6 char ', async () => {
        const res = await request(app).post('/api/new-employee').send({
            employeeNumber: 1111,
            password: "12345" ,
            employeeName: "waleed" , 
            roles: 'Employee'
        })
    expect(res.statusCode).toEqual(400)

    })
    
    it('should return err employee number 4 digit ', async () => {
        const res = await request(app).post('/api/new-employee').send({
            employeeNumber: 11,
            password: "123456" ,
            employeeName: "waleed" , 
            roles: 'Employee'
        })
    expect(res.statusCode).toEqual(400)

    })

    it('should sign in user', async () => {
        const res = await request(app).post('/api/sign-in').send({
            employeeNumber: 1111,
            password: "12345"
        })
    expect(res.statusCode).toEqual(200)

    })

})