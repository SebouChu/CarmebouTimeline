# CarmebouTimeline

Application mobile powered by Cordova.

## Features

Permet d'ajouter des articles à une timeline.
Les articles sont un type :
- Photo (via plugin Camera)
- Vidéo (via plugin Media Capture)
- Géoloc (via plugin Geolocation) : s'affiche dans une carte
- Texte simple

Ils sont persistés dans le LocalStorage et affichés dans la timeline du plus récent au plus ancien.

## Divers

- Navigation par menu en haut (peut être masqué)
- Chargement via GIF animé (un loader quoi) à côté du bouton cliqué.

## Exemple de données

```json
[
  {
    "type": "image",
    "data": {
      "path": "data:image/jpeg;base64..."
    },
    "createdAt": "2019-04-30T15:41:41.859Z"
  },

  {
    "type": "video",
    "data": {
      "path": "file:///storage/emulated/0/..."
    },
    "createdAt": "2019-04-30T15:41:41.859Z"
  },

  {
    "type": "location",
    "data": {
      "latitude": 42,
      "longitude": -1,
    },
    "createdAt": "2019-04-30T15:41:41.859Z"
  },

  {
    "type": "text",
    "data": {
      "content": "Lorem ipsum dolor sit amet, consectetur adipisicing elit..."
    },
    "createdAt": "2019-04-30T15:41:41.859Z"
  }
]
```