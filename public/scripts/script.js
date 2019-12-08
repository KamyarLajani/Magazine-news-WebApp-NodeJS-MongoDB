
class ClassAction {
    constructor(){
        this.searchShow= false;
        this.menuShow = false;
        this.subCat = false;
    }

    breakNews(){
        
        
        let element = document.querySelectorAll('.break-news span.news');
        if(document.querySelectorAll('.break-news span.news')[0] !== undefined){
            let intervalId = setInterval(show, 3500);
            document.querySelectorAll('.break-news span.news')[0].style.display = "inline";
            let id = 1;
            function show(){
                
                if(id == element.length){
                    id = 0;
                }
                for(let i=0; i< element.length; i++){
                    element[i].style.display = "none";
                }
                element[id].style.display = "inline";
                
                id++;
            }
        }
        
    }

    searchForm(){
        
        this.searchShow = !this.searchShow;
        let button = document.querySelectorAll('.search-form span');
        let field = document.querySelector('.search-form input');
        if(!this.searchShow){
            button[0].style.display = 'none';
            button[1].style.display = 'block';
            field.style.visibility = 'visible';
        }
        else {
            button[1].style.display = 'none';
            button[0].style.display = 'block';
            field.style.visibility = 'hidden';
        }

    }
    menu(){
        
        this.menuShow = !this.menuShow;
        let menuIcon = document.querySelector('.menu .menu-open');
        let menuClose = document.querySelector('.menu .menu-close');
        let menuBar = document.querySelector('nav');
        if(this.menuShow){
            menuIcon.style.display = 'none';
            menuBar.style.display = 'block';
            menuClose.style.display = 'block';
            
        }
        else {
            menuIcon.style.display = 'block';
            menuBar.style.display = 'none';
            menuClose.style.display = 'none';
            
        }

    }

    subCategory(ele){
        
        if(!this.subCat){
            let parent = ele.parentNode;
            parent.querySelector('.subcat').style.display= 'block';
            this.subCat = !this.subCat;
        }
        else {
            let parent = ele.parentNode;
            parent.querySelector('.subcat').style.display= 'none';
            this.subCat = !this.subCat;
        }
        

    }
    formSubmited(){
        if(document.querySelector('.contactForm') != null){
            document.querySelector('.contactForm').addEventListener('submit', (e)=>{
                e.preventDefault();
                let name = document.querySelector('input[name="name"]').value;
                let email = document.querySelector('input[name="email"]').value;
                let message = document.querySelector('textarea[name="message"]').value;
                let captcha = document.querySelector('#g-recaptcha-response').value;
                (async ()=>{
                    let res = await fetch('/ContactUs', {
                        method: 'POST',
                        headers: {
                            'Accept': 'application/json, text/plain, */*',
                            'Content-type': 'application/json'
            
                        },
                        body: JSON.stringify({name: name, email: email, message: message, captcha: captcha})
                    })
                    let body = await res.json()
                    document.querySelector('h5.result').innerHTML = body.result;
                    
                    
                })()
                
                
               });
        }

           
    }


    webpush(){
        (async ()=>{
            let response = await fetch('/publickey.txt', {
                method: 'GET'
            })

            if ('serviceWorker' in navigator) {

                run().catch(error => console.error(error));
            }
           

            async function run() {
               
                const registration = await navigator.serviceWorker.
                register('worker.js', {scope: '/'});

                const subscription = await registration.pushManager.
                subscribe({
                    userVisibleOnly: true,
                    applicationServerKey: urlBase64ToUint8Array(await response.text())
                });

                await fetch('/subscribe', {
                    method: 'POST',
                    body: JSON.stringify(subscription),
                    headers: {
                        'content-type': 'application/json'
                    }
                });
            }
        })()
        
        
        function urlBase64ToUint8Array(base64String) {
            const padding = '='.repeat((4 - base64String.length % 4) % 4);
            const base64 = (base64String + padding)
              .replace(/-/g, '+')
              .replace(/_/g, '/');
           
            const rawData = window.atob(base64);
            const outputArray = new Uint8Array(rawData.length);
           
            for (let i = 0; i < rawData.length; ++i) {
              outputArray[i] = rawData.charCodeAt(i);
            }
            return outputArray;
          }
        

         
    }

     notify(){
        window.onload= ()=>{
            if("Notification" in window){
                if(Notification.permission  == 'default'){
                    document.querySelector('.subs-notif').style.display = 'block';
                }
            }
        }
    }

    newsletterSub(){
           
                (async ()=>{
                   
                    let email = document.querySelector('.newsletter input');
                    let response = await fetch('/newsletter', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({email: email.value})
                    });
                   
                    let data = await response.json();

                    if(!data.success){
                        document.querySelector('.newsletter p').style.color = 'red';
                    }
                    else {
                        document.querySelector('.newsletter p').style.color = 'white';
                    }
                    document.querySelector('.newsletter p').innerHTML = data.message;

           })();
            
    }

    
    
}
    
new ClassAction().breakNews();
let obj = new ClassAction();
obj.searchForm();
obj.formSubmited();
obj.notify();


function searchClicked(){
    obj.searchForm();
}






