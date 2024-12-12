import { create } from "zustand";

interface BusinessStore {
    selectedSlug: string | null;
    setSelectedSlug: (slug: string) => void;
    loadSelectedSlug: () => void;
}

export const useBusinessStore = create<BusinessStore>((set) => ({
    selectedSlug: null,
    setSelectedSlug: (slug) => {
        set({ selectedSlug: slug });
        // Persist to localStorage
        localStorage.setItem('selectedBusinessSlug', slug);
    },
    loadSelectedSlug: () => {
        const storedSlug = localStorage.getItem('selectedBusinessSlug');
        if (storedSlug) {
            set({ selectedSlug: storedSlug });
        } else {
            set({
                selectedSlug: 'null'
            })
        }
    },
}));