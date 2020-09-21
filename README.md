# ophirofox ![icône Ophirofox](https://raw.githubusercontent.com/lovasoa/ophirofox/master/ophirofox/icons/48.png) 
Une extension pour navigateurs qui permet de lire les articles du monde.fr sur son compte [Europresse ENS](http://proxy.rubens.ens.fr/login?url=https://nouveau.europresse.com/access/ip/default.aspx?un=PSLT_1).

[![Mozilla Firefox: download on mozilla addons](https://user-images.githubusercontent.com/552629/82738693-f4900f80-9d39-11ea-816c-1bddb73b6967.png)](https://github.com/lovasoa/ophirofox/releases/latest/download/ophirofox.xpi)
[![Google Chrome: download on the chrome web store](https://developer.chrome.com/webstore/images/ChromeWebStore_BadgeWBorder_v2_206x58.png)](https://chrome.google.com/webstore/detail/ophirofox/mmmjkgckgcpankonbgbianpnfenbhodf)

L'extension ajoute un bouton *Lire sur Europresse* sur les articles réservés aux abonnés du [monde.fr](https://www.lemonde.fr/).
Ce bouton vous permet de vous connecter avec votre compte sur [sso.ens.fr](https://sso.ens.fr/cas/login), et une fois authentifié,
d'être redirigé automatiquement vers une page de recherche europresse qui contient l'article du Monde original.

![Capture d'écran animée de démonstration de l'extension](https://user-images.githubusercontent.com/552629/93182919-98168d00-f73a-11ea-9518-175847fdc677.gif)


## Sites supportés
  - [Le Monde](https://www.lemonde.fr/)
  - [Le Figaro](https://www.lefigaro.fr/)
  - [Libération](https://www.liberation.fr/)

Vous pouvez proposer d'autres sites en ouvrant une [demande sur github](https://github.com/lovasoa/ophirofox/issues)

# Tester la dernière version

### Pour firefox

 - Téléchargez [la dernière version d'Ophirofox](https://github.com/lovasoa/ophirofox/releases/latest) et ouvrez le fichier `.xpi` avec firefox.

### Pour chrome

[Téléchargez le code depuis github](https://github.com/lovasoa/ophirofox/archive/master.zip), puis :

Ouvrez l'adresse `chrome://extensions/`, activez le *developer mode*, et cliquez sur *load unpacked*, puis choisissez le dossier *ophirofox* à l'intérieur du code téléchargé.

<img width="624" alt="image" src="https://user-images.githubusercontent.com/552629/93186361-d8780a00-f73e-11ea-89c9-f63efd4a02fc.png">

# Comment cela fonctionne

L'extension injecte un script dans toutes les pages du monde.fr pour détecter les articles payants.
Lorsqu'un article est détecté, l'extension lui ajoute un lien intitulé *Lire sur Europresse* qui pointe vers
[`http://proxy.rubens.ens.fr/login?url=https://nouveau.europresse.com/Search/Reading?ophirofox_source=`](http://proxy.rubens.ens.fr/login?url=https://nouveau.europresse.com/Search/Reading?ophirofox_source=),
suivi de l'adresse de la page du monde originale.

Lorsque l'utilisateur se retrouve sur [la page de connexion à europresse](https://nouveau-europresse-com.proxy.rubens.ens.fr/Login/), dont l'utilisateur n'a pas les identifiants,
l'extension modifie la page pour simplement afficher les mots *Authentification*, et charge en arrière plan la page [`https://proxy.rubens.ens.fr/login?url=https://nouveau.europresse.com/access/ip/default.aspx?un=PSLT_1`](https://proxy.rubens.ens.fr/login?url=https://nouveau.europresse.com/access/ip/default.aspx?un=PSLT_1) qui permet de s'identifier sans mot de passe, puis recharge la page.

Quand l'utilisateur se retrouve enfin sur la page d'accueil d'Europresse, l'extension utilise la variable `ophirofox_source` définie initialement pour extraire les mots du titre de l'article,
et lancer une recherche europresse.

# License

Cette extension est un logiciel libre sous license [MPL](https://github.com/lovasoa/ophirofox/blob/master/LICENSE).
Vous pouvez y contribuer [sur github](https://github.com/lovasoa/ophirofox).
