/**
 * VisionForge AI — State Management (Zustand)
 * @author 0xR3TRO (https://github.com/0xR3TRO)
 * @copyright 2026 0xR3TRO
 * @license MIT
 */
import { create } from "zustand";
import type {
    GenerationResult,
    GalleryImage,
    StylePreset,
    Resolution,
} from "@/types";

// ─── Generation Store ───────────────────────────────────────────────────────

interface GenerationState {
    prompt: string;
    style: StylePreset;
    resolution: Resolution;
    numImages: number;
    creativity: number;
    negativePrompt: string;
    seed: number | undefined;
    isGenerating: boolean;
    isEnhancing: boolean;
    results: GenerationResult | null;
    error: string | null;

    setPrompt: (prompt: string) => void;
    setStyle: (style: StylePreset) => void;
    setResolution: (resolution: Resolution) => void;
    setNumImages: (n: number) => void;
    setCreativity: (c: number) => void;
    setNegativePrompt: (p: string) => void;
    setSeed: (s: number | undefined) => void;
    setIsGenerating: (v: boolean) => void;
    setIsEnhancing: (v: boolean) => void;
    setResults: (r: GenerationResult | null) => void;
    setError: (e: string | null) => void;
    reset: () => void;
}

const generationDefaults = {
    prompt: "",
    style: "none" as StylePreset,
    resolution: "1024x1024" as Resolution,
    numImages: 1,
    creativity: 0.7,
    negativePrompt: "",
    seed: undefined,
    isGenerating: false,
    isEnhancing: false,
    results: null,
    error: null,
};

export const useGenerationStore = create<GenerationState>((set) => ({
    ...generationDefaults,
    setPrompt: (prompt) => set({ prompt }),
    setStyle: (style) => set({ style }),
    setResolution: (resolution) => set({ resolution }),
    setNumImages: (numImages) => set({ numImages }),
    setCreativity: (creativity) => set({ creativity }),
    setNegativePrompt: (negativePrompt) => set({ negativePrompt }),
    setSeed: (seed) => set({ seed }),
    setIsGenerating: (isGenerating) => set({ isGenerating }),
    setIsEnhancing: (isEnhancing) => set({ isEnhancing }),
    setResults: (results) => set({ results }),
    setError: (error) => set({ error }),
    reset: () => set(generationDefaults),
}));

// ─── Gallery Store ──────────────────────────────────────────────────────────

interface GalleryState {
    images: GalleryImage[];
    total: number;
    page: number;
    totalPages: number;
    sort: "latest" | "popular" | "oldest";
    styleFilter: string;
    isLoading: boolean;
    selectedImage: GalleryImage | null;

    setImages: (images: GalleryImage[]) => void;
    setTotal: (total: number) => void;
    setPage: (page: number) => void;
    setTotalPages: (pages: number) => void;
    setSort: (sort: "latest" | "popular" | "oldest") => void;
    setStyleFilter: (style: string) => void;
    setIsLoading: (v: boolean) => void;
    setSelectedImage: (img: GalleryImage | null) => void;
    toggleLike: (imageId: string) => void;
}

export const useGalleryStore = create<GalleryState>((set) => ({
    images: [],
    total: 0,
    page: 1,
    totalPages: 1,
    sort: "latest",
    styleFilter: "",
    isLoading: false,
    selectedImage: null,

    setImages: (images) => set({ images }),
    setTotal: (total) => set({ total }),
    setPage: (page) => set({ page }),
    setTotalPages: (totalPages) => set({ totalPages }),
    setSort: (sort) => set({ sort, page: 1 }),
    setStyleFilter: (styleFilter) => set({ styleFilter, page: 1 }),
    setIsLoading: (isLoading) => set({ isLoading }),
    setSelectedImage: (selectedImage) => set({ selectedImage }),
    toggleLike: (imageId) =>
        set((state) => ({
            images: state.images.map((img) =>
                img.id === imageId
                    ? {
                          ...img,
                          isLiked: !img.isLiked,
                          _count: {
                              likes: img._count.likes + (img.isLiked ? -1 : 1),
                          },
                      }
                    : img,
            ),
        })),
}));

// ─── UI Store ───────────────────────────────────────────────────────────────

interface UIState {
    isSidebarOpen: boolean;
    isMobileMenuOpen: boolean;

    setSidebarOpen: (v: boolean) => void;
    setMobileMenuOpen: (v: boolean) => void;
    toggleSidebar: () => void;
    toggleMobileMenu: () => void;
}

export const useUIStore = create<UIState>((set) => ({
    isSidebarOpen: true,
    isMobileMenuOpen: false,

    setSidebarOpen: (isSidebarOpen) => set({ isSidebarOpen }),
    setMobileMenuOpen: (isMobileMenuOpen) => set({ isMobileMenuOpen }),
    toggleSidebar: () => set((s) => ({ isSidebarOpen: !s.isSidebarOpen })),
    toggleMobileMenu: () =>
        set((s) => ({ isMobileMenuOpen: !s.isMobileMenuOpen })),
}));
