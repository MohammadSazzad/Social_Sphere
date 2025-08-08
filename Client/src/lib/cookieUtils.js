export const clearAllCookies = () => {
    document.cookie.split(";").forEach((cookie) => {
        const eqPos = cookie.indexOf("=");
        const name = eqPos > -1 ? cookie.substr(0, eqPos).trim() : cookie.trim();
        
        if (name === 'jwt') return;
        
        document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
        document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=${window.location.hostname}`;
        
        const domain = window.location.hostname;
        const parts = domain.split('.');
        if (parts.length > 1) {
            const parentDomain = '.' + parts.slice(-2).join('.');
            document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=${parentDomain}`;
        }
    });
};

export const clearCookie = (name) => {
    if (name === 'jwt') {
        console.warn('Cannot clear httpOnly JWT cookie from client-side. This is handled by the server.');
        return;
    }
    
    document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
    document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=${window.location.hostname}`;
    
    const domain = window.location.hostname;
    const parts = domain.split('.');
    if (parts.length > 1) {
        const parentDomain = '.' + parts.slice(-2).join('.');
        document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=${parentDomain}`;
    }
};

export const clearAllStorage = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('authUser');
    localStorage.removeItem('user');
    localStorage.removeItem('auth-storage');

    sessionStorage.removeItem('token');
    sessionStorage.removeItem('authUser');
    sessionStorage.removeItem('user');
    sessionStorage.removeItem('auth-storage');
    
    localStorage.removeItem('jwt');
    sessionStorage.removeItem('jwt');
};
