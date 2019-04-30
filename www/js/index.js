//   ____ _____ ___  ____      _    ____ _____
//  / ___|_   _/ _ \|  _ \    / \  / ___| ____|
//  \___ \ | || | | | |_) |  / _ \| |  _|  _|
//   ___) || || |_| |  _ <  / ___ \ |_| | |___
//  |____/ |_| \___/|_| \_\/_/   \_\____|_____|

var storageService = {
    data: null,

    init: function () {
        console.log('init storage');
        var rawTimeline = localStorage.getItem("timeline");
        if (rawTimeline) {
            this.data = JSON.parse(rawTimeline);
        } else {
            this.data = [];
            this.persist();
        }
    },

    addPhoto: function () {
        // TODO: Ajouter une photo dans le localStorage
    },

    addVideo: function () {
        // TODO: Ajouter une vidéo dans le localStorage
    },

    addLocation: function () {
        // TODO: Ajouter une géolocalisation dans le localStorage
    },

    addSimpleText: function () {
        // TODO: Ajouter un texte simple dans le localStorage
    },

    addData: function (type, data) {
        this.data.push({
            type: type,
            data: data,
            createdAt: Date.now()
        })
    },

    persist: function () {
        localStorage.setItem("timeline", JSON.stringify(this.data));
    }
};

//    ____    _    __  __ _____ ____      _
//   / ___|  / \  |  \/  | ____|  _ \    / \
//  | |     / _ \ | |\/| |  _| | |_) |  / _ \
//  | |___ / ___ \| |  | | |___|  _ <  / ___ \
//   \____/_/   \_\_|  |_|_____|_| \_\/_/   \_\

var cameraService = {
    takePicture: function (sourceType, callback) {
        if (!Camera.PictureSourceType[sourceType]) {
            return;
        }

        navigator.camera.getPicture(
            callback,
            this.alertError.bind(this),
            {
                quality: 50,
                sourceType: Camera.PictureSourceType[sourceType],
                destinationType: Camera.DestinationType.DATA_URL,
                saveToPhotoAlbum: sourceType == "CAMERA"
            }
        );
    },

    // FIXME: A supprimer quand ça sera implémenté là où il faut
    // displayImage: function (imageData) {
    //     this.image.src = "data:image/jpeg;base64," + imageData;
    // },

    alertError: function(message) {
        alert('Failed because: ' + message);
    }
};

//      _    ____  ____  _     ___ ____    _  _____ ___ ___  _   _
//     / \  |  _ \|  _ \| |   |_ _/ ___|  / \|_   _|_ _/ _ \| \ | |
//    / _ \ | |_) | |_) | |    | | |     / _ \ | |  | | | | |  \| |
//   / ___ \|  __/|  __/| |___ | | |___ / ___ \| |  | | |_| | |\  |
//  /_/   \_\_|   |_|   |_____|___\____/_/   \_\_| |___\___/|_| \_|

var app = {
    // Application Constructor
    initialize: function() {
        storageService.init();
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
        document.getElementById("showFormButton").addEventListener("click", showForm);

        document.getElementById("typeSelection").addEventListener("change", chooseType);
    },

    // deviceready Event Handler
    //
    // Bind any cordova events here. Common events are:
    // 'pause', 'resume', etc.
    onDeviceReady: function() {
        console.log('ready');
        this.initCameraButtons();
    },

    // Update DOM on a Received Event
    initCameraButtons: function(id) {
        var cameraBtns = document.querySelectorAll('div#take-picture button'),
            targetImg = document.querySelector('div#take-picture img'),
            i;

        for (i = 0; i < cameraBtns.length; i += 1) {
            cameraBtns[i].addEventListener('click', function() {
                console.log(this);
                var sourceType = this.getAttribute('data-source');
                cameraService.takePicture(sourceType, function (imageData) {
                    targetImg.src = "data:image/jpeg;base64," + imageData;
                });
            });
        }
    }
};

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
