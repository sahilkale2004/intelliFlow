import React from 'react';
import { Calendar, MapPin, Clock, Users } from 'lucide-react';
import './Events.css';

const Events = () => (
  <div className="events-container">
    <div className="events-header">
      <h1 className="events-title">Events</h1>
      <button className="create-event-button">Create Event</button>
    </div>

    <div className="events-list">
      {[
        {
          title: 'Tech Symposium 2024',
          date: 'March 15, 2024',
          location: 'Main Auditorium',
          attendees: 200,
          status: 'Planning',
          image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=1000',
        },
        {
          title: 'Cultural Fest',
          date: 'March 20, 2024',
          location: 'College Ground',
          attendees: 500,
          status: 'Marketing',
          image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&q=80&w=1000',
        },
        {
          title: 'Sports Meet',
          date: 'March 22, 2024',
          location: 'College Playground',
          attendees: 500,
          status: 'Planning',
          image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&q=80&w=1000',
        },
      ].map((event, index) => (
        <div key={index} className="event-card">
          <div className="event-card-content">
            <div className="event-image-container">
              <img className="event-image" src={event.image} alt={event.title} />
            </div>
            <div className="event-details">
              <div className="event-header">
                <h2 className="event-title">{event.title}</h2>
                <span className="event-status">{event.status}</span>
              </div>
              <div className="event-meta">
                <div className="event-meta-item">
                  <Calendar className="event-icon" />
                  <span>{event.date}</span>
                </div>
                <div className="event-meta-item">
                  <MapPin className="event-icon" />
                  <span>{event.location}</span>
                </div>
                <div className="event-meta-item">
                  <Users className="event-icon" />
                  <span>{event.attendees} Attendees</span>
                </div>
                <div className="event-meta-item">
                  <Clock className="event-icon" />
                  <span>4 hours</span>
                </div>
              </div>
              <div className="event-actions">
                <button className="view-details-button">View Details</button>
                <button className="edit-event-button">Edit Event</button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default Events;
