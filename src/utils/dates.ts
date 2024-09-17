


export function isWithinHoursMinutesInterval(date: Date, interval: { start: Date, end: Date }) {
    const dateHours = date.getHours();
    const dateMinutes = date.getMinutes();

    const startHours = interval.start.getHours();
    const startMinutes = interval.start.getMinutes();

    const endHours = interval.end.getHours();
    const endMinutes = interval.end.getMinutes();

    // Check if date is within the interval based on hours and minutes
    const isAfterStart = dateHours > startHours || (dateHours === startHours && dateMinutes >= startMinutes);
    const isBeforeEnd = dateHours < endHours || (dateHours === endHours && dateMinutes <= endMinutes);

    return isAfterStart && isBeforeEnd;
}

export function changeDate(date: Date, hours: number, minutes: number): Date {
    // Create a new Date object to avoid modifying the original date
    const modifiedDate = new Date(date);

    // Update hours and minutes
    modifiedDate.setHours(hours);
    modifiedDate.setMinutes(minutes);

    return modifiedDate;
}