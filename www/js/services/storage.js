var storage = {
    data: null,

    init: function () {
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
}