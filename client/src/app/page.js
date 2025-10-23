import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col ">
      <Navbar />

      {/* Hero Section */}
      <section className="w-full min-h-[80vh] flex items-center bg-white">
          <div className="w-full rounded-2xl shadow-lg border border-white/20 overflow-hidden relative">

          <div
            className="flex flex-col md:flex-row items-center justify-between gap-8 relative z-10"
            style={{
            background: "linear-gradient(90deg,  #4AA47A 0%, #1C3E2E 100%)",
          
             opacity: 0.95,

          }}

          >
            {/* Left Text Section */}
              <div className="md:w-1/2 pl-5 md:pl-10">

             <h1 className="text-5xl md:text-6xl font-extrabold text-white leading-snug mb-6 pl-4 md:pl-8">
                Adopt a Tree
              </h1>

              <p className="text-white/90 text-lg md:text-xl max-w-2xl leading-relaxed mb-10 pl-4 md:pl-8fF">
                Adopt a Tree makes it easy (and fun!) to take real climate action.
                Get smart suggestions for trees that thrive in your area, log your
                plantings, and watch your environmental impact grow  one tree at a time.
              </p>

            <div className="pl-4 md:pl-8 flex justify-start md:justify-center">
                 <button className="bg-[#67B773] text-white font-semibold px-8 py-3 rounded-full shadow-sm hover:shadow-md hover:bg-[#5ca566] transition mt-8">
                  Join Us
                 </button>
             </div>

            </div>

            {/* Right Image Section */}
            <div className="md:w-1/2 flex justify-center md:justify-end">
              <img
                src="/assets/seedling.png"
                alt="Seedling"
               className="w-72 h-72 md:w-[450px] md:h-[450px] rounded-full object-cover shadow-2xl"

              />
            </div>
          </div>
          {/* Decorative tree elements */} 
             <div className="absolute inset-0 pointer-events-none -z-10 opacity-40">
              <img  
                 src="/assets/tree1.png" 
                 alt="" 
                 className="absolute bottom-10 right-32 h-56 w-auto brightness-90"
               />
               <img 
                 src="/assets/tree1.png" 
                 alt="" 
                 className="absolute top-20 right-56 h-44 w-auto brightness-90"
               />
                <img 
                  src="/assets/tree1.png" 
                   alt="" 
                   className="absolute bottom-32 right-72 h-36 w-auto brightness-90"
                 />
                 </div>

         </div>
      </section>

          {/* How It Works Section */}
         <section className="w-full py-16 px-4 bg-white">
            <h2 className="text-4xl md:text-5xl font-bold text-center text-black mb-12">
              How It Works
            </h2>

            <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Card 1 */}
                <div className="bg-[#E8F5E9] rounded-2xl p-8">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-16 h-16 bg-[#C8E6C9] rounded-full flex items-center justify-center p-3">
                    <img src="/assets/account-icon.png" alt="Create Account" className="w-full h-full object-contain" />
                  </div>
                  <h3 className="text-xl font-bold text-black">
                    Create an Account
                  </h3>
                </div>
                <p className="text-black leading-relaxed">
                  Sign up and tell us your region to get personalized tree recommendations
                </p>
              </div>

             {/* Card 2 */}
              <div className="bg-[#E8F5E9] rounded-2xl p-8">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-16 h-16 bg-[#C8E6C9] rounded-full flex items-center justify-center p-3">
                  <img src="/assets/tree-icon.png" alt="Adopt Tree" className="w-full h-full object-contain" />
                </div>
                <h3 className="text-xl font-bold text-black">
                  Adopt a Tree
                </h3>
              </div>
              <p className="text-black leading-relaxed">
                Choose from AI-recommended trees perfect for your area
              </p>
            </div>

            {/* Card 3 */}
              <div className="bg-[#E8F5E9] rounded-2xl p-8">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-16 h-16 bg-[#C8E6C9] rounded-full flex items-center justify-center p-3">
                <img src="/assets/impact-icon.png" alt="Track Impact" className="w-full h-full object-contain" />
              </div>
              <h3 className="text-xl font-bold text-black">
                Track Impact
              </h3>
            </div>
            <p className="text-black leading-relaxed">
              Monitor your tree's growth, CO₂ offset, and climb the leaderboard
            </p>
          </div>
            </div>
          </section>
      <Footer />
    </main>
  );
}
