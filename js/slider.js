var sliderThat=null;
const DEFAULT_WIDTH=100;
class Slider{
  constructor(wrapper){
    this.wrapper = document.getElementById(wrapper);
    this.wrapper = this.styleWrapper(this.wrapper);

    this.createContainer();
    this.createPrevNextButton();
    this.createListButton();

    this.run();
  }

  run(){
    this.tick=0;
    this.slideLeft=true;
    this.delay=true;
    this.leftVal=0;
    this.marginLeft=0;

    sliderThat=this;

    //stores originial direction which is changed after button is clicked
    this.orgSlideLeft=null;
    this.toBeSlide=0;
    this.prev.addEventListener('click',function(e){
      if(sliderThat.orgSlideLeft==null && sliderThat.marginLeft<0){
        sliderThat.slideTimes(false);
      }
    });    

    this.next.addEventListener('click',function(e){
      if(sliderThat.orgSlideLeft==null && Math.abs(sliderThat.marginLeft)<(sliderThat.images.length-1)*sliderThat.width){
        sliderThat.slideTimes(true);
      }
    });

    this.ul.addEventListener('click',function(e){
      var index=parseInt(e.target.classList[0]);
      var curPos=Math.abs(sliderThat.marginLeft);
      var posToBe=index*sliderThat.width;
      if(curPos!=posToBe){
        var times=Math.floor(Math.abs((posToBe-curPos))/sliderThat.width);
        if(curPos%sliderThat.width==0){
          times--;
        }
        if(posToBe<curPos){

          sliderThat.slideTimes(false,times);
        }
        else if(posToBe>curPos){
          sliderThat.slideTimes(true,times);
        }
      }
    });


    sliderThat.lis[0].style.background='gray';

    this.mainInterval=setInterval(this.slide,10);
  }

  slideTimes(isLeft,times=0){
    sliderThat.orgSlideLeft=sliderThat.slideLeft;
        
    if(isLeft){//For Prev
        sliderThat.toBeSlide=sliderThat.width-(Math.abs(sliderThat.marginLeft)%sliderThat.width);
        
        sliderThat.slideLeft=true;
    }  
    else{
      sliderThat.toBeSlide=Math.abs(sliderThat.marginLeft)%sliderThat.width;  
      
      sliderThat.slideLeft=false;
    }
    if(sliderThat.toBeSlide==0){
      sliderThat.toBeSlide=sliderThat.width;
    }

    // console.log(times,sliderThat.toBeSlide);
    while(times>0){
      sliderThat.toBeSlide+=sliderThat.width;
      times--;
    }
    // console.log(sliderThat.marginLeft,sliderThat.toBeSlide);
  }

  slide(){
    //On prev button clicked
    // console.log(sliderThat.orgSlideLeft);
    if(sliderThat.orgSlideLeft!=null){
      // console.log('Working');
      sliderThat.toBeSlide--;
      
      if(sliderThat.slideLeft!=sliderThat.orgSlideLeft){//For Delay
        sliderThat.leftVal--;    
      }
      else{
        sliderThat.leftVal++;
      }
      

      if(sliderThat.toBeSlide<0){
        sliderThat.changeActiveList();
        sliderThat.delay=true;
        sliderThat.tick=1;
        sliderThat.slideLeft=sliderThat.orgSlideLeft;
        sliderThat.orgSlideLeft=null;
        // console.log('Up',sliderThat.marginLeft);
      }
      else{

        if(Math.abs(sliderThat.marginLeft)>0
          && Math.abs(sliderThat.marginLeft)<sliderThat.width*(sliderThat.images.length-1) 
          && Math.abs(sliderThat.marginLeft)%sliderThat.width==0){
          console.log(sliderThat.marginLeft);
          sliderThat.changeActiveList();
        }
        sliderThat.update();
      }
      return;
    }


    if(sliderThat.delay && sliderThat.tick>100){
      sliderThat.tick=0;
      sliderThat.delay=false;
    }
    if(!sliderThat.delay){
      sliderThat.update();
      sliderThat.leftVal++;
      // console.log(sliderThat.marginLeft);
    }

    if(!sliderThat.delay && sliderThat.tick>=sliderThat.width-1){
      sliderThat.delay=true;
      sliderThat.tick=0;
      sliderThat.changeActiveList();
    }
    
    if(sliderThat.leftVal>=sliderThat.width*(sliderThat.images.length-1)){
      
      sliderThat.changeActiveList();
      sliderThat.slideLeft=!sliderThat.slideLeft;
      sliderThat.tick=0;
      sliderThat.leftVal=0;

      sliderThat.delay=true;
      sliderThat.tick=0;
    }


    sliderThat.tick++;
  }

  changeActiveList(){
      var activeIndex=Math.floor(Math.abs(sliderThat.marginLeft)/sliderThat.width);
      if(sliderThat.slideLeft){
        sliderThat.lis[activeIndex-1].style.background='transparent';
      }
      else{
          sliderThat.lis[activeIndex+1].style.background='transparent';  
      }
      sliderThat.lis[activeIndex].style.background='gray';
  }

  update(){
    var slidePos = this.slideLeft?-1:1;
    sliderThat.marginLeft+=slidePos;
    sliderThat.container.style.marginLeft=sliderThat.marginLeft+'%';
  }

  createContainer(){
    this.container = document.createElement('div');
    this.container = this.styleContainer(this.container);
    //Shift images inside slider into container
    this.images = this.wrapper.children;

    var temp=0;
    while(this.images.length>0){
      this.images[0].style.marginLeft=temp*this.width+'%';
      this.images[0].style.position = 'absolute';
      this.images[0].style.width=this.width+'%';

      temp++;
      this.container.appendChild(this.images[0]);
    }

    //Get all images from new position
    this.images = this.container.children;

    //append container into slider
    this.wrapper.appendChild(this.container);
  }

  createPrevNextButton(){
    this.prev = document.createElement('button');
    this.prev.style.background = 'url(\'img/assets/arrow-left.png\') no-repeat 100%';
    this.prev.style.height = '20px';
    this.prev.style.width = '20px';
    this.prev.style.position = 'absolute';
    this.prev.style.top = '40%';
    this.prev.style.border = 'none';
    this.prev.style.cursor = 'pointer';

    this.next = document.createElement('button');
    this.next.style.background = 'url(\'img/assets/arrow-right.png\') no-repeat';
    this.next.style.height = '20px';
    this.next.style.width = '20px';
    this.next.style.position = 'absolute';
    this.next.style.top = '40%';
    this.next.style.right = '0%';
    this.next.style.border = 'none';
    this.next.style.cursor ='pointer';

    this.wrapper.appendChild(this.prev);
    this.wrapper.appendChild(this.next);
  }
    
  createListButton(){
    this.ul = document.createElement('ul');
    this.ul.style.listStyleType = 'none';
    this.ul.style.position = 'absolute';
    this.ul.style.left = '40%';
    this.ul.style.bottom = '5%'
    this.ul.style.cursor = 'pointer';

    this.lis=[];
    
    for(var i=0;i<this.images.length;i++){
      var li=document.createElement('li');
      li=this.styleLi(li);
      li.classList.add(i);
      this.lis.push(li);
      this.ul.appendChild(li);
    }

    this.wrapper.appendChild(this.ul);
  }

  styleWrapper(elem){
    this.width=parseInt(elem.style.width);
    if(!elem.style.width){

      elem.style.width = DEFAULT_WIDTH+'%';
      this.width=DEFAULT_WIDTH;
    }
    elem.style.height = '500px';
    elem.style.overflow = 'hidden';
    elem.style.position = 'relative';

    return elem;
  }

  styleContainer(elem){
    elem.style.minWidth = '1000%';
    elem.style.marginLeft = '0px';
    elem.position = 'relative';

    return elem;
  }

  styleLi(elem){
    // elem.style.background = 'white';
    elem.style.width = '15px';
    elem.style.height = '15px';
    elem.style.marginLeft = '10px';
    elem.style.float = 'left';
    elem.style.borderRadius = '50%';
    elem.style.border='2px solid gray';
    return elem;
  }

}