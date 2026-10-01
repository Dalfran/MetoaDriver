# MetoaDriver

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 21.2.22.

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Vitest](https://vitest.dev/) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can# 🚗 METOA Driver — Application Chauffeur

Application web Angular dédiée aux **chauffeurs** de la plateforme de covoiturage **METOA**.

Cette application permet aux conducteurs de gérer leur profil chauffeur, leurs informations personnelles, leurs véhicules, leurs documents, leurs trajets, leurs réservations et les fonctionnalités associées à leur activité sur la plateforme.

---

# 📌 Présentation

**METOA** est une plateforme de covoiturage composée de plusieurs applications clientes communiquant avec un backend commun développé avec Spring Boot.

Ce dépôt correspond à l'application **Chauffeur**.

## Écosystème METOA

| Composant | Technologie | Port |
|---|---|---:|
| Backend METOA | Spring Boot / Java 17 | `8089` |
| Application Passager | Angular | `4200` |
| Application Chauffeur | Angular | `4201` |
| Application Administrateur | Angular | `4202` |

Architecture générale :

```text
                         ┌──────────────────────┐
                         │    METOA BACKEND     │
                         │ Spring Boot / Java 17│
                         │    localhost:8089    │
                         └──────────┬───────────┘
                                    │
                  ┌─────────────────┼─────────────────┐
                  │                 │                 │
                  ▼                 ▼                 ▼
          ┌──────────────┐  ┌──────────────┐  ┌──────────────┐
          │   PASSAGER   │  │  CHAUFFEUR   │  │    ADMIN     │
          │ Angular :4200│  │ Angular :4201│  │ Angular :4202│
          └──────────────┘  └──────────────┘  └──────────────┘
```

---

# 🛠️ Technologies utilisées

## Frontend

- Angular `21.2.24`
- Angular CLI `21.2.24`
- TypeScript `5.9.3`
- RxJS `7.8.2`
- Node.js `20.20.2`
- npm `10.8.2`
- Angular SSR
- Express `5.1.0`

## Backend

L'application communique avec le backend METOA :

- Spring Boot `3.3.7`
- Java `17`
- MySQL
- Spring Security
- JWT
- REST API

Backend :

```text
http://localhost:8089
```

---

# 📋 Prérequis

Vérifier les versions installées :

```bash
node -v
npm -v
npx ng version
```

Versions utilisées :

```text
Node.js       20.20.2
npm           10.8.2
Angular       21.2.24
Angular CLI   21.2.24
TypeScript    5.9.3
RxJS          7.8.2
```

---

# 📥 Installation

Cloner le dépôt :

```bash
git clone https://github.com/Dalfran/MetoaDriver.git
```

Entrer dans le projet :

```bash
cd MetoaDriver
```

Installer les dépendances :

```bash
npm install
```

---

# ▶️ Démarrage

Le port de l'application est configuré directement dans `package.json`.

Lancer :

```bash
npm start
```

L'application est disponible sur :

```text
http://localhost:4201
```

Le script utilisé est :

```json
"start": "ng serve --port 4201"
```

Il n'est donc pas nécessaire de préciser manuellement le port.

---

# 🔐 Authentification

L'application utilise une authentification basée sur **JWT (JSON Web Token)**.

Après connexion, le token JWT est utilisé pour authentifier les appels vers le backend.

Le token du chauffeur est stocké localement sous :

```text
metoa_driver_token
```

Les informations de l'utilisateur connecté sont stockées sous :

```text
metoa_driver_user
```

Les requêtes authentifiées utilisent :

```http
Authorization: Bearer <JWT>
```

---

# 👤 Accès chauffeur

L'application est destinée aux utilisateurs possédant le rôle chauffeur.

Le contrôle d'accès est effectué côté frontend à l'aide d'un guard dédié.

Le principe est :

```text
Utilisateur
     │
     ▼
Connexion
     │
     ▼
JWT
     │
     ▼
Vérification du rôle
     │
     ├── CHAUFFEUR → accès à l'application
     │
     └── autre rôle → accès refusé
```

---

# 🚗 Fonctionnalités principales

L'application chauffeur est organisée autour des fonctionnalités liées à l'activité du conducteur.

## 🔐 Authentification

- connexion ;
- gestion de session ;
- stockage du JWT ;
- déconnexion ;
- protection des routes.

## 📊 Tableau de bord

Le tableau de bord chauffeur permet de centraliser les informations importantes liées à son activité.

## 👤 Profil chauffeur

Le chauffeur peut gérer notamment :

- ses informations personnelles ;
- son profil conducteur ;
- sa bio ;
- ses préférences ;
- ses informations liées au véhicule ;
- ses informations d'activité ;
- sa photo de profil.

## 🚘 Véhicule

Le profil conducteur contient les informations relatives au véhicule utilisé pour les trajets.

## 📄 Documents conducteur

La plateforme permet au chauffeur de gérer plusieurs documents.

Les types actuellement pris en charge sont :

```text
PERMIS_CONDUIRE
CARTE_IDENTITE
ASSURANCE
CARTE_GRISE
AUTRE
```

Architecture :

```text
Utilisateur
     │
     ▼
ProfileConducteur
     │
     ▼
DocumentConducteur
     │
     ├── PERMIS_CONDUIRE
     ├── CARTE_IDENTITE
     ├── ASSURANCE
     ├── CARTE_GRISE
     └── AUTRE
```

Les documents peuvent être :

- ajoutés ;
- consultés ;
- supprimés.

La consultation des documents sécurisés utilise une requête HTTP authentifiée afin que le JWT soit correctement transmis au backend.

---

# 🔎 Vérification des documents

Les documents conducteur sont destinés à pouvoir être soumis à une vérification administrative.

Les statuts prévus sont :

```text
EN_ATTENTE
APPROUVE
REJETE
```

Lorsqu'un document est rejeté, un motif peut être associé à la décision administrative.

Le traitement de la vérification appartient au périmètre de l'application d'administration.

---

# 🚘 Gestion des trajets

L'application chauffeur permet de travailler avec les fonctionnalités liées aux trajets proposés par les conducteurs.

Le fonctionnement général est :

```text
Chauffeur
    │
    ▼
Création / gestion d'un trajet
    │
    ▼
Publication
    │
    ▼
Réservations des passagers
```

Les statuts de trajet utilisés côté backend sont notamment :

```text
PLANIFIE
EN_COURS
TERMINE
ANNULE
```

---

# 📑 Réservations

L'application chauffeur permet de gérer les réservations associées à ses trajets.

Les statuts de réservation sont notamment :

```text
EN_ATTENTE
CONFIRMEE
ANNULEE
TERMINEE
```

---

# ⭐ Avis et réputation

Le chauffeur peut être concerné par le système de notation et d'avis de la plateforme.

La réputation est basée sur les évaluations reçues dans le cadre des interactions et trajets réalisés.

Le profil conducteur contient notamment des informations telles que :

```text
note moyenne
nombre d'avis
nombre de trajets effectués
taux d'acceptation
badge
```

---

# 🏅 Badges conducteur

Le backend METOA prévoit une classification du profil conducteur en fonction de son activité et de ses évaluations.

Les badges utilisés sont :

```text
SUPER_CONDUCTEUR
CONDUCTEUR_FIABLE
NOUVEAU
A_RISQUE
```

Ces informations sont calculées et gérées côté backend.

---

# 🌐 Communication avec le backend

Le backend est accessible sur :

```text
http://localhost:8089
```

Le frontend communique avec l'API backend via HTTP.

Architecture :

```text
MetoaDriver
     │
     │ HTTP + JWT
     ▼
METOA Backend
     │
     ├── Authentification
     ├── Utilisateurs
     ├── Profils
     ├── Conducteurs
     ├── Documents
     ├── Trajets
     ├── Réservations
     └── Avis
            │
            ▼
          MySQL
```

---

# 🗂️ Organisation du projet

Structure simplifiée :

```text
src/
└── app/
    │
    ├── core/
    │   ├── services/
    │   ├── guards/
    │   ├── interceptors/
    │   └── ...
    │
    ├── features/
    │   ├── auth/
    │   ├── dashboard/
    │   ├── profil/
    │   ├── trajets/
    │   ├── reservations/
    │   ├── avis/
    │   └── ...
    │
    └── ...
```

### `core`

Contient les éléments transversaux :

- services ;
- authentification ;
- guards ;
- interceptors ;
- communication API.

### `features`

Contient les fonctionnalités métier :

- authentification ;
- dashboard ;
- profil chauffeur ;
- trajets ;
- réservations ;
- avis ;
- etc.

---

# 🔒 Sécurité

Les informations sensibles ne doivent jamais être ajoutées au dépôt Git.

Ne jamais versionner :

```text
mots de passe
clés secrètes
tokens JWT personnels
clés API
identifiants privés
```

---

# 🌿 Organisation Git

Le projet utilise :

```text
main
 │
 └── develop
       │
       ├── feature/...
       ├── fix/...
       └── refactor/...
```

## `main`

Version stable du projet.

## `develop`

Branche d'intégration des développements.

## `feature/*`

Nouvelle fonctionnalité.

Exemple :

```bash
git checkout develop
git pull origin develop
git checkout -b feature/gestion-trajet
```

## `fix/*`

Correction d'un problème.

Exemple :

```bash
git checkout develop
git pull origin develop
git checkout -b fix/correction-profil
```

---

# 🔄 Workflow collaboratif

Avant de commencer :

```bash
git checkout develop
git pull origin develop
```

Créer une branche :

```bash
git checkout -b feature/nom-fonctionnalite
```

Développer puis vérifier l'application.

Ajouter les modifications :

```bash
git add .
```

Créer le commit :

```bash
git commit -m "feat: description de la fonctionnalite"
```

Publier la branche :

```bash
git push -u origin feature/nom-fonctionnalite
```

Créer ensuite une **Pull Request vers `develop`**.

### Règle

Les développements fonctionnels doivent être réalisés dans une branche dédiée plutôt que directement sur `main` ou `develop`.

---

# 🧪 Tests

Lancer les tests Angular :

```bash
npm test
```

---

# 🏗️ Build

Construire l'application :

```bash
npm run build
```

Le résultat est généré dans :

```text
dist/
```

Le dossier `dist/` ne doit pas être versionné.

---

# 🚀 Développement local

Pour travailler sur l'écosystème METOA :

### Backend

```text
http://localhost:8089
```

### Passager

```text
http://localhost:4200
```

### Chauffeur

```bash
cd MetoaDriver
npm install
npm start
```

Disponible sur :

```text
http://localhost:4201
```

### Administrateur

```text
http://localhost:4202
```

---

# 👥 Collaboration GitHub

Chaque développeur doit utiliser son propre compte GitHub.

Les collaborateurs sont ajoutés directement au dépôt GitHub.

Les identifiants personnels et mots de passe ne doivent jamais être partagés.

---

# 📚 Dépôts METOA

| Projet | Repository |
|---|---|
| Backend | `METOA` |
| Passager | `METOA_front` |
| Chauffeur | `MetoaDriver` |
| Administrateur | `MetoaADMIN` |

---

# 👨‍💻 Projet

**METOA — Plateforme de covoiturage**

Application développée dans le cadre d'un projet académique.

**Frontend Chauffeur — Angular**
