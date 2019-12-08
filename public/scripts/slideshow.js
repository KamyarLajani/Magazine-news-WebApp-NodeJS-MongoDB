
    class slideShow {
        constructor(){
            searchShow: false;
            menuShow: false
        }
    
        slideshow(){
            let element = document.querySelectorAll('.sliders');
            if(element !== undefined){
                for(let i=0; i< element.length; i++){
                    element[i].id = i;
                }
                
                let intervalId = setInterval(show, 3000);
                
                function show(){
                    let current = document.querySelector('.show');
                    let id = parseInt(current.id)+1;
                    
                    if(id == element.length){
                        id = 0;
                    }
                    for(let i=0; i< element.length; i++){
                        element[i].className = "sliders";
                    }
                    element[id].className = "sliders show";
                    
                    id++;
                }
            }
        }
        next(){
            let element = document.querySelectorAll('.sliders');
            let current = document.querySelector('.show');
            let id = parseInt(current.id);
            
            if(id == element.length-1){
                element[parseInt(id)].className = "sliders";
                element[0].className = "sliders show";
                
            }
            else {
                element[id].className = "sliders";
                element[parseInt(id)+1].className = "sliders show";
                
            }
        }
        previous(){
            let element = document.querySelectorAll('.sliders');
            let current = document.querySelector('.show');
            let id = parseInt(current.id);
           
            if(id !== 0){
                element[parseInt(id)].className = "sliders";
                element[parseInt(id)-1].className = "sliders show";
                
            }
            
        }
    }

let element = document.querySelectorAll('.sliders');

// if articles are more than 1, then slideshow works
if(element.length > 1){
    new slideShow().slideshow();
}

let slider = new slideShow();






