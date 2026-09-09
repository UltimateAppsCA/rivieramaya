export default function Home() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Travel Booking App</h1>
        <p className="text-lg mb-8">Book your dream travel services with ease.</p>
        <div className="space-x-4">
          <a href="/login" className="bg-blue-500 text-white px-4 py-2 rounded">Login</a>
          <a href="/register" className="bg-green-500 text-white px-4 py-2 rounded">Register</a>
        </div>
      </div>
    </div>
  )
}
