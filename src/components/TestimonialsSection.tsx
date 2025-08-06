
import React from 'react';

const TestimonialsSection = () => {
  const testimonials = [
    {
      id: 1,
      name: "Marie L.",
      location: "Paris",
      text: "Une découverte incroyable ! Les produits sont authentiques et de qualité. J'ai pu ramener un peu de la Réunion chez moi.",
      rating: 5
    },
    {
      id: 2,
      name: "Pierre D.",
      location: "Lyon",
      text: "Parfait pour offrir ! Ma famille a adoré découvrir les saveurs réunionnaises. Service impeccable.",
      rating: 5
    },
    {
      id: 3,
      name: "Sophie M.",
      location: "Marseille",
      text: "Les box sont magnifiquement présentées et les produits délicieux. Une vraie invitation au voyage !",
      rating: 5
    }
  ];

  return (
    <section className="py-16 bg-soft-beige/20">
      <div className="container-section">
        <div className="text-center mb-12 fade-in">
          <h2 className="text-3xl font-bold mb-4">Ce que disent nos clients</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Découvrez les témoignages de ceux qui ont déjà goûté à l'expérience de nos box.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 fade-in">
          {testimonials.map(testimonial => (
            <div key={testimonial.id} className="bg-white p-6 rounded-xl shadow-lg">
              <div className="flex mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <svg key={i} className="w-5 h-5 text-leaf-green" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-gray-700 mb-4 italic">"{testimonial.text}"</p>
              <div className="text-sm text-gray-500">
                <strong className="text-gray-900">{testimonial.name}</strong>
                <span> • {testimonial.location}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
