// If we need to use custom DOM library, let's save it to $$ variable:
var $$ = Dom7;

var app = new Framework7({
  // App root element
  root: '#app',
  // App Name
  name: 'Tradder',
  // App id
  id: 'com.myapp.test',
  // Enable swipe panel
  panel: {
    swipe: 'left',
  },
  // Add default routes
  routes: [
    { path: '/pagPrin/', url: 'pagPrin.html', },
    { path: '/register/', url: 'register.html', },
    { path: '/login/', url: 'login.html' },
    { path: '/profile/', url: 'profile.html' },
    { path: '/nProduct/', url: 'new_product.html' },
    { path: '/product/', url: 'product.html' },
    { path: '/chat/', url: 'chat.html' },
    { path: '/ownerChats/', url: 'ownerChats.html' },
  ]
  // ... other parameters
});

var mainView = app.views.create('.view-main');

//Expresiones regulares - Formulario de registro
const expression = {
  name: /^[a-zA-ZÀ-ÿ\s]{1,40}$/, // Letras y espacios, pueden llevar acentos.
  password: /^.{6,12}$/, // 6 a 12 digitos.
  email: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
  phone: /^\d{7,14}$/ // 7 a 14 numeros.
}

const fields = {
  Name: false,
  Surname: false,
  Email: false,
  Password: false,
  ConPassword: false,
  Phone: false,
  Birthday: false
}


const fieldsProduct = {
  Name: false,
  Img: false,
  Category: false
}

//Variables de firestore
var db = firebase.firestore(),
  storage = firebase.storage(),
  colUser = db.collection("Users"),
  colProduct = db.collection("Product"),
  colChat = db.collection("Chat"),
  storageRef = firebase.storage().ref();

var photoURL,
  photoName,
  productPhotoRef,
  productPhotoRefPrev;


//Función de registro
function register() {
  var name = $$('#name').val();
  var surname = $$('#surname').val();
  var email = $$('#rEmail').val();
  var password = $$('#rPassword').val();
  var phone = $$('#rPhone').val();
  var birthday = $$('#rBirthday').val();

  firebase.auth().createUserWithEmailAndPassword(email, password)
    .then((userCredential) => {
      // Signed in
      var user = userCredential.user;
      // ...

      firebase.auth().currentUser.sendEmailVerification()
        .then(() => {
          passOfCollection = firebase.auth().currentUser.uid;

          data = {
            rol: "User",
            name: name,
            surname: surname,
            email: email,
            password: password,
            phone: phone,
            birthday: birthday
          }

          colUser.doc(passOfCollection).set(data)
            .then(() => {
              emailVerification();
              // "Document successfully written!"
            })
            .catch((error) => {
              // "Error writing document"
            });

          $$('.form_body input').val('');

          $$('#form-message-error').removeClass('is-active');
          $$('#form-message-exito').addClass('is-active');
          setTimeout(() => {
            $$('#form-message-exito').removeClass('is-active');
          }, 5000);

          $$('.form_body .group.group-correct').removeClass('group-correct');

          fields.Name = false;
          fields.Surname = false;
          fields.Password = false;
          fields.ConPassword = false;
          fields.Email = false;
          fields.Phone = false;
          fields.Birthday = false;

          mainView.router.navigate('/pagPrin/');
          logged = false;
          isLogged = true;
          // // Email verification sent!
          // // ...
        });
    })
    .catch((error) => {
      var errorCode = error.code;
      var errorMessage = error.message;
      // ..

      if (errorCode == 'auth/email-already-in-use') {
        $$('.form_body input').val('');
        $$('.form_body .group').removeClass('group-incorrect');
        $$('.form_body .group').removeClass('group-correct');
        $$('#gEmail > i').removeClass('fa-solid fa-check');
        $$('#gEmail > i').removeClass('fa-regular fa-circle-xmark');
        $$('#form-message-error').addClass('is-active');
        $$('#form-message-error span').html('El email ya esta en uso');
      }
    });
}

//Función de ingreso
function login() {
  var email = $$('#lEmail').val();
  var password = $$('#lPassword').val();

  firebase.auth().signInWithEmailAndPassword(email, password)
    .then((userCredential) => {
      // Signed in
      var user = userCredential.user;

      $$('#form-message-error-login').removeClass('is-active');
      mainView.router.navigate('/pagPrin/');
      logged = false;
      isLogged = true;
      // ...
    })
    .catch((error) => {
      var errorCode = error.code;
      var errorMessage = error.message;

      if (errorCode == 'auth/user-not-found') {
        $$('#form-message-error-login').addClass('is-active');
        $$('#form-message-error-login span').html('El email no está registrado')
      }
      else if (errorCode == 'auth/wrong-password') {
        $$('#form-message-error-login').addClass('is-active')
        $$('#form-message-error-login span').html('La contraseña es errónea')
      }
      else if (errorCode == 'auth/too-many-requests') {
        // Access to this account has been temporarily disabled due to many failed login attempts.You can immediately restore it by resetting your password or you can try again later.
      }
    });

}

//Función para cerrar sesión
function signOut() {
  firebase.auth().signOut()
    .then(() => {
      mainView.router.navigate('/pagPrin/');
      mainView.router.refreshPage();
    }).catch((error) => {
      // An error happened.
    });
}

//Función para validar el formulario
function formValidation(e) {
  switch (e.target.name) {
    case 'Name':
      fieldValidation(expression.name, e.target, 'Name');
      break;

    case 'Surname':
      fieldValidation(expression.name, e.target, 'Surname');
      break;

    case 'Email':
      fieldValidation(expression.email, e.target, 'Email');
      break;

    case 'Password':
      fieldValidation(expression.password, e.target, 'Password');
      passwordValidation();
      break;

    case 'ConPassword':
      passwordValidation();
      break;

    case 'Birthday':
      howOldAreYou(e.target.value);
      break;

    case 'Phone':
      fieldValidation(expression.phone, e.target, 'Phone');
      break;

    case 'pName':
      if (fieldValidation(expression.name, e.target, 'Name')) {
        fieldsProduct.Name = true;
      }
      break;
  }
}

//Función para calcular la mayoria de edad (a medias)
function howOldAreYou(input) {
  var date = new Date();
  var today = date.getFullYear();

  var year = new Date(input).getFullYear();
  var age = today - year;

  if (age <= 70 && age >= 18) {
    $$('#gBirthday').removeClass('group-incorrect');
    $$('#gBirthday').addClass('group-correct');

    $$('#gBirthday > i').removeClass('fa-regular fa-circle-xmark');
    $$('#gBirthday > i').addClass('fa-solid fa-check');

    $$('#form-error-Birthday').removeClass('is-active');

    fields['Birthday'] = true;
  } else if (input === '') {
    $$('#gBirthday').removeClass('group-correct');
    $$('#gBirthday').removeClass('group-incorrect');
    $$('#form-error-Birthday').removeClass('is-active');

    fields['Birthday'] = false;
  } else {
    $$('#gBirthday').removeClass('group-correct');
    $$('#gBirthday').addClass('group-incorrect');

    $$('#gBirthday > i').removeClass('fa-solid fa-check');
    $$('#gBirthday > i').addClass('fa-regular fa-circle-xmark');

    $$('#form-error-Birthday').addClass('is-active');

    fields['Birthday'] = false;
  }
}

//Función para validar los campos
function fieldValidation(expression, input, field) {
  if (expression.test(input.value) && input.value != '') {
    $$('#g' + field).removeClass('group-incorrect');
    $$('#g' + field).addClass('group-correct');

    $$('#g' + field + '> i').removeClass('fa-regular fa-circle-xmark');
    $$('#g' + field + '> i').addClass('fa-solid fa-check');

    $$('#form-error-' + field).removeClass('is-active');

    fields[field] = true;
    return true;
  }
  else if (input.value == '') {
    $$('#g' + field).removeClass('group-correct');
    $$('#g' + field).removeClass('group-incorrect');
    $$('#form-error-' + field).removeClass('is-active');

    fields[field] = false;
  }
  else {
    $$('#g' + field).removeClass('group-correct');
    $$('#g' + field).addClass('group-incorrect');

    $$('#g' + field + '> i').removeClass('fa-solid fa-check');
    $$('#g' + field + '> i').addClass('fa-regular fa-circle-xmark');

    $$('#form-error-' + field).addClass('is-active');

    fields[field] = false;
  }
}

//Función para validar la contraseña
function passwordValidation() {
  password = $$('#rPassword').val();
  conPassword = $$('#rConPassword').val();

  if (password !== conPassword) {
    $$('#gConPassword').removeClass('group-correct');
    $$('#gConPassword').addClass('group-incorrect');

    $$('#gConPassword > i').removeClass('fa-solid fa-check');
    $$('#gConPassword > i').addClass('fa-regular fa-circle-xmark');

    $$('#form-error-ConPassword').addClass('is-active');

    fields['ConPassword'] = false;
  } else if (conPassword !== '') {
    $$('#gConPassword').removeClass('group-incorrect');
    $$('#gConPassword').addClass('group-correct');

    $$('#gConPassword > i').removeClass('fa-regular fa-circle-xmark');
    $$('#gConPassword > i').addClass('fa-solid fa-check');

    $$('#form-error-ConPassword').removeClass('is-active');

    fields['ConPassword'] = true;
  }
}

//Función para verificar el email
function emailVerification() {
  var user = firebase.auth().currentUser;
  user.reload();

  if (user.emailVerified === true) {
    mainView.router.navigate('/pagPrin/');
    logged = false;
    isLogged = true;
  }
}

//Función que muestra el menu de "mi perfil"
function menuToggle() {
  const toggleMenu = $$('.menu-acc');
  toggleMenu.toggleClass('active');
}

//Función que abre el menu reponsive
function hamburgerToggle() {
  $$('.hamburger.button.no-ripple').toggleClass('is-active');
  $$('.menu-mobile').toggleClass('is-active');
}

//Función para activiar y desactivar los botones en mi perfil
function tabs(panelIndex) {
  if (panelIndex === 0) {
    $$('.profile.tabShow').addClass('is-active').siblings().removeClass('is-active');
  }
  else {
    $$('.security.tabShow').addClass('is-active').siblings().removeClass('is-active');
  }
}


// Función para desplegar la lista de categorias
function optionListCategory() {
  var selected = $$('.selected');
  var optionsContainer = $$('.options-container');
  var optionsList = $$('.option');

  selected.on('click', function () {
    optionsContainer.toggleClass('active');
  })

  optionsList.forEach(function (item) {
    $$(item).on('click', function () {
      selected.html($$(item).children('label').html());
      optionsContainer.removeClass('active');

      fieldsProduct.Category = true;
    })
  })
}

var productPrev = true;

// Función para poner una imagen y agregar su nombre en el recuadro
function defaultBtnActive() {
  var wrapper = $$('.wrapper');
  var fileName = $$('.file-name');
  var cancelBtn = $$('#cancel-btn');
  var defaultBtn = $$('#default-btn');
  var img = $$('.image img');
  var text = $$('.text');

  var productNew = false;

  var regExp = /[0-9a-zA-Z\^\&\'\@\{\}\[\]\,\$\=\!\-\#\(\)\.\%\+\~\_ ]+$/;

  defaultBtn.click();
  defaultBtn.on('change', function () {
    if (productNew === false) {
      var imgUID = randomUID();
      productPhotoRef = storageRef.child('images/Products/' + imgUID);
      var file = this.files[0];

      if (fieldsProduct.Img === true && productPrev === false) {
        productPhotoRefPrev.delete().then(function () {
          // File deleted successfully
          progressArea.html('');
          img.attr('src', '');
          wrapper.removeClass('active');
        }).catch(function (error) {
          // Uh-oh, an error occurred!
        });
      }

      productPhotoRefPrev = productPhotoRef;

      var totalBytes,
        progressArea = $$('.progress-area');

      var uploadTask = productPhotoRef.put(file);

      uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED,
        function (snapshot) {
          var progress = Math.floor((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
          totalBytes = Math.floor(snapshot.totalBytes / 1000);

          var progressHTML = `<li class="row">
                                  <i class="fas fa-file-alt"></i>
                                  <div class="content-progress-area">
                                      <div class="details-progress-area">
                                          <span class="name-progress-area">${file.name} • Uploading</span>
                                          <span class="percent">${progress}%</span>
                                      </div>
                                      <div class="progress-bar">
                                          <div class="progress" style="width: ${progress}%"></div>
                                      </div>
                                  </div>
                              </li>`;

          progressArea.html(progressHTML);
          text.html('');

          switch (snapshot.state) {
            case firebase.storage.TaskState.PAUSED:
              // 'Upload is paused'
              break;
            case firebase.storage.TaskState.RUNNING:
              // 'Upload is running'
              break;
          }
        }, function (error) {
          switch (error.code) {
            case 'storage/unauthorized':
              // User doesn't have permission to access the object
              break;
            case 'storage/canceled':
              // User canceled the upload
              break;
            case 'storage/unknown':
              // Unknown error occurred, inspect error.serverResponse
              break;
          }
        }, function () {
          uploadTask.snapshot.ref.getDownloadURL().then(function (downloadURL) {
            photoURL = downloadURL;
            photoName = imgUID;

            if (file) {
              var reader = new FileReader();
              reader.onload = function () {
                var result = reader.result;
                img.attr('src', result);
                wrapper.addClass('active');
                img.css("display", "block");
              }
              cancelBtn.on('click', function () {
                if (fieldsProduct.Img === true) {
                  fieldsProduct.Img = false;

                  productPhotoRef.delete().then(function () {
                    // File deleted successfully
                    text.html('No se eligió una imagen aún!');

                  }).catch(function (error) {
                    // Uh-oh, an error occurred!
                  });
                }

                progressArea.html('');
                img.attr('src', '');
                wrapper.removeClass('active');
              })
              reader.readAsDataURL(file);
            }

            if (file.name) {
              var valueStore = file.name.match(regExp);
              fileName.html(`${valueStore} • ${totalBytes}KB`);

              fieldsProduct.Img = true;
            }
          });
        });

      productPrev = false;
      productNew = true;
    }
  })
}

//Función para cambiar la contraseña
function securityChange(panelIndex) {
  var user = firebase.auth().currentUser;
  var docRef = db.collection('Users').doc(user.uid);
  var password = false;

  if (panelIndex === 0) {
    password = true;
  } else {
    password = false;
  }

  if (password) {
    var newPassword = $$('#pPassword').val();

    if (expression.password.test(newPassword)) {
      user.updatePassword(newPassword).then(() => {
        // Update successful.
        return docRef.update({
          password: newPassword
        })
          .then(() => {
            // "Document successfully updated!"
          })
          .catch((error) => {
            // The document probably doesn't exist.
            // "Error updating document"
          });
      }).catch((error) => {
        // An error ocurred
        // ...
      });

      alert('Contraseña cambiada con éxito');
      $$('#btn-cEmail').css('display', 'block');
      $$('#btn-cPassword').css('display', 'block');

      $$('#btn-pSecurity-password').css('display', 'none');
      $$('#pPassword').prop('disabled', true);
    } else {
      alert('Contraseña invalida');
      $$('#pPassword').val('');
    }
  } else {
    var newEmail = $$('#pEmail').val();

    if (expression.email.test(newEmail)) {
      user.updateEmail(newEmail).then(() => {
        // Update successful.
        return docRef.update({
          email: newEmail
        })
          .then(() => {
            // "Document successfully updated!"
          })
          .catch((error) => {
            // The document probably doesn't exist.
            // "Error updating document"
          });
      }).catch((error) => {
        // An error ocurred
        // ...
      });

      alert('Email cambiado con éxito');
      $$('#btn-cEmail').css('display', 'block');
      $$('#btn-cPassword').css('display', 'block');

      $$('#btn-pSecurity-email').css('display', 'none');
      $$('#pEmail').prop('disabled', true);
    } else {
      alert('Email invalido');
      $$('#pEmail').val('');
    }
  }
}

//Generar un numero aleatorio de muchos caracteres
function randomUID() {
  return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
    (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
  );
}

//Función para publicar un producto
function publishProduct(photoURL, photoName) {
  if (fieldsProduct.Name === true && fieldsProduct.Img === true && fieldsProduct.Category === true) {
    var name = $$('#nName').val();
    var category = $$('.selected').html();
    var description = $$('#nDescription').val();

    userID = firebase.auth().currentUser.uid;
    productID = randomUID();

    data = {
      rol: "Product",
      name: name,
      category: category,
      description: description,
      userID: userID,
      photoURL: photoURL,
      photoName: photoName,
      productID: productID
    }

    colProduct.doc(productID).set(data)
      .then(() => {
        // "Document successfully written!"
        mainView.router.navigate('/pagPrin/');
        logged = false;
        isLogged = true;

        $$('#form-message-exito').addClass('is-active');
        $$('#form-message-error').removeClass('is-active');

        fieldsProduct.Name = true;
        fieldsProduct.Img = true;
        fieldsProduct.Category = true;
      })
      .catch((error) => {
        // "Error writing document"
      });
  } else {
    $$('#form-message-exito').removeClass('is-active');
    $$('#form-message-error').addClass('is-active');
  }
}

// Handle Cordova Device Ready Event
$$(document).on('deviceready', function () {
  // verifica que el localStorage sea null para mostrar el mensaje
  if (!localStorage.getItem('ingreso')) {
    $$('.page[data-name="index"]').css('display', 'block');
    // estableces el localstorage en 1 para que no se vuelva a cumplir la condicion
    localStorage.setItem('ingreso', 1);
  } else {
    mainView.router.navigate('/pagPrin/');
  }
});

// Option 1. Using one 'page:init' handler for all pages
$$(document).on('page:init', function (e) {
  const metaViewport = document.querySelector('meta[name=viewport]');
  var initialHeight = $$('.page-content').height();
  metaViewport.setAttribute('content', 'height=' + initialHeight + 'px, width=device-width, initial-scale=1.0');

  productPrev = true;

  if (fieldsProduct.Img === true && fieldsProduct.Name === false || fieldsProduct.Category === false) {
    $$('#cancel-btn').click();
  }

  $$('.tNavbar').on('click', function () {
    mainView.router.navigate('/pagPrin/');
    logged = false;
    isLogged = true;
  })

  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      $$('#home').css('display', 'none');
      $$('#login').css('display', 'none');
      $$('#signUp').css('display', 'none');
      $$('.hamburger.button.no-ripple').css('display', 'none');

      $$('#myAcc').css('display', 'block');
      $$('#donar').css('display', 'block');
      $$('#signOut').on('click', signOut);

      var user = firebase.auth().currentUser;
      var docRefUser = colUser.doc(user.uid);

      docRefUser.onSnapshot((doc) => {
        if (doc.exists) {
          $$('.menu-acc h3').html(doc.data().name + ' ' + doc.data().surname);

          //Info Personal
          $$('#pFullName').val(doc.data().name + ' ' + doc.data().surname);
          $$('#pPhone').val(doc.data().phone);
          $$('#pBirthday').val(doc.data().birthday);

          //Info de seguridad
          $$('#pEmail').val(doc.data().email);
          $$('#pPassword').val(doc.data().password);
        } else {
          // 'No such document!'
        }
      })
    } else {
      $$('#home').css('display', 'block');
      $$('#login').css('display', 'block');
      $$('#signUp').css('display', 'block');
      $$('#myAcc').css('display', 'none');
      $$('#donar').css('display', 'none');

      $$('#chat-product').attr('disabled', 'true');
      $$('#chat-product').css('background', '#7a6e32');
    }
  });
})

var logged = false;
var isLogged = true;
var docProduct;

$$(document).on('page:init', '.page[data-name="pagPrin"]', function (e) {
  optionListCategory();

  colProduct.onSnapshot((querySnapshot) => {
    $$('.container-card').html('');
    querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots

      $$('.container-card').append($$(`
      <div class="card"> 
        <div class="imgBx"> 
          <img src="${doc.data().photoURL}">
        </div> 
        <div class="content"> 
          <div class="productName"> 
            <h3> ${doc.data().name} </h3> 
          </div> 
          <div class="category-rating"> 
            <h2> ${doc.data().category} </h2> 
          </div> 
        </div> 
      </div>`))
    });
  });

  $$('.option').on('click', function () {
    switch ($$(this).attr('name')) {
      case 'all':
        colProduct.onSnapshot((querySnapshot) => {
          $$('.container-card').html('');
          querySnapshot.forEach((doc) => {
            // doc.data() is never undefined for query doc snapshots

            $$('.container-card').append($$(`
            <div class="card"> 
              <div class="imgBx"> 
                <img src="${doc.data().photoURL}">
              </div> 
              <div class="content"> 
                <div class="productName"> 
                  <h3> ${doc.data().name} </h3> 
                </div> 
                <div class="category-rating"> 
                  <h2> ${doc.data().category} </h2> 
                </div> 
              </div> 
            </div>`))
          });
        });
        break;

      case 'metal':
        colProduct.where('category', '==', 'Metal').onSnapshot((querySnapshot) => {
          $$('.container-card').html('');
          querySnapshot.forEach((doc) => {
            // doc.data() is never undefined for query doc snapshots

            $$('.container-card').append($$(`
            <div class="card"> 
              <div class="imgBx"> 
                <img src="${doc.data().photoURL}">
              </div> 
              <div class="content"> 
                <div class="productName"> 
                  <h3> ${doc.data().name} </h3> 
                </div> 
                <div class="category-rating"> 
                  <h2> ${doc.data().category} </h2> 
                </div> 
              </div> 
            </div>`))
          });
        });
        break;

      case 'glass':
        colProduct.where('category', '==', 'Vidrio').onSnapshot((querySnapshot) => {
          $$('.container-card').html('');
          querySnapshot.forEach((doc) => {
            // doc.data() is never undefined for query doc snapshots

            $$('.container-card').append($$(`
            <div class="card"> 
              <div class="imgBx"> 
                <img src="${doc.data().photoURL}">
              </div> 
              <div class="content"> 
                <div class="productName"> 
                  <h3> ${doc.data().name} </h3> 
                </div> 
                <div class="category-rating"> 
                  <h2> ${doc.data().category} </h2> 
                </div> 
              </div> 
            </div>`))
          });
        });
        break;

      case 'cardboard':
        colProduct.where('category', '==', 'Cartón').onSnapshot((querySnapshot) => {
          $$('.container-card').html('');
          querySnapshot.forEach((doc) => {
            // doc.data() is never undefined for query doc snapshots

            $$('.container-card').append($$(`
            <div class="card"> 
              <div class="imgBx"> 
                <img src="${doc.data().photoURL}">
              </div> 
              <div class="content"> 
                <div class="productName"> 
                  <h3> ${doc.data().name} </h3> 
                </div> 
                <div class="category-rating"> 
                  <h2> ${doc.data().category} </h2> 
                </div> 
              </div> 
            </div>`))
          });
        });
        break;

      case 'wood':
        colProduct.where('category', '==', 'Madera').onSnapshot((querySnapshot) => {
          $$('.container-card').html('');
          querySnapshot.forEach((doc) => {
            // doc.data() is never undefined for query doc snapshots

            $$('.container-card').append($$(`
            <div class="card"> 
              <div class="imgBx"> 
                <img src="${doc.data().photoURL}">
              </div> 
              <div class="content"> 
                <div class="productName"> 
                  <h3> ${doc.data().name} </h3> 
                </div> 
                <div class="category-rating"> 
                  <h2> ${doc.data().category} </h2>  
                </div> 
              </div> 
            </div>`))
          });
        });
        break;

      case 'reusable':
        colProduct.where('category', '==', 'Reutilizable').onSnapshot((querySnapshot) => {
          $$('.container-card').html('');
          querySnapshot.forEach((doc) => {
            // doc.data() is never undefined for query doc snapshots

            $$('.container-card').append($$(`
            <div class="card"> 
              <div class="imgBx"> 
                <img src="${doc.data().photoURL}">
              </div> 
              <div class="content"> 
                <div class="productName"> 
                  <h3> ${doc.data().name} </h3> 
                </div> 
                <div class="category-rating"> 
                  <h2> ${doc.data().category} </h2> 
                </div> 
              </div> 
            </div>`))
          });
        });
        break;

      case 'biodegradable':
        colProduct.where('category', '==', 'Biodegradable').onSnapshot((querySnapshot) => {
          $$('.container-card').html('');
          querySnapshot.forEach((doc) => {
            // doc.data() is never undefined for query doc snapshots

            $$('.container-card').append($$(`
            <div class="card"> 
              <div class="imgBx"> 
                <img src="${doc.data().photoURL}">
              </div> 
              <div class="content"> 
                <div class="productName"> 
                  <h3> ${doc.data().name} </h3> 
                </div> 
                <div class="category-rating"> 
                  <h2> ${doc.data().category} </h2> 
                </div> 
              </div> 
            </div>`))
          });
        });
        break;
    }
  })

  $$('body').on('click', '.card img', function () {
    colProduct.where("photoURL", "==", this.src)
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          // doc.data() is never undefined for query doc snapshots
          docProduct = doc.id;
          mainView.router.navigate('/product/');
        });
      })
      .catch((error) => {
        // "Error getting documents"
      });
  })
})

var userChatID;
var chatID;

$$(document).on('page:init', '.page[data-name="product"]', function (e) {
  var userID = firebase.auth().currentUser;

  colProduct.doc(docProduct).onSnapshot((doc) => {
    if (doc.exists) {
      $$('.product-title').html(doc.data().name);
      $$('.img-showcase img').attr('src', doc.data().photoURL);
      $$('#pCategory').html(doc.data().category);
      $$('.product-detail p').html(doc.data().description);

      colUser.doc(doc.data().userID).onSnapshot((doc) => {
        $$('.name-donor span').html(doc.data().name + ' ' + doc.data().surname);
      })

      firebase.auth().onAuthStateChanged((user) => {
        if (user) {
          if (doc.data().userID == user.uid) {
            $$('#chat-product').css('display', 'none');
            $$('#delete-product').css('display', 'inline-block');
          }

          colChat.where('pURL', '==', doc.data().photoURL).get().then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
              if (doc.data().sender == user.uid) {
                $$('#chat-product').attr('disabled', 'true');
                $$('#chat-product').css('background', '#7a6e32');
              }
            })
          })
        }
      })

      $$('#chat-product').on('click', function () {
        colProduct.where('photoURL', '==', doc.data().photoURL)
          .get()
          .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
              // doc.data() is never undefined for query doc snapshots
              userChatID = doc.data().userID;
              chatID = randomUID();

              colChat.doc(chatID).set({
                chatID: chatID,
                receiver: userChatID,
                sender: userID.uid,
                pURL: doc.data().photoURL,
                pName: doc.data().name
              })
                .then(() => {
                  // Document successfully written!
                })
                .catch((error) => {
                  // "Error writing document"
                });

              colProduct.doc(doc.data().productID).update({
                chatID: chatID
              })
                .then(() => {
                  // "Document successfully updated!"
                })
                .catch((error) => {
                  // The document probably doesn't exist.
                  // "Error updating document:"
                });

              mainView.router.navigate('/chat/');
            });
          })
          .catch((error) => {
            // "Error writing document"
          });
      })

      $$('#delete-product').on('click', function () {
        var chatExists = false;

        colChat.where('pURL', '==', doc.data().photoURL).get().then((querySnapshot) => {
          querySnapshot.forEach((document) => {
            firebase.database().ref('chat' + '-' + doc.data().chatID).set({
              message: null,
              name: null
            }, (error) => {
              if (error) {
                // The write failed...
              } else {
                // Data saved successfully!
                storageRef.child('images/Products/' + doc.data().photoName).delete().then(function () {
                  // File deleted successfully
                  colChat.doc(doc.data().chatID).delete().then(() => {
                    colProduct.doc(docProduct).delete().then(() => {
                      chatExists = true;
                      mainView.router.navigate('/pagPrin/');
                    }).catch((error) => {
                      //  "Error removing document:"
                    });
                  }).catch((error) => {
                    // "Error removing document:"
                  })
                }).catch(function (error) {
                  // Uh-oh, an error occurred!
                });
              }
            });
          })
        })

        if (!chatExists) {
          storageRef.child('images/Products/' + doc.data().photoName).delete().then(function () {
            // File deleted successfully
            colProduct.doc(docProduct).delete().then(() => {
              mainView.router.navigate('/pagPrin/');
            }).catch((error) => {
              //  "Error removing document:"
            });
          }).catch(function (error) {
            // Uh-oh, an error occurred!
          });
        }
      })
    } else {
      // doc.data() will be undefined in this case
      // "No such document!"
    }
  })
})

$$(document).on('page:init', '.page[data-name="registro"]', function (e) {
  $$('#name').focus();

  $$('input').on('keyup', formValidation);
  $$('input').on('blur', formValidation);

  $$('#rButton').on('click', function (e) {
    e.preventDefault();

    if (fields.Name && fields.Surname && fields.Password && fields.ConPassword && fields.Email && fields.Phone && fields.Birthday) {
      register();
    } else {
      $$('.form_body input').val('');
      $$('.form_body .group').addClass('group-incorrect');

      $$('.form-val-status').removeClass('fa-solid fa-check');
      $$('.form-val-status').addClass('fa-regular fa-circle-xmark');

      $$('#form-message-exito').removeClass('is-active');
      $$('#form-message-error').addClass('is-active');

      fields.Name = false;
      fields.Surname = false;
      fields.Password = false;
      fields.ConPassword = false;
      fields.Email = false;
      fields.Phone = false;
      fields.Birthday = false;
    }
  });
})

$$(document).on('page:init', '.page[data-name="login"]', function (e) {
  $$('#lEmail').focus();

  $$('#lButton').on('click', function (e) {
    e.preventDefault();
    login();
  });
})

$$(document).on('page:init', '.page[data-name="profile"]', function (e) {
  tabs(0);

  $$('.tab').on('click', function () {
    $$(this).addClass('active').siblings().removeClass('active');
  })

  $$('#btn-cPassword').on('click', function () {
    $$('#pPassword').prop('disabled', false);
    $$('#pPassword').attr('placeholder', 'inserte nueva contraseña');
    $$('#btn-pSecurity-password').css('display', 'block');
    $$('#pPassword').val('');

    $$('#btn-cEmail').css('display', 'none');
    $$('#btn-cPassword').css('display', 'none');
  })

  $$('#btn-cEmail').on('click', function () {
    $$('#pEmail').prop('disabled', false);
    $$('#pEmail').attr('placeholder', 'inserte nuevo email');
    $$('#btn-pSecurity-email').css('display', 'block');
    $$('#pEmail').val('');

    $$('#btn-cEmail').css('display', 'none');
    $$('#btn-cPassword').css('display', 'none');
  })
})

$$(document).on('page:init', '.page[data-name="new_product"]', function (e) {
  $$('input').on('keyup', formValidation);
  $$('input').on('blur', formValidation);

  e.preventDefault();

  var img = $$('.image img');
  img.on('error', function (e) {
    $$(e.target).css("display", "none");
  });

  optionListCategory();

  $$('#new_pButton').on('click', function (e) {
    e.preventDefault();
    publishProduct(photoURL, photoName);
  });
})

$$(document).on('page:init', '.page[data-name="chat"]', function (e) {
  var txtMessage = $$('#message-chat');
  var btnSend = $$('#btn-chat');
  var bChat = $$('.body-chat');
  var user = firebase.auth().currentUser;

  txtMessage.focus();
  colUser.doc(user.uid).get().then((doc) => {
    if (doc.exists) {
      btnSend.on('click', function (e) {
        e.preventDefault();

        if (txtMessage.val() !== '') {
          var message = txtMessage.val();
          var completeName = doc.data().name + ' ' + doc.data().surname;

          txtMessage.val('');

          firebase.database().ref('chat' + '-' + chatID).push({
            name: completeName,
            message: message
          })
        }
      })

      firebase.database().ref('chat' + '-' + chatID).on('value', function (snapshot) {
        var html = '';

        snapshot.forEach(function (e) {
          var element = e.val();
          var name = element.name;
          var message = element.message;
          var completeName = doc.data().name + ' ' + doc.data().surname

          if (name === completeName) {
            html += `<p class="message-chat user-message"><b> ${name}: </b> ${message} </p>`;
          } else {
            html += `<p class="message-chat"><b> ${name}: </b> ${message} </p>`;
          }

        })

        bChat.html(html);
      })
    } else {
      // doc.data() will be undefined in this case
      // "No such document!"
    }
  }).catch((error) => {
    // "Error getting document"
  });
})


$$(document).on('page:init', '.page[data-name="ownerChats"]', function (e) {
  var user = firebase.auth().currentUser;

  colChat.where("receiver", "==", user.uid).onSnapshot((querySnapshot) => {
    $$('.container-owner-chats').html('');
    querySnapshot.forEach((doc) => {
      colUser.doc(doc.data().sender).get().then((docUser) => {
        if (docUser.exists) {
          $$('.container-owner-chats').append(`
              <div class="cards-owner-chats">
                  <figure>
                      <img src="${doc.data().pURL}">
                  </figure>
                  <div class="content-owner-chats">
                      <h3>${doc.data().pName}</h3>
                      <p> <b>Para:</b> Donar el producto</p>
                      <p> <b>A:</b> ${docUser.data().name + ' ' + docUser.data().surname}</p>
                      <a href="#" name="${doc.data().chatID}">Entrar al chat</a>
                  </div>
              </div>`);
        }
      })
    });
  })

  colChat.where("sender", "==", user.uid)
    .get()
    .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        colUser.doc(doc.data().receiver).get().then((docUser) => {
          if (docUser.exists) {
            $$('.container-owner-chats').append(`
                <div class="cards-owner-chats">
                    <figure>
                        <img src="${doc.data().pURL}">
                    </figure>
                    <div class="content-owner-chats">
                        <h3>${doc.data().pName}</h3>
                        <p> <b>Para:</b> Recibir el producto</p>
                        <p> <b>De:</b> ${docUser.data().name + ' ' + docUser.data().surname}</p>
                        <a href="#" name="${doc.data().chatID}">Entrar al chat</a>
                    </div>
                </div>`);
          }
        })
      });
    })
    .catch((error) => {
      // "Error getting document"
    });

  $$('body').on('click', '.content-owner-chats a', function () {
    chatID = this.name;
    mainView.router.navigate('/chat/');
  })
})

//slider
$$('#preNext').click(function () {
  var width = $$('.swiper-slide').width();
  width -= width * 2;

  $$('#slider').css('transform', 'translate3d(' + width + 'px, 0px, 0px)');
  $$('#slider').css('transition', '.5s');
});