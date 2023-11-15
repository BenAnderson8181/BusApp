export const formatCurrency = (value: number | null) => {
    if (value === null)
        return '---';
    if (isNaN(+value))
        return '---';
    if (value == 0)
        return '---';
    if (Number(value) > 0) {
        return Number(value).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
    }
    else {
        return `(${Math.abs(+value).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')})`;
    }
}

export const formatPhone = (phone: string) => {
    return `(${phone.slice(0, 3)}) ${phone.slice(3, 6)}-${phone.slice(6, 10)}`;
}