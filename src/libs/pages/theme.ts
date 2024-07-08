export const setTheme = (newTheme: string) => {
    if (newTheme === 'dark') {
        document.documentElement.classList.add('dark');
    } else if (newTheme === 'light') {
        document.documentElement.classList.remove('dark');
    }
}

export const setPreferredTheme = (newTheme: string) => {
    setTheme(newTheme);
    try {
        localStorage.setItem('theme', newTheme);
    } catch (err) { }
};