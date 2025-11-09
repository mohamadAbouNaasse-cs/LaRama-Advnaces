import { Link } from 'react-router-dom';

const About = () => {
  return (
    <div className="min-h-screen py-12 px-4 bg-[#FAF7F3]">
      <div className="container mx-auto max-w-4xl">
        <Link to="/" className="inline-block mb-8 text-[#5C4B3D] hover:text-[#D9A299] transition-colors">
          &larr; Back to Home
        </Link>
        
        <div className="text-center mb-12">
          <h1 className="text-4xl font-serif font-bold text-[#5C4B3D] mb-4">Our Story</h1>
          <p className="text-lg text-[#8C8A87] max-w-2xl mx-auto">
            From a university dorm room to creating beautiful handmade treasures—this is our journey.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-12">
          <div className="p-8 md:p-12">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-serif font-bold text-[#5C4B3D] mb-4">LaRama Handcrafted</h2>
              <p className="text-xl text-[#8C8A87]">
                Where passion meets craftsmanship, and dreams become tangible art.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div>
                <p className="text-[#5C4B3D] mb-4">
                  LaRama began as a spark of creativity in the busy life of a computer science student 
                  at AUST University. What started as a way to balance studies with creative expression 
                  has blossomed into a thriving handmade business that brings joy to customers across 
                  Lebanon and beyond.
                </p>
                <p className="text-[#5C4B3D]">
                  Each piece in our collection is infused with love, patience, and the unique story of 
                  its creation—a testament to the beautiful balance between technology and artistry, 
                  between academic rigor and creative freedom.
                </p>
              </div>
              <div className="bg-[#F0E4D3] p-6 rounded-lg text-center">
                <div className="text-5xl text-[#D9A299] mb-4">"</div>
                <p className="text-[#5C4B3D] italic">
                  Creating something beautiful with your hands has a magic that no algorithm can replicate.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-12">
          <div className="p-8 md:p-12">
            <h2 className="text-3xl font-serif font-bold text-[#5C4B3D] mb-8 text-center">Meet Rama</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div className="order-2 md:order-1">
                <h3 className="text-2xl font-serif font-semibold text-[#5C4B3D] mb-4">The Heart Behind the Art</h3>
                <p className="text-[#5C4B3D] mb-4">
                  Rama, a brilliant Computer Science student at AUST University, discovered her passion for 
                  handmade crafts during late-night study sessions. What began as stress relief soon became 
                  a calling—a way to bring beauty into the world while navigating the demanding world of 
                  algorithms and programming.
                </p>
                <p className="text-[#5C4B3D] mb-4">
                  Her unique perspective as both a technologist and artist allows her to create pieces that 
                  blend traditional craftsmanship with modern sensibility. Each bead is placed with intention, 
                  each pattern tells a story, and every finished piece carries the dedication of someone who 
                  understands both the precision of code and the fluidity of art.
                </p>
                <div className="bg-[#F0E4D3] p-4 rounded-lg">
                  <p className="text-[#5C4B3D] text-sm">
                    "Balancing university studies with LaRama has taught me that creativity and logic aren't 
                    opposites—they're partners in creating something truly special."
                  </p>
                </div>
              </div>
              <div className="order-1 md:order-2 text-center">
                <img 
                  src="/images/rama.png" 
                  alt="Rama" 
                  className="w-48 h-48 rounded-full mx-auto mb-4 object-cover shadow-md"
                />
                <h4 className="font-serif font-semibold text-[#5C4B3D]">Rama</h4>
                <p className="text-[#8C8A87]">Founder & Artisan</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-12">
          <div className="p-8 md:p-12">
            <h2 className="text-3xl font-serif font-bold text-[#5C4B3D] mb-8 text-center">The Digital Craftsman</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div className="text-center">
                <img 
                  src="/images/broda.png" 
                  alt="Brother" 
                  className="w-48 h-48 rounded-full mx-auto mb-4 object-cover shadow-md"
                />
                <h4 className="font-serif font-semibold text-[#5C4B3D]">The Brother</h4>
                <p className="text-[#8C8A87]">Web Developer & Support</p>
              </div>
              <div>
                <h3 className="text-2xl font-serif font-semibold text-[#5C4B3D] mb-4">Building the Digital Home</h3>
                <p className="text-[#5C4B3D] mb-4">
                  Every handmade business needs a digital presence that reflects its soul. That's where 
                  Rama's brother came in—transforming her vision into this beautiful website you're 
                  exploring now.
                </p>
                <p className="text-[#5C4B3D] mb-4">
                  With a shared passion for creating meaningful things (whether through code or crafts), 
                  he built this platform to showcase Rama's artistry to the world. The website itself is 
                  a labor of love, crafted with the same attention to detail that goes into every LaRama 
                  creation.
                </p>
                <div className="bg-[#F0E4D3] p-4 rounded-lg">
                  <p className="text-[#5C4B3D] text-sm">
                    "It's been incredible to watch Rama's talent flourish and to help build the digital 
                    foundation that allows her art to reach people who appreciate handmade beauty."
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-12">
          <div className="p-8 md:p-12">
            <h2 className="text-3xl font-serif font-bold text-[#5C4B3D] mb-8 text-center">Our Values</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-6 bg-[#FAF7F3] rounded-lg">
                <div className="w-16 h-16 bg-[#D9A299] rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className="fas fa-heart text-white text-xl"></i>
                </div>
                <h3 className="font-serif font-semibold text-[#5C4B3D] mb-2">Handmade with Love</h3>
                <p className="text-[#5C4B3D] text-sm">
                  Every piece is created by hand, ensuring uniqueness and personal touch in every item.
                </p>
              </div>
              
              <div className="text-center p-6 bg-[#FAF7F3] rounded-lg">
                <div className="w-16 h-16 bg-[#D9A299] rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className="fas fa-medal text-white text-xl"></i>
                </div>
                <h3 className="font-serif font-semibold text-[#5C4B3D] mb-2">Quality Craftsmanship</h3>
                <p className="text-[#5C4B3D] text-sm">
                  We use high-quality materials and traditional techniques to create pieces that last.
                </p>
              </div>
              
              <div className="text-center p-6 bg-[#FAF7F3] rounded-lg">
                <div className="w-16 h-16 bg-[#D9A299] rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className="fas fa-lightbulb text-white text-xl"></i>
                </div>
                <h3 className="font-serif font-semibold text-[#5C4B3D] mb-2">Creative Innovation</h3>
                <p className="text-[#5C4B3D] text-sm">
                  Blending traditional methods with contemporary designs to create something truly unique.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-[#F0E4D3] rounded-lg p-8 text-center">
          <h2 className="text-2xl font-serif font-bold text-[#5C4B3D] mb-4">Become Part of Our Story</h2>
          <p className="text-[#5C4B3D] mb-6">
            Each LaRama piece carries not just beauty, but a story of passion, dedication, and family. 
            We invite you to explore our collection and find a piece that speaks to you.
          </p>
          <Link 
            to="/products" 
            className="inline-block bg-[#D9A299] hover:bg-[#c18981] text-white font-semibold py-3 px-8 rounded-full transition-colors duration-300 shadow-md mr-4"
          >
            Explore Collection
          </Link>
          <Link 
            to="/contact" 
            className="inline-block border-2 border-[#5C4B3D] text-[#5C4B3D] hover:bg-[#5C4B3D] hover:text-white font-semibold py-3 px-8 rounded-full transition-colors duration-300"
          >
            Get In Touch
          </Link>
        </div>
      </div>
    </div>
  );
};

export default About;
