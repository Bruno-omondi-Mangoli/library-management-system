import { useState } from 'react'

// Hardcoded for now; the real list comes from the backend next week
const SPACES = [
  { id: '1', name: 'Room A', seats: 4 },
  { id: '2', name: 'Room B', seats: 6 },
  { id: '3', name: 'Quiet Study Pod', seats: 1 },
  { id: '4', name: 'Group Studio', seats: 10 },
  { id: '5', name: 'Computer Lab', seats: 20 },
]

const emptyForm = { spaceId: '', date: '', startTime: '', endTime: '' }

// Today's date as YYYY-MM-DD in the user's own timezone
function todayString() {
  return new Date().toLocaleDateString('en-CA')
}

function SpaceBookingPage() {
  const [form, setForm] = useState(emptyForm)
  const [error, setError] = useState(null)
  const [confirmation, setConfirmation] = useState(null)

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setConfirmation(null)

    if (!form.spaceId || !form.date || !form.startTime || !form.endTime) {
      setError('Please fill in every field.')
      return
    }
    if (form.date < todayString()) {
      setError('The date cannot be in the past.')
      return
    }
    if (form.endTime <= form.startTime) {
      setError('The end time must be after the start time.')
      return
    }

    setError(null)
    const space = SPACES.find((s) => s.id === form.spaceId)
    setConfirmation({ ...form, spaceName: space.name })
    setForm(emptyForm)

    // Next week this will POST the form to the bookings endpoint:
    // axios.post(`${import.meta.env.VITE_API_URL}/bookings`, form, { headers: ... })
  }

  const inputClasses =
    'w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200'

  return (
    <div className="mx-auto max-w-lg rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <h1 className="mb-1 text-2xl font-bold">Book a study space</h1>
      <p className="mb-4 text-sm text-gray-600">
        Choose a room, a date and a time window.
      </p>

      {error && (
        <p role="alert" className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">
          {error}
        </p>
      )}

      {confirmation && (
        <div role="status" className="mb-4 rounded-lg bg-green-50 p-3 text-sm text-green-800">
          Booking request captured for <strong>{confirmation.spaceName}</strong> on{' '}
          {confirmation.date} from {confirmation.startTime} to {confirmation.endTime}.
          It will be sent to the server once booking goes live.
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="spaceId" className="mb-1 block text-sm font-medium">
            Study space
          </label>
          <select
            id="spaceId"
            name="spaceId"
            value={form.spaceId}
            onChange={handleChange}
            className={inputClasses}
          >
            <option value="">Select a study space</option>
            {SPACES.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name} ({s.seats} {s.seats === 1 ? 'seat' : 'seats'})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="date" className="mb-1 block text-sm font-medium">
            Date
          </label>
          <input
            id="date"
            type="date"
            name="date"
            min={todayString()}
            value={form.date}
            onChange={handleChange}
            className={inputClasses}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="startTime" className="mb-1 block text-sm font-medium">
              Start time
            </label>
            <input
              id="startTime"
              type="time"
              name="startTime"
              value={form.startTime}
              onChange={handleChange}
              className={inputClasses}
            />
          </div>
          <div>
            <label htmlFor="endTime" className="mb-1 block text-sm font-medium">
              End time
            </label>
            <input
              id="endTime"
              type="time"
              name="endTime"
              value={form.endTime}
              onChange={handleChange}
              className={inputClasses}
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full rounded-lg bg-indigo-600 px-4 py-2 font-medium text-white hover:bg-indigo-700"
        >
          Request Booking
        </button>
      </form>
    </div>
  )
}

export default SpaceBookingPage