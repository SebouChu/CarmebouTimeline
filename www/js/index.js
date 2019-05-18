//   ____ _____ ___  ____      _    ____ _____
//  / ___|_   _/ _ \|  _ \    / \  / ___| ____|
//  \___ \ | || | | | |_) |  / _ \| |  _|  _|
//   ___) || || |_| |  _ <  / ___ \ |_| | |___
//  |____/ |_| \___/|_| \_\/_/   \_\____|_____|

var storageService = {
    data: null,

    init: function () {
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

    addItem: function (itemData) {
        itemData.uid = this.generateUid();
        itemData.createdAt = new Date();

        this.data.push(itemData)

        this.persist();
    },

    generateUid: function () {
        var arr = new Uint8Array(5),
            hexArr = [],
            i;

        (window.crypto || window.msCrypto).getRandomValues(arr);
        for (i = 0; i < arr.length; i += 1) {
            hexArr[i] = ('0' + arr[i].toString(16)).substr(-2);
        }

        return hexArr.join('');
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

//    ____ _____ ___  _     ___   ____
//   / ___| ____/ _ \| |   / _ \ / ___|
//  | |  _|  _|| | | | |  | | | | |
//  | |_| | |__| |_| | |__| |_| | |___
//   \____|_____\___/|_____\___/ \____|

var geolocService = {
    geolocateUser: function (callback) {
        navigator.geolocation.getCurrentPosition(
            callback,
            this.alertError.bind(this)
        );
    },

    alertError: function (error) {
        alert('Error code ' + error.code + ': ' + error.message);
    }
}

//   _____ ___  ____  __  __   __  __    _    _   _    _    ____ _____ ____
//  |  ___/ _ \|  _ \|  \/  | |  \/  |  / \  | \ | |  / \  / ___| ____|  _ \
//  | |_ | | | | |_) | |\/| | | |\/| | / _ \ |  \| | / _ \| |  _|  _| | |_) |
//  |  _|| |_| |  _ <| |  | | | |  | |/ ___ \| |\  |/ ___ \ |_| | |___|  _ <
//  |_|   \___/|_| \_\_|  |_| |_|  |_/_/   \_\_| \_/_/   \_\____|_____|_| \_\

var formManager = {
    toggler: undefined,
    wrapper: undefined,
    form: undefined,
    navItems: [],
    inputs: [],

    init: function () {
        this.toggler = document.querySelector('#showFormButton');
        this.wrapper = document.querySelector('#itemFormWrapper');
        this.form = document.querySelector('form#itemForm');

        if (!this.toggler || !this.wrapper || !this.form) {
            return;
        }

        this.form.addEventListener('submit', this.handleSubmit.bind(this));

        this.initToggler();
        this.initNav();
        this.initTabs();
    },

    initToggler: function () {
        this.toggler.addEventListener('click', function () {
            formManager.wrapper.classList.toggle('active');
        });
    },

    initNav: function () {
        this.navItems = this.form.querySelectorAll('.form-nav-item');

        var i;
        for (i = 0; i < this.navItems.length; i += 1) {
            this.navItems[i].addEventListener('click', function () {
                formManager.toggleTab(this.getAttribute('data-target'));
            });
        }
    },

    toggleTab: function (tabSelector) {
        var tab = this.form.querySelector(tabSelector);
        if (tab) {
            tab.classList.toggle('active');
        }
    },

    initTabs: function () {
        this.initTextTab();
        this.initPictureTab();
        this.initVideoTab();
        this.initLocationTab();
    },

    initTextTab: function () {
        var textTab = this.form.querySelector('#textTab');
        if (!textTab) {
            return;
        }

        var textInput = textTab.querySelector('#textInput');
        this.inputs.push(textInput);
    },

    initPictureTab: function () {
        var pictureTab = this.form.querySelector('#pictureTab');
        if (!pictureTab) {
            return;
        }

        var pictureInput = pictureTab.querySelector('#pictureInput'),
            actionBtns = pictureTab.querySelectorAll('button'),
            previewImg = pictureTab.querySelector('img'),
            i;

        for (i = 0; i < actionBtns.length; i += 1) {
            actionBtns[i].addEventListener('click', function () {
                var sourceType = this.getAttribute('data-source');
                cameraService.takePicture(sourceType, function (imageData) {
                    var imagePath = "data:image/jpeg;base64," + imageData;

                    previewImg.src = imagePath;
                    pictureInput.value = imagePath;
                });
            });
        };

        this.inputs.push(pictureInput);
    },

    initVideoTab: function () {
        var videoTab = this.form.querySelector('#videoTab');
        if (!videoTab) {
            return;
        }

        var videoInput = videoTab.querySelector('#videoInput'),
            actionBtn = videoTab.querySelector('button'),
            previewVideo = videoTab.querySelector('video');

        actionBtn.addEventListener('click', function () {
            videoService.captureVideo(function (mediaFiles) {
                var capturedVideo = mediaFiles[0];
                if (!capturedVideo) {
                    return;
                }

                var videoPath = capturedVideo.fullPath;

                previewVideo.src = videoPath;
                videoInput.value = videoPath;
            });
        });

        this.inputs.push(videoInput);
    },

    initLocationTab: function () {
        var locationTab = this.form.querySelector('#locationTab');
        if (!locationTab) {
            return;
        }

        var latitudeInput = locationTab.querySelector('#latitudeInput'),
            longitudeInput = locationTab.querySelector('#longitudeInput'),
            actionBtn = locationTab.querySelector('button'),
            coordsParagraph = locationTab.querySelector('p'),
            mapElt = locationTab.querySelector('#map'),
            leafletMap;

        actionBtn.addEventListener('click', function () {
            geolocService.geolocateUser(function (position) {
                var lat = position.coords.latitude,
                    lon = position.coords.longitude;

                coordsParagraph.textContent = "Coords: " + lat + " / " + lon;
                leafletMap = L.map(mapElt).setView([lat, lon], 11);
                L.tileLayer('https://{s}.tile.openstreetmap.fr/osmfr/{z}/{x}/{y}.png', {
                    minZoom: 1,
                    maxZoom: 20
                }).addTo(leafletMap);
                L.marker([lat, lon]).addTo(leafletMap);

                latitudeInput.value = lat;
                longitudeInput.value = lon;
            });
        });

        this.inputs.push(latitudeInput);
        this.inputs.push(longitudeInput);
    },

    handleSubmit: function (e) {
        e.preventDefault();

        var rawFormData = {},
            i;

        for (i = 0; i < this.inputs.length; i += 1) {
            let key = this.inputs[i].getAttribute('name'),
                value = this.inputs[i].value;

            if (value !== "") {
                rawFormData[key] = value;
            }
        }

        var formData = this.processData(rawFormData);
        storageService.addItem(formData);
    },

    processData: function (rawData) {
        var processedData = {};
        processedData.text = rawData.text;
        processedData.picture = rawData.picture;
        processedData.video = rawData.video;

        if (rawData.hasOwnProperty('latitude') && rawData.hasOwnProperty('longitude')) {
            processedData.location = {
                latitude: parseFloat(rawData.latitude),
                longitude: parseFloat(rawData.longitude),
            };
        }

        return processedData;
    }
}

/////////

var timelineManager = {
    init: function () {
        this.container = document.getElementById("timeline");
        if (!this.container) {
            return;
        }

        storageService.data.forEach(item => {
            console.log(item.uid);
            this.addItem(item);
        });
    },

    addItem: function (item) {
        var itemElement = this.createItemElement(item);
        this.container.appendChild(itemElement);
    },

    createItemElement: function (item) {
        var element = document.createElement('div');
        element.setAttribute('class', 'timeline__item');
        element.setAttribute('id', `timeline__item-${item.uid}`);


        return element;
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
    },

    onDeviceReady: function () {
        formManager.init();
        timelineManager.init();
    }
};

app.initialize();
