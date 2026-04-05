'use client';

const companies = [
  { name: 'Goldman Sachs', logo: 'GS' },
  { name: 'Morgan Stanley', logo: 'MS' },
  { name: 'Citadel', logo: 'C' },
  { name: 'ByteDance', logo: 'BD' },
  { name: 'Alibaba', logo: 'ALI' },
  { name: 'Tencent', logo: 'TX' },
  { name: 'JPMorgan', logo: 'JPM' },
  { name: 'Meta', logo: 'M' },
];

export function TopCompanies() {
  return (
    <section className="py-16 bg-background border-y">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h3 className="text-lg font-medium text-foreground/60">
            trusted by leading companies worldwide
          </h3>
        </div>

        <div className="grid grid-cols-4 md:grid-cols-8 gap-8 items-center">
          {companies.map((company, index) => (
            <div
              key={company.name}
              className="flex items-center justify-center animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="w-16 h-16 rounded-xl bg-accent/50 flex items-center justify-center text-foreground/30 font-bold hover:bg-primary/10 hover:text-primary transition-colors cursor-pointer">
                {company.logo}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
