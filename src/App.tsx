import './App.css';
import dayjs from 'dayjs';
import 'dayjs/locale/en-gb.js';
import { Calendar } from 'components/Calendar/Calendar.tsx';
import { Stack, styled } from '@mui/material';
import { Header } from 'components/Header/Header.tsx';
import { useState } from 'react';
import { Modal } from 'components/Modal/Modal.tsx';
import { getRandomColor } from 'services/getRandomColor.ts';
import Update from 'assets/update.svg';
import Remove from 'assets/remove1.svg';

const StackStyled = styled(Stack)`
  margin: 50px auto;
  max-width: 968px;
  box-shadow:
    0 0 0 1px #b7caf3,
    0 8px 20px 6px #888;
  border-radius: 7px;
`;

const inputStyles = `
  padding: 4px 14px;
  font-size: 0.85rem;
  width: 100%;
  border: unset;
  color: black;
  outline: unset;
  border-bottom: 2px solid #e3e3e3;
  letter-spacing: 0.05em;
`;

const EventTitle = styled('input')`
  ${inputStyles};
  margin: 40px 0;
  width: 100%;
`;

const EventDescription = styled('textarea')`
  ${inputStyles};
  resize: none;
  width: 100%;
  margin: 10% 0;
`;

const EventDate = styled('input')`
  ${inputStyles};
  width: 55%;
  position: relative;
`;
const EventTime = styled('input')`
  ${inputStyles};
  width: 30%;
  margin-left: 15%;
`;

const EventHours = styled('span')`
  position: absolute;
  right: 5%;
  margin-left: 10%;
`;

const EventDescriptionWrapper = styled('div')`
  position: relative;
`;

const UpdateIcon = styled('img')`
  position: absolute;
  right: 0;
  top: 0;
`;

interface IEvent {
  title: string;
  description: string;
  date: string;
  time: string;
  id?: string;
  background?: string;
  createdAt?: string;
}

function App() {
  dayjs.locale('en-gb');

  // const startDayOfWeek = dayjs().startOf('month').startOf('week');
  // const endDayOfWeek = dayjs().endOf('month').endOf('week');
  // console.log('startDayOfWeek', startDayOfWeek.format('YYYY-MM-DD'));
  // console.log('endDayOfWeek', endDayOfWeek);

  const [today, setToday] = useState(dayjs());

  console.log('createdAT', today.format('DD.MM.YYYY HH:mm'));

  const [modalActive, setModalActive] = useState(false);

  const [events, setEvents] = useState<IEvent[]>(() => {
    const storedEvents = localStorage.getItem('events');
    return storedEvents ? JSON.parse(storedEvents) : [];
  });

  const [event, setEvent] = useState<IEvent>({
    title: '',
    description: '',
    date: dayjs().format('YYYY-MM-DD'),
    time: '',
    createdAt: '',
  });

  console.log(event);

  const [method, setMethod] = useState('');

  const prevMonthHandler = () => {
    setToday(prev => prev.subtract(1, 'month'));
  };
  const nextMonthHandler = () => {
    setToday(prev => prev.add(1, 'month'));
  };
  const currentMonthHandler = () => {
    setToday(dayjs());
  };

  // const date = today.format('DD.MM.YYYY HH:mm');

  const resetForm = () => {
    setEvent({
      title: '',
      description: '',
      date: dayjs().format('YYYY-MM-DD'),
      time: '',
    });
  };

  // const openCreate = (methodeName: string) => {
  //   console.log(methodeName);
  //   // setMethod(methodeName);
  //   addEvent();
  // };

  const addEvent = () => {
    const eventIndex = events.findIndex(eventElem => eventElem.id === event.id);

    if (eventIndex === -1) {
      const newEvent = {
        ...event,
        id: String(events.length + 1),
        background: getRandomColor(),
        createdAt: dayjs().format('DD.MM.YYYY HH:mm'),
      };
      localStorage.setItem('events', JSON.stringify([...events, newEvent]));
      setEvents(prevEvents => [...prevEvents, newEvent]);
    } else {
      const updatedEvents = structuredClone(events);
      updatedEvents[eventIndex] = event;
      setEvents(updatedEvents);
      localStorage.setItem('events', JSON.stringify(updatedEvents));
    }
  };

  const openFormHandler = (methodName: string, eventForEdit: IEvent) => {
    console.log(methodName);
    setMethod(methodName);
    setModalActive(true);
    setEvent(eventForEdit);
    setEvents(prevEvents =>
      prevEvents.map(eventEl => (eventEl.id === eventForEdit.id ? eventForEdit : eventEl)),
    );
  };

  const eventChangeHandler = (text: string, field: string) => {
    setEvent(prevState => ({
      ...prevState,
      [field]: text,
    }));
  };

  const removeEvent = e => {
    e.preventDefault();
    const result = events.filter(eventEl => eventEl.id !== event.id);
    setEvents(result);
    localStorage.setItem('events', JSON.stringify(result));
    setModalActive(false);
  };

  return (
    <>
      <StackStyled>
        <Header
          today={today}
          setModalActive={setModalActive}
          prevMonthHandler={prevMonthHandler}
          nextMonthHandler={nextMonthHandler}
          currentMonthHandler={currentMonthHandler}
          // openCreate={openCreate}
          // method={method}
        />
        <Calendar today={today} events={events} openFormHandler={openFormHandler} />
      </StackStyled>
      {modalActive ? (
        <Modal
          active={modalActive}
          setActive={setModalActive}
          title={method === 'Update' ? 'Edit idea item' : 'Add new idea item'}
          resetForm={resetForm}
          setMethod={setMethod}>
          <form>
            {method === 'Update' && (
              <p style={{ color: '#9e9e9e', fontSize: '0.85rem', fontStyle: 'italic' }}>
                Created at {event.createdAt}
              </p>
            )}
            <EventTitle
              type="text"
              placeholder={'Title goes here'}
              required
              value={event.title}
              onChange={({ target }) => eventChangeHandler(target.value, 'title')}
            />
            <EventDescriptionWrapper>
              <EventDescription
                placeholder={'Description'}
                value={event.description}
                onChange={({ target }) => eventChangeHandler(target.value, 'description')}
              />
              {method === 'Update' && <UpdateIcon src={Update} alt="update icon" />}
            </EventDescriptionWrapper>
            <EventDate
              type="date"
              placeholder={'Date'}
              required
              value={event.date}
              onChange={({ target }) => eventChangeHandler(target.value, 'date')}
            />
            <EventTime
              type="time"
              value={event.time}
              placeholder={'Begin time'}
              onChange={({ target }) => eventChangeHandler(target.value, 'time')}
            />
            <EventHours>🕒</EventHours>

            {method === 'Update' && (
              <button onClick={removeEvent}>
                <img src={Remove} alt="remove icon" />
              </button>
            )}

            <button
              onClick={e => {
                e.preventDefault();
                addEvent();
                setModalActive(false);
                resetForm();
              }}>
              SAVE
            </button>
          </form>
        </Modal>
      ) : null}
    </>
  );
}

export default App;
