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

        return itemData;
    },

    removeItem: function (itemUid) {
        var index = this.data.findIndex(item => item.uid === itemUid);
        if (index !== -1) {
            this.data.splice(index, 1);
            this.persist();
        }
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

    initMap: function (mapElt, lat, lon) {
        var leafletMap = L.map(mapElt).setView([lat, lon], 11);
        L.tileLayer('https://{s}.tile.openstreetmap.fr/osmfr/{z}/{x}/{y}.png', {
            minZoom: 1,
            maxZoom: 20
        }).addTo(leafletMap);
        L.marker([lat, lon]).addTo(leafletMap);
        mapElt._leaflet_map = leafletMap;
    },

    reloadMap: function (mapElt) {
        mapElt._leaflet_map.invalidateSize();
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
        this.initTitleInput();
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

    initTitleInput: function () {
        var titleInput = this.form.querySelector('#titleInput');
        this.inputs.push(titleInput);
    },

    initTextTab: function () {
        var textTab = this.form.querySelector('#textTab');
        if (!textTab) {
            return;
        }

        var contentInput = textTab.querySelector('#contentInput');
        this.inputs.push(contentInput);
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
                this.classList.toggle('loading');
                var sourceType = this.getAttribute('data-source');
                var self = this;

                cameraService.takePicture(sourceType, function (imageData) {
                    var imagePath = "data:image/jpeg;base64," + imageData;
                    self.classList.toggle('loading');

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
            this.classList.toggle('loading');
            var self = this;

            videoService.captureVideo(function (mediaFiles) {
                var capturedVideo = mediaFiles[0];

                self.classList.toggle('loading');
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
            mapElt = locationTab.querySelector('#map');

        actionBtn.addEventListener('click', function () {
            this.classList.toggle('loading');

            var self = this;
            geolocService.geolocateUser(function (position) {
                var lat = position.coords.latitude,
                    lon = position.coords.longitude;

                coordsParagraph.textContent = "Coords: " + lat + " / " + lon;
                geolocService.initMap(mapElt, lat, lon);
                self.classList.toggle('loading');

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
        var item = storageService.addItem(formData);

        timelineManager.addItem(item);
        this.resetForm();
    },

    processData: function (rawData) {
        var processedData = {};
        processedData.title = rawData.title;
        processedData.content = rawData.content;
        processedData.picture = rawData.picture;
        processedData.video = rawData.video;

        if (rawData.hasOwnProperty('latitude') && rawData.hasOwnProperty('longitude')) {
            processedData.location = {
                latitude: parseFloat(rawData.latitude),
                longitude: parseFloat(rawData.longitude),
            };
        }

        return processedData;
    },

    resetForm: function () {
        var i;
        for (i = 0; i < this.inputs.length; i += 1) {
            this.inputs[i].value = "";
        }

        var previewImg = this.form.querySelector('#pictureTab img');
        previewImg.src = "#";

        var previewVideo = this.form.querySelector('#videoTab video');
        previewVideo.src = "#";

        var locationInfos = this.form.querySelector('#locationTab .location-infos');
        locationInfos.querySelector('p').innerText = "";
        var previewMap = locationInfos.querySelector('#map');
        if (previewMap._leaflet_map) {
            previewMap._leaflet_map.remove();
            previewMap._leaflet_map = null;
        }

        var tabs = this.form.querySelectorAll('.form-tab');
        tabs.forEach(tab => tab.classList.remove('active'));

        formManager.wrapper.classList.toggle('active');
    }
}


//   _____ ___ __  __ _____ _     ___ _   _ _____
//  |_   _|_ _|  \/  | ____| |   |_ _| \ | | ____|
//    | |  | || |\/| |  _| | |    | ||  \| |  _|
//    | |  | || |  | | |___| |___ | || |\  | |___
//    |_| |___|_|  |_|_____|_____|___|_| \_|_____|

var timelineManager = {
    init: function () {
        this.container = document.getElementById("timeline");
        if (!this.container) {
            return;
        }

        console.log('Init Timeline');

        storageService.data.forEach(item => {
            this.addItem(item);
        });
    },

    addItem: function (item) {
        console.log(`Adding item #${item.uid}`);
        var itemElement = this.createItemElement(item);
        this.container.appendChild(itemElement);

        if (item.location !== undefined) {
            this.initItemMap(item);
        }
    },

    removeItem: function (itemUid) {
        var itemElement = this.container.querySelector(`#timeline__item-${itemUid}`);
        if (itemElement !== null) {
            itemElement.parentNode.removeChild(itemElement);
        }
    },

    createItemElement: function (item) {
        var element = document.createElement('div');
        element.setAttribute('class', 'timeline__item');
        element.setAttribute('id', `timeline__item-${item.uid}`);

        var deleteBtn = this.getDeleteButton(item.uid);
        element.appendChild(deleteBtn);

        var titleElt = this.getSimpleElement('h2', 'title', item.title);
        if (titleElt !== null) {
            element.appendChild(titleElt);
        }

        var contentElt = this.getSimpleElement('p', 'content', item.content);
        if (contentElt !== null) {
            element.appendChild(contentElt);
        }

        var imageElt = this.getMediaElement('image', item.picture);
        var videoElt = this.getMediaElement('video', item.video);
        var locationElt = this.getLocationElement(item.location, item.uid);
        if (!imageElt && !videoElt && !locationElt) {
            return element;
        }

        var collapseBtn = document.createElement('button');
        collapseBtn.setAttribute('type', 'button');
        collapseBtn.setAttribute('data-target', `#item__collapsed-${item.uid}`);
        collapseBtn.innerText = "Show Details";
        this.addCollapseEventListener(collapseBtn);
        element.appendChild(collapseBtn);

        var collapsedContainer = document.createElement('div');
        collapsedContainer.setAttribute('class', 'item__collapsed');
        collapsedContainer.setAttribute('id', `item__collapsed-${item.uid}`);

        if (imageElt !== null) {
            collapsedContainer.appendChild(imageElt);
        }

        if (videoElt !== null) {
            collapsedContainer.appendChild(videoElt);
        }

        if (locationElt !== null) {
            collapsedContainer.appendChild(locationElt);
        }

        element.appendChild(collapsedContainer);

        return element;
    },

    getDeleteButton: function (uid) {
        var button = document.createElement('a');
        button.setAttribute('href', '#');
        button.setAttribute('class', 'item__delete');
        button.setAttribute('data-uid', uid);
        button.innerHTML = "&times;";
        button.addEventListener('click', function () {
            var uid = this.getAttribute('data-uid');
            storageService.removeItem(uid);
            timelineManager.removeItem(uid);
        });

        return button;
    },

    getSimpleElement: function (tagName, key, text) {
        if (!text) {
            return null;
        }

        var element = document.createElement(tagName);
        element.setAttribute('class', `item__${key}`);
        element.innerText = text;

        return element;
    },

    getMediaElement: function (key, source) {
        if (!source) {
            return null;
        }

        var tagName;
        switch (key) {
            case "image":
                tagName = "img";
                break;
            case "video":
                tagName = "video";
                break;
        }

        var element = document.createElement(tagName);
        element.setAttribute('class', `item__${key}`);
        if (key === "video") {
            element.setAttribute('controls', 'controls');
        }
        element.setAttribute('src', source);

        return element;
    },

    getLocationElement: function (locationData, uid) {
        if (locationData === undefined) {
            return null;
        }

        var element = document.createElement('div');
        element.setAttribute('class', 'map item__location');
        element.setAttribute('id', `item__location-${uid}`);
        element.setAttribute('data-lat', locationData.latitude);
        element.setAttribute('data-lon', locationData.longitude);

        return element;
    },

    addCollapseEventListener: function (collapseElt) {
        collapseElt.addEventListener('click', function () {
            var targetSelector = this.getAttribute('data-target'),
                targetElt = this.parentElement.querySelector(targetSelector);

            if (targetElt !== null) {
                targetElt.classList.toggle('item__collapsed--visible');

                var map = targetElt.querySelector('.item__location');
                if (map) {
                    map._leaflet_map.invalidateSize();
                }

                this.innerText = this.innerText === "Show Details"  ? "Hide Details"
                                                                    : "Show Details";
            }
        });
    },

    initItemMap: function (item) {
        var mapElt = this.container.querySelector(`#item__location-${item.uid}`),
            lat = parseFloat(mapElt.getAttribute('data-lat')),
            lon = parseFloat(mapElt.getAttribute('data-lon'));

        geolocService.initMap(mapElt, lat, lon);
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
