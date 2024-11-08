'use client'

const Age = (props) => {

    const daysSince = (dateString) => {
        const timeDifference = new Date() - new Date(dateString);
        return Math.floor(timeDifference / (1000 * 60 * 60 * 24));
    }

    const formatDays = (days) => {
        const years = Math.floor(days / 365);
        const remainingDaysAfterYears = days % 365;
        const months = Math.floor(remainingDaysAfterYears / 30);
        let remainingDays = remainingDaysAfterYears % 30;

        const formatUnit = (value, singular, plural) => value > 0 ? `${value} ${value === 1 ? singular : plural}` : '';

        const yearText = formatUnit(years, 'year', 'years');
        const monthText = formatUnit(months, 'month', 'months');
        const dayText = formatUnit(remainingDays, 'day', 'days');

        const formattedMessage = [yearText, monthText, dayText].filter(Boolean).join(' ');
        return `We are ${formattedMessage} old`;
    }


    return (
        <>
            {formatDays(daysSince(props.date))}
        </>
    )
}

export default Age