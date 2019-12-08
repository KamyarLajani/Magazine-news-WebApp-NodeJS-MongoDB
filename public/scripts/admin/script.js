
class ClassAction {
    constructor(){
        this.deleteWindow = false;
        
    }

    deleteBtn(ele, path){
        if(!this.deleteWindow){
            this.deleteWindow = !this.deleteWindow
            document.querySelector('.deleteWindow').style.display = 'block';
            if(path !== undefined) {
                document.querySelector('.deleteWindow div a:first-child').href= `/admin/${path}/delete/${ele.id}`;
            }
        }
        else {
            this.deleteWindow = !this.deleteWindow
            document.querySelector('.deleteWindow').style.display = 'none';
        }
        
        
    }
    imageUpload(ele){
        if(ele.files && ele.files[0]) {
            let fr = new FileReader();
            fr.addEventListener('load', (e)=>{
                document.querySelector('.imageShow').src= e.target.result;
            });
            fr.readAsDataURL(ele.files[0])
        }
        

    }

    
           
    }
    
    
let obj = new ClassAction();





