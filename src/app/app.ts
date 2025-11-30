// src/app/app.component.ts
import {
  AfterViewInit,
  Component,
  HostListener,ElementRef
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';



interface ProductStat {
  label: string;
  value: string;
  positive?: boolean;
  negative?: boolean;
}

interface ProductBubble {
  label: string;
  value: string;
}

interface Product {
  id: string;
  name: string;
  tag: string;
  description: string;
  bullets: string[];
  pillLabel: string;
  caption: string;
  stats: ProductStat[];
  bubbles: ProductBubble[];
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './app.html',
  styleUrls: ['./app.scss']
})
export class App implements AfterViewInit {
  scrollY = 0;

constructor(private el: ElementRef<HTMLElement>) {}

  @HostListener('window:scroll', [])
  onScroll() {
    this.scrollY = window.scrollY || window.pageYOffset;
    this.updateParallax();
  }

  ngAfterViewInit(): void {
    this.initRevealObserver();
    this.updateParallax();
  }

  private updateParallax(): void {
    const layers = document.querySelectorAll<HTMLElement>('[data-parallax]');
    layers.forEach(layer => {
      const depth = Number(layer.dataset['parallax'] || '0');
      const movement = (this.scrollY * depth) / 100;
      layer.style.transform = `translate3d(0, ${movement}px, 0)`;
    });
  }

  private initRevealObserver(): void {
    const revealElements = document.querySelectorAll<HTMLElement>('[data-reveal]');
    if (!('IntersectionObserver' in window)) {
      // Fallback: just show everything
      revealElements.forEach(el => el.classList.add('visible'));
      return;
    }

    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          const el = entry.target as HTMLElement;
          if (entry.isIntersecting) {
            el.classList.add('visible');
            observer.unobserve(el);
          }
        });
      },
      { threshold: 0.2 }
    );

    revealElements.forEach(el => observer.observe(el));
  }

  scrollTo(targetId: string): void {
    const el = document.getElementById(targetId);
    if (!el) return;
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
   products: Product[] = [
    {
      id: 'schoolos',
      name: 'SchoolOS',
      tag: 'Education',
      description:
        'All-in-one school operating system: admissions, academics, transport, communication, and fees — tightly integrated.',
      bullets: [
        'Parent & teacher apps',
        'Fees, transport & hostel modules',
        'Exam, timetable, analytics'
      ],
      pillLabel: 'Live campus view',
      caption: 'Real-time view of your school operations in one secure cockpit.',
      stats: [
        { label: 'New enrolments', value: '+24%', positive: true },
        { label: 'Fee collection', value: '96%', positive: true },
        { label: 'Manual paperwork', value: '-52%', negative: true }
      ],
      bubbles: [
        { label: 'Bus routes', value: '12 optimised' },
        { label: 'Parent app usage', value: '89%' },
        { label: 'Alerts per day', value: '430+' }
      ]
    },
    {
      id: 'gymos',
      name: 'GymOS',
      tag: 'Fitness',
      description:
        'Modern membership management for gyms and fitness studios with recurring billing and smart reminders.',
      bullets: [
        'Membership & renewal flows',
        'Trainer & slot management',
        'Razorpay / Stripe ready'
      ],
      pillLabel: 'Live member flow',
      caption: 'See renewals, trials, and active members in a single stream.',
      stats: [
        { label: 'On-time renewals', value: '+37%', positive: true },
        { label: 'Missed follow-ups', value: '-61%', negative: true },
        { label: 'Active members', value: '420', positive: true }
      ],
      bubbles: [
        { label: 'Today’s check-ins', value: '138' },
        { label: 'Trials this week', value: '27' },
        { label: 'Revenue (M)', value: '₹1.8L' }
      ]
    },
    {
      id: 'pharmacy',
      name: 'Pharmacy Manager',
      tag: 'Healthcare',
      description:
        'Inventory-first pharmacy system that keeps expiry, batches, and billing perfectly under control.',
      bullets: [
        'Expiry & batch tracking',
        'Purchase & sales GST reports',
        'Multi-store ready'
      ],
      pillLabel: 'Store health',
      caption: 'Know exactly what is expiring, what is moving, and what is stuck.',
      stats: [
        { label: 'Near-expiry items', value: '-43%', positive: true },
        { label: 'Stock-outs', value: '-32%', negative: true },
        { label: 'Billing speed', value: '2.3s / bill', positive: true }
      ],
      bubbles: [
        { label: 'SKUs tracked', value: '14,230' },
        { label: 'Stores live', value: '5' },
        { label: 'GST-ready reports', value: '1-click' }
      ]
    }
  ];
  selectedProduct: Product = this.products[0];

  selectProduct(product: Product): void {
    this.selectedProduct = product;
  }

   whatsAppLink = 'https://wa.me/6590356479?text=Hi%20Aadhirai%20Innovations%2C%20I%20would%20like%20to%20discuss%20a%20project.';

  contactData = {
    name: '',
    company: '',
    email: '',
    phone: '',
    city: '',
    projectType: '',
    budget: '',
    message: ''
  };
 
  isSubmitting = false;
  submitSuccess = false;
  submitError = false;


  onContactSubmit(): void {
    this.isSubmitting = true;
    this.submitSuccess = false;

    // Build an email body using the captured data
    const subject = encodeURIComponent('New project enquiry from Aadhirai Innovations website');
    const body = encodeURIComponent(
      [
        `Name: ${this.contactData.name}`,
        `Business: ${this.contactData.company || '-'}`,
        `Email: ${this.contactData.email}`,
        `Phone/WhatsApp: ${this.contactData.phone}`,
        `City: ${this.contactData.city || '-'}`,
        `Project type: ${this.contactData.projectType || '-'}`,
        `Budget: ${this.contactData.budget || '-'}`,
        '',
        'Problem / Notes:',
        this.contactData.message
      ].join('\n')
    );

    // Open default email client – simple frontend-only integration.
    // For production you can replace this with a backend API / Email service.
    setTimeout(() => {
      this.isSubmitting = false;
      this.submitSuccess = true;
      window.location.href = `mailto:manisubu3295@gmail.com?subject=${subject}&body=${body}`;
    }, 500);
  }

    // how strong the movement/tilt should be
  private readonly orbitStrength = 24;  // px
  private readonly heroShiftStrength = 8; // px
  private readonly heroTiltStrength = 4;  // degrees

  @HostListener('document:mousemove', ['$event'])
  onMouseMove(event: MouseEvent): void {
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;

    const relX = (event.clientX - centerX) / centerX; // -1 .. 1
    const relY = (event.clientY - centerY) / centerY; // -1 .. 1

    const orbitX = -relX * this.orbitStrength;
    const orbitY = -relY * this.orbitStrength;

    const heroShiftX = -relX * this.heroShiftStrength;
    const heroShiftY = -relY * this.heroShiftStrength;

    const tiltX = relY * this.heroTiltStrength;
    const tiltY = -relX * this.heroTiltStrength;

    const host = this.el.nativeElement;
    const orbit = host.querySelector<HTMLElement>('.bg-orbit');
    const hero = host.querySelector<HTMLElement>('.hero-inner');

    if (orbit) {
      orbit.style.transform = `translate3d(${orbitX}px, ${orbitY}px, 0)`;
    }

    if (hero) {
      hero.style.transform =
        `translate3d(${heroShiftX}px, ${heroShiftY}px, 0) ` +
        `rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;
    }
  }

  @HostListener('window:mouseleave')
  @HostListener('window:blur')
  resetParallax(): void {
    const host = this.el.nativeElement;
    const orbit = host.querySelector<HTMLElement>('.bg-orbit');
    const hero = host.querySelector<HTMLElement>('.hero-inner');

    if (orbit) {
      orbit.style.transform = 'translate3d(0, 0, 0)';
    }
    if (hero) {
      hero.style.transform = 'translate3d(0, 0, 0) rotateX(0deg) rotateY(0deg)';
    }
  }
currentYear = new Date().getFullYear();
}
