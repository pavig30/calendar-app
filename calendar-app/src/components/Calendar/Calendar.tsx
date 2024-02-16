import React, {useEffect, useState} from 'react';
import './Calendar.css';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faChevronLeft, faChevronRight} from '@fortawesome/free-solid-svg-icons'

import {Event} from "../../types/types";
import {useNavigate, useParams} from "react-router-dom";
import CalendarDays from '../CalendarDays/CalendarDays';

const Calendar = () => {
    const navigate = useNavigate();
    const searchParams = useParams();
    const [year, setYear] = useState<number>(Number(searchParams.year));
    const [month, setMonth] = useState<number>(Number(searchParams.month));
    const staticDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    const [weekDays, setWeekDays] = useState(staticDays);
    const [currentMonth, setCurrentMonth] = useState(new Date(Number(searchParams.year), Number(searchParams.month) - 1));
    const [events, setEvents] = useState<Event[]>([]);

    const [width, setWidth] = useState(window.innerWidth);

    useEffect(() => {
        const handleResize = () => setWidth(window.innerWidth);
        window.addEventListener('resize', handleResize);
        setWeekDays(width <= 768 ? ['S', 'M', 'T', 'W', 'T', 'F', 'S'] : staticDays)
        return () => window.removeEventListener('resize', handleResize);
    }, [window.innerWidth]);

    // Get year and month from parameters
    useEffect(() => {
        const initialYear = searchParams.year;
        const initialMonth = Number(searchParams.month);

        if (initialYear && initialMonth) {
            const minYear = 1900;
            const maxYear = 2100;
            if (
                isNaN(Number(initialYear)) ||
                parseInt(initialYear, 10) < minYear ||
                parseInt(initialYear, 10) > maxYear ||
                isNaN(Number(initialMonth)) ||
                parseInt(String(initialMonth), 10) < 1 ||
                parseInt(String(initialMonth), 10) > 12
            ) {
                // Redirect to current date if invalid
                const today = new Date();
                window.location.replace(`/${today.getFullYear()}/${today.getMonth() + 1}`);
                return;
            }

            setYear(parseInt(initialYear, 10));
            setMonth(parseInt(String(initialMonth), 10));
        }
    }, [searchParams]);

    useEffect(() => {
        fetch('https://amock.io/api/infopav/events')
            .then(async response => await response.json()
                .then(data => typeof data.events !== "undefined"
                    ? setEvents(data.events)
                    : setEvents([])
                )
            )
            .catch((e) => console.log('API failed to fetch event data', e));
    }, []);

    const forward = () => {
        const y = currentMonth.getFullYear();
        const m = currentMonth.getMonth();
        if (m === 11) {
            setCurrentMonth(new Date(y + 1, 0))
            navigate(`/${y + 1}/${1}`)
        } else {
            setCurrentMonth(new Date(y, m + 1))
            navigate(`/${y}/${m + 2}`)
        }
    }

    const backward = () => {
        const y = currentMonth.getFullYear();
        const m = currentMonth.getMonth();
        if (m <= 0) {
            setCurrentMonth(new Date(y - 1, 11))
            navigate(`/${y - 1}/${12}`)
        } else {
            setCurrentMonth(new Date(y, m - 1))
            navigate(`/${y}/${m}`)
        }
    }

    return (
        <div className="calendar" data-testid={'calendar-component'}>
            <div className="header">
                <span className={'arrows'} data-testid={'arrow-left'} onClick={() => backward()}><FontAwesomeIcon icon={faChevronLeft}/></span>
                <h1>{currentMonth.toLocaleDateString('en-US', {month: 'long', year: 'numeric'})}</h1>
                <span className={'arrows'} data-testid={'arrow-right'} onClick={() => forward()}><FontAwesomeIcon icon={faChevronRight}/></span>
            </div>
            <div className="days week-days">{weekDays.map((day, i) => <div key={'week-days-'+ i} className="day">{day}</div>)}</div>
            <CalendarDays currentMonth={currentMonth} events={events} />
        </div>
    );
};

export default Calendar;