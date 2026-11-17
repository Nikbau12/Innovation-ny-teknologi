// Indstillinger for landing pagen.
// Firebase-config er den samme som i database/firebase.js.

export const FIREBASE_CONFIG = {
    apiKey: "AIzaSyCNH7z566XNodLzLffOnpIBVYjnwTItJ2o",
    authDomain: "innt-7578d.firebaseapp.com",
    databaseURL: "https://innt-7578d-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "innt-7578d",
    storageBucket: "innt-7578d.firebasestorage.app",
    messagingSenderId: "1010812931807",
    appId: "1:1010812931807:web:beb207e95053880f2a236a",
};

// EmailJS sender bekræftelsesmailen (gratis op til 200 mails/md). Se landing/README.md.
// Står felterne tomme, gemmes tilmeldingen stadig, men der sendes ingen mail.
export const EMAILJS = {
    publicKey: "",
    serviceId: "",
    templateId: "",
};

export const LANCERING = {
    dato: "2027-03-01T00:00:00+01:00",
    tekst: "marts 2027",
    antalBoostedeAnnoncer: 5,
};

// Antallet af tilmeldte vises først på siden, når det når dette tal
export const VIS_ANTAL_FRA = 10;
