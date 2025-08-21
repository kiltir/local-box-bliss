import React from 'react';
const CallToAction = () => {
  return <section className="py-16 bg-leaf-yellow text-white">
      <div className="container-section py-[15px]">
        <div className="max-w-3xl mx-auto text-center fade-in">
          <h2 className="text-3xl font-bold mb-4 text-slate-900">Une expérience inédite à partager ?</h2>
          <p className="text-xl mb-8 text-slate-900">Vous avez commandé votre box ? Votre avis nous intéresse. Partagez-nous votre unboxing !</p>
          <button className="text-leaf-yellow px-8 py-3 rounded-lg font-bold text-lg text-slate-50 bg-yellow-500 hover:bg-yellow-400">Partager sur nos réseaux</button>
        </div>
      </div>
    </section>;
};
export default CallToAction;