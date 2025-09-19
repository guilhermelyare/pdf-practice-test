// Supabase client configuration
// For now, using mock functions until Supabase is properly connected

interface MockSupabaseClient {
  from: (table: string) => {
    select: (columns?: string) => {
      eq: (column: string, value: any) => {
        gte: (column: string, value: any) => {
          lte: (column: string, value: any) => {
            order: (column: string, options?: any) => {
              limit: (count: number) => Promise<{ data: any[] | null; error: any; count?: number }>;
            };
          };
        };
        order: (column: string, options?: any) => {
          limit: (count: number) => Promise<{ data: any[] | null; error: any; count?: number }>;
        };
      };
      gte: (column: string, value: any) => {
        order: (column: string, options?: any) => {
          limit: (count: number) => Promise<{ data: any[] | null; error: any; count?: number }>;
        };
      };
      order: (column: string, options?: any) => {
        limit: (count: number) => Promise<{ data: any[] | null; error: any; count?: number }>;
      };
    };
  };
}

// Mock Supabase client para desenvolvimento
const mockSupabase: MockSupabaseClient = {
  from: (table: string) => ({
    select: (columns?: string) => ({
      eq: (column: string, value: any) => ({
        gte: (column: string, value: any) => ({
          lte: (column: string, value: any) => ({
            order: (column: string, options?: any) => ({
              limit: (count: number) => Promise.resolve({
                data: [],
                error: null
              })
            })
          })
        }),
        order: (column: string, options?: any) => ({
          limit: (count: number) => Promise.resolve({
            data: [],
            error: null
          })
        })
      }),
      gte: (column: string, value: any) => ({
        order: (column: string, options?: any) => ({
          limit: (count: number) => Promise.resolve({
            data: [],
            error: null
          })
        })
      }),
      order: (column: string, options?: any) => ({
        limit: (count: number) => Promise.resolve({
          data: [],
          error: null
        })
      })
    })
  })
};

export const supabase = mockSupabase;

export const useSupabase = () => {
  return { supabase };
};