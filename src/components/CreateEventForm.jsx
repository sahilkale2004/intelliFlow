import { useState } from 'react';
import axios from 'axios';
import { Save, XCircle } from 'lucide-react';
import './CreateEventForm.css';

const CreateEventForm = ({ onClose, refreshEvents }) => {
  const [formData, setFormData] = useState({
    title: '',
    date: '',
    location: '',
    attendees: '',
    status: '',
    image: '',
    duration: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/events', formData);
      alert('Event Created Successfully');
      refreshEvents();
      onClose();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>Create Event</h2>
        <form onSubmit={handleSubmit}>
          <input type="text" name="title" placeholder="Event Title" required onChange={handleChange} />
          <input type="date" name="date" required onChange={handleChange} />
          <input type="text" name="location" placeholder="Location" required onChange={handleChange} />
          <input type="number" name="attendees" placeholder="Attendees" required onChange={handleChange} />
          <select name="status" required onChange={handleChange}>
            <option value="">Select Status</option>
            <option value="Planning">Planning</option>
            <option value="Marketing">Marketing</option>
          </select>
          <input type="text" name="image" placeholder="Image URL" required onChange={handleChange} />
          <input type="number" name="duration" placeholder="Duration" required onChange={handleChange} />
          <button type="submit">
          <Save size={18} /> Create Event</button>
          <button type="button" onClick={onClose}>
          <XCircle size={18} /> Cancel</button>
        </form>
      </div>
    </div>
  );
};

export default CreateEventForm;
