import { Link } from 'react-router-dom'

const NotFound = () => (
  <section className="flex min-h-screen items-center justify-center bg-[#F2F2F2] p-6 font-sans text-black selection:bg-black selection:text-white">
    <div className="w-full max-w-xl border-4 border-black bg-white p-12 text-center shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] sm:p-16">
      
      {/* Huge Brutalist 404 */}
      <h1 className="text-8xl font-black tracking-tighter sm:text-[10rem] leading-none">
        404
      </h1>
      
      <div className="my-8 border-t-4 border-black"></div>
      
      {/* Editorial Heading */}
      <h2 className="text-3xl font-black uppercase tracking-tighter sm:text-4xl">
        System Fault.
      </h2>
      
      <p className="mt-4 text-xs font-bold uppercase tracking-[0.2em] text-gray-500">
        The requested resource could not be located or access is strictly denied.
      </p>
      
      {/* Sharp Button */}
      <Link
        to="/"
        className="mt-10 inline-block w-full border-2 border-black bg-black py-4 text-sm font-black uppercase tracking-widest text-white transition-all hover:bg-white hover:text-black sm:w-auto sm:px-12"
      >
        Return to Core
      </Link>
      
    </div>
  </section>
)

export default NotFound