function validate(email) {
	var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	return re.test(email);
}

$('#login').click(() => {
	console.log('tentou');
	let email = $('#email').val();
	let senha = $('#senha').val();
	firebase.auth().signInWithEmailAndPassword(email, senha).then(() => {
		window.location.href = "../views/gasolina.html";
	}).catch(function (error) {
		console.log(error)
		console.log('nao deu')
		var errorCode = error.code;
		var errorMessage = error.message;
		// ...
	});
})


$('#Logout').click(() => {
	firebase.auth().signOut().then(function () {
		// Sign-out successful.
	}).then(result => {
		window.location.href = "../login/index.html";
	})
		.catch(function (error) {
			console.log(error)
		});
})

$('#createUser').click(() => {
	email = $('#email').val();
	senha = $('#senha').val();
	confSenha = $('#confSenha').val();
	if (validateEmail(email)) {
		if (senha.length > 5) {
			if (senha === confSenha) {
				if ($('#scales').prop("checked")) {
					firebase.auth().createUserWithEmailAndPassword(email, senha)
						.then(() => {
							alert('Cadastro efetuado com sucesso!')
							window.location.href = "../views/gasolina.html";
						})
						.catch(function (error) {
							var errorCode = error.code;
							var errorMessage = error.message;
							console.log(errorCode);
						});
				} else {
					alert('Você deve concordar com nossos termos de serviço')
				}
			} else {
				alert('As senhas devem ser iguais');
			}
		} else {
			alert('A senha deve ter pelo menos 6 caracteres');
		}
	} else {
		alert('Email Invalido');
	}
	// if(email )
	// firebase.auth().createUserWithEmailAndPassword(email, password)
	// .then(()=>{
	// 	alert('Cadastro feito com sucesso! Redirecionando...');		
	// 	window.location.href = "gasolina.html";
	// }).catch(function(error) {
	//   var errorCode = error.code;
	//   var errorMessage = error.message;
	// });
})

firebase.auth().onAuthStateChanged(function (user) {
	let freePages = ['index', 'login', 'recuperar_senha', 'cadastro'];
	let currentPage = window.location.href.split('/');
	currentPage = currentPage[currentPage.length - 1].split('.');
	currentPage = currentPage[0];

	if (user && freePages.indexOf(currentPage) < 0) {
		var user = firebase.auth().currentUser;
		if (user != null) {
			user.providerData.forEach(function (profile) {
				var email = (profile.email);
				var uid = ("  Codigo do usuario: " + user.uid);
				var name = ("" + profile.displayName);
				var photoURL = (profile.photoURL);
				// console.log(user.providerData);
				document.getElementById("emailUser").innerHTML = email;

				document.getElementById("nameUser").innerHTML = name;

				$('#imagePreview').css('background-image', 'url(' + photoURL + ')');
			});
		}
	} else if (user && freePages.indexOf(currentPage) >= 0) {
		window.location.href = "../views/gasolina.html";
	} else if (!user && freePages.indexOf(currentPage) < 0) {
		window.location.href = "../login/login.html";
	}
	else {
		console.log('user is loged out');
	}
});

//Facebook Auth
$('#facebookAuth').click(() => {
	var provider = new firebase.auth.FacebookAuthProvider();
	firebase.auth().signInWithPopup(provider).then(function (result) {
		// This gives you a Facebook Access Token. You can use it to access the Facebook API.
		var token = result.credential.accessToken;
		// The signed-in user info.
		var user = result.user;
	}).catch(function (error) {
		alert('Falha na autenticação');
		var errorCode = error.code;
		var errorMessage = error.message;
		console.log(errorCode)
		console.log(errorMessage)
	});
});

//Google Auth With Redirect
//$('#googleAuth').click(()=> {
//  var provider = new firebase.auth.GoogleAuthProvider();
//  firebase.auth().signInWithRedirect(provider);
//  firebase.auth().getRedirectResult().then(result=>{
//    if(result.credential){
//      var token = result.credential.accessToken;
//    }
//    var user = result.user;
//  }).catch(err=>{
//    console.log(err.code);
//    console.log(err.message);
//  })
//});

//Google Auth With Popup
$('#googleAuth').click(() => {
	var provider = new firebase.auth.GoogleAuthProvider();
	firebase.auth().signInWithPopup(provider).then(result => {
		// This gives you a Google Access Token. You can use it to access the Google API.
		var token = result.credential.accessToken;
		// The signed-in user info.
		var user = result.user;
	}).catch(error => {
		console.log(error);
		alert('falha na autentificação');
	});

});