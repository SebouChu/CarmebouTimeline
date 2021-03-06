# CarmebouTimeline

Application mobile *powered by Cordova* et dévelopée par BAUMÉ Aurore & GAYA Sébastien.

## Features

Permet d'ajouter des articles à une timeline.
Les articles peuvent avoir :
- Photo (via plugin Camera)
- Vidéo (via plugin Media Capture)
- Géoloc (via plugin Geolocation) : s'affiche dans une carte
- Texte simple

Ils sont persistés dans le LocalStorage et affichés dans la timeline du plus récent au plus ancien.

## Divers

- Navigation par menu en haut (peut être masqué)
- Chargement via GIF animé (un loader quoi) à côté du bouton cliqué.

## Workflow

- T'as un formulaire, on peut renseigner plusieurs infos indépendantes :
  - Un texte
  - Une image
    - A la capture ou sélection, on change un input hidden avec l'imagePath
  - Une vidéo
    - A la capture, on change un input hidden avec le videoPath
  - Une localisation
    - Au callback du getCurrentPosition(), on change 2 input hidden avec lat et lon
- On submit le formulaire
- On prépare les données
- On les ajoute au localstorage
- On update la timeline

## Exemple de données

```json
{
  "title": "Lorem ipsum.",
  "content": "Lorem ipsum dolor sit amet, consectetur adipisicing elit...",
  "video": "file:///storage/emulated/0/...",
  "picture": "data:image/jpeg;base64...",
  "location": {
    "latitude": 42,
    "longitude": -1,
  },
  "uid": "50c2d330cf",
  "createdAt": "2019-04-30T15:41:41.859Z"
}
```
