import apiClient from '@/core/lib/apiClient';
import type { Recipe } from '@/core/types';

/**
 * Tipo de respuesta de la subida de imagen a Vercel Blob
 */
interface BlobUploadResponse {
    success: boolean;
    blob: {
        url: string;
        downloadUrl: string;
        pathname: string;
        contentType: string;
        contentDisposition: string;
    };
    message: string;
}

/**
 * Tipos para creación y actualización de recetas
 */
export interface RecipeCreateInput {
    title: string;
    description?: string;
    time_minutes: number;
    price: string;
    link?: string;
    image?: string | null;
    image_file?: File;
    tags: Array<{ name: string }>;
    ingredients: Array<{ name: string }>;
}

export interface RecipeUpdateInput {
    title?: string;
    description?: string;
    time_minutes?: number;
    price?: string;
    link?: string;
    image?: string | null;
    image_file?: File;
    tags?: Array<{ name: string }>;
    ingredients?: Array<{ name: string }>;
}

/**
 * Servicio para gestión de recetas
 * Implementa todas las operaciones CRUD con soporte para subida de imágenes
 */
class RecipesService {
    /**
     * Obtener todas las recetas
     * @returns Lista de recetas
     */
    async getAll(): Promise<Recipe[]> {
        return apiClient.get<Recipe[]>('/recipe/recipe/');
    }

    /**
     * Obtener una receta por ID
     * @param id - ID de la receta
     * @returns Receta encontrada
     */
    async getById(id: number): Promise<Recipe> {
        return apiClient.get<Recipe>(`/recipe/recipe/${id}/`);
    }

    /**
     * Crear una nueva receta
     * @param data - Datos de la receta a crear
     * @returns Receta creada
     */
    async create(data: RecipeCreateInput): Promise<Recipe> {
        // Si hay imagen, subirla primero a Vercel Blob
        let imageUrl: string | null = data.image || null;

        if (data.image_file) {
            try {
                imageUrl = await this.uploadRecipeImage(data.image_file);
                console.log('✅ Imagen subida:', imageUrl);
            } catch (error) {
                console.error('❌ Error al subir imagen:', error);
                throw new Error('Error al subir la imagen de la receta');
            }
        }

        // Crear receta con la URL de la imagen
        const recipeData = {
            title: data.title,
            description: data.description,
            time_minutes: data.time_minutes,
            price: data.price,
            link: data.link,
            image: imageUrl,
            tags: data.tags,
            ingredients: data.ingredients,
        };

        return apiClient.post<Recipe>('/recipe/recipe/', recipeData);
    }

    /**
     * Actualizar una receta existente
     * @param id - ID de la receta
     * @param data - Datos a actualizar
     * @returns Receta actualizada
     */
    async update(id: number, data: Partial<RecipeUpdateInput>): Promise<Recipe> {
        // Si hay nueva imagen, subirla primero
        let imageUrl = data.image;

        if (data.image_file) {
            try {
                imageUrl = await this.uploadRecipeImage(data.image_file);
                console.log('✅ Imagen actualizada:', imageUrl);
                // Eliminar image_file del payload
                const { image_file, ...restData } = data;
                data = restData;
            } catch (error) {
                console.error('❌ Error al subir imagen:', error);
                throw new Error('Error al subir la imagen de la receta');
            }
        }

        const updateData: any = { ...data };
        if (imageUrl !== undefined) {
            updateData.image = imageUrl;
        }

        return apiClient.patch<Recipe>(`/recipe/recipe/${id}/`, updateData);
    }

    /**
     * Eliminar una receta
     * @param id - ID de la receta a eliminar
     */
    async delete(id: number): Promise<void> {
        return apiClient.delete(`/recipe/recipe/${id}/`);
    }

    /**
     * Subir imagen de receta a Vercel Blob
     * @param file - Archivo de imagen
     * @param onProgress - Callback para progreso de upload (opcional)
     * @returns URL de la imagen subida
     */
    async uploadRecipeImage(file: File, onProgress?: (progress: number) => void): Promise<string> {
        // Validar tipo de archivo
        const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
        if (!validTypes.includes(file.type)) {
            throw new Error('Tipo de archivo no válido. Solo se permiten imágenes (JPG, PNG, WebP, GIF)');
        }

        // Validar tamaño (máximo 5MB)
        const maxSize = 5 * 1024 * 1024; // 5MB
        if (file.size > maxSize) {
            throw new Error('La imagen es demasiado grande. Máximo 5MB');
        }

        try {
            const formData = new FormData();
            formData.append('file', file);

            const response = await apiClient.post<BlobUploadResponse>(
                '/recipe/blob/upload/',
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                    onUploadProgress: (progressEvent: any) => {
                        if (onProgress && progressEvent.total) {
                            const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                            onProgress(percentCompleted);
                        }
                    },
                }
            );

            if (response.success && response.blob.url) {
                return response.blob.url;
            }

            throw new Error('No se recibió URL de la imagen');
        } catch (error: any) {
            console.error('Error uploading image:', error);
            throw new Error(error.message || 'Error al subir la imagen');
        }
    }
}

// Exportar instancia única
export const recipesService = new RecipesService();
