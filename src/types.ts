import {Database} from './database.types';

export type TodoEntity = Database['public']['Tables']['todotable']['Row'];
export type PageEntity = Database['public']['Tables']['pagetable']['Row'];
