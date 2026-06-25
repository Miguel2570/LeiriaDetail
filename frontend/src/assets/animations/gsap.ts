// src/animations/gsap.ts
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export const fadeInUp = (element: any, delay = 0) => {
  gsap.from(element, {
    scrollTrigger: {
      trigger: element,
      start: 'top 85%',
      toggleActions: 'play none none none'
    },
    y: 60,
    opacity: 0,
    duration: 0.8,
    delay,
    ease: 'power3.out'
  })
}

export const heroAnimation = (elements: { badge: any; title: any; subtitle: any; cta?: any }) => {
  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })
  
  tl.from(elements.badge, { y: 40, opacity: 0, duration: 0.6, scale: 0.9 })
    .from(elements.title, { y: 80, opacity: 0, duration: 0.8, scale: 0.95 }, '-=0.3')
    .from(elements.subtitle, { y: 40, opacity: 0, duration: 0.6 }, '-=0.4')
  
  // ✅ Só anima o CTA se existir
  if (elements.cta) {
    tl.from(elements.cta, { y: 30, opacity: 0, duration: 0.6 }, '-=0.3')
  }
}

export const parallax = (elements: string, distance = -150) => {
  gsap.to(elements, {
    scrollTrigger: {
      trigger: elements,
      start: 'top bottom',
      end: 'bottom top',
      scrub: 1
    },
    y: distance,
    ease: 'none'
  })
}

export const countUp = (element: any, target: number, duration = 2) => {
  gsap.from(element, {
    scrollTrigger: {
      trigger: element,
      start: 'top 90%'
    },
    textContent: 0,
    duration,
    snap: { textContent: 1 },
    ease: 'power1.inOut',
    onUpdate: function(this: any) {
      element.textContent = Math.round(this.targets()[0].textContent)
    }
  })
}

export const button3DHover = (selector: string) => {
  const buttons = document.querySelectorAll(selector)
  buttons.forEach((btn) => {
    btn.addEventListener('mousemove', (e: Event) => {
      const mouseEvent = e as MouseEvent
      const rect = (btn as HTMLElement).getBoundingClientRect()
      const x = (mouseEvent.clientX - rect.left) / rect.width - 0.5
      const y = (mouseEvent.clientY - rect.top) / rect.height - 0.5
      
      gsap.to(btn, {
        rotateY: x * 10,
        rotateX: -y * 10,
        duration: 0.4,
        ease: 'power2.out'
      })
    })
    
    btn.addEventListener('mouseleave', () => {
      gsap.to(btn, {
        rotateY: 0,
        rotateX: 0,
        duration: 0.4,
        ease: 'power2.out'
      })
    })
  })
}

export const scaleIn = (element: any, delay = 0) => {
  if (!element) return
  
  gsap.from(element, {
    scrollTrigger: {
      trigger: element,
      start: 'top 90%',
      toggleActions: 'play none none none'
    },
    scale: 0.9,
    opacity: 0,
    duration: 0.8,
    delay,
    ease: 'back.out(1.5)'
  })
}

// ✅ Deslizar da esquerda
export const slideInLeft = (element: any, delay = 0) => {
  if (!element) return
  
  gsap.from(element, {
    scrollTrigger: {
      trigger: element,
      start: 'top 85%',
      toggleActions: 'play none none none'
    },
    x: -100,
    opacity: 0,
    duration: 0.8,
    delay,
    ease: 'power3.out'
  })
}

// ✅ Deslizar da direita
export const slideInRight = (element: any, delay = 0) => {
  if (!element) return
  
  gsap.from(element, {
    scrollTrigger: {
      trigger: element,
      start: 'top 85%',
      toggleActions: 'play none none none'
    },
    x: 100,
    opacity: 0,
    duration: 0.8,
    delay,
    ease: 'power3.out'
  })
}