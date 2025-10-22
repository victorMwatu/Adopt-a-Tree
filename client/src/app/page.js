import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col ">
      <Navbar />

      {/* Hero Section */}
      <section className="w-full py-16 ">
       <div className="w-full rounded-2xl shadow-lg border border-white/20 overflow-hidden">

          <div
            className="flex flex-col md:flex-row items-center justify-between gap-8"
            style={{
            background: "linear-gradient(90deg,  #4AA47A 0%, #1C3E2E 100%)",
             }}

          >
            {/* Left Text Section */}
            <div className="md:w-1/2 pl-5 md:pl-10 mt-4 md:-mt-32  ">
              <h1 className="text-4xl md:text-5xl font-extrabold text-white leading-tight mb-4 pl-4 md:pl-8">
                Adopt a Tree
              </h1>

              <p className="text-white/90 max-w-lg leading-relaxed mb-8">
                Adopt a Tree makes it easy (and fun!) to take real climate action.
                Get smart suggestions for trees that thrive in your area, log your
                plantings, and watch your environmental impact grow — one tree at a time.
              </p>

             <button className="bg-[#67B773] text-white font-semibold px-6 py-2 rounded-full shadow-sm hover:shadow-md hover:bg-[#5ca566] transition mt-16">
               Join Us
              </button>

            </div>

            {/* Right Image Section */}
            <div className="md:w-1/2 flex justify-center md:justify-end">
              <img
                src="/assets/seedling.png"
                alt="Seedling"
               className="w-80 h-80 md:w-[420px] md:h-[420px] rounded-full object-cover shadow-2xl"

              />
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
