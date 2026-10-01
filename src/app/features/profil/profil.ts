import {
  Component,
  OnInit,
  PLATFORM_ID,
  ChangeDetectorRef,
  inject
} from '@angular/core';

import {
  DocumentConducteurResponse,
  TypeDocumentConducteur
} from '../../core/models/document-conducteur.models';

import {
  DocumentConducteurService
} from '../../core/services/document-conducteur.service';

import { FormsModule} from '@angular/forms';

import { CommonModule, isPlatformBrowser } from '@angular/common';

import {
  FormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import { HttpErrorResponse } from '@angular/common/http';

import { AuthService } from '../../core/services/auth.service';

import {
  UserService,
  ChangePasswordRequest
} from '../../core/services/user.service';

import {
  ProfileConducteurService
} from '../../core/services/profile-conducteur.service';

import { UserResponse } from '../../core/models/auth.models';

import { UserUpdateRequest } from '../../core/models/user.models';

import {
  ProfileConducteurRequest,
  ProfileConducteurResponse
} from '../../core/models/conducteur.models';


@Component({
  selector: 'app-profil',
  standalone: true,

  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule
  ],

  templateUrl: './profil.html',
  styleUrl: './profil.css',
})
export class Profil implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly profileConducteurService = inject(ProfileConducteurService);

  private readonly platformId = inject(PLATFORM_ID);
  private readonly cdr = inject(ChangeDetectorRef);

  private readonly documentConducteurService =
    inject(DocumentConducteurService);

  readonly userService = inject(UserService);

  utilisateur: UserResponse | null = null;

  profile: ProfileConducteurResponse | null = null;

  profileExiste = false;

  chargement = true;

  sauvegardeUtilisateur = false;
  sauvegardeConducteur = false;

  uploadPhotoEnCours = false;
  uploadCoverEnCours = false;

  changementMotPasseEnCours = false;

  messageSucces = '';
  messageErreur = '';

  photoPreview: string | null = null;
  coverPreview: string | null = null;

  /**
   * Formulaire informations personnelles
   */
  userForm = this.fb.nonNullable.group({
    nom: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],

    prenom: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],

    email: ['', [Validators.required, Validators.email]],

    telephone: ['', [Validators.required]],

    sexe: [''],
  });

  documents: DocumentConducteurResponse[] = [];

  chargementDocuments = false;

  uploadDocumentEnCours = false;

  messageDocument = '';

  erreurDocument = '';

  typeDocumentSelectionne: TypeDocumentConducteur =
    'PERMIS_CONDUIRE';

  fichierDocumentSelectionne: File | null = null;

  /**
   * Formulaire conducteur
   */
  conducteurForm = this.fb.nonNullable.group({
    adresse: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(150)]],

    bio: ['', [Validators.maxLength(500)]],

    preferences: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(200)]],

    vehicule: ['', [Validators.maxLength(150)]],

    actif: [true],
  });

  /**
   * Formulaire changement mot de passe
   */
  passwordForm = this.fb.nonNullable.group({
    ancienPasse: ['', [Validators.required]],

    nouveauPasse: ['', [Validators.required, Validators.minLength(6)]],

    confirmationPasse: ['', [Validators.required, Validators.minLength(6)]],
  });

  readonly typesDocuments: {
    value: TypeDocumentConducteur;
    label: string;
  }[] = [
    {
      value: 'PERMIS_CONDUIRE',
      label: 'Permis de conduire'
    },
    {
      value: 'CARTE_IDENTITE',
      label: "Carte d'identité"
    },
    {
      value: 'ASSURANCE',
      label: 'Assurance'
    },
    {
      value: 'CARTE_GRISE',
      label: 'Carte grise'
    },
    {
      value: 'AUTRE',
      label: 'Autre document'
    }
  ];

  ngOnInit(): void {
    this.chargerProfil();
  }

  /**
   * Chargement du user + profil conducteur
   */
  chargerProfil(): void {
    console.log('🟣 [PROFIL] Début chargement');

    this.chargement = true;
    this.messageErreur = '';

    this.utilisateur = this.authService.getCurrentUser();

    console.log('🟣 [PROFIL] Utilisateur localStorage :', this.utilisateur);

    if (!this.utilisateur?.idUser) {
      console.error('🔴 [PROFIL] Aucun utilisateur connecté');

      this.chargement = false;
      this.messageErreur = 'Impossible de récupérer le chauffeur connecté.';
      return;
    }

    const userId = this.utilisateur.idUser;

    console.log('🟢 [PROFIL] ID utilisateur :', userId);

    this.userService.getUserById(userId).subscribe({
      next: (user) => {
        console.log('🟢 [PROFIL] User récupéré :', user);

        this.utilisateur = user;

        this.remplirFormulaireUtilisateur(user);

        console.log('🟣 [PROFIL] Chargement profil conducteur...');

        this.chargerProfilConducteur(userId);

        this.chargerDocuments();

        this.cdr.detectChanges();
      },

      error: (error: HttpErrorResponse) => {
        console.error('🔴 [PROFIL] Erreur user :', error);

        this.messageErreur =
          error.error?.message ??
          'Impossible de charger vos informations personnelles.';

        this.chargerProfilConducteur(userId);
        this.cdr.detectChanges();
      },
    });
  }

  /**
   * Chargement du profil conducteur
   */
  private chargerProfilConducteur(userId: string): void {
    console.log(
      '🟣 [PROFIL CONDUCTEUR] Requête pour :',
      userId
    );

    this.profileConducteurService.getProfileByUserId(userId).subscribe({
      next: (profile) => {
        console.log(
          '🟢 [PROFIL CONDUCTEUR] Profil récupéré :',
          profile
        );

        this.profile = profile;
        this.profileExiste = true;

        this.remplirFormulaireConducteur(profile);

        this.chargement = false;


        console.log(
          '✅ [PROFIL] Chargement terminé'
        );

        console.log('🔥 chargement =', this.chargement);

        this.cdr.detectChanges();
      },

      error: (error: HttpErrorResponse) => {
        console.error(
          '🔴 [PROFIL CONDUCTEUR] Erreur :',
          error
        );

        if (error.status === 404) {
          console.log(
            '🟡 [PROFIL CONDUCTEUR] Aucun profil conducteur'
          );

          this.profile = null;
          this.profileExiste = false;

          this.conducteurForm.patchValue({
            actif: true,
          });

          this.chargement = false;

          return;
        }

        this.messageErreur =
          error.error?.message ??
          'Impossible de charger votre profil conducteur.';

        this.chargement = false;

        this.chargerDocuments();

        this.cdr.detectChanges();
      },
    });
  }

  chargerDocuments(): void {

    const userId = this.utilisateur?.idUser;

    if (!userId) {
      return;
    }

    this.chargementDocuments = true;
    this.erreurDocument = '';

    this.documentConducteurService
      .getDocuments(userId)
      .subscribe({

        next: (documents) => {

          this.documents = documents;

          this.chargementDocuments = false;

          console.log(
            '📄 Documents conducteur chargés :',
            documents
          );

          this.cdr.detectChanges();
        },

        error: (error) => {

          this.chargementDocuments = false;

          this.erreurDocument =
            'Impossible de charger les documents.';

          console.error(
            '❌ Erreur chargement documents :',
            error
          );

          this.cdr.detectChanges();
        }

      });
  }

  /**
   * Remplissage formulaire User
   */
  private remplirFormulaireUtilisateur(user: UserResponse): void {
    this.userForm.patchValue({
      nom: user.nom ?? '',

      prenom: user.prenom ?? '',

      email: user.email ?? '',

      telephone: user.telephone ?? '',

      sexe: user.sexe ?? '',
    });
  }

  /**
   * Remplissage formulaire Conducteur
   */
  private remplirFormulaireConducteur(profile: ProfileConducteurResponse): void {
    this.conducteurForm.patchValue({
      adresse: profile.adresse ?? '',

      bio: profile.bio ?? '',

      preferences: profile.preferences ?? '',

      vehicule: profile.vehicule ?? '',

      actif: profile.actif ?? true,
    });
  }

  /**
   * Sauvegarder informations personnelles
   */
  sauvegarderUtilisateur(): void {
    this.messageSucces = '';
    this.messageErreur = '';

    if (this.userForm.invalid) {
      this.userForm.markAllAsTouched();

      this.messageErreur = 'Veuillez corriger les informations personnelles.';

      return;
    }

    if (!this.utilisateur?.idUser) {
      this.messageErreur = 'Utilisateur non identifié.';

      return;
    }

    this.sauvegardeUtilisateur = true;

    const data: UserUpdateRequest = {
      nom: this.userForm.controls.nom.value,

      prenom: this.userForm.controls.prenom.value,

      email: this.userForm.controls.email.value,

      telephone: this.userForm.controls.telephone.value,

      sexe: this.userForm.controls.sexe.value || null,
    };

    this.userService.updateUser(this.utilisateur.idUser, data).subscribe({
      next: (user) => {
        this.utilisateur = user;

        this.mettreAJourUtilisateurStocke(user);

        this.messageSucces = 'Vos informations personnelles ont été mises à jour.';

        this.sauvegardeUtilisateur = false;
      },

      error: (error: HttpErrorResponse) => {
        console.error('Erreur modification utilisateur :', error);

        this.messageErreur = error.error?.message ?? 'Impossible de modifier vos informations.';

        this.sauvegardeUtilisateur = false;

        this.cdr.detectChanges();
      },
    });
  }

  /**
   * Sauvegarder profil conducteur
   */
  sauvegarderProfilConducteur(): void {
    this.messageSucces = '';
    this.messageErreur = '';

    if (this.conducteurForm.invalid) {
      this.conducteurForm.markAllAsTouched();

      this.messageErreur = 'Veuillez corriger les informations du profil conducteur.';

      return;
    }

    if (!this.utilisateur?.idUser) {
      this.messageErreur = 'Utilisateur non identifié.';

      return;
    }

    this.sauvegardeConducteur = true;

    const data: ProfileConducteurRequest = {
      adresse: this.conducteurForm.controls.adresse.value,

      bio: this.conducteurForm.controls.bio.value || null,

      preferences: this.conducteurForm.controls.preferences.value,

      vehicule: this.conducteurForm.controls.vehicule.value || null,

      actif: this.conducteurForm.controls.actif.value,

      userId: this.utilisateur.idUser,
    };

    const requete$ = this.profileExiste
      ? this.profileConducteurService.updateProfile(this.utilisateur.idUser, data)
      : this.profileConducteurService.createProfile(this.utilisateur.idUser, data);

    requete$.subscribe({
      next: (profile) => {
        const etaitDejaExistant = this.profileExiste;

        this.profile = profile;

        this.profileExiste = true;

        this.remplirFormulaireConducteur(profile);

        this.messageSucces = etaitDejaExistant
          ? 'Votre profil conducteur a été mis à jour.'
          : 'Votre profil conducteur a été créé.';

        this.sauvegardeConducteur = false;
        this.cdr.detectChanges();
      },

      error: (error: HttpErrorResponse) => {
        console.error('Erreur profil conducteur :', error);

        this.messageErreur =
          error.error?.message ?? 'Impossible d’enregistrer le profil conducteur.';

        this.sauvegardeConducteur = false;

        this.cdr.detectChanges();
      },
    });
  }

  /**
   * Sélection photo profil
   */
  selectionnerPhoto(event: Event): void {
    const input = event.target as HTMLInputElement;

    const file = input.files?.[0];

    if (!file) {
      return;
    }

    if (!this.verifierImage(file)) {
      input.value = '';
      return;
    }

    this.uploadPhoto(file);

    input.value = '';
  }

  /**
   * Sélection photo couverture
   */
  selectionnerCover(event: Event): void {
    const input = event.target as HTMLInputElement;

    const file = input.files?.[0];

    if (!file) {
      return;
    }

    if (!this.verifierImage(file)) {
      input.value = '';
      return;
    }

    this.uploadCover(file);

    input.value = '';
  }

  /**
   * Upload photo profil
   */
  private uploadPhoto(file: File): void {
    if (!this.utilisateur?.idUser) {
      return;
    }

    this.uploadPhotoEnCours = true;

    this.messageErreur = '';
    this.messageSucces = '';

    this.userService.uploadPhoto(this.utilisateur.idUser, file).subscribe({
      next: (user) => {
        this.utilisateur = user;

        this.mettreAJourUtilisateurStocke(user);

        this.messageSucces = 'Votre photo de profil a été mise à jour.';

        this.uploadPhotoEnCours = false;

        this.cdr.detectChanges();
      },

      error: (error: HttpErrorResponse) => {
        console.error('Erreur upload photo :', error);

        this.messageErreur = error.error?.message ?? 'Impossible de téléverser la photo.';

        this.uploadPhotoEnCours = false;

        this.cdr.detectChanges();
      },
    });
  }

  /**
   * Upload couverture
   */
  private uploadCover(file: File): void {
    if (!this.utilisateur?.idUser) {
      return;
    }

    this.uploadCoverEnCours = true;

    this.messageErreur = '';
    this.messageSucces = '';

    this.userService.uploadCoverPhoto(this.utilisateur.idUser, file).subscribe({
      next: (user) => {
        this.utilisateur = user;

        this.mettreAJourUtilisateurStocke(user);

        this.messageSucces = 'Votre photo de couverture a été mise à jour.';

        this.uploadCoverEnCours = false;

        this.cdr.detectChanges();
      },

      error: (error: HttpErrorResponse) => {
        console.error('Erreur upload couverture :', error);

        this.messageErreur = error.error?.message ?? 'Impossible de téléverser la couverture.';

        this.uploadCoverEnCours = false;

        this.cdr.detectChanges();
      },
    });
  }

  /**
   * Suppression photo profil
   */
  supprimerPhoto(): void {
    if (!this.utilisateur?.idUser) {
      return;
    }

    if (
      isPlatformBrowser(this.platformId) &&
      !window.confirm('Voulez-vous vraiment supprimer votre photo de profil ?')
    ) {
      return;
    }

    this.userService.deletePhoto(this.utilisateur.idUser).subscribe({
      next: () => {
        if (this.utilisateur) {
          this.utilisateur = {
            ...this.utilisateur,
            photoUrl: null,
          };

          this.mettreAJourUtilisateurStocke(this.utilisateur);
        }

        this.messageSucces = 'Votre photo de profil a été supprimée.';

        this.cdr.detectChanges();
      },

      error: (error: HttpErrorResponse) => {
        console.error('Erreur suppression photo :', error);

        this.messageErreur = 'Impossible de supprimer la photo.';

        this.cdr.detectChanges();
      },
    });
  }

  /**
   * Suppression couverture
   */
  supprimerCover(): void {
    if (!this.utilisateur?.idUser) {
      return;
    }

    if (
      isPlatformBrowser(this.platformId) &&
      !window.confirm('Voulez-vous vraiment supprimer votre photo de couverture ?')
    ) {
      return;
    }

    this.userService.deleteCoverPhoto(this.utilisateur.idUser).subscribe({
      next: () => {
        if (this.utilisateur) {
          this.utilisateur = {
            ...this.utilisateur,
            coverPhotoUrl: null,
          };

          this.mettreAJourUtilisateurStocke(this.utilisateur);
        }

        this.messageSucces = 'Votre photo de couverture a été supprimée.';

        this.cdr.detectChanges();
      },

      error: (error: HttpErrorResponse) => {
        console.error('Erreur suppression couverture :', error);

        this.messageErreur = 'Impossible de supprimer la couverture.';

        this.cdr.detectChanges();
      },
    });
  }

  /**
   * Vérification image
   */
  private verifierImage(file: File): boolean {
    if (!file.type.startsWith('image/')) {
      this.messageErreur = 'Veuillez sélectionner une image valide.';

      return false;
    }

    const tailleMax = 5 * 1024 * 1024;

    if (file.size > tailleMax) {
      this.messageErreur = 'L’image ne doit pas dépasser 5 Mo.';

      return false;
    }

    return true;
  }

  /**
   * Changement mot de passe
   */
  changerMotDePasse(): void {
    this.messageSucces = '';
    this.messageErreur = '';

    if (this.passwordForm.invalid) {
      this.passwordForm.markAllAsTouched();

      this.messageErreur = 'Veuillez remplir correctement les champs du mot de passe.';

      return;
    }

    const ancienPasse = this.passwordForm.controls.ancienPasse.value;

    const nouveauPasse = this.passwordForm.controls.nouveauPasse.value;

    const confirmationPasse = this.passwordForm.controls.confirmationPasse.value;

    if (nouveauPasse !== confirmationPasse) {
      this.messageErreur = 'La confirmation du nouveau mot de passe est incorrecte.';

      return;
    }

    const data: ChangePasswordRequest = {
      ancienPasse,

      nouveauPasse,

      confirmationPasse,
    };

    this.changementMotPasseEnCours = true;

    this.userService.changePassword(data).subscribe({
      next: (response) => {
        this.messageSucces = response?.message ?? 'Votre mot de passe a été modifié avec succès.';

        this.passwordForm.reset();

        this.changementMotPasseEnCours = false;

        this.cdr.detectChanges();
      },

      error: (error: HttpErrorResponse) => {
        console.error('Erreur changement mot de passe :', error);

        this.messageErreur = error.error?.message ?? 'Impossible de modifier le mot de passe.';

        this.changementMotPasseEnCours = false;

        this.cdr.detectChanges();
      },
    });
  }

  onDocumentFileSelected(event: Event): void {

    const input =
      event.target as HTMLInputElement;

    if (!input.files || input.files.length === 0) {
      this.fichierDocumentSelectionne = null;
      return;
    }

    this.fichierDocumentSelectionne =
      input.files[0];

    this.messageDocument = '';
    this.erreurDocument = '';

    console.log(
      '📄 Fichier sélectionné :',
      this.fichierDocumentSelectionne.name
    );
  }

  uploadDocument(): void {

    const userId = this.utilisateur?.idUser;

    if (!userId) {
      this.erreurDocument =
        'Utilisateur non identifié.';
      return;
    }

    if (!this.fichierDocumentSelectionne) {
      this.erreurDocument =
        'Veuillez sélectionner un fichier.';
      return;
    }

    this.uploadDocumentEnCours = true;
    this.messageDocument = '';
    this.erreurDocument = '';

    this.documentConducteurService
      .uploadDocument(
        userId,
        this.fichierDocumentSelectionne,
        this.typeDocumentSelectionne
      )
      .subscribe({

        next: (document) => {

          this.documents = [
            ...this.documents,
            document
          ];

          this.fichierDocumentSelectionne = null;

          this.uploadDocumentEnCours = false;

          this.messageDocument =
            'Document ajouté avec succès.';

          console.log(
            '✅ Document ajouté :',
            document
          );
          this.cdr.detectChanges();
        },

        error: (error) => {

          this.uploadDocumentEnCours = false;

          this.erreurDocument =
            error?.error?.message ??
            'Erreur lors de l’ajout du document.';

          console.error(
            '❌ Erreur upload document :',
            error
          );
          this.cdr.detectChanges();
        }

      });
  }

  supprimerDocument(
    document: DocumentConducteurResponse
  ): void {

    const userId = this.utilisateur?.idUser;

    if (!userId) {
      return;
    }

    if (
      isPlatformBrowser(this.platformId) &&
      !window.confirm(
        `Voulez-vous vraiment supprimer "${document.nom}" ?`
      )
    ) {
      return;
    }

    this.documentConducteurService
      .deleteDocument(
        userId,
        document.documentId
      )
      .subscribe({

        next: () => {

          this.documents =
            this.documents.filter(
              d => d.documentId !== document.documentId
            );

          this.messageDocument =
            'Document supprimé avec succès.';

          console.log(
            '🗑️ Document supprimé :',
            document.documentId
          );
          this.cdr.detectChanges();

        },

        error: (error) => {

          this.erreurDocument =
            error?.error?.message ??
            'Impossible de supprimer le document.';

          console.error(
            '❌ Erreur suppression document :',
            error
          );
          this.cdr.detectChanges();
        }

      });
  }

ouvrirDocument(document: DocumentConducteurResponse): void {

  if (!isPlatformBrowser(this.platformId)) {
    return;
  }

  const userId = this.utilisateur?.idUser;

  if (!userId) {
    this.erreurDocument =
      'Impossible d’identifier le chauffeur connecté.';
    return;
  }

  this.erreurDocument = '';

  /*
   * On ouvre immédiatement la fenêtre pendant l'action utilisateur.
   * Cela évite que le navigateur bloque la popup.
   */
  const nouvelleFenetre = window.open('', '_blank');

  if (!nouvelleFenetre) {
    this.erreurDocument =
      'Le navigateur a bloqué l’ouverture du document. Autorisez les fenêtres pop-up pour METOA.';
    return;
  }

  /*
   * Page temporaire de chargement.
   */
  nouvelleFenetre.document.title =
    'Document conducteur - METOA';

  nouvelleFenetre.document.body.innerHTML = `
<div style="
  min-height:100vh;
  display:flex;
  align-items:center;
  justify-content:center;
  background:#05091f;
  color:#f6f7ff;
  font-family:Arial,sans-serif;
  ">
  <div style="
  text-align:center;
  ">
  <div style="
  width:40px;
  height:40px;
  margin:0 auto 16px;
  border:4px solid rgba(255,255,255,.15);
  border-top-color:#ec1d83;
  border-radius:50%;
  animation:spin 1s linear infinite;
  "></div>

  <p style="margin:0;">
    Chargement du document...
</p>
</div>
</div>

<style>
  @keyframes spin {
  from {
  transform:rotate(0deg);
}

to {
  transform:rotate(360deg);
}
}
</style>
  `;

  /*
   * Récupération sécurisée du document.
   *
   * HttpClient utilise automatiquement notre interceptor JWT.
   */
  this.documentConducteurService
    .getDocument(
      userId,
      document.documentId
    )
    .subscribe({

      next: (blob: Blob) => {

        console.log(
          '📄 Document reçu :',
          {
            type: blob.type,
            size: blob.size
          }
        );

        /*
         * Vérification du contenu.
         */
        if (!blob.size) {

          nouvelleFenetre.close();

          this.erreurDocument =
            'Le document reçu est vide.';

          return;
        }

        /*
         * Création d'une URL temporaire sécurisée
         * à partir du Blob récupéré avec le JWT.
         */
        const blobUrl =
          URL.createObjectURL(blob);

        /*
         * On nettoie complètement la fenêtre temporaire.
         */
        nouvelleFenetre.document.open();

        nouvelleFenetre.document.write(`
<!DOCTYPE html>

<html lang="fr">

<head>

  <meta charset="UTF-8">

<meta
  name="viewport"
content="width=device-width, initial-scale=1.0"
  >

  <title>
    Document conducteur - METOA
</title>

<style>

html,
  body {
  width:100%;
  height:100%;
  margin:0;
  padding:0;
  overflow:hidden;
  background:#05091f;
}

iframe {
  width:100%;
  height:100%;
  border:0;
  display:block;
  background:#05091f;
}

</style>

</head>

<body>

<iframe
  src="${blobUrl}"
title="Document conducteur"
  ></iframe>

  </body>

  </html>
    `);

        nouvelleFenetre.document.close();

        /*
         * On conserve le Blob URL pendant suffisamment longtemps
         * pour permettre au navigateur/PDF.js de charger le fichier.
         */
        setTimeout(() => {
          URL.revokeObjectURL(blobUrl);
        }, 5 * 60 * 1000);
      },

      error: (error) => { console.error( '❌ Erreur consultation document :', error );

        /*
         * La fenêtre temporaire n'est plus nécessaire.
         */
        nouvelleFenetre.close();

        if (error.status === 401) {

          this.erreurDocument =
            'Votre session a expiré. Veuillez vous reconnecter.';

          return;
        }

        if (error.status === 403) {

          this.erreurDocument =
            'Vous n’êtes pas autorisé à consulter ce document.';

          return;
        }

        if (error.status === 404) {

          this.erreurDocument =
            'Le document demandé est introuvable.';

          return;
        }

        this.erreurDocument =
          'Impossible de consulter le document.';
      }
    });
}

    /**
   * URL photo profil
   */
  getPhotoProfil(): string | null {
    return this.userService.getPhotoUrl(this.utilisateur?.photoUrl);
  }

  /**
   * URL couverture
   */
  getPhotoCover(): string | null {
    return this.userService.getPhotoUrl(this.utilisateur?.coverPhotoUrl);
  }

  /**
   * Initiale utilisateur
   */
  get initiale(): string {
    return this.utilisateur?.prenom?.charAt(0)?.toUpperCase() || 'C';
  }

  /**
   * Nom complet
   */
  get nomComplet(): string {
    if (!this.utilisateur) {
      return 'Chauffeur';
    }

    return `${this.utilisateur.prenom ?? ''} ${this.utilisateur.nom ?? ''}`.trim();
  }

  /**
   * Note formatée
   */
  formatNote(note: number | null | undefined): string {
    return Number(note ?? 0).toFixed(1);
  }

  /**
   * Mise à jour localStorage
   */
  private mettreAJourUtilisateurStocke(user: UserResponse): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    localStorage.setItem('metoa_driver_user', JSON.stringify(user));
  }
}
