# ophirofox ![icône Ophirofox](https://raw.githubusercontent.com/lovasoa/ophirofox/master/ophirofox/icons/48.png)

Une extension pour navigateurs qui permet de lire la plupart des titres de presse, comme les articles du **Monde**, du **Figaro**, de **Libération** et du **Monde Diplomatique** avec son compte **Europresse**.

[![Mozilla Firefox: download on mozilla addons](https://user-images.githubusercontent.com/552629/82738693-f4900f80-9d39-11ea-816c-1bddb73b6967.png)](https://github.com/lovasoa/ophirofox/releases/latest/download/ophirofox.xpi)
[![Google Chrome: download on the chrome web store](https://user-images.githubusercontent.com/552629/104166652-661ceb00-53fb-11eb-91c1-2db0718db66f.png)](https://chrome.google.com/webstore/detail/ophirofox/mmmjkgckgcpankonbgbianpnfenbhodf)

Comme illustré ci-dessous, l'extension ajoute un bouton **Lire sur Europresse** sur les articles réservés aux abonnés des journaux compatibles.

Ce bouton vous permet de vous connecter avec votre compte sur Europresse via le site de votre établissement, et une fois authentifié,
d'être redirigé automatiquement vers une page de recherche Europresse qui contient l'article souhaité. Un article peut prendre plusieurs heures avant d'être archivé par Europresse.

![Capture d'écran animée de démonstration de l'extension](https://user-images.githubusercontent.com/552629/93182919-98168d00-f73a-11ea-9518-175847fdc677.gif)

## Partenaires Europresse supportés

L'extension supporte la majorité des portails universitaires, mais aussi d'autres partenaires d'Europresse.

 - [La liste exhaustive se trouve sur le site Web de l'extension](https://ophirofox.ophir.dev/#partenaires-europresse-support%C3%A9s)

Si votre établissement n'est pas dans la liste, vous pouvez [l'ajouter](#comment-ajouter-un-nouveau-partenaire-europresse).

## Sites supportés

Les nouveau médias supportés sont mis à jour automatiquement avec l'extension.

### Presse nationale
Voici la liste triée par ordre alphabétique :
- [La Croix](https://www.la-croix.com)
- [L'Express](https://www.lexpress.fr/)
- [L'Humanité](https://www.humanite.fr)
- [L'Obs](https://www.nouvelobs.com/)
- [L'Opinion](https://www.lopinion.fr/)
- [La Tribune](https://www.latribune.fr)
- [Le Figaro](https://www.lefigaro.fr/)
- [Le Monde](https://www.lemonde.fr/)
- [Le Monde Diplomatique](https://www.monde-diplomatique.fr)
- [Le Point](https://www.lepoint.fr)
- [Libération](https://www.liberation.fr/)
- [Les Échos](https://www.lesechos.fr)
  
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
  - [Le Télégramme](https://www.letelegramme.fr/)
  - [Le Progrès](https://www.leprogres.fr/)
  
### Presse étrangère
  - [Courrier international](https://www.courrierinternational.com)
  - [De Morgen (Belgique - néerlandophone)](https://www.demorgen.be/)
  - [De Standaard (Belgique - néerlandophone)](https://www.standaard.be/)
  - [Financial Times (Royaume-Uni)](https://www.ft.com/)
  - [Gazet van Antwerpen (Belgique - néerlandophone)](https://www.gva.be/)
  - [Het Laatste Nieuws (Belgique - néerlandophone)](https://www.hln.be/)
  - [Het Nieuwsblad (Belgique - néerlandophone)](https://www.nieuwsblad.be/)
  - [Knack (Belgique - néerlandophone)](https://www.knack.be/)
  - [L'Avenir (Belgique)](https://www.lavenir.net/)
  - [L'Orient-Le Jour (Liban)](https://www.lorientlejour.com/)
  - [La DH (Belgique)](https://www.dhnet.be/)
  - [La Libre Belgique](https://www.lalibre.be/)
  - [Le Soir (Belgique)](https://www.lesoir.be)
  - [Le Temps (Suisse)](https://www.letemps.ch/)
  - [Le Vif (Belgique)](https://www.levif.be/)
  - [Sudinfo (Belgique)](https://www.sudinfo.be/)
  - [The Economist (Royaume-Uni)](https://www.economist.com/)
  - [The Washington Post (USA)](https://www.washingtonpost.com/)
  - [Trends-Tendances (Belgique)](https://trends.levif.be/)

Vous pouvez proposer d'autres sites Web de médias en ouvrant une [demande ici-même](https://github.com/lovasoa/ophirofox/issues).

# Tester la dernière version

## Firefox sur ordinateur

1. Téléchargez la dernière version d'Ophirofox depuis les *releases* disponibles [ici](https://github.com/lovasoa/ophirofox/releases/latest) ;
2. Deux options en fonction de la version de Firefox :
- Pour les versions récentes : cliquez simplement sur `ophirofox.xpi` et autorisez l'installation du module complémentaire ;
- Pour les versions plus anciennes : enregistrez le fichier `ophirofox.xpi` en réalisant un clic droit, puis ouvrez le gestionnaire des extensions depuis le menu de Firefox. Ensuite, ouvrez les paramètres (représentés par une roue dentée), sélectionnez « Installer un module depuis un fichier », puis choisissez le fichier `ophirofox.xpi` que vous avez téléchargé précédemment ;
4. Une fois installée, allez dans les paramètres du module et choisissez le nom de votre établissement.

## Chrome, Edge et similaires sur ordinateur

Ophirofox est [présent sur le Chrome Web Store](https://chrome.google.com/webstore/detail/ophirofox/mmmjkgckgcpankonbgbianpnfenbhodf), mais Google prend parfois du temps à approuver une nouvelle version de l'extension. Les instructions suivantes peuvent êtres suivies pour installer la dernière version sans passer par Google :
 - [Téléchargez le code source de l'extension](https://github.com/lovasoa/ophirofox/archive/master.zip) ;
 - Décompressez-le ;
 - Ouvrez l'adresse `chrome://extensions/` ;
 - Activez le « *developer mode* » ;
 - Et cliquez sur « *load unpacked* » ;
 - Puis choisissez le dossier *ophirofox* à l'intérieur du code téléchargé.

<img width="624" alt="image" src="https://user-images.githubusercontent.com/552629/94343918-dbff7100-001b-11eb-86e4-df66e15bc6f6.png">

## Android avec Firefox

Depuis la version 122 de Firefox publiée le 23 janvier 2024, il est maintenant possible d'installer une extension non publiée sur le Web Store de Mozilla en activant les paramètres avancés sur Android. Les étapes à suivre sont :
- Téléchargez le fichier `ophirofox.xpi` depuis les *releases* [ici](https://github.com/lovasoa/ophirofox/releases/latest) ,
- Allez dans Paramètres de Firefox, direction « À propos de Firefox » ;
- Tapez 10 fois sur le logo Fenix de Firefox ;
- Revenez en arrière, une nouvelle option apparaît « Installer un module complémentaire à partir d'un fichier » ;
- Sélectionnez le fichier `ophirofox.xpi` depuis le répertoire où vous l'avez sauvegardé.

À terme, Firefox devrait proposer une manière plus simple d'installer manuellement des extensions.

## Userscript pour des besoins spécifiques

Un projet annexe récupère la dernière version publiée de l'extension sur ce dépôt et la concatène en un seul *userscript*. Ce script est un fichier qui peut être installer par l'intermédiaire d'autres extensions, comme Greasemonkey, Tampermonkey, ou Violentmonkey.

Le projet annexe *ophirofox-userscript* [se trouve ici](https://github.com/Write/ophirofox-userscript).

# Comment ajouter un nouveau partenaire Europresse

Si votre établissement a un portail Europresse, vous pouvez facilement ajouter son support à cette extension.

1. Créez un compte sur [github](https://github.com) ;
2. Sur Github, ouvrez [le fichier `manifest.json` de l'extension](https://github.com/lovasoa/ophirofox/blob/master/ophirofox/manifest.json) ;
3. Cliquez sur le crayon pour éditer le fichier ;
4. Ajoutez votre établissement à la liste des partenaires Europresse supportés, en suivant le modèle des autres universités.
  - Dans la section qui contient toutes les URLs au format `https://nouveau-europresse-com.proxy.univ-xyz.fr/*`, ajoutez une ligne avec l'URL du proxy Europresse de votre établissement ;
  - Dans la section qui contient tous les objets au format 
    `{ "name": "Université XYZ", "AUTH_URL": "https://proxy.univ-xyz.fr/login?url=https://nouveau.europresse.com/access/ip/default.aspx?un=CODE_UNIVERSITE" }`, ajoutez un objet avec le nom de votre université et l'URL de son lien de connexion Europresse.
    Vous pouvez trouver l'URL de connexion en vous connectant à votre portail d'université, puis en faisant un clic droit sur le lien de connexion à Europresse et en choisissant « Copier l'adresse du lien ». Conservez l'ordre alphabétique des universités. Faites attention au format de l'URL qui doit contenir le code Europresse de l'établissement.
5. Cliquez sur « *Propose file change* » (ou proposer une modification).
6. Indiquez le nom de votre université dans le champs.
7. Cliquez sur « *Create pull request* » (ou créer une demande de tirage).

# Comment l'extension fonctionne

1. L'extension injecte un script dans toutes les pages des médias supportés pour détecter les articles payants ;
2. Lorsqu'un article est détecté l'extension ajoute un lien intitulé vers la page de connexion Europresse de l'établissement sélectionné par l'utilisateur ;
3. Lorsque l'utilisateur clique sur le lien, le titre de l'article est extrait et conservée dans l'espace de stockage local de l'extension pour être réutilisé par la suite ;
4. Quand l'utilisateur se retrouve sur la page d'accueil d'Europresse, après s'être connecté, l'extension utilise le titre stocké à l'étape précédente pour lancer une recherche. Le titre est parallèlement supprimé de l'espace de stockage local.
5. Lorsque l'utilisateur ouvre l'article, l'extension supprime l'horrible surlignage jaune qui est ajouté par défaut par Europresse.

# Licence

Cette extension est un logiciel libre sous license [MPL](https://github.com/lovasoa/ophirofox/blob/master/LICENSE).
Vous pouvez y contribuer [sur github](https://github.com/lovasoa/ophirofox).

Si vous avez accès à un portail europresse via votre université mais qu'il n'est pas supporté par cette extension,
il devrait être relativement facile à ajouter.
N'hésitez pas à [ouvrir une demande sur Github](https://github.com/lovasoa/ophirofox/issues/new),
ou à ajouter vous-même le support pour votre université en modifiant [`config.js`](./ophirofox/content_scripts/config.js) 
