import { create } from 'zustand';

interface PatientFiltersState {
  searchTerm: string;
  statusFilter: string;
  // Add other filter states here as needed, e.g., date ranges, assigned staff
  // Example: intakeDateRange: { from?: Date; to?: Date };

  setSearchTerm: (term: string) => void;
  setStatusFilter: (status: string) => void;
  // Example: setIntakeDateRange: (range: { from?: Date; to?: Date }) => void;

  clearFilters: () => void;
}

export const usePatientFiltersStore = create<PatientFiltersState>((set) => ({
  searchTerm: '',
  statusFilter: '',
  // intakeDateRange: {},

  setSearchTerm: (term) => set({ searchTerm: term }),
  setStatusFilter: (status) => set({ statusFilter: status }),
  // setIntakeDateRange: (range) => set({ intakeDateRange: range }),

  clearFilters: () =>
    set({
      searchTerm: '',
      statusFilter: ''
      // intakeDateRange: {}
    })
}));
