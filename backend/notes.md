# key concept that we are using in this project 

1. cookie parser -
   bacause cookie storage stored the tokens and it returns tokens everytime when the api is called 

2. hashing -
   In hashing plain password or string is connected to a **criptographic string ** or heaxdecimal string that is never changed value and not able to convert back to original string so same value gives same hashed code everytime 
   we using the bcrypt package to genearte the hased password 

3. role based authentication 


the basic structure of this api is :

/api
│
├── /auth
│   ├── POST /register
│   ├── POST /login
│   ├── GET  /me
│   └── POST /logout
│
├── /profile
│   ├── POST /
│   ├── GET  /
│   └── PUT  /
│
└── /opportunities
    ├── POST   /
    ├── GET    /
    ├── GET    /:id
    ├── PUT    /:id
    └── DELETE /:id