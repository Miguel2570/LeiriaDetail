<!-- src/page/portfolio/PortfolioDetail.vue -->
<template>
  <section class="min-h-screen bg-[#050505] text-white">
    
    <div v-if="isLoading" class="flex justify-center py-40">
      <div class="animate-spin rounded-full h-10 w-10 border-2 border-[#00D8FF] border-t-transparent"></div>
    </div>

    <template v-else-if="item">
      
      <!-- ====== TOPO: Título + Stats ====== -->
      <div class="max-w-7xl mx-auto px-4 md:px-8 pt-8 md:pt-12">
        <router-link to="/portfolio" class="inline-flex items-center gap-2 text-gray-400 hover:text-white text-sm mb-4 transition-colors">
          <ArrowLeft class="w-4 h-4" /> Voltar ao Portfólio
        </router-link>
        
        <div class="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-6">
          <div>
            <p class="text-[#00D8FF] text-xs font-black uppercase tracking-[0.4em] mb-2">{{ item.category }}</p>
            <h1 class="text-3xl md:text-5xl font-black uppercase italic tracking-tighter">{{ item.title }}</h1>
          </div>
          
          <div class="flex gap-6 md:gap-10">
            <div class="text-center">
              <p class="text-2xl md:text-3xl font-black text-[#00D8FF]">{{ gallery.length }}</p>
              <p class="text-[10px] text-gray-400 uppercase tracking-wider">Fotos</p>
            </div>
            <div class="text-center">
              <p class="text-2xl md:text-3xl font-black text-[#00D8FF]">{{ item.category }}</p>
              <p class="text-[10px] text-gray-400 uppercase tracking-wider">Serviço</p>
            </div>
            <div class="text-center">
              <p class="text-2xl md:text-3xl font-black text-[#00D8FF]">Premium</p>
              <p class="text-[10px] text-gray-400 uppercase tracking-wider">Qualidade</p>
            </div>
          </div>
        </div>
      </div>

      <!-- ====== GALERIA + DESCRIÇÃO (Lado a lado) ====== -->
      <div class="max-w-7xl mx-auto px-4 md:px-8 pb-8">
        <div class="flex flex-col lg:flex-row gap-6">
          
          <!-- GALERIA (Esquerda) -->
          <div class="lg:w-[60%]">
            <div class="flex flex-col sm:flex-row bg-[#0A0A0F] rounded-2xl overflow-hidden border border-white/5 h-[300px] sm:h-[400px] lg:h-[450px]">
              
              <!-- Thumbnails verticais -->
              <div class="hidden sm:flex flex-col gap-2 p-3 overflow-y-auto bg-[#0A0A0F] w-20 flex-shrink-0 border-r border-white/5">
                <div v-for="(img, idx) in gallery" :key="idx" class="relative flex-shrink-0">
                  <img 
                    :src="img.url" 
                    @click="currentImageIndex = idx"
                    :class="['w-full h-16 object-cover rounded-lg cursor-pointer border-2 transition-all',
                      currentImageIndex === idx ? 'border-[#00D8FF] opacity-100' : 'border-transparent opacity-50 hover:opacity-80']"
                  />
                  <span v-if="img.type === 'before'" class="absolute top-0.5 left-0.5 px-1 py-0.5 bg-red-500/90 text-[8px] font-bold rounded-md leading-none text-white">ANTES</span>
                  <span v-if="img.type === 'after'" class="absolute top-0.5 left-0.5 px-1 py-0.5 bg-[#00D8FF]/90 text-[8px] font-bold rounded-md leading-none text-black">DEPOIS</span>
                </div>
              </div>

              <!-- Imagem Principal -->
              <div class="flex-1 relative cursor-pointer" @click="openGallery">
                <img :src="currentImage" :alt="item.title" class="w-full h-full object-cover" />
                
                <div class="absolute bottom-3 right-3 px-3 py-1.5 bg-black/70 backdrop-blur-sm rounded-lg text-white text-xs font-bold flex items-center gap-1.5">
                  <Camera class="w-3.5 h-3.5" /> {{ gallery.length }} fotos
                </div>

                <button @click.stop="prevImage" class="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center transition-all">
                  <ChevronLeft class="w-4 h-4" />
                </button>
                <button @click.stop="nextImage" class="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center transition-all">
                  <ChevronRight class="w-4 h-4" />
                </button>
              </div>
            </div>

            <!-- Thumbnails mobile -->
            <div class="flex sm:hidden gap-2 mt-3 overflow-x-auto">
              <div v-for="(img, idx) in gallery" :key="idx" class="relative flex-shrink-0">
                <img 
                  :src="img.url" 
                  @click="currentImageIndex = idx"
                  :class="['w-14 h-14 object-cover rounded-lg cursor-pointer border-2',
                    currentImageIndex === idx ? 'border-[#00D8FF] opacity-100' : 'border-transparent opacity-50']"
                />
                <span v-if="img.type === 'before'" class="absolute top-0.5 left-0.5 px-1 py-0.5 bg-red-500/90 text-[8px] font-bold rounded-md leading-none text-white">ANTES</span>
                <span v-if="img.type === 'after'" class="absolute top-0.5 left-0.5 px-1 py-0.5 bg-[#00D8FF]/90 text-[8px] font-bold rounded-md leading-none text-black">DEPOIS</span>
              </div>
            </div>
          </div>

          <!-- DESCRIÇÃO + CTA (Direita) -->
          <div class="lg:w-[40%] space-y-6">
            <div>
              <h2 class="text-lg font-black uppercase tracking-wider mb-3">Descrição</h2>
              <p class="text-gray-400 leading-relaxed text-sm">{{ item.description }}</p>
              
              <!-- ✅ Verifica se tem imagens antes/depois -->
              <div v-if="hasBeforeAfter" class="mt-4 flex items-center gap-3 p-4 bg-[#0A0A0F] border border-white/10 rounded-xl">
                <div class="w-10 h-10 rounded-full bg-[#2563EB]/20 flex items-center justify-center flex-shrink-0">
                  <Camera class="w-5 h-5 text-[#2563EB]" />
                </div>
                <div>
                  <p class="text-white text-xs font-bold">Registo Antes/Depois</p>
                  <p class="text-gray-400 text-[10px]">Ver fotos na galeria à esquerda</p>
                </div>
              </div>
            </div>

            <!-- Características -->
            <div class="bg-[#0A0A0F] border border-white/10 rounded-xl p-4">
              <h3 class="font-black text-white text-xs uppercase tracking-wider mb-3">Características</h3>
              <div class="grid grid-cols-2 gap-2">
                <div v-for="feature in features" :key="feature" class="flex items-center gap-2 text-xs text-gray-400">
                  <Check class="w-3.5 h-3.5 text-[#2563EB] flex-shrink-0" />
                  {{ feature }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- ====== LIGHTBOX ====== -->
      <Teleport to="body">
        <div v-if="showGallery" class="fixed inset-0 z-50 bg-black/95 flex items-center justify-center" @click="closeGallery">
          <button @click="closeGallery" class="absolute top-4 right-4 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-all z-10">
            <X class="w-6 h-6" />
          </button>
          <button @click.stop="prevImage" class="absolute left-4 md:left-8 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center z-10">
            <ChevronLeft class="w-6 h-6" />
          </button>
          <img :src="currentImage" class="max-w-[90vw] max-h-[85vh] object-contain" @click.stop />
          <button @click.stop="nextImage" class="absolute right-4 md:right-8 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center z-10">
            <ChevronRight class="w-6 h-6" />
          </button>
          <div class="absolute bottom-8 left-1/2 -translate-x-1/2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm font-bold">
            {{ currentImageIndex + 1 }} / {{ gallery.length }}
          </div>
        </div>
      </Teleport>

      <!-- ====== CTA FINAL ====== -->
      <div class="bg-gradient-to-r from-[#2563EB]/5 to-[#00D8FF]/5 border-t border-white/5 py-12 mt-8">
        <div class="max-w-2xl mx-auto text-center px-4">
          <h2 class="text-2xl md:text-3xl font-black uppercase italic tracking-tighter mb-4">
            Pronto para <span class="bg-gradient-to-r from-[#2563EB] to-[#00D8FF] bg-clip-text text-transparent">transformar</span> o seu carro?
          </h2>
          <p class="text-gray-400 text-sm mb-6">Agende já e tenha o carro que sempre mereceu.</p>
          <router-link to="/servicos" class="inline-flex px-8 py-4 bg-gradient-to-r from-[#2563EB] to-[#00D8FF] text-white font-black uppercase tracking-widest text-sm rounded-xl hover:shadow-[0_10px_30px_rgba(37,99,235,0.4)] transition-all hover:-translate-y-1">
            Agendar Agora
          </router-link>
        </div>
      </div>

    </template>

    <div v-else class="flex justify-center py-40">
      <div class="text-center">
        <p class="text-gray-500 text-lg mb-4">Trabalho não encontrado.</p>
        <router-link to="/portfolio" class="text-[#00D8FF] text-sm font-bold hover:underline">Ver Portfólio</router-link>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { ArrowLeft, Camera, Check, ChevronLeft, ChevronRight, X } from 'lucide-vue-next'
import { graphql } from '@/graphql'
import { base64ToDataUrl } from '@/Helpers/FileHelper'
import { useHead } from '@vueuse/head'

// ✅ Interface atualizada para o novo sistema de ficheiros
interface PortfolioItem {
  id: string
  title: string
  description: string
  category: string
  mainImageData?: string          // base64
  mainImageExtension?: string
  beforeImageData?: string        // base64
  beforeImageExtension?: string
  afterImageData?: string         // base64
  afterImageExtension?: string
  galleryImages?: GalleryImageData[]  // Array de objetos, não JSON string
}

interface GalleryImageData {
  fileId: string
  fileData: string       // base64
  fileName: string
  fileExtension: string
  type: 'gallery' | 'before' | 'after'
  sortOrder?: number
}

interface GalleryImage {
  url: string            // Data URL completo para <img src>
  type: 'main' | 'before' | 'after' | 'gallery'
}

const route = useRoute()
const item = ref<PortfolioItem | null>(null)
const isLoading = ref(true)
const showGallery = ref(false)
const currentImageIndex = ref(0)

const features = [
  'Serviço Profissional',
  'Produtos Premium',
  'Garantia de Satisfação',
  'Técnicas Avançadas',
  'Proteção Duradoura',
  'Acabamento Espelhado',
]

// ✅ Converte base64 + extensão para Data URL
const getImageUrl = (base64?: string, extension?: string) => {
  if (!base64) return ''
  return base64ToDataUrl(base64, extension || 'jpg')
}

// ✅ Verifica se tem imagens antes/depois
const hasBeforeAfter = computed(() => {
  return !!(item.value?.beforeImageData || item.value?.afterImageData)
})

// ✅ Galeria construída a partir dos dados reais (base64)
const gallery = computed<GalleryImage[]>(() => {
  if (!item.value) return []
  const images: GalleryImage[] = []
  
  // Imagem principal
  if (item.value.mainImageData) {
    images.push({ 
      url: getImageUrl(item.value.mainImageData, item.value.mainImageExtension), 
      type: 'main' 
    })
  }
  
  // Imagem antes
  if (item.value.beforeImageData) {
    images.push({ 
      url: getImageUrl(item.value.beforeImageData, item.value.beforeImageExtension), 
      type: 'before' 
    })
  }
  
  // Imagem depois
  if (item.value.afterImageData) {
    images.push({ 
      url: getImageUrl(item.value.afterImageData, item.value.afterImageExtension), 
      type: 'after' 
    })
  }
  
  // Galeria extra (já vem como array de objetos, não JSON string)
  if (item.value.galleryImages && Array.isArray(item.value.galleryImages)) {
    item.value.galleryImages.forEach((img) => {
      if (img.fileData) {
        images.push({ 
          url: getImageUrl(img.fileData, img.fileExtension), 
          type: img.type || 'gallery' 
        })
      }
    })
  }
  
  return images
})

const currentImage = computed(() => gallery.value[currentImageIndex.value]?.url || '')

const openGallery = () => { showGallery.value = true }
const closeGallery = () => { showGallery.value = false }

const nextImage = () => {
  currentImageIndex.value = (currentImageIndex.value + 1) % gallery.value.length
}

const prevImage = () => {
  currentImageIndex.value = (currentImageIndex.value - 1 + gallery.value.length) % gallery.value.length
}

useHead({
  title: computed(() => item.value ? `${item.value.title} - LeiriaDetail` : 'Portfólio - LeiriaDetail'),
})

const fetchItem = async () => {
  try {
    // ✅ Query atualizada para buscar os novos campos
    const query = `
      query {
        portfolio {
          items {
            id
            title
            description
            category
            mainImageData
            mainImageExtension
            beforeImageData
            beforeImageExtension
            afterImageData
            afterImageExtension
            galleryImages {
              fileId
              fileData
              fileName
              fileExtension
              type
              sortOrder
            }
          }
        }
      }
    `
    const data = await graphql<{ portfolio: { items: PortfolioItem[] } }>(query)
    if (data.portfolio?.items) {
      const found = data.portfolio.items.find((i: PortfolioItem) => i.id === route.params.id)
      if (found) item.value = found
    }
  } catch (e) { console.error(e) }
  finally { isLoading.value = false }
}

onMounted(() => fetchItem())
</script>