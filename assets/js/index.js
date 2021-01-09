//déclaration des constantes et variables
const URL = 'http://localhost:3000/';
var user;
var token;

//chargement de index.js
$(document).ready(function () {
    //cibles du DOM
    const $loginForm = $('#loginForm');
    const $pwdInput = $('#pwd');
    const $loginInput = $('#login');
    const $loginDiv = $('#loginDiv');
    const $registerDiv = $('#registerDiv');
    const $h1 = $('h1');
    const $btShowLogin = $('#btShowLogin');
    const $btShowRegister = $('#btShowRegister');
    const $registerForm = $('#registerForm');

    //masquer le login et l'inscription
    $loginDiv.hide();
    $registerDiv.hide();

    $btShowLogin.click(function () {
        $loginDiv.toggle();
        $registerDiv.hide();
    });

    $btShowRegister.click(function () {
        $registerDiv.toggle();
        $loginDiv.hide();
    });

    //gestion du login
    $loginForm.submit(function (even) {
        //on empêche l'action par default de soumission du formulaire
        even.preventDefault();

        //récupération des saisies ut sous forme d'objet 
        const credentials = {
            login: $loginInput.val(),
            pwd: $pwdInput.val(),
        };

        $.post(URL + 'login', credentials)
            .done(function (response) {
                user = response.user;
                token = response.token;
                $loginDiv.hide();
                $h1.text('Bienvenue ' + user.username);
            })
            .fail(function (err) {
                console.log(err);
            });
    });

    //gestion de l'inscription
    $registerForm.submit(function (even) {
        even.preventDefault();
        const data = {
            login: $("#registerForm input[name='login']").val(),
            username: $("#registerForm input[name='username']").val(),
            pwd: $("#registerForm input[name='pwd']").val(),
        };

        $.post(URL + 'register', data)
            .done(function (response) {
                user = response.user;
                token = response.token;
                $registerDiv.hide();
                $h1.text('Bienvenue ' + user.username);
            })
            .fail(function (err) {
                console.log(err);
            });
    });
});