// __mocks__/supabaseClient.ts

// Definiamo il query builder chainable
const mockQueryBuilder = {
    select: jest.fn().mockReturnThis(),
    order: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
    gte: jest.fn().mockReturnThis(),
    // Il metodo finale che ritorna una Promise
    range: jest.fn().mockResolvedValue({
      data: [],
      error: null,
      count: 0,
      status: 200,
      statusText: 'OK',
    }),
  };
  
  // Esportiamo il mock di supabase: la funzione "from" restituisce il query builder
  export const supabase = {
    from: jest.fn(() => mockQueryBuilder),
  };
  
  // Per poter fare asserzioni sui metodi della chain (ad esempio, range o gte)
  export { mockQueryBuilder };
  