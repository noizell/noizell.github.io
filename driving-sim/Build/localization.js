function getLanguageFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    const lang = urlParams.get('lang');
    return lang || 'en'; // Default to 'en' if no lang parameter is found
}

// Object holding the translations
const translations = {
    'en': 'Please rotate your device to landscape mode.',
    'cn': '把手机横过来以开始游戏。',
    'bn': 'দয়া করে আপনার ডিভাইসটি ল্যান্ডস্কেপ মোডে ঘুরিয়ে নিন।.',
    'ta': 'தயவுசெய்து உங்கள் சாதனத்தை லான்ட்ஸ்கேப் முறையில் சுழற்றுங்கள்.',
    'id': 'Tolong rotasi layar ke mode lanskap.',
};

function updateLanguage() {
    const lang = getLanguageFromURL();
    const messageElement = document.getElementById('rotate-message');
    messageElement.textContent = translations[lang] || translations['en'];
}

document.addEventListener('DOMContentLoaded', updateLanguage);