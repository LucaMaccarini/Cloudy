const start_white_theme = localStorage.getItem('white_theme');

if(start_white_theme === 'true' || start_white_theme==null){
    document.body.classList.remove("bootstrap-dark");
    document.body.classList.add("bootstrap");
}
else{
    document.body.classList.remove("bootstrap");
    document.body.classList.add("bootstrap-dark");
}


var styles = `
    ::-webkit-input-placeholder { 
        transition-duration: 645ms ;
    }
    ::-moz-placeholder { 
        transition-duration: 645ms ;
    }
    :-ms-input-placeholder { 
        transition-duration: 645ms ;
    }

    *{
        transition-duration: 645ms ;
        transition-property: background-color, color;
    }
`

var styleSheet = document.createElement("style")
styleSheet.innerText = styles
document.head.appendChild(styleSheet)
//add css rule