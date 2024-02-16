import React, {useEffect, useState} from 'react';
import { DaysProps, Event } from '../../interfaces/interfaces';


const Days: React.FC<DaysProps> = (props: DaysProps) => {
    const [selectedEvent, setSelectedEvent] = useState<{ weekIndex: number | string, event: Event } | null>(null);
    const [selectedWeekIndex, setSelectedWeekIndex] = useState<number | string | null>(null);
    const daysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
    const startOfMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth(), 1).getDay();

    const today = new Date();
    const totalDays = daysInMonth(props.currentMonth.getFullYear(), props.currentMonth.getMonth());
    const startDay = startOfMonth(props.currentMonth);

    // Calculate the total number of days to display, including days from previous and next months
    const totalDisplayDays = 35; // 5 rows of 7 days
    const previousMonthDays = startDay === 0 ? 6 : startDay; // Days from previous month
    const nextMonthDays = totalDisplayDays - totalDays - previousMonthDays; // Days from next month

    // Dates from the previous month
    const previousMonth = new Date(props.currentMonth.getFullYear(), props.currentMonth.getMonth() - 1);
    const previousMonthTotalDays = daysInMonth(previousMonth.getFullYear(), previousMonth.getMonth());
    const previousMonthStart = previousMonthTotalDays - previousMonthDays + 1;

    const url = process.env.REACT_APP_IMAGE_BASE_URL || '';
    const weeks: { day: number; month: string; }[][] = [];
    let days = [];

    // Add days from the previous month
    for (let i = previousMonthStart; i <= previousMonthTotalDays; i++) {
        days.push({ day: i, month: 'previous' });
    }

    // Add days from the current month
    for (let i = 1; i <= totalDays; i++) {
        days.push({ day: i, month: 'current' });
    }

    // Add days from the next month
    for (let i = 1; i <= nextMonthDays; i++) {
        days.push({ day: i, month: 'next' });
    }

    let week: { day: number; month: string; }[] = [];

    days.forEach((item, index) => {
        week.push(item);
        if ((index + 1) % 7 === 0) {
            weeks.push(week);
            week = [];
        }
    });

    const handleDayClick = (event: Event, weekIndex: number | string, id: number | string) => {
        if (selectedEvent && selectedEvent.event.id === id){
            setSelectedEvent(null);
            return;
        }
        if (event) {
            setSelectedWeekIndex(weekIndex);
            setSelectedEvent({weekIndex, event});
        } else {
            setSelectedWeekIndex(0);
            setSelectedEvent(null);
        }
    };

    const renderEventsForDay = (eventsForDay: Event[], weekIndex: number | string, day: number | string, isCurrentMonth:boolean) => {
        return eventsForDay.map((event, eventIndex) =>
            {
                return (
                    isCurrentMonth ?
                        <div id={'event-' + weekIndex} key={'event-' + event.id} className="event has-event"
                             style={{backgroundImage: `url(https://pavi-calendar-app.netlify.app/${event.imageFilenameThumb}.webp)`}}
                             onClick={() => {
                                 handleDayClick(event, weekIndex, event.id);
                             }}
                        >
                            {
                                eventsForDay.length === 1
                                    ? <div className="day-number">{day}</div>
                                    : eventIndex === 0
                                        ? <div className="day-number">{day}</div>
                                        : <div className="empty-day-number"></div>
                            }
                        </div>
                        : <div id={'event-' + weekIndex} key={'event-' + event.id} className="event">
                            <div className="day-number">{day}</div>
                        </div>
                )
            }
        );
    };

    const renderEvent = (event: Event) => {
        return (
            <div className="event-section">
                <div className="event-detail" style={{backgroundImage: `url(https://pavi-calendar-app.netlify.app/${event.imageFilenameFull}.webp)`}}>
                    <h2>{event.title}</h2>
                    <p>{event.summary}</p>
                    <p className='available'>
                        <b>Available {new Date(event.launchDate).toLocaleDateString('en-US', {day:'2-digit', month: 'long', year: 'numeric'})}</b>
                        </p>
                    <a className={'btn btn-primary'} href={event.learnMoreLink} target={'_blank'}>Learn More</a>
                    <a className={'btn btn-secondary'} href={event.purchaseLink} target={'_blank'}>Purchase</a>
                </div>
            </div>
        )
    }

    useEffect(() => {
        setSelectedEvent(null)
    }, [props.currentMonth]);

    return (
        <React.Fragment>
            {
                weeks.map((w, weekIndex) => {
                    return (
                        <React.Fragment key={'week-' + weekIndex}>
                            <div className="days">
                                {w.map((day: { day: number; month: string; }, index: number) => {
                                    const eventsForDay = props.events.filter((event) => {
                                        const eventDate = new Date(event.launchDate);
                                        return eventDate.getDate() === day.day
                                            && eventDate.getMonth() === props.currentMonth.getMonth()
                                            && eventDate.getFullYear() === props.currentMonth.getFullYear();
                                    });
                                    return (
                                        <div key={'day-' + index} data-testid="day"
                                            className={`day${day.month !== 'current' ? ' other-month' : ''} ${day.day === today.getDate() ? 'today' : ''}`}>
                                            <div className="events">
                                                {
                                                    eventsForDay.length > 0
                                                        ? renderEventsForDay(eventsForDay, weekIndex, day.day, day.month === 'current')
                                                        : <div className="event">
                                                            <div className="day-number">{day.day}</div>
                                                        </div>
                                                }
                                            </div>
                                        </div>
                                    )
                                })
                                }
                            </div>
                            {
                                selectedWeekIndex === weekIndex && selectedEvent && renderEvent(selectedEvent.event)
                            }
                        </React.Fragment>
                    )
                })
            }
        </React.Fragment>
    );
}

export default Days;