export default {
  common: {
    next: "Suivant",
    previous: "Précédent",
    edit: "Editer",
    cancel: "Annuler",
    skip: "Ignorer",
    close: "Fermer",
    delete: "Supprimer",
    other: "Autre"
  },

  onboarding: {
    get_started: {
      next_button: "Commencer",
      website_button: "Aide - Code source",

      slide1: "Cactus-Key protège vos comptes avec l'authentification à deux facteurs"
    }
  },

  lockscreen: {
    title: "Sécurité",
    hint: "Entrez votre code de sécurité pour continuer",
    error: {
      message: "Code erroné, veuillez réessayer",
      ok: "OK",
      forgot: "J'ai oublié mon code de sécurité"
    }
  },

  services: {
    no_services_text: "Ajoutez votre premier compte pour commencer",
    no_services_button: "Ajouter un compte",
    copy_msg: "Token copié pour {{issuer}}.",

    add: {
      title: 'Ajouter un compte',
      hint: "Scannez un QR code d'activation pour associer votre compte",
      hint_no_permission: "Autorisez l'accès à votre caméra dans les réglages de votre smartphone pour scanner un QR code.",
      no_qrcode_button: "Pas de QR code ?",
      no_permission_button: "Saisir la clé manuellement",
      success_msg: "Le compte a bien été ajouté",
      errors: {
        totp_only: "Seul les codes TOTP (délai) sont pris en charge pour le moment",
        unknown: "Le code semble invalide, ré-essayez ou saisissez-le manuellement"
      },
      manual: {
        issuer: {
          text: "Quel type de compte souhaitez-vous ajouter ?",
          submit_link: "Compte manquant ? Demandez à l'ajouter"
        },
        info: {
          text: "Saisissez votre clé pour ajouter votre compte {{name}}.",
          account: "Compte",
          account_placeholder: "compte@example.com",
          secret: "Clé OTP",
          secret_placeholder: "A1B2C3D4E5F6G7H8",
          button: "Valider",
          errors: {
            unknown: "Les informations saisies semblent incorrectes",
            missing_account: "Vous devez saisir le nom du compte",
            missing_secret: "Vous devez saisir la clé OTP"
          }
        }
      }
    },

    edit: {
      title: "Détails du compte",
      account: "Nom du compte",
      button: "Enregistrer",
      errors: {
        unknown: "Les informations saisies semblent incorrectes",
        missing_account: "Vous devez saisir le nom du compte"
      }
    },

    delete: {
      title: "Confirmation de suppression",
      text: "Etes-vous sûr de vouloir supprimer {{name}} ?",
      success_msg: "Le compte a bien été supprimé",
    }
  },

  settings: {
    title: "Paramètres",
    general: {
      title: "Général",
      dark_mode: "Thème sombre",
      do_you_like: "Que pensez-vous de CactusKey ?"
    },
    security: {
      title: "Sécurité"
    }
  },

  feedback: {
    title: "Que pensez-vous de CactusKey ?",
    love_button: "J'adore CactusKey",
    disappointed_button: "Je suis déçu",

    love: {
      title: "Partagez votre joie !",
      text: "Fantastique ! Partagez votre joie en donnant une note sur le Store !",
      next_button: "Donner 5 étoiles à CactusKey",
      later_button: "Pas maintenant"
    },

    disappointed: {
      title: "Nous sommes désolés...",
      text: "... de ne pas avoir pu répondre à vos besoins ! Faites-nous savoir comment améliorer l'app avec ce questionnaire",
      next_button: "Donner mon avis",
      later_button: "Pas pour l'instant"
    }
  }
};