var header, topLocation;

function nsetup(){
    window.onscroll = function() {updateScroll()};
    header = document.getElementById("header");
    window.scrollTo(0,0);
    topLocation = header.offsetTop;
}

function updateScroll() {
  if (window.pageYOffset > topLocation) {
    header.classList.add("top");
  } else {
    header.classList.remove("top");
  }
}