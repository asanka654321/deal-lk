export type Language = "en" | "si" | "ta";

export const translations = {
    en: {
        nav: {
            home: "Home",
            allAds: "All Ads",
            categories: "Categories",
            stores: "Stores",
            postAd: "Post an Ad",
            login: "Log in",
            logout: "Log out",
        },
        hero: {
            title: "Buy & Sell {anything} in {sriLanka}",
            anything: "Anything",
            sriLanka: "Sri Lanka",
            subtitle: "Experience the most premium marketplace for all your needs.",
            searchPlaceholder: "What are you looking for?",
            searchButton: "Search",
        }
    },
    si: {
        nav: {
            home: "මුල් පිටුව",
            allAds: "සියලුම දැන්වීම්",
            categories: "වර්ගීකරණයන්",
            stores: "වෙළඳසැල්",
            postAd: "දැන්වීමක් පළ කරන්න",
            login: "ඇතුල් වන්න",
            logout: "ඉවත් වන්න",
        },
        hero: {
            title: "ශ්‍රී ලංකාවේ {anything} ගන්න සහ විකුණන්න",
            anything: "ඕනෑම දෙයක්",
            sriLanka: "ශ්‍රී ලංකාවේ",
            subtitle: "ඔබේ සියලු අවශ්‍යතා සඳහා වඩාත්ම වටිනා වෙළඳපොළ අත්විඳින්න.",
            searchPlaceholder: "ඔබ සොයන්නේ කුමක්ද?",
            searchButton: "සොයන්න",
        }
    },
    ta: {
        nav: {
            home: "முகப்பு",
            allAds: "அனைத்து விளம்பரங்கள்",
            categories: "வகைகள்",
            stores: "கடைகள்",
            postAd: "விளம்பரம் இடுக",
            login: "உள்நுழைய",
            logout: "வெளியேற",
        },
        hero: {
            title: "இலங்கையில் {anything} வாங்கவும் விற்கவும்",
            anything: "எதையும்",
            sriLanka: "இலங்கையில்",
            subtitle: "உங்களின் அனைத்து தேவைகளுக்கும் மிகவும் பிரீமியம் சந்தையை அனுபவியுங்கள்.",
            searchPlaceholder: "நீங்கள் எதைத் தேடுகிறீர்கள்?",
            searchButton: "தேடு",
        }
    }
};

export type TranslationKey = typeof translations.en;
