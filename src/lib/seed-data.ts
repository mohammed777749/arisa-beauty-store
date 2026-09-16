// Shared seed data for the beauty e-commerce store.
// Used by both prisma/seed.ts and src/app/api/seed/route.ts

export type SeedCategory = {
  slug: string;
  name: string;
  nameEn: string;
  description: string;
  image: string;
  icon: string;
};

export type SeedProduct = {
  name: string;
  description: string;
  price: number;
  oldPrice?: number;
  image: string;
  images: string[];
  categorySlug: string;
  rating: number;
  reviewCount: number;
  stock: number;
  brand: string;
  shades?: string[];
  isFeatured?: boolean;
  isBestseller?: boolean;
  isNew?: boolean;
};

export const categories: SeedCategory[] = [
  {
    slug: "makeup",
    name: "مكياج",
    nameEn: "Makeup",
    description: "كريمات الأساس، ظلال العيون، الماسكارا وأدوات المكياج الفاخرة لإطلالة ساحرة.",
    image: "/images/cat-makeup.jpg",
    icon: "Sparkles",
  },
  {
    slug: "lips",
    name: "شفاه",
    nameEn: "Lips",
    description: "أحمر شفاه، جلوس، وأقلام تحديد لشفاه ممتلئة وجذابة طوال اليوم.",
    image: "/images/cat-lips.jpg",
    icon: "Heart",
  },
  {
    slug: "hair",
    name: "شعر",
    nameEn: "Hair",
    description: "سيرومات، شامبو، ماسكات وزيوت لعناية متكاملة بشعر صحي ولامع.",
    image: "/images/cat-hair.jpg",
    icon: "Wind",
  },
  {
    slug: "nails",
    name: "أظافر",
    nameEn: "Nails",
    description: "طلاءات أظافر جل طويلة الأمد، طقم العناية، ومستحضرات التركيب.",
    image: "/images/cat-nails.jpg",
    icon: "Hand",
  },
  {
    slug: "perfume",
    name: "عطور",
    nameEn: "Perfume",
    description: "عطور شرقية وفرنسية فاخرة بروائح الورد والمسك والعود تدوم طويلاً.",
    image: "/images/cat-perfume.jpg",
    icon: "Flower2",
  },
  {
    slug: "skincare",
    name: "عناية بالبشرة",
    nameEn: "Skincare",
    description: "سيرومات، كريمات ترطيب، غسول وواقي شمس لبشرة نضرة ومشرقة.",
    image: "/images/cat-skincare.jpg",
    icon: "Droplet",
  },
];

export const products: SeedProduct[] = [
  // ===== Makeup =====
  {
    name: "كريم أساس فاخر بترطيب 24 ساعة",
    description:
      "كريم أساس بتغطية متوسطة وملمس حريري يوحد لون البشرة ويمنحها إشراقة طبيعية تدوم 24 ساعة. خفيف الوزن، مقاوم للعرق، ومناسب لجميع أنواع البشرة. يحتوي على حمض الهيالورونيك وفيتامين E لترطيب عميق.",
    price: 189,
    oldPrice: 245,
    image: "/images/prod-foundation.jpg",
    images: ["/images/prod-foundation.jpg"],
    categorySlug: "makeup",
    rating: 4.8,
    reviewCount: 287,
    stock: 64,
    brand: "جلورية لوكس",
    isFeatured: true,
    isBestseller: true,
  },
  {
    name: "باليت ظلال العيون الذهبية - 12 لون",
    description:
      "باليت ظلال عيون فاخر بـ 12 درجة لونية بين المات واللامع، صباغة عالية وثبات طويل. ألوان ذهبية ووردية ونود مثالية للإطلالات اليومية والمسائية. قابل للمزج بسهولة ولا يتطاير.",
    price: 156,
    oldPrice: 199,
    image: "/images/prod-eyeshadow.jpg",
    images: ["/images/prod-eyeshadow.jpg"],
    categorySlug: "makeup",
    rating: 4.9,
    reviewCount: 312,
    stock: 42,
    brand: "جلورية لوكس",
    isFeatured: true,
    isBestseller: true,
  },
  {
    name: "ماسكارا الحجم الفائق المقاومة للماء",
    description:
      "ماسكارا تمنح رموشكِ حجماً وطولاً مضاعفاً بتركيبة مقاومة للماء والتلطخ. فرشاة مبتكرة تفصل كل رمشة دون تكتلات. تدوم حتى 16 ساعة وتُزال بسهولة بالماء الدافئ.",
    price: 89,
    image: "/images/prod-mascara.jpg",
    images: ["/images/prod-mascara.jpg"],
    categorySlug: "makeup",
    rating: 4.7,
    reviewCount: 198,
    stock: 88,
    brand: "جلورية",
    isBestseller: true,
  },
  {
    name: "أحمر خدود وردي بتأثير طبيعي",
    description:
      "بودرة أحمر خدود ناعمة بدرجات وردية تمنح وجنتيكِ لوناً طبيعياً ومشرقاً. قابلة للمزج بسهولة وتدوم طوال اليوم. مناسبة لجميع درجات البشرة.",
    price: 75,
    image: "/images/prod-foundation.jpg",
    images: ["/images/prod-foundation.jpg"],
    categorySlug: "makeup",
    rating: 4.6,
    reviewCount: 134,
    stock: 70,
    brand: "جلورية",
    isNew: true,
  },
  {
    name: "برايمر مثبت للمكياج - قاعدة مضيئة",
    description:
      "برايمر يوحد سطح البشرة ويصغر المسام ويمنحها إشراقة فورية. يثبت المكياج ويطيل ثباته حتى 12 ساعة. خفيف وغير دهني ومناسب للبشرة الدهنية والمختلطة.",
    price: 112,
    oldPrice: 140,
    image: "/images/prod-foundation.jpg",
    images: ["/images/prod-foundation.jpg"],
    categorySlug: "makeup",
    rating: 4.7,
    reviewCount: 156,
    stock: 53,
    brand: "جلورية لوكس",
  },
  {
    name: "كونسيلر تغطية كاملة - مقاوم للتجاعيد",
    description:
      "كونسيلر كريمي بتغطية عالية يخفي الهالات السوداء والبقع والتصبغات فوراً. يحتوي على فيتامين C وحمض الهيالورونيك لرعاية المنطقة الحساسة حول العين. لا يتشقق ولا يتراكم بالخطوط الدقيقة.",
    price: 98,
    image: "/images/prod-foundation.jpg",
    images: ["/images/prod-foundation.jpg"],
    categorySlug: "makeup",
    rating: 4.8,
    reviewCount: 203,
    stock: 67,
    brand: "جلورية",
    isNew: true,
  },
  {
    name: "محدد عيون مقاوم للماء - أسود فاحم",
    description:
      "محدد عيون بقلم جل بتركيبة مقاومة للماء والعرق. لون أسود مكثف وثبات حتى 14 ساعة. طرف رفيع لرسم خطوط دقيقة وسهولة التحكم. مثالي للخطوط العربية والقطط.",
    price: 65,
    image: "/images/prod-mascara.jpg",
    images: ["/images/prod-mascara.jpg"],
    categorySlug: "makeup",
    rating: 4.5,
    reviewCount: 89,
    stock: 95,
    brand: "جلورية",
  },
  {
    name: "فرشاة مكياج احترافية - طقم 10 قطع",
    description:
      "طقم فرش مكياج احترافي من 10 قطع بشعيرات صناعية ناعمة فائقة الجودة. تشمل فرشاة الأساس والكونسيلر والظلال والبودرة وأحمر الخدود. مقابض خشبية فاخرة وحقيبة حمل أنيقة.",
    price: 145,
    oldPrice: 199,
    image: "/images/prod-eyeshadow.jpg",
    images: ["/images/prod-eyeshadow.jpg"],
    categorySlug: "makeup",
    rating: 4.9,
    reviewCount: 167,
    stock: 38,
    brand: "جلورية لوكس",
    isFeatured: true,
  },
  // ===== Lips =====
  {
    name: "أحمر شفاه ماط فاخر - ثبات 12 ساعة",
    description:
      "أحمر شفاه بتركيبة ماط مخملي يمنح لوناً مكثفاً بلمسة واحدة. ثبات يصل إلى 12 ساعة دون جفاف أو تشقق. غني بزبدة الشيا وزيت جوز الهند لترطيب الشفاه. متوفر بدرجات متعددة.",
    price: 69,
    oldPrice: 89,
    image: "/images/prod-lipstick.jpg",
    images: ["/images/prod-lipstick.jpg"],
    categorySlug: "lips",
    rating: 4.8,
    reviewCount: 245,
    stock: 120,
    brand: "جلورية",
    shades: ["أحمر كلاسيكي", "وردي عاري", "نود بيج", "أحمر فونت", "بنفسجي داكن"],
    isFeatured: true,
    isBestseller: true,
  },
  {
    name: "جلوس الشفاه اللامع - لمعان زجاجي",
    description:
      "جلوس شفاه بتركيبة لامعة غير لزجة تمنح شفاهكِ مظهراً ممتلئاً ولامعاً. خفيف الوزن ومريح على الشفاه، يحتوي على حمض الهيالورونيك للترطيب. يمكن استخدامه بمفرده أو فوق أحمر الشفاه.",
    price: 55,
    image: "/images/prod-lipgloss.jpg",
    images: ["/images/prod-lipgloss.jpg"],
    categorySlug: "lips",
    rating: 4.6,
    reviewCount: 178,
    stock: 84,
    brand: "جلورية",
    shades: ["شفاف لامع", "وردي لؤلؤي", "خوخي", "أحمر خفيف"],
    isNew: true,
  },
  {
    name: "قلم تحديد الشفاه المقاوم للانزياح",
    description:
      "قلم تحديد شفاه كريمي يمنع انزياح أحمر الشفاه ويحدد ملامح الشفاه بدقة. تركيبة طويلة الثبات تتمدد بسهولة لملء الشفاه. متوفر بدرجات متناسقة مع أغلب ألوان أحمر الشفاه.",
    price: 42,
    image: "/images/prod-lipstick.jpg",
    images: ["/images/prod-lipstick.jpg"],
    categorySlug: "lips",
    rating: 4.5,
    reviewCount: 112,
    stock: 76,
    brand: "جلورية",
    shades: ["أحمر", "وردي", "نود", "بني"],
  },
  {
    name: "تينت الشفاه طويل الأمد - لون طبيعي",
    description:
      "تينت شفاه سائل يمنح لوناً طبيعياً يدوم حتى 8 ساعات. خفيف جداً وغير لزج، مثالي للإطلالة اليومية الطبيعية. يتفاعل مع درجة حموضة الشفاه لإظهار لون مخصص لكِ.",
    price: 48,
    image: "/images/prod-lipgloss.jpg",
    images: ["/images/prod-lipgloss.jpg"],
    categorySlug: "lips",
    rating: 4.4,
    reviewCount: 96,
    stock: 58,
    brand: "جلورية",
    shades: ["وردي طبيعي", "خوخي", "توتي", "مرجاني"],
    isNew: true,
  },
  {
    name: "بلسم الشفاه المرطب - نكهة الفراولة",
    description:
      "بلسم شفاه مرطب بزبدة الكاكاو وزبدة الشيا وزيت اللوز. يرطب الشفاه الجافة والمتشققة ويحميها من العوامل الخارجية. بلمسة لامعة خفيفة ونكهة فراولة لذيذة. مناسب للاستخدام اليومي.",
    price: 28,
    image: "/images/prod-lipgloss.jpg",
    images: ["/images/prod-lipgloss.jpg"],
    categorySlug: "lips",
    rating: 4.7,
    reviewCount: 145,
    stock: 150,
    brand: "جلورية",
  },
  // ===== Hair =====
  {
    name: "سيروم نمو الشعر بزيت الأرغان والبيوتين",
    description:
      "سيروم مركّز يغذي فروة الرأس ويحفز نمو الشعر ويقلل التساقط. يحتوي على زيت الأرغان المغربي والبيوتين والكافيين. يعزز كثافة الشعر ويمنحه قوة ولمعاناً. مناسب لجميع أنواع الشعر.",
    price: 135,
    oldPrice: 175,
    image: "/images/prod-hairserum.jpg",
    images: ["/images/prod-hairserum.jpg"],
    categorySlug: "hair",
    rating: 4.8,
    reviewCount: 234,
    stock: 62,
    brand: "جلورية لوكس",
    isFeatured: true,
    isBestseller: true,
  },
  {
    name: "شامبو خالي من السلفات - للأشقر والمعالج",
    description:
      "شامبو لطيف خالٍ من السلفات والبارابين ينظف الشعر بلطف دون أن يجففه. مثالي للشعر المصبوغ والمعالج كيميائياً. يحافظ على لون الصبغة ويرطب الشعر بزيت الأركان والأرغان.",
    price: 78,
    image: "/images/prod-shampoo.jpg",
    images: ["/images/prod-shampoo.jpg"],
    categorySlug: "hair",
    rating: 4.6,
    reviewCount: 167,
    stock: 94,
    brand: "جلورية",
  },
  {
    name: "ماسك الشعر المغذي - ترميم عميق",
    description:
      "ماسك شعر غني بالكيراتين وزبدة الشيا لترميم الشعر التالف بعمق. يرطب ويغذي ويمنح الشعر نعومة ولمعاناً فائقاً. يستخدم مرة أو مرتين أسبوعياً للحصول على شعر صحي وقوي.",
    price: 95,
    oldPrice: 120,
    image: "/images/prod-hairmask.jpg",
    images: ["/images/prod-hairmask.jpg"],
    categorySlug: "hair",
    rating: 4.7,
    reviewCount: 189,
    stock: 71,
    brand: "جلورية لوكس",
    isBestseller: true,
  },
  {
    name: "زيت الأرغان المغربي الأصلي - 100 مل",
    description:
      "زيت أرغان مغربي نقي 100% عضوي يغذي الشعر والبشرة والأظافر. غني بفيتامين E والأحماض الدهنية الأساسية. يرطب الشعر ويمنحه لمعاناً صحياً ويقاوم التقصف. متعدد الاستخدامات.",
    price: 115,
    image: "/images/prod-hairserum.jpg",
    images: ["/images/prod-hairserum.jpg"],
    categorySlug: "hair",
    rating: 4.9,
    reviewCount: 278,
    stock: 45,
    brand: "جلورية لوكس",
    isFeatured: true,
    isNew: true,
  },
  {
    name: "بلسم الشعر الحريري - فك التشابك",
    description:
      "بلسم شعر خفيف يفك التشابك ويرطب الشعر ويجعله حريرياً وسهل التسريح. خالٍ من السلفات والبارابين. مناسب للاستخدام اليومي لجميع أنواع الشعر. برائحة الأزهار الأنثوية.",
    price: 68,
    image: "/images/prod-shampoo.jpg",
    images: ["/images/prod-shampoo.jpg"],
    categorySlug: "hair",
    rating: 4.5,
    reviewCount: 124,
    stock: 88,
    brand: "جلورية",
  },
  // ===== Nails =====
  {
    name: "طلاء أظافر جل طويل الأمد - 7 أيام",
    description:
      "طلاء أظافر بتركيبة الجل التي تمنح لمعاناً زجاجياً وثباتاً يصل إلى 7 أيام دون تقشر. يجف بسرعة تحت ضوء LED. ألوان غنية ومشبعة بدرجات عصرية. خالٍ من الفورمالديهايد والتولوين.",
    price: 45,
    oldPrice: 60,
    image: "/images/prod-nailpolish.jpg",
    images: ["/images/prod-nailpolish.jpg"],
    categorySlug: "nails",
    rating: 4.7,
    reviewCount: 187,
    stock: 110,
    brand: "جلورية",
    shades: ["أحمر كلاسيكي", "وردي فاتح", "نود بيج", "أسود", "فرنسي أبيض", "ميتاليك ذهبي"],
    isFeatured: true,
    isBestseller: true,
  },
  {
    name: "طقم العناية بالأظافر الاحترافي - 12 قطعة",
    description:
      "طقم عناية بالأظافر من 12 قطعة من الستانلس المقاوم للصدأ. يشمل مقص الأظافر، المبرد، الملقط، دافع الجلد وغيرها. في حقيبة حمل أنيقة. مثالي للاستخدام المنزلي أو الاحترافي.",
    price: 89,
    image: "/images/prod-nailpolish.jpg",
    images: ["/images/prod-nailpolish.jpg"],
    categorySlug: "nails",
    rating: 4.6,
    reviewCount: 98,
    stock: 56,
    brand: "جلورية لوكس",
  },
  {
    name: "مزيل طلاء الأظافر اللطيف - بدون أسيتون",
    description:
      "مزيل طلاء أظافر لطيف خالٍ من الأسيتون، مُعزّز بزيت الجوجوبا وفيتامين E. يزيل طلاء الأظافر بسهولة دون أن يجفف الأظافر أو الجلد المحيط. برائحة منعشة ولطيفة.",
    price: 32,
    image: "/images/prod-nailpolish.jpg",
    images: ["/images/prod-nailpolish.jpg"],
    categorySlug: "nails",
    rating: 4.4,
    reviewCount: 67,
    stock: 130,
    brand: "جلورية",
    isNew: true,
  },
  {
    name: "أظافر جاهزة للتركيب - فرنسي طبيعي",
    description:
      "طقم أظافر جاهزة للتركيب بتصميم الفرنسي الأنيق. 24 قطعة بأحجام متناسبة مع كل الأظافر. سهلة التركيب وتدوم حتى أسبوعين. تعطي مظهراً احترافياً في المنزل.",
    price: 52,
    oldPrice: 68,
    image: "/images/prod-nailpolish.jpg",
    images: ["/images/prod-nailpolish.jpg"],
    categorySlug: "nails",
    rating: 4.5,
    reviewCount: 134,
    stock: 78,
    brand: "جلورية",
  },
  // ===== Perfume =====
  {
    name: "عطر الورد الدمشقي الفاخر - 100 مل",
    description:
      "عطر شرقي زهري فاخر مستوحى من ورود دمشق الأصيلة. يفتح بنفحات الورد البلغاري والياسمين، ويتطور إلى قلب من العود والمسك. يدوم أكثر من 10 ساعات. تركيبة فاخرة بتركيز EDP.",
    price: 285,
    oldPrice: 360,
    image: "/images/prod-perfume1.jpg",
    images: ["/images/prod-perfume1.jpg"],
    categorySlug: "perfume",
    rating: 4.9,
    reviewCount: 198,
    stock: 34,
    brand: "جلورية لوكس",
    isFeatured: true,
    isBestseller: true,
  },
  {
    name: "عطر المسك الأبيض النقي - 90 مل",
    description:
      "عطر أبيض نقي بروائح المسك الأبيض الناعم واللوز والعنبر. عطر لطيف وأنيق يناسب الإطلالات اليومية والمناسبات. يدوم طويلاً على البشرة ويترك أثراً ساحراً. تركيز EDP فاخر.",
    price: 215,
    image: "/images/prod-perfume1.jpg",
    images: ["/images/prod-perfume1.jpg"],
    categorySlug: "perfume",
    rating: 4.8,
    reviewCount: 156,
    stock: 48,
    brand: "جلورية لوكس",
    isBestseller: true,
  },
  {
    name: "عطر الياسمين الملكي - 100 مل",
    description:
      "عطر زهري ملكي بنفحات الياسمين الصنفوري والزهر البرتقالي وفانيليا البوربون. أنثوي وراقٍ، مثالي للسهرات والمناسبات الخاصة. يدوم حتى 12 ساعة. عبوة فاخرة بتغطية ذهبية.",
    price: 245,
    oldPrice: 290,
    image: "/images/prod-perfume1.jpg",
    images: ["/images/prod-perfume1.jpg"],
    categorySlug: "perfume",
    rating: 4.7,
    reviewCount: 112,
    stock: 29,
    brand: "جلورية لوكس",
    isNew: true,
  },
  {
    name: "عطر العود الملكي الفاخر - 75 مل",
    description:
      "عطر عود ملكي فاخر بنفحات العود الكمبودي والصندل والورد التائفي. عطر شرقي غني ودافئ يدوم طويلاً ويناسب الأجواء الفخمة. تركيز EDP بجودة عالية. عبوة أنيقة بتصميم عربي تراثي.",
    price: 325,
    image: "/images/prod-perfume1.jpg",
    images: ["/images/prod-perfume1.jpg"],
    categorySlug: "perfume",
    rating: 4.9,
    reviewCount: 87,
    stock: 22,
    brand: "جلورية لوكس",
    isFeatured: true,
  },
  // ===== Skincare =====
  {
    name: "سيروم فيتامين C المركز - 20%",
    description:
      "سيروم بفيتامين C بتركيز 20% يوحّد لون البشرة ويفتح البقع الداكنة ويعزز إنتاج الكولاجين. يحتوي على حمض الفيروليك وفيتامين E لفعالية مضاعفة. يمنح البشرة إشراقة فورية ويقلل علامات التقدم في العمر.",
    price: 145,
    oldPrice: 195,
    image: "/images/prod-serum.jpg",
    images: ["/images/prod-serum.jpg"],
    categorySlug: "skincare",
    rating: 4.8,
    reviewCount: 267,
    stock: 58,
    brand: "جلورية لوكس",
    isFeatured: true,
    isBestseller: true,
  },
  {
    name: "كريم الترطيب اليومي مع حمض الهيالورونيك",
    description:
      "كريم ترطيب يومي خفيف بتركيبة حمض الهيالورونيك والسيراميد يرطب البشرة بعمق ويحافظ على رطوبتها لمدة 48 ساعة. غير دهني وسريع الامتصاص، مناسب لجميع أنواع البشرة. يحقق نضارة وإشراقاً.",
    price: 110,
    image: "/images/prod-moisturizer.jpg",
    images: ["/images/prod-moisturizer.jpg"],
    categorySlug: "skincare",
    rating: 4.7,
    reviewCount: 189,
    stock: 76,
    brand: "جلورية لوكس",
    isBestseller: true,
  },
  {
    name: "غسول الوجه اللطيف - للبشرة الحساسة",
    description:
      "غسول وجه لطيف خالٍ من الصابون والعطور ينظف البشرة بعمق دون أن يجففها. يحتوي على خلاصة الشاي الأخضر والصبار لتهدئة البشرة. مناسب للبشرة الحساسة والجافة. يستخدم صباحاً ومساءً.",
    price: 65,
    image: "/images/prod-serum.jpg",
    images: ["/images/prod-serum.jpg"],
    categorySlug: "skincare",
    rating: 4.6,
    reviewCount: 145,
    stock: 92,
    brand: "جلورية",
  },
  {
    name: "ماسك الطين المنقي للبشرة الدهنية",
    description:
      "ماسك طين كاولين وبنتونيت ينقي البشرة الدهنية والمختلطة بعمق. يمتص الزيوت الزائدة، يصغر المسام، وينظف الرؤوس السوداء. يمنح البشرة مظهراً صحياً ومتجدداً. يستخدم مرة أسبوعياً.",
    price: 78,
    oldPrice: 98,
    image: "/images/prod-moisturizer.jpg",
    images: ["/images/prod-moisturizer.jpg"],
    categorySlug: "skincare",
    rating: 4.5,
    reviewCount: 112,
    stock: 64,
    brand: "جلورية",
    isNew: true,
  },
  {
    name: "واقي الشمس الخفيف SPF 50+ - بدون أثر أبيض",
    description:
      "واقي شمس خفيف الوزن بعامل حماية SPF 50+ يحمي البشرة من الأشعة فوق البنفسجية UVA وUVB. تركيبة غير دهنية لا تترك أثراً أبيض وتصلح كقاعدة للمكياج. مقاوم للعرق والماء. مناسب للبشرة الحساسة.",
    price: 125,
    image: "/images/prod-moisturizer.jpg",
    images: ["/images/prod-moisturizer.jpg"],
    categorySlug: "skincare",
    rating: 4.8,
    reviewCount: 203,
    stock: 49,
    brand: "جلورية لوكس",
    isFeatured: true,
    isNew: true,
  },
  {
    name: "تونر موازن للبشرة - بالورد الطبيعي",
    description:
      "تونر بماء الورد الطبيعي يوازن درجة حموضة البشرة ويصغر المسام ويحضّر البشرة لاستقبال السيروم والكريم. يرطب وينعش البشرة بعمق. خالٍ من الكحول والعطور الصناعية. للاستخدام اليومي.",
    price: 72,
    image: "/images/prod-serum.jpg",
    images: ["/images/prod-serum.jpg"],
    categorySlug: "skincare",
    rating: 4.6,
    reviewCount: 134,
    stock: 81,
    brand: "جلورية",
  },
];
