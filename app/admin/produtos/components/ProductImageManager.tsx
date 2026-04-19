'use client';

import { useState, useEffect, useRef } from 'react';
import { Upload, X, Star, Loader2, Image as ImageIcon, Plus } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface ProductImage {
  id?: string;
  url: string;
  is_cover: boolean;
  file?: File; // Para imagens novas não enviadas
  localUrl?: string; // Para preview de imagens capturadas do input
}

interface ProductImageManagerProps {
  productId?: string | number | null;
  initialImages?: any[];
  onImagesChange?: (images: ProductImage[]) => void;
}

export default function ProductImageManager({ productId, initialImages = [], onImagesChange }: ProductImageManagerProps) {
  const [images, setImages] = useState<ProductImage[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);

  // Sincronizar imagens iniciais
  useEffect(() => {
    if (initialImages.length > 0) {
      setImages(initialImages.map(img => ({
        id: img.id,
        url: img.url,
        is_cover: img.is_cover || false
      })));
    } else if (productId) {
      fetchProductImages();
    }
  }, [productId, initialImages]);

  const fetchProductImages = async () => {
    try {
      const { data, error } = await supabase
        .from('product_images')
        .select('*')
        .eq('product_id', productId)
        .order('created_at', { ascending: true });
      
      if (error) throw error;
      if (data) {
        setImages(data.map(img => ({
          id: img.id,
          url: img.url,
          is_cover: img.is_cover
        })));
      }
    } catch (err) {
      console.error('Erro ao buscar imagens:', err);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleFiles = async (files: FileList) => {
    const newFiles = Array.from(files);
    
    if (productId) {
      setIsUploading(true);
      try {
        for (const file of newFiles) {
          const fileExt = file.name.split('.').pop();
          const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
          const filePath = `${productId}/${fileName}`;

          const { error: uploadError } = await supabase.storage
            .from('products')
            .upload(filePath, file);

          if (uploadError) throw uploadError;

          const { data: { publicUrl } } = supabase.storage
            .from('products')
            .getPublicUrl(filePath);

          // Salvar no banco
          const isFirst = images.length === 0;
          const { data: imgData, error: dbError } = await supabase
            .from('product_images')
            .insert([{
              product_id: productId,
              url: publicUrl,
              is_cover: isFirst
            }])
            .select()
            .single();

          if (dbError) throw dbError;

          if (isFirst) {
            await supabase.from('products').update({ image: publicUrl }).eq('id', productId);
          }

          setImages(prev => [...prev, {
            id: imgData.id,
            url: publicUrl,
            is_cover: isFirst
          }]);
        }
      } catch (err) {
        console.error('Erro ao subir imagens:', err);
        alert('Erro ao subir algumas imagens.');
      } finally {
        setIsUploading(false);
        if (onImagesChange) onImagesChange(images);
      }
    } else {
      // Modo cadastro (pendente)
      const newImages: ProductImage[] = newFiles.map(file => ({
        url: '',
        is_cover: images.length === 0,
        file: file,
        localUrl: URL.createObjectURL(file)
      }));

      const updatedImages = [...images, ...newImages];
      setImages(updatedImages);
      if (onImagesChange) onImagesChange(updatedImages);
    }
  };

  const toggleCover = async (index: number) => {
    const updatedImages = images.map((img, i) => ({
      ...img,
      is_cover: i === index
    }));
    setImages(updatedImages);
    
    if (onImagesChange) onImagesChange(updatedImages);

    // Se estiver em modo edição, atualizar no banco
    if (productId && images[index].id) {
       try {
         // Reset covers
         await supabase.from('product_images').update({ is_cover: false }).eq('product_id', productId);
         // Set new cover
         await supabase.from('product_images').update({ is_cover: true }).eq('id', images[index].id);
         // Update main product table
         await supabase.from('products').update({ image: images[index].url }).eq('id', productId);
       } catch (err) {
         console.error('Erro ao atualizar capa:', err);
       }
    }
  };

  const removeImage = async (index: number) => {
    const imageToRemove = images[index];
    const updatedImages = images.filter((_, i) => i !== index);
    
    // Se a imagem removida era capa e sobraram outras, definir a próxima como capa
    if (imageToRemove.is_cover && updatedImages.length > 0) {
      updatedImages[0].is_cover = true;
    }

    setImages(updatedImages);
    if (onImagesChange) onImagesChange(updatedImages);

    // Limpeza de URL local
    if (imageToRemove.localUrl) {
      URL.revokeObjectURL(imageToRemove.localUrl);
    }

    // Se estiver em modo edição e tiver ID, remover do banco e storage
    if (productId && imageToRemove.id) {
      try {
        const { error } = await supabase.from('product_images').delete().eq('id', imageToRemove.id);
        if (error) throw error;
        
        // Tentar extrair o path do storage a partir da URL
        // Exemplo de URL: https://.../products/12/foto.jpg
        const pathParts = imageToRemove.url.split('products/');
        if (pathParts.length > 1) {
          const path = pathParts[1];
          await supabase.storage.from('products').remove([path]);
        }
      } catch (err) {
        console.error('Erro ao remover imagem:', err);
      }
    }
  };

  return (
    <div className="space-y-6">
      <div 
        className={`relative border-2 border-dashed rounded-2xl p-8 transition-all flex flex-col items-center justify-center gap-4 ${
          dragActive ? 'border-[#1A3A5C] bg-[#1A3A5C]/5' : 'border-[#DDE1E9] bg-[#F8F9FB]'
        } hover:border-[#1A3A5C]/50 cursor-pointer`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <input 
          ref={fileInputRef}
          type="file" 
          multiple 
          accept="image/*"
          className="hidden" 
          onChange={(e) => e.target.files && handleFiles(e.target.files)}
        />
        
        <div className="w-16 h-16 bg-white rounded-2xl shadow-sm border border-[#e2e8f0] flex items-center justify-center text-[#1A3A5C]">
          <Upload className="w-8 h-8" />
        </div>
        
        <div className="text-center">
          <p className="text-lg font-bold text-[#1A3A5C]">Clique ou arraste imagens aqui</p>
          <p className="text-sm text-[#4A5568]">JPG, PNG ou WEBP (Max. 5MB cada)</p>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {images.map((img, index) => (
          <div key={index} className="group relative aspect-square rounded-xl overflow-hidden border border-[#e2e8f0] bg-white group shadow-sm">
            <img 
              src={img.localUrl || img.url} 
              alt={`Imagem ${index + 1}`} 
              className="w-full h-full object-cover transition-transform group-hover:scale-105"
            />
            
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
              <button 
                onClick={(e) => { e.stopPropagation(); toggleCover(index); }}
                className={`p-2 rounded-lg transition-colors ${
                  img.is_cover ? 'bg-amber-400 text-white' : 'bg-white/20 text-white hover:bg-white/40'
                }`}
                title={img.is_cover ? 'Capa Selecionada' : 'Definir como Capa'}
              >
                <Star className={`w-5 h-5 ${img.is_cover ? 'fill-current' : ''}`} />
              </button>
              
              <button 
                onClick={(e) => { e.stopPropagation(); removeImage(index); }}
                className="p-2 bg-white/20 text-white hover:bg-red-500 rounded-lg transition-colors"
                title="Remover Imagem"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {img.is_cover && (
              <div className="absolute top-2 left-2 bg-amber-400 text-white text-[10px] font-bold px-2 py-1 rounded shadow-sm flex items-center gap-1 uppercase tracking-wider">
                <Star className="w-3 h-3 fill-current" />
                Capa
              </div>
            )}

            {img.file && (
              <div className="absolute bottom-2 right-2 bg-[#1A3A5C] text-white text-[10px] font-bold px-2 py-1 rounded shadow-sm opacity-80 uppercase tracking-wider">
                Novo
              </div>
            )}
          </div>
        ))}
        
        {images.length > 0 && (
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="aspect-square rounded-xl border border-dashed border-[#DDE1E9] bg-[#F8F9FB] flex flex-col items-center justify-center gap-2 text-[#4A5568] hover:bg-[#F0F2F5] transition-colors"
          >
            <Plus className="w-6 h-6" />
            <span className="text-xs font-medium">Adicionar</span>
          </button>
        )}
      </div>
    </div>
  );
}
