MULTIVUE — PRÊT POUR VERCEL

Accès web : https://multivue-tau.vercel.app/
Téléchargement : véritable MULTIVUE-Installation-1.0.0.exe fourni, octets inchangés.

PUBLIER VOUS-MÊME
1. Décompresser le ZIP.
2. Créer un NOUVEAU dépôt GitHub pour la vitrine, distinct de votre application.
3. Envoyer le CONTENU de multivue-vitrine dans ce dépôt, en conservant assets/ et downloads/ et leurs fichiers. index.html doit être à la racine.
4. Vercel : Add New Project, importer ce nouveau dépôt.
5. Framework Preset : Other. Root Directory : racine. Pas de Build Command ni Install Command. Garder Output Directory par défaut pour le site statique.
6. Deploy puis tester les deux boutons à l'adresse donnée par Vercel.

Le .exe de 107 Mo est réparti en six morceaux de 20 Mo maximum, adaptés à l'envoi dans GitHub. Le navigateur télécharge, vérifie les SHA-256 et produit un seul .exe. Conserver tous les morceaux. Utiliser l'import Git, pas la CLI Vercel Hobby dont les sources sont limitées à 100 Mo.

TEST LOCAL
index.html permet de voir le site et d'ouvrir Multivue en ligne.
Pour tester le téléchargement, lancer dans ce dossier : python -m http.server 8000
Puis ouvrir http://localhost:8000.

MISES À JOUR
Un nouvel installateur nécessite de nouveaux morceaux avec de nouveaux noms et leurs tailles/SHA-256 dans config.js. Ne pas réutiliser les noms à cause du cache.

Cette vitrine ne modifie pas votre application existante.
