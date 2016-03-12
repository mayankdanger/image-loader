# Infinite-Image-Loader

to create a infinite image container.
Just put the id="mainApp" for ex: see index.html
as of now it pulls images from imgur(the latest trending images);

mainApp container can be styled at ./css/style.css;
js code can be seen at ./js/app.js;

Procedure:Following is the procedural flow, See issues for their status <br>
1)calculate initial no of images to be displayed. <br>
2)see the img array nd create place-holders as per their relative size. <br>
3)set the loading txt/graphic/dummy image untill image is fully loaded. <br>
4)replace the dummy graphic with the image data. <br>
5)see for scroll event <br>
6)on scroll calculate no of images to be added and repeat step 2,3,4 <br>
