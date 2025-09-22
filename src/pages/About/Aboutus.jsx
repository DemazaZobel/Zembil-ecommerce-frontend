import React from "react";
import team1 from "../../assets/profile/profile1.jpeg"; 
import team2 from "../../assets/profile/profile2.jpeg";
import team3 from "../../assets/profile/profile3.jpeg";
import Logo from "../../assets/logo.png"; // Zembile logo

const AboutUs = () => {
  const values = [
    {
      title: "Locally Made",
      desc: "Every garment is designed and produced in Ethiopia, supporting local artisans and businesses.",
      icon: "🇪🇹",
    },
    {
      title: "Quality Materials",
      desc: "We carefully select premium fabrics sourced from Ethiopia for lasting comfort and style.",
      icon: "🧵",
    },
    {
      title: "Inclusive Fashion",
      desc: "Collections for men, women, and kids, ensuring style for the whole family.",
      icon: "👨‍👩‍👧‍👦",
    },
  ];

  const team = [
    { name: "Lily Abebe", role: "Creative Director", img: team1 },
    { name: "Samuel Tesfaye", role: "Head of Design", img: team2 },
    { name: "Mimi Desta", role: "Fashion Stylist", img: team3 },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-32">
      
      {/* Hero Section */}
      <section className="text-center space-y-6">
        <img src={Logo} alt="Zembile Logo" className="mx-auto h-20 mb-4" />
        <h1 className="text-5xl sm:text-6xl font-extrabold text-gray-900">
          About Zembile
        </h1>
        <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
          Zembile is a proud women-owned fashion brand from Ethiopia, crafting stylish, high-quality clothing for men, women, and kids. 
          All products are made locally with premium materials sourced from the motherland — no Western imports. 
          The name <strong>Zembile</strong> represents a traditional Ethiopian handmade shopping bag, symbolizing culture, craftsmanship, and sustainability.
        </p>
        <a
          href="/"
          className="mt-6 inline-block bg-gradient-to-r from-primary to-secondary text-white px-8 py-3 rounded-full font-semibold shadow-lg hover:scale-105 transform transition"
        >
          Explore Collection
        </a>
      </section>

      {/* Story Section */}
      <section className="text-center space-y-6 max-w-3xl mx-auto">
        <h2 className="text-4xl font-bold text-gray-900">Our Story</h2>
        <p className="text-gray-600 leading-relaxed">
          Founded by passionate Ethiopian women, Zembile showcases the richness of our culture through fashion. 
          Our online-only brand eliminates the need for Western imports, focusing entirely on original, stylish clothing. 
          Every piece is carefully crafted using premium local materials, celebrating creativity, heritage, and sustainability.
        </p>
      </section>

      {/* Values Section */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {values.map((item) => (
          <div
            key={item.title}
            className="bg-white rounded-3xl shadow-lg p-8 text-center hover:shadow-2xl transition-transform transform hover:-translate-y-2"
          >
            <div className="text-5xl mb-4">{item.icon}</div>
            <h3 className="text-2xl font-semibold mb-2">{item.title}</h3>
            <p className="text-gray-600">{item.desc}</p>
          </div>
        ))}
      </section>

      {/* Team Section */}
      <section className="space-y-12">
        <h2 className="text-4xl font-bold text-center text-gray-900">Meet the Fashion Experts</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">
          {team.map((member) => (
            <div
              key={member.name}
              className="bg-white rounded-3xl shadow-lg overflow-hidden hover:shadow-2xl transition-all transform hover:-translate-y-2"
            >
              <div className="overflow-hidden">
                <img
                  src={member.img}
                  alt={member.name}
                  className="w-full h-64 object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-6 text-center">
                <h3 className="text-xl font-bold text-gray-900 mb-1">{member.name}</h3>
                <p className="text-gray-500">{member.role}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-gradient-to-r from-primary/20 to-secondary/20 py-16 rounded-3xl text-center space-y-6">
        <h2 className="text-4xl font-bold text-gray-900">
          Celebrate Ethiopian Fashion with Zembile
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Shop locally made, stylish clothing for your family. Experience the quality, creativity, and culture of Ethiopia through fashion.
        </p>
        <a
          href="/"
          className="inline-block bg-gradient-to-r from-primary to-secondary text-white px-10 py-3 rounded-full font-semibold shadow-lg hover:scale-105 transform transition"
        >
          Start Shopping
        </a>
      </section>
    </div>
  );
};

export default AboutUs;
