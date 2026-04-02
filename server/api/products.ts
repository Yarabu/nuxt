export default defineEventHandler((event) => {
  return {
    plans: [
      {
        name: 'Starter - Annual',
        color: 'bg-gradient-to-r from-green-400 to-cyan-400',
        price: '83.25',
        oldPrice: '1,188',
        billedYearly: '999',
        savings: '189',
        usersMain: 'Primary user only',
        usersExtra: '(extra team members for $35/month)',
        exports: '10,000',
        exportsExtra: '(additional exports at $0.02 each)',
        traces: '500',
        tracesExtra: '(additional skip tracing at $0.08 each)'
      },
      {
        name: 'Team - Annual',
        color: 'bg-gradient-to-r from-green-400 to-cyan-400',
        price: '207.50',
        oldPrice: '2,988',
        billedYearly: '2,490',
        savings: '498',
        usersMain: 'Primary user + 2 free team members',
        usersExtra: '(extra team members for $25/month)',
        exports: '50,000',
        exportsExtra: '(additional exports at $0.01 each)',
        traces: '1,000',
        tracesExtra: '(additional skip tracing at $0.08 each)'
      },
      {
        name: 'Business - Annual',
        color: 'bg-gradient-to-r from-green-400 to-cyan-400',
        price: '457.50',
        oldPrice: '6,588',
        billedYearly: '5,490',
        savings: '1,098',
        usersMain: 'Primary user + 6 free team members',
        usersExtra: '(extra team members for $20/month)',
        exports: '100,000',
        exportsExtra: '(additional exports at $0.01 each)',
        traces: '2,000',
        tracesExtra: '(additional skip tracing at $0.08 each)'
      }
    ],
    sharedFeatures: [
      'Imports $0.01',
      '<span class="font-bold">FREE</span> daily product trainings and support',
      'Full suite of next-gen investing tools',
      'Industry first AI powered comp tool',
      'Includes dedicated support agent'
    ]
  }
})
