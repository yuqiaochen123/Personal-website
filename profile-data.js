(function exposeProfile(root, factory) {
  const profile = factory();
  if (typeof module === 'object' && module.exports) module.exports = profile;
  if (root) root.YUQIAO_PROFILE = profile;
}(typeof globalThis !== 'undefined' ? globalThis : this, function createProfile() {
  return Object.freeze({
    name: 'Yuqiao Chen',
    positioning: 'Pianist · Scholar · AI Builder · Global Citizen',
    biography: 'Yuqiao Chen is an 18-year-old pianist, scholar, and technology builder whose work connects performance, disciplined learning, and creative experimentation. After growing up and studying across Asia, he will begin Piano Performance studies at the Royal College of Music with a four-year full scholarship.',
    academics: Object.freeze({
      ib: '45/45',
      higherLevelFullMarks: Object.freeze(['Mathematics AA HL', 'Physics HL']),
      ielts: '8.0',
      sat: 1520,
      universityOffer: 'Full scholarship offer from the University of Hong Kong Faculty of Science',
    }),
    education: Object.freeze({
      rcm: 'Piano Performance at the Royal College of Music with a four-year full scholarship',
      nextChapter: 'London',
    }),
    recordings: Object.freeze({
      collaborators: Object.freeze(['Chris Craker', 'Karma Sound Studios']),
      appleMusicPeak: 'No. 1',
      appleMusicRecommendations: 'Multiple releases in Apple Music global recommendation Top 10',
    }),
    technology: Object.freeze({
      product: 'A music-theory and aural-learning platform developed from user research through AI product design, full-stack development, database integration, and deployment',
      studies: Object.freeze([
        'AI product design',
        'AI agents',
        'Context engineering',
        'Vibe coding',
        'Full-stack development',
      ]),
    }),
    languages: Object.freeze(['Chinese', 'English', 'French']),
    journey: Object.freeze(['Chengdu', 'Beijing', 'India', 'Nepal', 'Thailand', 'London']),
    upcomingEvent: Object.freeze({
      status: 'Upcoming',
      date: '2026-08-16',
      title: 'A First Public Statement at 18',
      venue: 'YAMAHA Smart Concert Hall',
      city: 'Chengdu',
      composers: Object.freeze(['Bach', 'Chopin', 'Debussy', 'Rachmaninoff']),
    }),
  });
}));
