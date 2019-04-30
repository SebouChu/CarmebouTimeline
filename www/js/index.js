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
            this.data.forEach(item => {
                item.createdAt = new Date(item.createdAt);
            });
        } else {
            this.data = [];
            this.persist();
        }
    },

    addPhoto: function (imagePath) {
        this.addData('photo', {path: imagePath});
    },

    addVideo: function (videoPath) {
        this.addData('video', { path: videoPath });
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
            createdAt: new Date()
        })

        this.persist();
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

    alertError: function (message) {
        alert('Failed because: ' + message);
    }
};

//  __     _____ ____  _____ ___
//  \ \   / /_ _|  _ \| ____/ _ \
//   \ \ / / | || | | |  _|| | | |
//    \ V /  | || |_| | |__| |_| |
//     \_/  |___|____/|_____\___/

var videoService = {
    captureVideo: function (callback) {
        navigator.device.capture.captureVideo(
            callback,
            this.alertError.bind(this),
            {
                limit: 1,
                duration: 30,
                quality: 0 // Android only
            }
        )
    },

    alertError: function (error) {
        alert('Error code: ' + error.code, null, 'Capture Error');
    }
}

//      _    ____  ____  _     ___ ____    _  _____ ___ ___  _   _
//     / \  |  _ \|  _ \| |   |_ _/ ___|  / \|_   _|_ _/ _ \| \ | |
//    / _ \ | |_) | |_) | |    | | |     / _ \ | |  | | | | |  \| |
//   / ___ \|  __/|  __/| |___ | | |___ / ___ \| |  | | |_| | |\  |
//  /_/   \_\_|   |_|   |_____|___\____/_/   \_\_| |___\___/|_| \_|

var app = {
    // Application Constructor
    initialize: function () {
        storageService.init();
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
        document.getElementById("showFormButton").addEventListener("click", showForm);

        document.getElementById("showTextButton").addEventListener("click", () => {
            showFormElement('text')
        });
        document.getElementById("showPictureButton").addEventListener("click", () => {
            showFormElement('take-picture')
        });
        document.getElementById("showVideoButton").addEventListener("click", () => {
            showFormElement('capture-video')
        });
        document.getElementById("showLocalisationButton").addEventListener("click", () => {
            showFormElement('localisation')
        });

        showTimeline();
    },

    // deviceready Event Handler
    //
    // Bind any cordova events here. Common events are:
    // 'pause', 'resume', etc.
    onDeviceReady: function () {
        console.log('ready');
        this.initCameraButtons();
        this.initVideoCaptureButton();
    },

    // Update DOM on a Received Event
    initCameraButtons: function () {
        var cameraBtns = document.querySelectorAll('div#take-picture button'),
            targetImg = document.querySelector('div#take-picture img'),
            i;

        for (i = 0; i < cameraBtns.length; i += 1) {
            cameraBtns[i].addEventListener('click', function () {
                var sourceType = this.getAttribute('data-source');
                cameraService.takePicture(sourceType, function (imageData) {
                    var imagePath = "data:image/jpeg;base64," + imageData;
                    targetImg.src = imagePath;

                    storageService.addPhoto(imagePath);
                });
            });
        }
    },

    initVideoCaptureButton: function () {
        var videoCaptureBtn = document.querySelector('div#capture-video button'),
            targetVideo = document.querySelector('div#capture-video video');
        if (!videoCaptureBtn) {
            return;
        }

        videoCaptureBtn.addEventListener('click', function () {
            videoService.captureVideo(function (mediaFiles) {
                var capturedVideo = mediaFiles[0];
                if (!capturedVideo) {
                    return;
                }

                var videoPath = capturedVideo.fullPath;
                targetVideo.src = videoPath;

                storageService.addVideo(videoPath);
            });
        });
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

function showFormElement(id) {
    let elem = document.getElementById(id);
    if (elem.classList.contains('hidden')) {
        elem.classList.remove('hidden')
    } else {
        elem.classList.add('hidden')
    }
}

function showTimeline() {
    let elements = [
        {
            titre: "banane",
            description: "la cure de banane c'est bien",
            image: "",
            video: "",
            localisation: ""
        },
        {
            titre: "patate",
            description: "la cure de patates c'est bien",
            image: "",
            video: "",
            localisation: ""
        }
    ];

    let timeline = document.getElementById("timeline");

    elements.forEach((elem) => {
        let title = document.createElement('h2');
        title.append(elem.titre);
        timeline.appendChild(title);

        let description = document.createElement('p');
        description.append(elem.description);
        timeline.appendChild(description);

        let image = document.createElement('img');
        image.setAttribute('src', elem.image);
        timeline.appendChild(image);

        let video = document.createElement('video');
        video.setAttribute('src', elem.video);
        timeline.appendChild(video);

        let localisation = document.createElement('text')
    })
}

app.initialize();
