do {
    localStorage.password = window.prompt("This page is protected ! You must be authenticated (the default password is ' passwd ')\n \n Password :");   
} while(!localStorage.password);
