(function(window){
    var form = document.getElementById("form"),
    
    warn_span = document.getElementById("warn"),
    
    values = {},
    
    warn = function(msg){
        warn_span.innerHTML = msg;
    };
    
    form.addEventListener("submit", function(event){
        values.password = document.getElementById("password").value;
        values.check_password = document.getElementById("check_password").value;
        
        if(!values.password && values.check_password){
            warn("You must have a non empty password !");
        } else if(values.password !== values.check_password){
            warn("You must have the same password !");
        } else {
            localStorage.password = values.password;
            window.close();
        }
    });
}(window));


