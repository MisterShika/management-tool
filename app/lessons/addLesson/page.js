'use client';
import { useState } from 'react';

export default function Lessons() {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    url: '',
    type: 'FREE',
  });
  const [status, setStatus] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('Saving...');

    try {
      const res = await fetch('/api/allLessons', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error('Failed to add lesson');

      setStatus('Lesson added successfully!');
      setFormData({ name: '', description: '', url: '', type: 'FREE' });
    } catch (err) {
      console.error(err);
      setStatus('Error adding lesson');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-2xl shadow">
      <h1 className="text-xl font-semibold mb-4">Add a Lesson</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium mb-1">Name *</label>
          <input
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full border rounded p-2"
            required
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="w-full border rounded p-2"
            rows="3"
          />
        </div>

        <div>
          <label className="block font-medium mb-1">URL</label>
          <input
            name="url"
            value={formData.url}
            onChange={handleChange}
            className="w-full border rounded p-2"
            type="url"
            placeholder="https://example.com"
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Type</label>
          <select
            name="type"
            value={formData.type}
            onChange={handleChange}
            className="w-full border rounded p-2"
          >
            <option value="FREE">Free</option>
            <option value="MINECRAFT">Minecraft</option>
            <option value="SCRATCH">Scratch</option>
            <option value="INDEPENDENT">Independent</option>
            <option value="OTHER">Other</option>
          </select>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Add Lesson
        </button>

        {status && <p className="text-sm mt-2 text-gray-600">{status}</p>}
      </form>
    </div>
  );
}
