import Vue from 'vue';
import VueI18n from 'vue-i18n';
Vue.use(VueI18n);

const messages = {
    'en': {
        appWelcomeText: "Hello",
        appLoginTitle: "Log in",
        appRegisterTitle: "Register",
        formEmailLabel: "Email",
        formPasswordLabel: "Password",
        formPasswordRepeatLabel: "Confirm password",
        formNameLabel: "User name",
        formRequired: "Input required",
        formPasswordMatch: "Different passwords entered",
        formValidEmail: "Not a valid email",
        formNameLength: "Name should be at least 5 characters",
        formPasswordLength: "Password should be at least 5 characters",
        calendarToday: "Today",
        calendarDay: "Day",
        calendarWeek: "Week",
        calendarMonth: "Month",
        calendarEventEditTitle: "Edit event",
        calendarEventCreateTitle: "Create event",
        eventStartdate: "Start date",
        eventEnddate: "End date",
        eventStarttime: "Start time",
        eventEndtime: "End time",
        eventColor: "Color",
        eventDetails: "Details",
        eventName: "Title",
        buttonCancelText: "Cancel",
        buttonSaveText: "Save",
        buttonDeleteText: "Delete",
        navHome: "Home",
        navLogin: "Log in",
        navRegister: "Sign up",
        navLogout: "Logout"
    },
    'pl': {
        appWelcomeText: "Witaj",
        appLoginTitle: "Zaloguj się",
        appRegisterTitle: "Zarejestruj się",
        formEmailLabel: "Email",
        formPasswordLabel: "Hasło",
        formPasswordRepeatLabel: "Potwierdź hasło",
        formNameLabel: "Nazwa użytkownika",
        formRequired: "Pole wymagane",
        formPasswordMatch: "Wprowadzono różne hasła",
        formValidEmail: "Niepoprawny email",
        formNameLength: "Nazwa powinna zawierać przynajmniej 5 znaków",
        formPasswordLength: "Hasło powinno zawierać przynajmniej 5 znaków",
        calendarToday: "Dzisiaj",
        calendarDay: "Dzień",
        calendarWeek: "Tydzień",
        calendarMonth: "Miesiąc",
        calendarEventEditTitle: "Edytuj wydarzenie",
        calendarEventCreateTitle: "Utwórz wydarzenie",
        eventStartdate: "Data rozpoczęcia",
        eventEnddate: "Data zakończenia",
        eventStarttime: "Godzina rozpoczęcia",
        eventEndtime: "Godzina zakończenia",
        eventColor: "Kolor",
        eventDetails: "Szczegóły",
        eventName: "Tytuł",
        buttonCancelText: "Anuluj",
        buttonSaveText: "Zapisz",
        buttonDeleteText: "Usuń",
        navHome: "Strona główna",
        navLogin: "Zaloguj się",
        navRegister: "Zarejestruj się",
        navLogout: "Wyloguj"
    }
};

const i18n = new VueI18n({
    locale: 'pl',
    fallbackLocale: 'en',
    messages,
});

export default i18n;