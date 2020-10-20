export default {
  common: {
    next: "Suivant",
    previous: "Précédent",
    cancel: "Annuler",
    skip: "Ignorer",
    close: "Fermer",
    delete: "Supprimer",
    other: "Autre"
  },

  onboarding: {
    get_started: {
      title: "Get Started",
      button: "Let's go!"
    }
  },

  services: {
    loading_text: "Chargement de vos services...",
    no_services_text: "Aucun service",
    no_services_button: "+ Ajouter",

    add: {
      title: 'Ajouter un compte',
      hint: "Scannez un QR code d'activation pour associer votre compte",
      hint_no_permission: "Autorisez l'accès à votre caméra dans les réglages de votre smartphone pour scanner un QR code.",
      no_qrcode_button: "Pas de QR code ?",
      no_permission_button: "Saisir la clé manuellement",
      success_msg: "Le compte a bien été ajouté",
      manual: {
        issuer: {
          text: "Quel type de compte souhaitez-vous ajouter ?"
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
  }
};