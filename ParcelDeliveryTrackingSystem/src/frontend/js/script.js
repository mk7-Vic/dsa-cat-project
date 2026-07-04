/*PAGE LOADED*/
document.addEventListener("DOMContentLoaded",function(){
    animateCards();
    animateCounters();
    searchParcel();
    showWelcomeToast();
    enableDarkMode();
    sidebarToggle();
});


/*ANIMATE DASHBOARD CARDS*/
function animateCards(){

    const cards=document.querySelectorAll(".stats-card");

    cards.forEach((card,index)=>{
        card.style.opacity="0";

        card.style.transform="translateY(40px)";

        setTimeout(()=>{
            card.style.transition="0.6s";

            card.style.opacity="1";

            card.style.transform="translateY(0px)";

        },index*200);
    });
}


/*COUNTER ANIMATION*/
function animateCounters(){

    const numbers=document.querySelectorAll(".stats-card h2");

    numbers.forEach(counter=>{
        let target=parseInt(counter.innerText);

        let current=0;

        let speed=Math.ceil(target/50);

        let updateCounter=function(){
            current+=speed;
            if(current>=target){
                counter.innerText=target;
            }

            else{
                counter.innerText=current;
                requestAnimationFrame(updateCounter);
            }
        };
        updateCounter();
    });
}


/*SEARCH BAR*/
function searchParcel(){
    const input=document.querySelector("input[type='search']");
    if(!input) return;
    input.addEventListener("keyup",function(){
        console.log("Searching for:",input.value);
    });
}


/*WELCOME MESSAGE*/
function showWelcomeToast(){

    setTimeout(()=>{
        console.log("Welcome to Parcel Delivery Tracking System");
    },1000);
}


/*SIDEBAR ACTIVE LINK*/
const links=document.querySelectorAll(".nav-link");

links.forEach(link=>{
    link.addEventListener("click",function(){
        links.forEach(item=>{
            item.classList.remove("active");
        });
        this.classList.add("active");
    });
});


/*CARD HOVER EFFECT*/
const stats=document.querySelectorAll(".stats-card");

stats.forEach(card=>{
    card.addEventListener("mouseenter",()=>{
        card.style.transform="translateY(-8px) scale(1.03)";
    });

    card.addEventListener("mouseleave",()=>{
        card.style.transform="translateY(0px) scale(1)";
    });
});


/*DARK MODE*/
function enableDarkMode(){

    const button=document.createElement("button");
    button.innerHTML="<i class='bi bi-moon-fill'></i>";
    button.className="btn btn-dark position-fixed";
    button.style.right="20px";
    button.style.bottom="20px";
    button.style.borderRadius="50%";
    button.style.width="55px";
    button.style.height="55px";
    button.style.zIndex="999";
    document.body.appendChild(button);
    let dark=false;
    button.addEventListener("click",()=>{
        dark=!dark;
        if(dark){
            document.body.style.background="#121212";
            document.body.style.color="white";
        }
        else{
            document.body.style.background="#eef2f7";
            document.body.style.color="black";
        }
    });
}


/*SIDEBAR TOGGLE*/
function sidebarToggle(){
    if(window.innerWidth>768){
        return;
    }
    const sidebar=document.querySelector(".sidebar");
    if(!sidebar){
        return;
    }
    sidebar.style.display="block";
}


/*SMOOTH SCROLL*/
document.documentElement.style.scrollBehavior="smooth";