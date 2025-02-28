export const formatDate = (date: Date): string => {
    return date.toLocaleDateString();
};

export const capitalizeFirstLetter = (string: string): string => {
    return string.charAt(0).toUpperCase() + string.slice(1);
};

export const generateUniqueId = (): string => {
    return 'id-' + Math.random().toString(36).substr(2, 16);
};