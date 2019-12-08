# Magazine news Blog web app with Node.js and MongoDB

This app is developed with Node.js and MongoDB.
The web app is a blog CMS. Everything is dynamic. You don't need to edit any code manually.

### features:

Posting articles  
highlighted articles  
Slideshow of  articles  
Popular articles  
Most viewed articles  
Recent articles  
Breaking news articles  
Categories and Subcategories  
search of articles by (article title and article keywords)  
Contact page with Google recaptcha  
About page  
REST API for fetching the articles  
Push Notification for visitors  
Newsletter for visistors  
Fully managed Admin Panel (Add, Edit and Delete everything from Database)  
Advanced Admin Panel dashboard  


## Project directory structure

```
|-- .gitignore  
|-- directoryList.md  
|-- index.js  
|-- package-lock.json  
|-- package.json  
|-- Procfile  
|-- models  
|---|-- about.js  
|---|-- admin.js  
|---|-- article.js  
|---|-- breaknews.js  
|---|-- category.js  
|---|-- contact.js  
|---|-- db.js  
|---|-- highlighted.js  
|---|-- index.js  
|---|-- info.js  
|---|-- newsletter-email.js  
|---|-- newsletter.js  
|---|-- popular.js  
|---|-- slideshow.js  
|---|-- subcategory.js  
|---|-- videos.js  
|---|-- webpush.js  
|-- public  
|---|-- publickey.txt  
|---|-- worker.js  
|---|-- css  
|---|   |-- admin.css  
|---|   |-- bootstrap.min.css  
|---|   |-- styles.css  
|---|-- icons  
|---|   |-- css  
|---|-- images  
|---|-- scripts  
|---|-- uploads  
|-- routes  
|---|-- about.js  
|---|-- api.js  
|---|-- article.js  
|---|-- category.js  
|---|-- home.js  
|---|-- index.js  
|---|-- newsletter.js  
|---|-- webpush.js  
|---|-- admin  
|-------|-- about.js  
|-------|-- account.js  
|-------|-- articles.js  
|-------|-- authenticate.js  
|-------|-- breaknews.js  
|-------|-- categories.js  
|-------|-- contacts.js  
|-------|-- highlight.js  
|-------|-- home.js  
|-------|-- index.js  
|-------|-- login.js  
|-------|-- newsletter-sub.js  
|-------|-- newsletter.js  
|-------|-- pagination.js  
|-------|-- passport-config.js  
|-------|-- popular.js  
|-------|-- setting.js  
|-------|-- slideshow.js  
|-------|-- subcategories.js  
|-------|-- videos.js  
|-- views  
----|-- 404.pug  
----|-- about.pug  
----|-- article.pug  
----|-- category.pug  
----|-- contact.pug  
----|-- footer.pug  
----|-- header.pug  
----|-- index.pug  
----|-- sidebar.pug  
----|-- admin  
--------|-- about.pug  
--------|-- account.pug  
--------|-- articles.pug  
--------|-- breaknews.pug  
--------|-- categories.pug  
--------|-- contact.pug  
--------|-- header.pug  
--------|-- highlight.pug  
--------|-- index.pug  
--------|-- login.pug  
--------|-- newsletter-sub.pug  
--------|-- newsletter.pug  
--------|-- popular.pug  
--------|-- setting.pug  
--------|-- sidebar.pug  
--------|-- slideshow.pug  
--------|-- subcategories.pug  
--------|-- videos.pug  
```

### Getting Started

Use exported DB files from the 'db' folder and import it your database called 'magazine'.  
You can do the same thing manually, but you have to be carefull of using the right document properies names.  
example for Admin document there is not pages to register admin account. you need to add it manually or import admin.json file to your databasein admin collection.

if you imported it:  

admin username: Demo  
admin Email: demo@example.com  
admin Password: demo  



### Prerequisites and Installing

install all modules from the package.json file by typing:  
npm install from CMD on the project directory path

```  
npm install
```  

Change web push publicVapidKey, privateVapidKey and Email from index.js. Sample code:  

```  
const publicVapidKey = "<PublicKey>";  
const privateVapidKey  = "<PrivateKey>;  
webpush.setVapidDetails('mailto:<YourEmail>', publicVapidKey, privateVapidKey);
```  
#### deployment

Use mongoDB as a cloud. Example: MongoDB Atlas  
Use a cloud server. Example: Heroku  

Change the db url in /models/db.js to your own db url connection  

```  
await mongoose.connect('<DBurl>', { useNewUrlParser: true, useUnifiedTopology: true });  
```  
Change all the session store url values to your DB url connection in all pages at directory /admin/*
```
router.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: false,
    store: new MongoStore({
        url: 'DBurl',
    })
}));
```

Change Google recaptcha Secret key to your own at path /routes/home.js  

```
const secretKey = '<SecretKey>';
```
Change email verifier module API key to your own at path /routes/newsletter.js, Get the key [Here](https://emailverification.whoisxmlapi.com/)  

```
let verifier = new Verifier("<YourKey>");
```

## Author
[Kamyar Lajani](https://www.instagram.com/kamyar_lajani/)

### Live Demo

[Demo](https://magazine-news.herokuapp.com)

