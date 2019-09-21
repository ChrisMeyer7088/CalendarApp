import { TimeFormat, Time } from '../interfaces/addNoticePopup'
let uniqueId: number = 0;

export const getUniqueId = (prefix="id"): string => {
    uniqueId++;
    return `${prefix}${uniqueId}`;
}

const formatHours = (hours: number) => {
    if(hours > 12) return hours - 12
    return hours
}

const formatMinutes = (minutes: number) => {
    if(minutes < 10) return `0${minutes}`;
    return minutes;
}

const formatTime = (hours: number): TimeFormat => {
    if(hours === 24) return TimeFormat.AM
    if(hours > 11) return TimeFormat.PM;
    return TimeFormat.AM;
}

export const formatTimeString = (time: Time): string => {
    return formatHours(time.hours) + ":" + formatMinutes(time.minutes) + " " + formatTime(time.hours);
}