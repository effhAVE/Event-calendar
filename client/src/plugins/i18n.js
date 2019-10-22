import Vue from 'vue';
import VueI18n from 'vue-i18n';
Vue.use(VueI18n);

const messages = {
    'en': {
        appWelcomeText: "Hello",
        appLoginTitle: "Log in",
        formEmailLabel: "Email",
        formPasswordLabel: "Password",
        calendarToday: "Today",
        calendarDay: "Day",
        calendarWeek: "Week",
        calendarMonth: "Month",
        buttonCancelText: "Cancel",
        navHome: "Home",
        navLogin: "Log in",
        navRegister: "Sign up",
        navLogout: "Logout"
    },
    'pl': {
        appWelcomeText: "Witaj",
        appLoginTitle: "Zaloguj się",
        formEmailLabel: "Email",
        formPasswordLabel: "Hasło",
        calendarToday: "Dzisiaj",
        calendarDay: "Dzień",
        calendarWeek: "Tydzień",
        calendarMonth: "Miesiąc",
        buttonCancelText: "Anuluj",
        navHome: "Strona główna",
        navLogin: "Zaloguj się",
        navRegister: "Zarejestruj się",
        navLogout: "Wyloguj"
    }
};

const i18n = new VueI18n({
    locale: 'pl', // set locale
    fallbackLocale: 'en', // set fallback locale
    messages, // set locale messages
});

export default i18n;