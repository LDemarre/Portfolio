// Your web app's Firebase configuration
var firebaseConfig = {
    apiKey: "AIzaSyAte-5B6f64RInGydgJDJjuWfY0Q28X-k0",
    authDomain: "led-pixel-table-72595.firebaseapp.com",
    databaseURL: "https://led-pixel-table-72595.firebaseio.com",
    projectId: "led-pixel-table-72595",
    storageBucket: "led-pixel-table-72595.appspot.com",
    messagingSenderId: "515686650568",
    appId: "1:515686650568:web:cb3f0ea09f834f0ca50bfd"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);


document.querySelector("form").addEventListener("submit", e => {
    e.preventDefault();
    const name = e.target.name.value,
        email = e.target.email.value,
        phone = e.target.phone.value,
        message = e.target.message.value;
        
    firebase
        .firestore()
        .collection("formcontact")
        .add({ name, email, phone, message })
        .then(r => {
            console.log(r);
            alert("Consulta enviada");
            $('input[type="text"]').val('');
            $('textarea').val('');
        });
});

