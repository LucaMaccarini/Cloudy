//checkbox.checked => dark theme, else white theme 

var dark_white_checkbox =  document.createElement('input');
dark_white_checkbox.type = 'checkbox';
dark_white_checkbox.id = "dark-light-mode-checkbox"
dark_white_checkbox.className="l"

if(start_white_theme === 'true' || start_white_theme==null)
    dark_white_checkbox.checked = true
else
    dark_white_checkbox.checked = false

dark_white_checkbox.addEventListener("change", function(){
    if(dark_white_checkbox.checked){
        document.body.classList.remove("bootstrap-dark");
        document.body.classList.add("bootstrap");
        localStorage.setItem('white_theme', true);
    }
    else{
        document.body.classList.remove("bootstrap");
        document.body.classList.add("bootstrap-dark");
        localStorage.setItem('white_theme', false);
    }
});

document.getElementById("dark-light-mode-div").appendChild(dark_white_checkbox);


