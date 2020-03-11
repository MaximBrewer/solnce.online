window.__ = function (name) {

    let translation, translationNotFound = true

    try {
        translation = name.split('.').reduce((t, i) => t[i] || null, window._translations.php)
        if (translation) {
            translationNotFound = false
        }
    } catch (e) {
        translation = name
    }

    if (translationNotFound) {
        translation = window._translations.json[name]
            ? window._translations.json[name]
            : name
    }
    return translation

}