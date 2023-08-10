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
 - [**Europresse ENS Ulm PSL**](http://proxy.rubens.ens.fr/login?url=https://nouveau.europresse.com/access/ip/default.aspx?un=PSLT_1),
 - [**Europresse ENSAM (Arts et Métiers)**](http://rp1.ensam.eu/login?url=https://nouveau.europresse.com/access/ip/default.aspx?un=AML),
 - [**Europresse Université Paris-Saclay**](https://proxy.scd.u-psud.fr/login?url=http://nouveau.europresse.com/access/ip/default.aspx?un=U031535T_9),
 - [**Europresse INSA Lyon**](https://docelec.insa-lyon.fr/login?url=https://nouveau.europresse.com/access/ip/default.aspx?un=INSAT_3)
 - [**Europresse Bibliothèque nationale de France**](https://bnf.idm.oclc.org/login?url=https://nouveau.europresse.com/access/ip/default.aspx?un=bnf)
 - [**Europresse Université de Bordeaux Montaigne**](https://www.ezproxy.u-bordeaux-montaigne.fr/login?url=https://nouveau.europresse.com/access/ip/default.aspx?un=UNIVMONTAIGNET_1)
 - [**Europresse Université de Bordeaux**](https://docelec.u-bordeaux.fr/login?url=https://nouveau.europresse.com/access/ip/default.aspx?un=UNIVBORDEAUXT_1)
 - [**Europresse Université de Montpellier**](https://ezpum.scdi-montpellier.fr/login?url=https://nouveau.europresse.com/access/ip/default.aspx?un=MontpellierT_1)
 - [**Europresse Université de Grenoble**](https://sid2nomade-2.grenet.fr/login?url=https://nouveau.europresse.com/access/ip/default.aspx?un=grenobleT_1)
 - [**Europresse Université de Haute-Alsace**](https://scd-proxy.uha.fr/login?url=http://nouveau.europresse.com/access/ip/default.aspx?un=ALSACET_1)

 Ou directement via le site Europresse.

## Sites supportés
  - [Le Monde](https://www.lemonde.fr/)
  - [Le Figaro](https://www.lefigaro.fr/)
  - [Libération](https://www.liberation.fr/)
  - [Le Monde Diplomatique](https://www.www.monde-diplomatique.fr)
  - [La Croix](https://www.la-croix.com)
  - [Courrier international](https://www.courrierinternational.com)
  - [L'Humanité](https://www.humanite.fr)
  - [La Montagne](https://www.lamontagne.fr)
  - [Le Point](https://www.lepoint.fr)

Vous pouvez proposer d'autres sites en ouvrant une [demande sur github](https://github.com/lovasoa/ophirofox/issues)

# Tester la dernière version

### Pour firefox

 - Téléchargez [la dernière version d'Ophirofox](https://github.com/lovasoa/ophirofox/releases/latest) et ouvrez le fichier `.xpi` avec firefox.

### Pour chrome

ophirofox est [présent sur le Chrome Webstore](https://chrome.google.com/webstore/detail/ophirofox/mmmjkgckgcpankonbgbianpnfenbhodf), mais google prend parfois du temps à approuver une nouvelle version de l'extension. On peut suivre les instructions suivantes pour installer la dernière version sans passer par Google:

 - [Téléchargez le code depuis github](https://github.com/lovasoa/ophirofox/archive/master.zip),
 - décompressez-le, puis
 - ouvrez l'adresse `chrome://extensions/`,
 - activez le *developer mode*,
 - et cliquez sur *load unpacked*,
 - puis choisissez le dossier *ophirofox* à l'intérieur du code téléchargé.

<img width="624" alt="image" src="https://user-images.githubusercontent.com/552629/94343918-dbff7100-001b-11eb-86e4-df66e15bc6f6.png">

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

Si vous avez accès à un portail europresse via votre université mais qu'il n'est pas supporté par cette extension,
il devrait être relativement facile à ajouter.
N'hésitez pas à [ouvrir une demande sur Github](https://github.com/lovasoa/ophirofox/issues/new),
ou à ajouter vous-même le support pour votre université en modifiant [`config.js`](./ophirofox/content_scripts/config.js) 
