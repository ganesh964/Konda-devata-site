import { motion, type Variants, useScroll, useTransform, AnimatePresence, useInView } from 'framer-motion'
import { useState, useRef, useEffect } from 'react'
import {
  // Flame, Sun, Sunrise, Sunset, Compass, Music,
  // Tv, Heart, CalendarClock,
  Sparkles, ChevronRight, Calendar, X, Image as ImageIcon, ZoomIn,
  Upload, Plus, Trash2, CheckCircle2, ArrowLeft, Video
} from 'lucide-react'
import {
  fetchGalleryImages,
  uploadGalleryImage,
  deleteGalleryImage,
  type GalleryImage,
} from '../services/galleryApi'

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.1 }
  }
}

const itemVariants: Variants = {
  hidden: { y: 30, opacity: 0, filter: 'blur(4px)' },
  visible: {
    y: 0,
    opacity: 1,
    filter: 'blur(0px)',
    transition: { type: 'spring', stiffness: 80, damping: 20 }
  }
}

const galleryCardVariants: Variants = {
  hidden: { y: 40, opacity: 0, scale: 0.95 },
  visible: (i: number) => ({
    y: 0,
    opacity: 1,
    scale: 1,
    transition: {
      type: 'spring',
      stiffness: 70,
      damping: 18,
      delay: i * 0.08
    }
  })
}

// ─── Types ───────────────────────────────────────────────────────────────────
type GalleryItem = Omit<GalleryImage, 'id' | 'isUploaded'> & {
  id?: number;
  isUploaded?: boolean;
};

// ─── Approved Emails for Uploading ────────────────────────────────────────────
const ALLOWED_EMAILS = [
  'nani@gmail.com',
  'jagdeep@gamil.com',
  'jagdeep@gmail.com',
  'admin@gmail.com',
  'devotee@gmail.com'
]

// ─── Accepted file types & size limits ───────────────────────────────────────
const ACCEPTED_IMAGE_TYPES = [
  'image/jpeg', 'image/png', 'image/heic', 'image/heif',
  'image/webp', 'image/gif', 'image/avif'
]
const ACCEPTED_VIDEO_TYPES = [
  'video/mp4', 'video/quicktime', 'video/x-msvideo',
  'video/x-matroska', 'video/webm', 'video/3gpp', 'video/mpeg'
]
const ACCEPTED_TYPES = [...ACCEPTED_IMAGE_TYPES, ...ACCEPTED_VIDEO_TYPES]
const ACCEPTED_EXTENSIONS = '.jpg,.jpeg,.png,.heic,.heif,.webp,.gif,.avif,.mp4,.mov,.avi,.mkv,.webm,.3gp,.mpeg'

const IMAGE_MAX_BYTES = 25 * 1024 * 1024   // 25 MB
const VIDEO_MAX_BYTES = 100 * 1024 * 1024  // 100 MB


const defaultGalleryImages: GalleryItem[] = [
  {
    src: '/gallery/gallery-01.png',
    title: 'శ్రీ కొండదేవత అమ్మవారి ఆలయం (Temple Poster)',
    desc: 'Devotional poster for Sri Kondadevata Ammavari Temple, Simhagiri Colony, Saligramapuram, Visakhapatnam.',
    year: 2024,
    type: 'image'
  },
  {
    src: '/gallery/gallery-02.png',
    title: 'ఉత్సవ దృశ్యాలు (Festival Collage)',
    desc: 'A collage of the adorned idol, offerings on the ground, prasadam, and festive shrine decorations.',
    year: 2025,
    type: 'image'
  },
  {
    src: '/gallery/gallery-04.png',
    title: 'అమ్మవారి అలంకారం (Divine Alankaram)',
    desc: 'Close view of the goddess idol in blue alankaram with crown, garlands, and jewelry beside a sacred tree.',
    year: 2026,
    type: 'image'
  },
  {
    src: '/gallery/gallery-05.png',
    title: 'పూజ అలంకారం',
    desc: 'Outdoor shrine with turmeric-covered deity, marigold garlands, fruits, sweets, and lit brass lamps.',
    year: 2026,
    type: 'image'
  }
]

export function Home() {
  // ─── existing state ───────────────────────────────────────────────────────
  const [activeImageIndex, setActiveImageIndex] = useState<number | null>(null)
  const heroRef = useRef<HTMLElement>(null)
  const galleryRef = useRef<HTMLDivElement>(null)
  const galleryInView = useInView(galleryRef, { once: true, margin: '-80px' })

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  })

  const heroBgScale = useTransform(scrollYProgress, [0, 1], [1, 1.05])
  const heroBgOpacity = useTransform(scrollYProgress, [0, 0.8], [0.15, 0])
  const heroContentY = useTransform(scrollYProgress, [0, 1], [0, -40])
  const heroContentOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0])

  // ─── Upload state ─────────────────────────────────────────────────────────
  const [showUploadPanel, setShowUploadPanel] = useState(false)
  const [uploadPreview, setUploadPreview] = useState<string | null>(null)
  const [uploadFile, setUploadFile] = useState<File | null>(null)
  const [uploadTitle, setUploadTitle] = useState('')
  const [uploadDesc, setUploadDesc] = useState('')
  const [uploadEmail, setUploadEmail] = useState('')
  const [uploadYear, setUploadYear] = useState<number>(new Date().getFullYear())
  const [uploadFileType, setUploadFileType] = useState<'image' | 'video'>('image')
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [uploadSuccess, setUploadSuccess] = useState(false)
  const [uploadLoading, setUploadLoading] = useState(false)
  const [showAllPhotos, setShowAllPhotos] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  // 1. Add this state near the other upload state declarations
  const [pendingDeleteIndex, setPendingDeleteIndex] = useState<number | null>(null)

  // ─── Filter & Toast state ──────────────────────────────────────────────────
  const [selectedYear, setSelectedYear] = useState<string>('All')
  const [viewMode, setViewMode] = useState<'all' | 'defaults'>('all')
  const [toastMessage, setToastMessage] = useState<string | null>(null)
  const [toastType, setToastType] = useState<'success' | 'error'>('error')

  const showToast = (msg: string, type: 'success' | 'error' = 'error') => {
    setToastMessage(msg)
    setToastType(type)
    setTimeout(() => {
      setToastMessage(null)
    }, 4000)
  }



  const [galleryImages, setGalleryImages] = useState<GalleryItem[]>(defaultGalleryImages)
  const [galleryLoading, setGalleryLoading] = useState(true)
  const [galleryFetchError, setGalleryFetchError] = useState<string | null>(null)

  // Keep bundled/default images and append persisted uploads returned by the API.
  useEffect(() => {
    let isMounted = true

    const loadGallery = async () => {
      try {
        setGalleryLoading(true)
        setGalleryFetchError(null)
        const uploadedImages = await fetchGalleryImages()

        if (isMounted) {
          setGalleryImages([
            ...defaultGalleryImages,
            ...uploadedImages.map(image => ({ ...image, isUploaded: true })),
          ])
        }
      } catch (error) {
        console.error('Failed to load gallery images:', error)
        if (isMounted) {
          setGalleryFetchError('Unable to load uploaded photos. Please try again.')
          // The bundled/default images remain visible if the API is unavailable.
          setGalleryImages(defaultGalleryImages)
        }
      } finally {
        if (isMounted) setGalleryLoading(false)
      }
    }

    void loadGallery()
    return () => { isMounted = false }
  }, [])

  // Generate list of years to filter by dynamically (guaranteeing present + past 2 years, plus any media years)
  const currentYear = new Date().getFullYear()
  const yearsSet = new Set<number>()
  yearsSet.add(currentYear)
  yearsSet.add(currentYear - 1)
  yearsSet.add(currentYear - 2)
  galleryImages.forEach(img => yearsSet.add(img.year))
  const filterYears = ['All', ...Array.from(yearsSet).sort((a, b) => b - a).map(String)]

  // Filter gallery images by viewMode (all vs defaults only) and selectedYear
  const visibleImages = galleryImages.filter(img => {
    const matchesMode = viewMode === 'all' ? true : !img.isUploaded
    const matchesYear = selectedYear === 'All' ? true : img.year.toString() === selectedYear
    return matchesMode && matchesYear
  })

  const displayImages = showAllPhotos ? visibleImages : visibleImages.slice(0, 5)

  // ─── Quick links & timings (commented out to satisfy ts compiler) ─────────
  /*
  const quickLinks = [
    { name: 'Daily Panchang', path: '/panchang', icon: CalendarClock, desc: 'Auspicious times & calendars', color: 'from-orange-500 to-saffron-600' },
    { name: 'Bhajans & Songs', path: '/bhajans', icon: Music, desc: 'Listen to devotional music', color: 'from-saffron-500 to-maroon-600' },
    { name: 'Temples Directory', path: '/temples', icon: Compass, desc: 'Explore historical temples', color: 'from-gold-500 to-saffron-600' },
    { name: 'Festivals', path: '/festivals', icon: Calendar, desc: 'Upcoming fasts & events', color: 'from-pink-500 to-maroon-600' },
    { name: 'Live Darshan', path: '/darshan', icon: Tv, desc: 'Virtual live streaming', color: 'from-amber-500 to-orange-600' },
    { name: 'Donations', path: '/donate', icon: Heart, desc: 'Support temple causes', color: 'from-red-500 to-maroon-800' }
  ]

  const prayerTimings = [
    { name: 'Brahma Muhurta', time: '04:12 AM - 05:00 AM', status: 'Auspicious', icon: Flame },
    { name: 'Sunrise (Pratah)', time: '05:48 AM', status: 'Standard', icon: Sunrise },
    { name: 'Abhijit Muhurta', time: '11:45 AM - 12:38 PM', status: 'Auspicious', icon: Sun },
    { name: 'Sunset (Sandhya)', time: '06:34 PM', status: 'Standard', icon: Sunset }
  ]

  const upcomingFestivals = [
    { name: 'Buddha Purnima', date: 'May 20, 2026', daysLeft: '1 Day Left', tithi: 'Purnima', bg: 'from-saffron-500/10 to-gold-500/10' },
    { name: 'Ekadashi Vrat', date: 'May 27, 2026', daysLeft: '8 Days Left', tithi: 'Ekadashi', bg: 'from-maroon-500/10 to-pink-500/10' },
    { name: 'Pradosh Vrat', date: 'June 03, 2026', daysLeft: '15 Days Left', tithi: 'Trayodashi', bg: 'from-orange-500/10 to-saffron-500/10' }
  ]
  */


  // ─── Upload handlers ──────────────────────────────────────────────────────
  const validateAndSetFile = (file: File): boolean => {
    const isAccepted = ACCEPTED_TYPES.includes(file.type)
    if (!isAccepted) {
      setUploadError('Unsupported file type. Allowed: images (JPEG, PNG, HEIC, WEBP) and videos (MP4, MOV, AVI, MKV, WEBM).')
      return false
    }

    const isVideo = file.type.startsWith('video/')
    if (isVideo && file.size > VIDEO_MAX_BYTES) {
      setUploadError(`Video is too large (${(file.size / 1024 / 1024).toFixed(1)} MB). Maximum allowed is 100 MB.`)
      return false
    }
    if (!isVideo && file.size > IMAGE_MAX_BYTES) {
      setUploadError(`Image is too large (${(file.size / 1024 / 1024).toFixed(1)} MB). Maximum allowed is 25 MB.`)
      return false
    }

    const previewUrl = URL.createObjectURL(file)
    setUploadFile(file)
    setUploadPreview(previewUrl)
    setUploadFileType(isVideo ? 'video' : 'image')
    return true
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUploadError(null)
    const file = e.target.files?.[0]
    if (!file) return
    validateAndSetFile(file)
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setUploadError(null)
    const file = e.dataTransfer.files?.[0]
    if (!file) return
    validateAndSetFile(file)
  }

  const handleAddToGallery = async () => {
    setUploadError(null)
    if (!uploadPreview || !uploadFile) { setUploadError('Please select a file first.'); return }
    if (!uploadTitle.trim()) { setUploadError('Please enter a title.'); return }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!uploadEmail.trim() || !emailRegex.test(uploadEmail)) {
      setUploadError('Invalid email. You cannot add media without a valid email.');
      return;
    }

    const normalizedEmail = uploadEmail.trim().toLowerCase()
    if (!ALLOWED_EMAILS.includes(normalizedEmail)) {
      showToast('You cannot add media. Unauthorized email address.', 'error')
      setUploadError('Unauthorized email. Only approved emails can add media.')
      return
    }

    // Save the file and metadata through the shared gallery API service.
    setUploadLoading(true)
    try {
      const saved = await uploadGalleryImage(uploadFile, {
        title: uploadTitle.trim(),
        desc: uploadDesc.trim() || 'Uploaded by devotee.',
        year: uploadYear,
        type: uploadFileType,
      })

      setGalleryImages(prev => [...prev, { ...saved, isUploaded: true }])
      setUploadSuccess(true)
      showToast(`${uploadFileType === 'video' ? 'Video' : 'Photo'} uploaded & added to gallery!`, 'success')

      // Reset after short delay.
      setTimeout(() => {
        setUploadPreview(null)
        setUploadFile(null)
        setUploadTitle('')
        setUploadDesc('')
        setUploadEmail('')
        setUploadYear(new Date().getFullYear())
        setUploadError(null)
        setUploadSuccess(false)
        setUploadLoading(false)
        setShowUploadPanel(false)
        if (fileInputRef.current) fileInputRef.current.value = ''
      }, 1800)
    } catch (error) {
      console.error('Gallery upload failed:', error)
      setUploadError(error instanceof Error ? error.message : 'Network error — make sure the gallery server is running.')
      setUploadLoading(false)
    }
  }

  const handleRemoveUploaded = (idx: number, e: React.MouseEvent) => {
    e.stopPropagation()
    setPendingDeleteIndex(idx)
  }

  const confirmDelete = async () => {
    if (pendingDeleteIndex === null) return

    const imageToRemove = displayImages[pendingDeleteIndex]
    if (!imageToRemove) {
      setPendingDeleteIndex(null)
      return
    }

    try {
      // Uploaded media has a database ID and must be deleted on the server first.
      if (imageToRemove.isUploaded && imageToRemove.id !== undefined) {
        await deleteGalleryImage(imageToRemove.id)
      }

      setGalleryImages(prev => prev.filter(img => img.src !== imageToRemove.src))

      if (activeImageIndex !== null) {
        if (activeImageIndex === pendingDeleteIndex) setActiveImageIndex(null)
        else if (activeImageIndex > pendingDeleteIndex) setActiveImageIndex(activeImageIndex - 1)
      }

      showToast('Photo removed from gallery.', 'success')
    } catch (error) {
      console.error('Gallery delete failed:', error)
      showToast(error instanceof Error ? error.message : 'Unable to delete photo. Please try again.', 'error')
    } finally {
      setPendingDeleteIndex(null)
    }
  }

  const resetUploadPanel = () => {
    setUploadPreview(null)
    setUploadFile(null)
    setUploadTitle('')
    setUploadDesc('')
    setUploadEmail('')
    setUploadYear(new Date().getFullYear())
    setUploadError(null)
    setUploadSuccess(false)
    setUploadLoading(false)
    setShowUploadPanel(false)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  return (
    <motion.div
      className="space-y-10 overflow-x-clip"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Hero Section */}
      <motion.section
        ref={heroRef}
        variants={itemVariants}
        className="relative isolate overflow-hidden rounded-3xl bg-gradient-to-br from-maroon-950 via-maroon-900 to-dev-bg-dark border border-saffron-500/20 text-white p-6 sm:p-8 md:p-12 min-h-[420px] flex items-center"
      >
        <motion.div
          style={{ opacity: heroBgOpacity }}
          className="absolute inset-0 overflow-hidden pointer-events-none"
          aria-hidden
        >
          <motion.div
            style={{
              backgroundImage: "url('/temple_deity_1.jpg')",
              scale: heroBgScale,
            }}
            className="absolute inset-0 bg-cover bg-center brightness-[0.22] saturate-[1.1] will-change-transform origin-center"
          />
        </motion.div>

        {/* Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-dev-bg-dark via-transparent to-transparent opacity-75 pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_120%,rgba(255,126,26,0.12),transparent_50%)] pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_-20%,rgba(212,175,55,0.08),transparent_40%)] pointer-events-none" />

        <motion.div
          style={{ y: heroContentY, opacity: heroContentOpacity }}
          className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10 w-full"
        >
          {/* Left Content */}
          <div className="lg:col-span-6 space-y-5">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold font-sans leading-relaxed text-gold-300">
              శ్రీ కొండదేవత అమ్మవారి ఆలయo
            </h1>
            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-sans">
              మన కొండ దేవత అమ్మవారికి ప్రజలందరూ ధర్మకర్తలే, భక్తుల సేవే అమ్మవారికి నిజమైన పూజ. ప్రజలందరూ ధర్మకర్తలుగా కలిసి సేవ చేస్తే గ్రామం సుభిక్షంగా, శాంతియుతంగా, ఆనందంగా ఉంటుంది
            </p>
          </div>
          {/* Right Content: The Festival Image */}
          <div className="lg:col-span-6 overflow-hidden rounded-2xl border border-gold-400/30 relative group cursor-pointer">
            <motion.div
              whileHover={{ scale: 1.03 }}
              transition={{ type: 'spring', stiffness: 350, damping: 15 }}
            >
              <img
                src="/temple_festival.jpg"
                alt="Konda Devata Ammavari Festival Invitation"
                className="w-full h-auto object-cover transition-transform duration-500"
              />
            </motion.div>
          </div>
        </motion.div>
      </motion.section>


      {/* Featured Temple Section */}
      <motion.section
        variants={itemVariants}
        className="relative bg-white dark:bg-dev-card-dark border border-saffron-100/30 dark:border-maroon-800/30 rounded-3xl p-6 sm:p-8"
      >

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Text Info */}
          <div className="lg:col-span-5 space-y-5">
            <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-saffron-600 dark:text-gold-400 bg-saffron-500/10 dark:bg-gold-500/10 px-2.5 py-0.5 rounded-md">
              <Sparkles className="h-3 w-3" />
              Featured Local Temple
            </span>
            <h2 className="text-2xl sm:text-3xl font-sans font-bold text-slate-800 dark:text-gold-400 leading-relaxed">
              శ్రీ శ్రీ శ్రీ కొండదేవత అమ్మవారి ఆలయం
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold tracking-wide">
              Sri Konda Devata Ammavari Temple, Visakhapatnam
            </p>

            <div className="p-4 rounded-2xl bg-saffron-500/5 dark:bg-maroon-950/20 border border-saffron-500/10 space-y-2">
              <h3 className="text-xs font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wide">Temple Address (ఆలయ చిరునామా)</h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-sans whitespace-pre-line font-medium">
                కొండ దేవత అమ్మవారి దేవాలయం,
                సింహగిరి కాలనీ, సాలగ్రామపురం,
                ఇనార్బిట్ మాల్ వెనుక గేట్ సమీపంలో,
                విశాఖపట్నం, ఆంధ్రప్రదేశ్ 530024
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-gold-500/5 dark:bg-gold-950/10 border border-gold-500/25 space-y-2">
              <h3 className="text-xs font-bold text-saffron-600 dark:text-gold-400 uppercase tracking-wide">ఉత్సవాల ఆహ్వానం (Festival Invitation)</h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-sans font-medium">
                కొండ దేవత అమ్మవారి 10వ వార్షికోత్సవ పూజా కార్యక్రమాలకు, మహోత్సవాలకు భక్తజనులందరికీ ఇదే మా సాధర ఆహ్వానం. ప్రతి ఒక్కరూ కుటుంబ సమేతంగా విచ్చేసి అమ్మవారి కృపాకటాక్షాలను పొందగలరని ప్రార్థన.
              </p>
            </div>
          </div>

          {/* Highlighted Images Gallery */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Deity image - tall card */}
            <motion.div
              whileHover={{
                scale: 1.02,
                y: -4,
                borderColor: 'rgba(212, 175, 55, 0.6)',
              }}
              transition={{ type: 'spring', stiffness: 400, damping: 17 }}
              className="relative group overflow-hidden rounded-2xl border-2 border-saffron-400/30 dark:border-maroon-800/30 flex flex-col cursor-pointer"
            >
              <div className="aspect-[3/4] overflow-hidden bg-slate-900">
                <img
                  src="/temple_deity_1.jpg"
                  alt="Konda Devata Deity"
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              <div className="p-3 bg-white dark:bg-dev-card-dark border-t border-saffron-100/10">
                <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">శ్రీ కొండదేవత అమ్మవారు (Divine Idol)</h4>
                <p className="text-[10px] text-slate-400 mt-0.5">Swayambhu deity under the sacred tree</p>
              </div>
            </motion.div>

            {/* Festival & Poster column */}
            <div className="space-y-4 flex flex-col justify-between">
              {/* Festival Program Description Block (in place of the image) */}
              <div className="p-4 rounded-2xl bg-saffron-50/50 dark:bg-maroon-950/20 border border-saffron-200 dark:border-maroon-800/50 space-y-2">
                <h3 className="text-xs font-bold text-saffron-600 dark:text-gold-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Calendar className="h-4 w-4" />
                  పూజా కార్యక్రమాల వివరాలు (Festival Program)
                </h3>
                <div className="space-y-2 text-xs text-slate-700 dark:text-slate-300 font-sans font-medium">
                  <div className="border-b border-saffron-100/30 pb-1">
                    <span className="text-saffron-600 dark:text-gold-400 font-bold">తేదీ 06-December: తోలేళ్ళు</span>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400">సాయంత్రం అమ్మవారి పూజ మరియు తోలేళ్ళ ఉత్సవం.</p>
                  </div>
                  <div>
                    <span className="text-saffron-600 dark:text-gold-400 font-bold">తేదీ 07-December: పండుగ మహోత్సవం</span>
                    <ul className="list-disc list-inside space-y-0.5 text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 pl-0.5">
                      <li>ఉదయం: అమ్మవారి ప్రత్యేక పూజలు</li>
                      <li>మధ్యాహ్నం: అన్నసంతర్పణ (మహాప్రసాదం)</li>
                      <li>సాయంత్రం: పవిత్ర ఘటాల ఊరేగింపు మహోత్సవం</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Temple Poster */}
              <motion.div
                whileHover={{
                  scale: 1.02,
                  y: -4,
                  borderColor: 'rgba(212, 175, 55, 0.6)',
                }}
                transition={{ type: 'spring', stiffness: 400, damping: 17 }}
                className="relative group overflow-hidden rounded-2xl border-2 border-saffron-400/30 dark:border-maroon-800/30 flex flex-col cursor-pointer"
              >
                <div className="aspect-[1.5/1] overflow-hidden bg-slate-900">
                  <img
                    src="/temple_poster.jpg"
                    alt="Temple Invitation Poster"
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                <div className="p-3 bg-white dark:bg-dev-card-dark border-t border-saffron-100/10">
                  <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">ఆలయ మహోత్సవాలు (Temple Invitation)</h4>
                  <p className="text-[10px] text-slate-400 mt-0.5">Devotee invitations & spiritual programs</p>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Main Grid: Quick links, Prayer times & Quote */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Right Column: Prayer Timings & Quote of Day */}
        {/* <motion.div variants={itemVariants} className="space-y-8"> */}
        {/* Prayer Timings */}
        {/* <div className="space-y-4"> ... </div> */}
        {/* </motion.div> */}
      </div>

      {/* Interactive Photo Gallery Section — Bento Grid */}
      <motion.section variants={itemVariants} className="space-y-6 pt-6" ref={galleryRef}>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-saffron-100/30 dark:border-maroon-800/30 pb-4 gap-4">
          <div className="space-y-1">
            <h2 className="text-2xl font-serif font-bold text-slate-800 dark:text-gold-400 flex items-center gap-2">
              <ImageIcon className="h-6 w-6 text-saffron-500" />
              ఆలయ చిత్రమాలిక (Photo Gallery)
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Moments of divine grace, festive celebrations, and temple daily alankaram.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold hidden sm:block">
              {displayImages.length} Sacred Views
            </span>

            {/* View Mode controls when added photos + defaults count > 5 */}
            {galleryImages.length > 5 && (
              <div className="flex items-center gap-2">
                {viewMode === 'all' ? (
                  <motion.button
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => {
                      setViewMode('defaults')
                      setShowAllPhotos(false)
                    }}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-100 dark:bg-maroon-900/40 text-slate-600 dark:text-slate-300 text-xs font-bold transition-colors cursor-pointer border border-slate-200 dark:border-slate-800"
                  >
                    <ArrowLeft className="h-3.5 w-3.5" />
                    Back to Defaults
                  </motion.button>
                ) : (
                  <motion.button
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => {
                      setViewMode('all')
                      setShowAllPhotos(true)
                    }}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-saffron-500/10 hover:bg-saffron-500/25 text-saffron-600 dark:text-gold-400 text-xs font-bold transition-colors cursor-pointer border border-saffron-500/20"
                  >
                    View All Photos
                  </motion.button>
                )}
              </div>
            )}

            {/* ── Upload Button ── */}
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setShowUploadPanel(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-saffron-500 hover:bg-saffron-600 text-white text-xs font-bold transition-colors cursor-pointer"
            >
              <Plus className="h-4 w-4" />
              Add Photo
            </motion.button>
          </div>
        </div>

        {/* Year Filter Tabs */}
        <div className="flex flex-wrap items-center gap-2 pt-1 pb-2">
          {filterYears.map(year => (
            <button
              key={year}
              onClick={() => setSelectedYear(year)}
              className={`flex items-center gap-1.5 px-4 py-1.5 text-xs font-bold rounded-xl transition-all cursor-pointer border ${selectedYear === year
                ? 'bg-saffron-500 text-white border-saffron-500'
                : 'bg-slate-100 dark:bg-maroon-900/40 text-slate-600 dark:text-slate-300 border-transparent hover:bg-slate-200 dark:hover:bg-maroon-800/40'
                }`}
            >
              <Calendar className="h-3.5 w-3.5 opacity-70" />
              {year === 'All' ? 'All Years (అన్నీ)' : `${year}`}
            </button>
          ))}
        </div>

        {/* Loading/error states; bundled default images remain visible. */}
        {galleryLoading && (
          <p className="text-center text-sm text-slate-500 py-3" role="status">
            Loading uploaded gallery images...
          </p>
        )}
        {galleryFetchError && (
          <p className="text-center text-sm text-red-500 py-3" role="alert">
            {galleryFetchError}
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="ml-2 underline font-semibold"
            >
              Retry
            </button>
          </p>
        )}

        {/* Bento Grid Layout or Empty State */}
        {displayImages.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center p-12 text-center rounded-2xl border border-dashed border-saffron-200/50 dark:border-maroon-800/30 bg-saffron-50/10 dark:bg-maroon-950/5"
          >
            <Calendar className="h-8 w-8 text-saffron-500/45 dark:text-gold-400/45 mb-3 animate-pulse" />
            <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300">
              No photos or videos for {selectedYear}
            </h3>
            <p className="text-xs text-slate-400 mt-1 max-w-xs leading-relaxed">
              No media has been uploaded for this year yet. Be the first to share your memories!
            </p>
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setShowUploadPanel(true)}
              className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-saffron-500 hover:bg-saffron-600 text-white text-xs font-bold transition-colors cursor-pointer"
            >
              <Plus className="h-3.5 w-3.5" />
              Upload Now
            </motion.button>
          </motion.div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 auto-rows-[minmax(170px,220px)] sm:auto-rows-[minmax(200px,260px)] gap-3 sm:gap-4">
            {displayImages.map((image, idx) => {
              const spanClass = idx === 0 ? 'col-span-2 row-span-2' : 'col-span-1 row-span-1'

              return (
                <motion.div
                  key={`${image.src}-${idx}`}
                  custom={idx}
                  variants={galleryCardVariants}
                  initial="hidden"
                  animate={galleryInView ? 'visible' : 'hidden'}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`${spanClass} group relative overflow-hidden rounded-2xl cursor-pointer border border-saffrin-100/20 dark:border-maroon-800/30 shadow-none`}
                >
                  {/* Media (Image or Video) */}
                  {image.type === 'video' ? (
                    <video
                      src={image.src}
                      muted
                      loop
                      playsInline
                      className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                      onMouseEnter={(e) => {
                        e.currentTarget.play().catch(() => { })
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.pause()
                      }}
                    />
                  ) : (
                    <img
                      src={image.src}
                      alt={image.title}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                      loading="lazy"
                    />
                  )}

                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent opacity-60 group-hover:opacity-90 transition-opacity duration-500" />

                  {/* Hover Zoom / Play Icon */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                    <div className="h-12 w-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30 transform scale-75 group-hover:scale-100 transition-transform duration-300">
                      {image.type === 'video' ? (
                        <Video className="h-5 w-5 text-white" />
                      ) : (
                        <ZoomIn className="h-5 w-5 text-white" />
                      )}
                    </div>
                  </div>

                  {/* Bottom Text Overlay */}
                  <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4 translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                    <h3 className="font-sans font-bold text-white text-sm sm:text-base leading-tight">
                      {image.title}
                    </h3>
                    <p className="text-[10px] sm:text-xs text-white/70 mt-1 leading-relaxed line-clamp-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                      {image.desc}
                    </p>
                  </div>

                  {/* Top-right index badge */}
                  <div className="absolute top-3 right-3 h-7 w-7 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center border border-white/15 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <span className="text-[10px] font-bold text-white/90 font-mono">{idx + 1}</span>
                  </div>

                  {/* Video camera badge */}
                  {image.type === 'video' && (
                    <div className="absolute top-3 left-3 z-10 flex h-7 w-7 items-center justify-center rounded-full bg-black/60 backdrop-blur-sm text-white border border-white/15">
                      <Video className="h-3.5 w-3.5" />
                    </div>
                  )}

                  {/* Delete button for uploaded images */}
                  {image.isUploaded && (
                    <button
                      onClick={(e) => handleRemoveUploaded(idx, e)}
                      className={`absolute top-3 h-7 w-7 rounded-full bg-red-600/80 backdrop-blur-sm flex items-center justify-center border border-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-red-500 cursor-pointer z-10 ${image.type === 'video' ? 'left-12' : 'left-3'
                        }`}
                      aria-label="Remove item"
                    >
                      <Trash2 className="h-3.5 w-3.5 text-white" />
                    </button>
                  )}

                </motion.div>
              )
            })}
          </div>
        )}
      </motion.section>

      {/* ── Upload Panel Modal ──────────────────────────────────────────────── */}
      <AnimatePresence>
        {showUploadPanel && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4"
          >
            {/* Backdrop close */}
            <div className="absolute inset-0" onClick={resetUploadPanel} />

            <motion.div
              initial={{ scale: 0.92, opacity: 0, y: 24 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.92, opacity: 0, y: 24 }}
              transition={{ type: 'spring', damping: 26, stiffness: 220 }}
              className="relative z-10 w-full max-w-lg max-h-[calc(100dvh-2rem)] flex flex-col bg-white dark:bg-dev-card-dark rounded-3xl border border-saffron-200/30 dark:border-gold-400/15 overflow-hidden"
            >
              {/* Header */}
              <div className="flex shrink-0 items-center justify-between px-6 pt-6 pb-4 border-b border-saffron-100/20 dark:border-maroon-800/30">                <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-saffron-500 to-orange-600 flex items-center justify-center">
                  <Upload className="h-4 w-4 text-white" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-800 dark:text-gold-400">చిత్రం/వీడియో జోడించు (Add Photo/Video)</h3>
                  <p className="text-[10px] text-slate-400">Images ≤ 25 MB · Videos ≤ 100 MB · JPEG · PNG · HEIC · MP4 · MOV · AVI · MKV</p>
                </div>
              </div>
                <button
                  onClick={resetUploadPanel}
                  className="h-8 w-8 flex items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-maroon-900/40 text-slate-500 transition-colors cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div
                className="px-6 py-5 space-y-4 min-h-0 overflow-y-auto overscroll-contain touch-pan-y"
                data-lenis-prevent
                style={{ WebkitOverflowScrolling: 'touch' }}
              >
                {/* Drop Zone */}
                <div
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`relative rounded-2xl border-2 border-dashed transition-all cursor-pointer overflow-hidden
                    ${uploadPreview
                      ? 'border-saffron-400/60 dark:border-gold-400/40'
                      : 'border-saffron-200 dark:border-maroon-700/50 hover:border-saffron-400 dark:hover:border-gold-500/50 hover:bg-saffron-50/30 dark:hover:bg-maroon-950/20'
                    }`}
                >
                  {uploadPreview ? (
                    <div className="relative group">
                      {uploadFileType === 'video' ? (
                        <video
                          src={uploadPreview}
                          className="w-full h-44 object-cover"
                          autoPlay
                          muted
                          loop
                          playsInline
                        />
                      ) : (
                        <img
                          src={uploadPreview}
                          alt="Preview"
                          className="w-full h-44 object-cover"
                        />
                      )}
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                        <span className="text-white text-xs font-semibold bg-black/50 px-3 py-1.5 rounded-full">Click to change</span>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center gap-3 py-10 px-4 text-center">
                      <div className="h-12 w-12 rounded-2xl bg-saffron-500/10 flex items-center justify-center">
                        <ImageIcon className="h-6 w-6 text-saffron-500" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">Drag & drop or click to browse</p>
                        <p className="text-[10px] text-slate-400 mt-0.5">Images up to 25 MB · Videos up to 100 MB (MP4, MOV, AVI, MKV)</p>
                      </div>
                    </div>
                  )}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept={ACCEPTED_EXTENSIONS}
                    className="sr-only"
                    onChange={handleFileChange}
                  />
                </div>

                {/* Title Field */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    చిత్రం/వీడియో శీర్షిక / Title <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={uploadTitle}
                    onChange={(e) => {
                      setUploadTitle(e.target.value)
                      setUploadError(null)
                    }}
                    placeholder="e.g. అమ్మవారి దర్శనం (Deity Darshan)"
                    className="w-full rounded-xl border border-saffron-200 dark:border-maroon-700/50 bg-saffron-50/40 dark:bg-maroon-950/20 px-4 py-2.5 text-sm text-slate-800 dark:text-slate-200 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-saffron-400/50 transition-all"
                  />
                </div>

                {/* Email Field */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    ఈమెయిల్ / Email <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="email"
                    value={uploadEmail}
                    onChange={(e) => {
                      setUploadEmail(e.target.value)
                      setUploadError(null)
                    }}
                    placeholder="Enter your email"
                    className="w-full rounded-xl border border-saffron-200 dark:border-maroon-700/50 bg-saffron-50/40 dark:bg-maroon-950/20 px-4 py-2.5 text-sm text-slate-800 dark:text-slate-200 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-saffron-400/50 transition-all"
                  />
                </div>

                {/* Year Selection Field */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    సంవత్సరం / Upload Year <span className="text-red-400">*</span>
                  </label>
                  <select
                    value={uploadYear}
                    onChange={(e) => {
                      setUploadYear(Number(e.target.value))
                      setUploadError(null)
                    }}
                    className="w-full rounded-xl border border-saffron-200 dark:border-maroon-700/50 bg-saffron-50/40 dark:bg-maroon-950/20 px-4 py-2.5 text-sm text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-saffron-400/50 transition-all"
                  >
                    <option value={new Date().getFullYear()} className="bg-white dark:bg-maroon-950 text-slate-800 dark:text-slate-200">{new Date().getFullYear()}</option>
                    <option value={new Date().getFullYear() - 1} className="bg-white dark:bg-maroon-950 text-slate-800 dark:text-slate-200">{new Date().getFullYear() - 1}</option>
                    <option value={new Date().getFullYear() - 2} className="bg-white dark:bg-maroon-950 text-slate-800 dark:text-slate-200">{new Date().getFullYear() - 2}</option>
                  </select>
                </div>

                {/* Description Field */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    వివరణ / Description <span className="text-slate-300">(optional)</span>
                  </label>
                  <textarea
                    value={uploadDesc}
                    onChange={(e) => setUploadDesc(e.target.value)}
                    placeholder="Brief description of the photo…"
                    rows={2}
                    className="w-full rounded-xl border border-saffron-200 dark:border-maroon-700/50 bg-saffron-50/40 dark:bg-maroon-950/20 px-4 py-2.5 text-sm text-slate-800 dark:text-slate-200 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-saffron-400/50 transition-all resize-none"
                  />
                </div>

                {/* Error */}
                <AnimatePresence>
                  {uploadError && (
                    <motion.p
                      initial={{ opacity: 0, y: -6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="text-xs text-red-500 dark:text-red-400 flex items-center gap-1.5 bg-red-50 dark:bg-red-950/20 px-3 py-2 rounded-xl border border-red-200/50"
                    >
                      <X className="h-3.5 w-3.5 shrink-0" />
                      {uploadError}
                    </motion.p>
                  )}
                </AnimatePresence>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-1">
                  <button
                    onClick={resetUploadPanel}
                    className="flex-1 py-2.5 rounded-xl border border-saffron-200 dark:border-maroon-700/50 text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-saffron-50 dark:hover:bg-maroon-950/20 transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={handleAddToGallery}
                    disabled={uploadSuccess || uploadLoading}
                    className={`flex-1 py-2.5 rounded-xl text-sm font-bold text-white transition-all cursor-pointer flex items-center justify-center gap-2
                      ${uploadSuccess
                        ? 'bg-green-500'
                        : uploadLoading
                          ? 'bg-saffron-400 opacity-80 cursor-not-allowed'
                          : 'bg-gradient-to-r from-saffron-500 to-orange-500 hover:from-saffron-600 hover:to-orange-600'
                      }`}
                  >
                    {uploadSuccess ? (
                      <>
                        <CheckCircle2 className="h-4 w-4" />
                        Uploaded!
                      </>
                    ) : uploadLoading ? (
                      <>
                        <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                        </svg>
                        Uploading…
                      </>
                    ) : (
                      <>
                        <Plus className="h-4 w-4" />
                        Add to Gallery
                      </>
                    )}
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Full-Screen Lightbox Modal */}
      <AnimatePresence>
        {activeImageIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-lg flex flex-col justify-center items-center p-4"
            data-lenis-prevent
          >
            {/* Background click to close */}
            <div className="absolute inset-0 cursor-zoom-out" onClick={() => setActiveImageIndex(null)} />

            {/* Modal Box */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="relative max-w-5xl w-full bg-white dark:bg-dev-card-dark rounded-3xl overflow-hidden border border-saffron-200/30 dark:border-gold-400/20 z-10 flex flex-col"
            >
              {/* Close Button */}
              <button
                onClick={() => setActiveImageIndex(null)}
                className="absolute top-4 right-4 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-black/50 text-white hover:bg-saffron-500 transition-colors border border-white/20 cursor-pointer"
                aria-label="Close Lightbox"
              >
                <X className="h-5 w-5" />
              </button>

              {/* Image Container with slide animation */}
              <div className="relative aspect-[16/10] sm:aspect-[16/9] bg-black flex items-center justify-center overflow-hidden">
                <AnimatePresence mode="wait">
                  {displayImages[activeImageIndex].type === 'video' ? (
                    <motion.video
                      key={activeImageIndex}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.3 }}
                      src={displayImages[activeImageIndex].src}
                      controls
                      autoPlay
                      className="max-h-full max-w-full rounded-lg"
                    />
                  ) : (
                    <motion.img
                      key={activeImageIndex}
                      initial={{ opacity: 0, x: 40 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -40 }}
                      transition={{ duration: 0.3, ease: 'easeInOut' }}
                      src={displayImages[activeImageIndex].src}
                      alt={displayImages[activeImageIndex].title}
                      className="max-h-full max-w-full object-contain"
                    />
                  )}
                </AnimatePresence>

                {/* Navigation Arrows */}
                <button
                  onClick={() => setActiveImageIndex((prev) => (prev !== null && prev > 0 ? prev - 1 : displayImages.length - 1))}
                  className="absolute left-4 top-1/2 -translate-y-1/2 flex h-12 w-12 items-center justify-center rounded-full bg-black/50 text-white hover:bg-saffron-500 transition-all border border-white/10 cursor-pointer"
                  aria-label="Previous Image"
                >
                  <ChevronRight className="h-6 w-6 rotate-180" />
                </button>
                <button
                  onClick={() => setActiveImageIndex((prev) => (prev !== null && prev < displayImages.length - 1 ? prev + 1 : 0))}
                  className="absolute right-4 top-1/2 -translate-y-1/2 flex h-12 w-12 items-center justify-center rounded-full bg-black/50 text-white hover:bg-saffron-500 transition-all border border-white/10 cursor-pointer"
                  aria-label="Next Image"
                >
                  <ChevronRight className="h-6 w-6" />
                </button>
              </div>

              {/* Bottom Info + Thumbnail Strip */}
              <div className="p-5 sm:p-6 bg-white dark:bg-dev-card-dark space-y-4 border-t border-saffron-100/20 dark:border-gold-400/10">
                <div className="flex items-center justify-between">
                  <h4 className="font-sans text-lg font-bold text-slate-800 dark:text-gold-400 leading-tight">
                    {displayImages[activeImageIndex].title}
                  </h4>
                  <span className="text-xs font-mono text-slate-400">
                    {activeImageIndex + 1} / {displayImages.length}
                  </span>
                </div>
                <p className="text-sm text-slate-500 dark:text-slate-300 leading-relaxed max-w-2xl">
                  {displayImages[activeImageIndex].desc}
                </p>

                {/* Thumbnail Strip */}
                <div className="flex gap-2 pt-2 overflow-x-auto overscroll-x-contain" data-lenis-prevent>
                  {displayImages.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveImageIndex(i)}
                      className={`shrink-0 h-14 w-20 rounded-lg overflow-hidden border-2 transition-all cursor-pointer relative ${i === activeImageIndex
                        ? 'border-saffron-500 dark:border-gold-400 ring-2 ring-saffron-500/30 dark:ring-gold-400/30 scale-105'
                        : 'border-transparent opacity-50 hover:opacity-80'
                        }`}
                    >
                      {img.type === 'video' ? (
                        <>
                          <video src={img.src} className="h-full w-full object-cover" muted />
                          <div className="absolute inset-0 flex items-center justify-center bg-black/35">
                            <Video className="h-3.5 w-3.5 text-white" />
                          </div>
                        </>
                      ) : (
                        <img src={img.src} alt={img.title} className="h-full w-full object-cover" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Global Toast Notification Overlay */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
            className={`fixed bottom-6 right-6 z-[100] flex items-center gap-3 px-5 py-4 rounded-2xl backdrop-blur-md border ${toastType === 'error' ? 'border-red-500/50 bg-red-500/10 text-red-700' : 'border-green-500/50 bg-green-500/10 text-green-700'}`}
          >
            {toastType === 'error' ? (
              <X className="h-5 w-5 text-red-500 shrink-0" />
            ) : (
              <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0" />
            )}
            <div className="text-xs font-semibold">{toastMessage}</div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {pendingDeleteIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="fixed inset-0 z-[60] flex items-center justify-center p-4"
            style={{ background: 'rgba(0,0,0,0.45)' }}
          >
            {/* Backdrop */}
            <div className="absolute inset-0" onClick={() => setPendingDeleteIndex(null)} />

            <motion.div
              initial={{ scale: 0.94, opacity: 0, y: 16 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.94, opacity: 0, y: 16 }}
              transition={{ type: 'spring', stiffness: 300, damping: 28 }}
              role="alertdialog"
              aria-modal="true"
              aria-labelledby="delete-dialog-title"
              aria-describedby="delete-dialog-desc"
              className="relative z-10 w-full max-w-sm bg-white dark:bg-dev-card-dark rounded-2xl border border-slate-200/70 dark:border-maroon-800/40 overflow-hidden"
            >
              {/* Top accent line — red, matches danger intent */}
              <div className="h-[3px] w-full bg-red-500/80" />

              <div className="px-6 pt-5 pb-6 space-y-5">
                {/* Icon + Title */}
                <div className="flex items-start gap-4">
                  <div className="shrink-0 mt-0.5 flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200/60 dark:border-red-800/40">
                    <Trash2 className="h-5 w-5 text-red-500 dark:text-red-400" />
                  </div>
                  <div className="space-y-1">
                    <h2
                      id="delete-dialog-title"
                      className="text-sm font-bold text-slate-800 dark:text-slate-100 leading-snug"
                    >
                      Delete this photo?
                    </h2>
                    <p
                      id="delete-dialog-desc"
                      className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed"
                    >
                      {pendingDeleteIndex !== null && displayImages[pendingDeleteIndex]
                        ? <>
                          <span className="font-semibold text-slate-600 dark:text-slate-300">
                            "{displayImages[pendingDeleteIndex].title}"
                          </span>{' '}
                          will be permanently removed from the gallery.
                        </>
                        : 'This photo will be permanently removed from the gallery.'}
                    </p>
                  </div>
                </div>

                {/* Thumbnail preview of the item being deleted */}
                {pendingDeleteIndex !== null && displayImages[pendingDeleteIndex] && (
                  <div className="rounded-xl overflow-hidden border border-slate-200/60 dark:border-maroon-800/40 h-28 bg-slate-100 dark:bg-maroon-950/20">
                    {displayImages[pendingDeleteIndex].type === 'video' ? (
                      <video
                        src={displayImages[pendingDeleteIndex].src}
                        muted
                        className="h-full w-full object-cover opacity-80"
                      />
                    ) : (
                      <img
                        src={displayImages[pendingDeleteIndex].src}
                        alt="Photo to delete"
                        className="h-full w-full object-cover opacity-80"
                      />
                    )}
                  </div>
                )}

                {/* Separator */}
                <div className="h-px bg-slate-100 dark:bg-maroon-800/30" />

                {/* Actions */}
                <div className="flex gap-2.5">
                  {/* Cancel — Radix-style ghost */}
                  <button
                    onClick={() => setPendingDeleteIndex(null)}
                    className="flex-1 h-9 rounded-lg border border-slate-200 dark:border-maroon-700/50 text-xs font-semibold text-slate-600 dark:text-slate-300 bg-white dark:bg-transparent hover:bg-slate-50 dark:hover:bg-maroon-950/30 transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>

                  {/* Confirm Delete — Radix-style destructive */}
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={confirmDelete}
                    className="flex-1 h-9 rounded-lg bg-red-500 hover:bg-red-600 active:bg-red-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    Delete photo
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>


    </motion.div >
  )
}
