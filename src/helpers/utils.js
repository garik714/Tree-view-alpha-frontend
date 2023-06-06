export const validateEmail = (email) => {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    
    return re.test(String(email).toLowerCase());
};

export const isValidHttpUrl = (string) => {
    let url;
    
    try {
        url = new URL(string);
    } catch (_) {
        return false;
    }
    
    return url.protocol === "http:" || url.protocol === "https:";
}
