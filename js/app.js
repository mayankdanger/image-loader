/*
imgs array is updated using ajax from imgur, indexes less than used_no have been displayed
and still req_no of images are needed for the screen.
'end' is true when appEnd div containing 'End of images' have been displayed.

All the Boxes and placeholders required are loaded initially and
Images loads only to scrolled positions also reflected in console 
*/
var imgs=new Array();
var used_no=0,req_no=0;
var prevScroll=0;
var end=false;

var config={
  'Authorization': 'Client-ID 2caa3460222960b',
    'url': 'https://api.imgur.com/3/gallery/hot/',
    'imgWidth':160,
    'imgHeight':160
};
/*
start of imgur specific functions
*/
/*
cbArray contains one object for each ajax call. object it containes is named as:
cb followed by an unique id indentifying that ajax call.
id is uniquely assaigned to each ajax call by incrementing counter.
ex:cbArray[cb1,cb2,cb3....] and cb1={},cb2={} which oncompletion of ajax call gets property 'status':true
i.e. cb1={'status:true'},cb2={'status:true'},...
*/
var cbArray={};
var counter=0;
var stock=0;
var getAlbumImg=function(id,callback){
  var cbId=++counter;
  cbArray['cb'+cbId]={};
  var request = new XMLHttpRequest();
  request.open("GET", 'https://api.imgur.com/3/gallery/album/'+id);
  request.setRequestHeader('Authorization', config.Authorization);
  request.onreadystatechange = function() {
      if (request.readyState === 4 && request.status === 200) {
        var data=JSON.parse(request.responseText);
          cbArray['cb'+cbId].status=true;//request has ended
          callback(data);
      }
      else if(request.status!==200){
        console.log("error"+request.status);
      }
    }
    request.send(null);
};

function getImgList(config, callback) {
  var cbId=++counter;
  cbArray['cb'+cbId]={};
  var request = new XMLHttpRequest();
  request.open("GET", config.url);
  request.setRequestHeader('Authorization', config.Authorization);
  request.onreadystatechange = function() {
      if (request.readyState === 4 && request.status === 200) {
            cbArray['cb'+cbId].status=true;//requst has ended
            var data=JSON.parse(request.responseText);
            console.log(data);
            for(x of data.data){
                if(!x.is_album){
                  var img={};
                  img.url=x.link;
                  img.height=160;
                  img.width=160;
                  imgs.push(img);
                }
                else{
                  //if given link is of album not image then get details of album and then get all its image
                  getAlbumImg(x.id,function(album_data){
                      for(imgData of album_data.data.images){
                          var img={};
                          img.url=imgData.link;
                          img.height=160;
                          img.width=160;
                          imgs.push(img);
                      }
                      callback();
                  });
                }
            };
            callback();
        }
      };
      request.send(null);
};


/*
End of imgur Specific functions
*/

/*
checkEnd determines if all images source have been displayed.
it sees all ajax call status in cbArray and if all have ended displays appEnd div.
*/
var checkEnd=function(){
  var fl=true;
  for(cb in cbArray){
    if(!cbArray[cb].hasOwnProperty("status")){
      fl=false;
      break;
    }
  };
  if(fl&&(stock==used_no)&&(!end)){
    end=true;
    document.getElementById("mainApp").innerHTML +=
    '<br><div id="appEnd"><p>End Of Images</p></div>';
  }
}

/*
addScreen function is fired on Event of scrolling. it calculates how many new images are to be inserted.
*/
var addScreen=function(){
  var elem = document.getElementById("mainApp");
  var w=parseInt(window.getComputedStyle(elem,null).getPropertyValue("width"));
  if(window.pageYOffset>prevScroll){
    req_no+=((window.pageYOffset-prevScroll)*w)/(config.imgWidth*config.imgHeight);
    prevScroll=window.pageYOffset;
    dispImg();
  }
};

/*
  putImg Starts loading the image according to demand
*/

var putImg=function(img,n){
  var loadingImg=new Image();
  loadingImg.src=img.url;
  console.log("loading: img"+n);
  loadingImg.onload = function(){
    console.log("loaded: img"+n);
    document.getElementById("img"+n).setAttribute("src",this.src);
  };
};
/*
displays images. and check for End through 'checkEnd'.
checkEnd function is source specific and must be provided as per source.
*/

var dispImg=function(){
  for(var i=used_no;i<req_no;i++){
    if(i<stock){
      putImg(imgs[i],used_no);
      ++used_no;
    }
  };
  checkEnd();
};
/* 
  This function can be modified to get the no of images from database and then stock can be set
*/
var setStock=function(callback){
  stock=200;
  callback();
};

/*
Intialises req_no i.e. no of images initially required for screen by taking width and height of conatiner 'mainApp'.
sets the event onscroll on mainApp
*/
var screenInit=function(){
  var elem = document.getElementById("mainApp");
  var h=parseInt(window.getComputedStyle(elem,null).getPropertyValue("height"));
  var w=parseInt(window.getComputedStyle(elem,null).getPropertyValue("width"));
  req_no=(h*w)/(config.imgHeight*config.imgWidth)+1;
  document.getElementById("mainApp").setAttribute("onscroll","addScreen()");
  setStock(function(){
    for(var i=0;i<stock;i++){
      document.getElementById("mainApp").innerHTML +='<a><img src="" height="'+
      config.imgWidth+'" width="'+config.imgHeight+'" class="img_holder" id="img'+i+'"></a>';
    }
    /*
      get list of images from imgur,dispImg is callback
    */
    getImgList(config,dispImg);
  });
};
screenInit();
