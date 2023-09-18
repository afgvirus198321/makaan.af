let menu = document.getElementById("tmenu");
let close = document.getElementById("closemenu");
let threeline = document.getElementById("threeline");
let firstdiv = document.getElementById("firstdiv");
menu.addEventListener("click", () => {
  threeline.style.display = "flex";
});

close.addEventListener("click", () => {
  threeline.style.display = "none";
});
let formid = document.getElementById("formid");

formid.addEventListener("submit", (event) => {
  if (document.getElementById("street").value == "") {
    document.getElementById("streetp").innerHTML =
      "Please fill out street address";
    event.preventDefault();
  } else {
    document.getElementById("streetp").innerHTML = "";
  }

  if (document.getElementById("city").value == "") {
    document.getElementById("cityp").innerHTML = "Please fill out city field";
    event.preventDefault();
  } else {
    document.getElementById("cityp").innerHTML = "";
  }

  if (document.getElementById("province").value == "") {
    document.getElementById("provincep").innerHTML =
      "Please fill out province field";
    event.preventDefault();
  } else {
    document.getElementById("provincep").innerHTML = "";
  }

  if (document.getElementById("price").value == "") {
    document.getElementById("pricep").innerHTML = "Please fill out price field";
    event.preventDefault();
  } else {
    document.getElementById("pricep").innerHTML = "";
  }
  if (document.getElementById("rooms").value == "") {
    document.getElementById("roomsp").innerHTML = "Please fill out rooms field";
    event.preventDefault();
  } else {
    document.getElementById("roomsp").innerHTML = "";
  }
  if (document.getElementById("square").value == "") {
    document.getElementById("squarep").innerHTML =
      "Please fill out square field";
    event.preventDefault();
  } else {
    document.getElementById("squarep").innerHTML = "";
  }
  if (document.getElementById("phnum").value == "") {
    document.getElementById("phnump").innerHTML =
      "Please fill out phone number field";
    event.preventDefault();
  } else {
    document.getElementById("phnump").innerHTML = "";
  }
  if (document.getElementById("upload").value) {
    document.getElementById("uploadp").innerHTML = "";
  } else {
    document.getElementById("uploadp").innerHTML = "please upload your photo";
  }
});

let filebtn = document.getElementById("upload");
let fileimg = document.getElementById("imgupload");
let filetxt = document.getElementById("filetxt");

filebtn.addEventListener("mouseover", () => {
  fileimg.style.transform = "scale(110%) translateY(-20px)";
});

filebtn.addEventListener("mouseout", () => {
  fileimg.style.transform = "scale(100%) ";
});
filebtn.addEventListener("change", () => {
  filetxt.innerHTML = "File Selected ";
  filetxt.style.color = "red";
});

let phnum = document.getElementById("phnum");
let phnump = document.getElementById("phnump2");
let form = document.getElementById("formid");
form.addEventListener("submit", (item) => {
  if (phnum.value.length < 9 || phnum.value.length > 12) {
    phnump2.innerHTML = "Please Enter a Valid number";
    item.preventDefault();
  } else {
    phnump2.innerHTML = "";
    item.defaultPrevented = false;
  }
});
