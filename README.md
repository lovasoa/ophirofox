# ophirofox ![icône Ophirofox](https://raw.githubusercontent.com/lovasoa/ophirofox/master/ophirofox/icons/48.png)

Une extension pour navigateurs qui permet de lire les articles du **Monde**, du **Figaro**, de **Libération** et du **Monde Diplomatique** sur son compte **Europresse**.

[![Mozilla Firefox: download on mozilla addons](https://user-images.githubusercontent.com/552629/82738693-f4900f80-9d39-11ea-816c-1bddb73b6967.png)](https://github.com/lovasoa/ophirofox/releases/latest/download/ophirofox.xpi)
[![Google Chrome: download on the chrome web store](https://user-images.githubusercontent.com/552629/104166652-661ceb00-53fb-11eb-91c1-2db0718db66f.png)](https://chrome.google.com/webstore/detail/ophirofox/mmmjkgckgcpankonbgbianpnfenbhodf)


L'extension ajoute un bouton *Lire sur Europresse* sur les articles réservés aux abonnés du [monde.fr](https://www.lemonde.fr/) et d'autres sites d'information.
Ce bouton vous permet de vous connecter avec votre compte sur europresse via le site de votre université, et une fois authentifié,
d'être redirigé automatiquement vers une page de recherche europresse qui contient l'article du Monde original.

![Capture d'écran animée de démonstration de l'extension](https://user-images.githubusercontent.com/552629/93182919-98168d00-f73a-11ea-9518-175847fdc677.gif)


## Partenaires Europresse supportés

L'extension fonctionne avec les portails universitaires suivants :
 - [La liste des universités et autres partenaires europresse qui fonctionnent se trouve sur le site web.](https://ophirofox.ophir.dev/#partenaires-europresse-support%C3%A9s)

Si votre université n'est pas dans la liste, vous pouvez [l'ajouter](#comment-ajouter-un-nouveau-partenaire-europresse).

## Sites supportés

### Presse nationale
  - [L'Express](https://www.lexpress.fr/)
  - [L'Humanité](https://www.humanite.fr)
  - [L'Obs](https://www.nouvelobs.com/)
  - [L'Opinion](https://www.lopinion.fr/)
  - [La Croix](https://www.la-croix.com)
  - [La Tribune](https://www.latribune.fr)
  - [Le Figaro](https://www.lefigaro.fr/)
  - [Le Monde Diplomatique](https://www.www.monde-diplomatique.fr)
  - [Le Monde](https://www.lemonde.fr/)
  - [Le Point](https://www.lepoint.fr)
  - [Libération](https://www.liberation.fr/)
  
### Presse régionale
  - [Corse Matin](https://www.corsematin.com/)
  - [L'Est républicain](https://www.estrepublicain.fr/)
  - [La Dépêche du Midi](https://www.ladepeche.fr/)
  - [La Montagne](https://www.lamontagne.fr)
  - [La Provence](https://www.laprovence.com/)
  - [La Voix du Nord](https://www.lavoixdunord.fr/)
  - [Le Parisien](https://www.leparisien.fr/)
  - [Nice-Matin](https://www.nicematin.com/)
  - [Ouest France](https://www.ouest-france.fr/)
  - [Sud Ouest](https://www.sudouest.fr/)
  
### Presse étrangère
  - [Courrier international](https://www.courrierinternational.com)
  - [La Libre Belgique](https://www.lalibre.be/)
  - [Le Soir (Belgique)](https://www.lesoir.be)
  - [Le Temps (Suisse)](https://www.letemps.ch/)

Vous pouvez proposer d'autres sites en ouvrant une [demande sur github](https://github.com/lovasoa/ophirofox/issues)

# Tester la dernière version

### Pour firefox

 - Installer [la dernière version d'Ophirofox](https://github.com/lovasoa/ophirofox/releases/latest).
    - Pour les versions de Firefox plus récentes: il suffit de cliquer sur `ophirofox.xpi` et autoriser l'installation du module complémentaire.
    - Pour les versions de Firefox plus anciennes: enregistrer le fichier `ophirofox.xpi` via un clic-droit, depuis le menu de Firefox ouvrir le gestionnaire des extensions, ouvrir les paramètres (roue dentée), sélectionner `Installer un module depuis un fichier`, sélectionner le fichier `ophirofox.xpi` précédemment téléchargé.
 - Après installation, sélectionner dans les paramètres du module le nom de votre université.

### Pour chrome

ophirofox est [présent sur le Chrome Webstore](https://chrome.google.com/webstore/detail/ophirofox/mmmjkgckgcpankonbgbianpnfenbhodf), mais google prend parfois du temps à approuver une nouvelle version de l'extension. On peut suivre les instructions suivantes pour installer la dernière version sans passer par Google:

 - [Téléchargez le code depuis github](https://github.com/lovasoa/ophirofox/archive/master.zip),
 - décompressez-le, puis
 - ouvrez l'adresse `chrome://extensions/`,
 - activez le *developer mode*,
 - et cliquez sur *load unpacked*,
 - puis choisissez le dossier *ophirofox* à l'intérieur du code téléchargé.

<img width="624" alt="image" src="https://user-images.githubusercontent.com/552629/94343918-dbff7100-001b-11eb-86e4-df66e15bc6f6.png">

### Pour mobile

Si vous souhaitez utiliser ophirofox sur un téléphone android, vous pouvez vous référer à [ces instruction](https://github.com/lovasoa/ophirofox/issues/139).

# Comment ajouter un nouveau partenaire Europresse

Si votre établissement a un portail Europresse, vous pouvez facilement ajouter son support à cette extension.

1. Créez un compte sur [github](https://github.com).
2. Sur github, ouvrez [le fichier `manifest.json` de l'extension](https://github.com/lovasoa/ophirofox/blob/master/ophirofox/manifest.json).
3. Cliquez sur le crayon pour éditer le fichier.
4. Ajoutez votre université à la liste des partenaires Europresse supportés, en suivant le modèle des autres universités.
  - Dans la section qui contient toutes les URLs au format `https://nouveau-europresse-com.proxy.univ-xyz.fr/*`, ajoutez une ligne avec l'URL du proxy europresse de votre université.
  - Dans la section qui contient tous les objets au format 
    `{ "name": "Université XYZ", "AUTH_URL": "https://proxy.univ-xyz.fr/login?url=https://nouveau.europresse.com/access/ip/default.aspx?un=CODE_UNIVERSITE" }`
    , ajoutez un objet avec le nom de votre université et l'URL de son lien de connexion europresse. Vous pouvez trouver l'URL de connexion en vous connectant à votre portail d'université, puis en faisant un clic droit sur le lien de connexion à Europresse et en choisissant *Copier l'adresse du lien*. Conservez l'ordre alphabétique des universités. Faites attention au format de l'URL, qui doit contenir le code europresse de l'établissement.
5. Cliquez sur *Propose file change*.
6. Indiquez le nom de votre université dans le champ *Propose file change*.
7. Cliquez sur *Create pull request*.

# Comment cela fonctionne

1. L'extension injecte un script dans toutes les pages des journaux supportés pour détecter les articles payants.
Lorsqu'un article est détecté, l'extension lui ajoute un lien intitulé *Lire sur Europresse* qui pointe vers
la page de connexion europresse de l'université sélectionnée par l'utilisateur.
Lorsque l'utilisateur clique sur le lien, le titre de l'article est extrait de la page actuelle,
et conservée dans l'espace de stockage local de l'extension pour être réutilisé ensuite.
2. Quand l'utilisateur se retrouve sur la page d'accueil d'Europresse, après s'être connecté, l'extension utilise le titre stocké à l'étape précédente pour lancer une recherche europresse. Le titre est ensuite tout de suite supprimé de l'espace de stockage local.
3. Lorsque l'utilisateur ouvre l'article, l'extension supprime l'horrible surlignage jaune qui est ajouté par défaut par Europresse.

# License

Cette extension est un logiciel libre sous license [MPL](https://github.com/lovasoa/ophirofox/blob/master/LICENSE).
Vous pouvez y contribuer [sur github](https://github.com/lovasoa/ophirofox).

Si vous avez accès à un portail europresse via votre université mais qu'il n'est pas supporté par cette extension,
il devrait être relativement facile à ajouter.
N'hésitez pas à [ouvrir une demande sur Github](https://github.com/lovasoa/ophirofox/issues/new),
ou à ajouter vous-même le support pour votre université en modifiant [`config.js`](./ophirofox/content_scripts/config.js) 
