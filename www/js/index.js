import storageService from './services/storage.js';

var app = {
    // Application Constructor
    initialize: function() {
        storageService.init();
        document.getElementById("showFormButton").addEventListener("click", showForm);

        document.getElementById("typeSelection").addEventListener("change", chooseType);
    },

    // deviceready Event Handler
    //
    // Bind any cordova events here. Common events are:
    // 'pause', 'resume', etc.
    onDeviceReady: function() {
        this.receivedEvent('deviceready');
    },

    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
    }
};

function setLocalStorage(key, value) {
    localStorage.setItem(key, value);
}

function getLocalStorageByKey(key) {
    localStorage.getItem(key)
}

function cameraTakePicture() {
    navigator.camera.getPicture(onSuccess, onFail,
        {
            quality: 50,
            destinationType: Camera.DestinationType.DATA_URL
        });
}

function cameraGetPicture() {
    navigator.camera.getPicture(onSuccess, onFail, {
        quality: 50,
        destinationType: Camera.DestinationType.DATA_URL,
        sourceType: Camera.PictureSourceType.PHOTOLIBRARY
    });
}

function onSuccess(imageData) {
    var image = document.getElementById('myImage');
    image.src = "data:image/jpeg;base64," + imageData;
}

function onFail(message) {
    alert('Failed because: ' + message);
}

function showForm() {
    let form = document.getElementById('add-form');
    if (form.classList.contains('hidden')) {
        form.classList.remove('hidden');
    } else {
        form.classList.add('hidden');
    }
}

function chooseType() {
    let type = document.getElementById('typeSelection').value;
    hideTypes();

    switch (type) {
        case "none": console.log("none"); break;
        case "image":
            document.getElementById("image").classList.remove('hidden');
            break;
        case "video":
            document.getElementById("video").classList.remove('hidden');
            break;
        case "localisation":
            document.getElementById("localisation").classList.remove('hidden');
            break;
        default: break;
    }
}

function hideTypes() {
    document.getElementById("image").classList.add('hidden');
    document.getElementById("video").classList.add('hidden');
    document.getElementById("localisation").classList.add('hidden');
}

app.initialize();
