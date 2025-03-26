import React from 'react';
import { Calendar, MapPin, Clock, Users } from 'lucide-react';

const Events = () => (
  <div className="space-y-6">
    <div className="flex justify-between items-center">
      <h1 className="text-3xl font-bold text-gray-900">Events</h1>
      <button className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700">
        Create Event
      </button>
    </div>

    <div className="grid gap-6">
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
        },{
          title: 'Sports Meet',
          date: 'March 22, 2024',
          location: 'College  Playground',
          attendees: 500,
          status: 'Planning',
          image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&q=80&w=1000',
        },
      ].map((event, index) => (
        <div key={index} className="bg-white rounded-lg shadow overflow-hidden">
          <div className="md:flex">
            <div className="md:flex-shrink-0">
              <img
                className="h-48 w-full object-cover md:w-48"
                src={event.image}
                alt={event.title}
              />
            </div>
            <div className="p-8">
              <div className="flex items-center">
                <h2 className="text-xl font-semibold text-gray-900">{event.title}</h2>
                <span className="ml-4 px-3 py-1 text-sm font-medium text-indigo-700 bg-indigo-100 rounded-full">
                  {event.status}
                </span>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-4">
                <div className="flex items-center text-gray-600">
                  <Calendar className="h-5 w-5 mr-2" />
                  <span>{event.date}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <MapPin className="h-5 w-5 mr-2" />
                  <span>{event.location}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Users className="h-5 w-5 mr-2" />
                  <span>{event.attendees} Attendees</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Clock className="h-5 w-5 mr-2" />
                  <span>4 hours</span>
                </div>
              </div>
              <div className="mt-6 flex space-x-3">
                <button className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700">
                  View Details
                </button>
                <button className="border border-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-50">
                  Edit Event
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default Events;
