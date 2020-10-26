export default {
  common: {
    next: "Next",
    previous: "Previous",
    edit: "Edit",
    cancel: "Cancel",
    skip: "Skip",
    close: "Close",
    delete: "Delete",
    other: "Other"
  },

  onboarding: {
    get_started: {
      next_button: "Get Started",
      website_button: "Help - Source code",

      slide1: "Cactus-Key protects your accounts with two-factor authentication"
    }
  },

  services: {
    no_services_text: "Add your first account to get started",
    no_services_button: "Add an account",
    copy_msg: "Token copied for {{issuer}}.",

    add: {
      title: 'Add an account',
      hint: "Scan an activation QR code to link your account",
      hint_no_permission: "Allow access to your camera in your smartphone settings to scan a QR code.",
      no_qrcode_button: "No QR code ?",
      no_permission_button: "Enter key manually",
      success_msg: "The account has been added",
      errors: {
        totp_only: "Only TOTP (delay) codes are supported at this time",
        unknown: "The code seems invalid, try again or enter it manually"
      },
      manual: {
        issuer: {
          text: "What type of account do you want to add?"
        },
        info: {
          text: "Enter your key to add your {{name}} account.",
          account: "Account",
          account_placeholder: "account@example.com",
          secret: "OTP secret",
          secret_placeholder: "A1B2C3D4E5F6G7H8",
          button: "Add account",
          errors: {
            unknown: "The information entered seems incorrect",
            missing_account: "You must enter the account name",
            missing_secret: "You must enter the OTP secret"
          }
        }
      }
    },

    edit: {
      title: "Account details",
      account: "Account name",
      button: "Save",
      errors: {
        unknown: "The information entered seems incorrect",
        missing_account: "You must enter the account name"
      }
    },

    delete: {
      title: "Deletion confirmation",
      text: "Are you sure you want to delete {{name}}?",
      success_msg: "The account has been deleted",
    }
  },

  settings: {
    title: "Settings",
    general: {
      title: "General",
      dark_mode: "Dark theme"
    },
    security: {
      title: "Security"
    }
  }
};