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
  isChoice?: boolean;
  prime?: boolean;
  ingredients?: string;
  weight?: string;
  origin?: string;
};

export type SeedReview = {
  author: string;
  rating: number;
  title: string;
  body: string;
  helpful: number;
  verified: boolean;
  daysAgo: number;
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
    images: ["/images/prod-foundation.jpg", "/images/prod-eyeshadow.jpg", "/images/prod-mascara.jpg"],
    categorySlug: "makeup",
    rating: 4.8,
    reviewCount: 287,
    stock: 64,
    brand: "أريسا لوكس",
    isFeatured: true,
    isBestseller: true,
    isChoice: true,
    prime: true,
    ingredients:
      "ماء، سيكلوبنتاسيلوكسان، غليسرين، حمض الهيالورونيك، نياسيناميد، فيتامين E، ثاني أكسيد التيتانيوم، أكسيد الزنك، خلاصة الشاي الأخضر، زبدة الشيا.",
    weight: "30 مل",
    origin: "فرنسا",
  },
  {
    name: "باليت ظلال العيون الذهبية - 12 لون",
    description:
      "باليت ظلال عيون فاخر بـ 12 درجة لونية بين المات واللامع، صباغة عالية وثبات طويل. ألوان ذهبية ووردية ونود مثالية للإطلالات اليومية والمسائية. قابل للمزج بسهولة ولا يتطاير.",
    price: 156,
    oldPrice: 199,
    image: "/images/prod-eyeshadow.jpg",
    images: ["/images/prod-eyeshadow.jpg", "/images/prod-foundation.jpg", "/images/prod-mascara.jpg"],
    categorySlug: "makeup",
    rating: 4.9,
    reviewCount: 312,
    stock: 42,
    brand: "أريسا لوكس",
    isFeatured: true,
    isBestseller: true,
    isChoice: true,
    prime: true,
    ingredients:
      "تالك، ميكا، سيليكا، ماغنيسيوم ستيرات، بارافين، خلاصة الورد، فيتامين E، أصباغ طبيعية.",
    weight: "15 جم",
    origin: "كوريا الجنوبية",
  },
  {
    name: "ماسكارا الحجم الفائق المقاومة للماء",
    description:
      "ماسكارا تمنح رموشكِ حجماً وطولاً مضاعفاً بتركيبة مقاومة للماء والتلطخ. فرشاة مبتكرة تفصل كل رمشة دون تكتلات. تدوم حتى 16 ساعة وتُزال بسهولة بالماء الدافئ.",
    price: 89,
    image: "/images/prod-mascara.jpg",
    images: ["/images/prod-mascara.jpg", "/images/prod-eyeshadow.jpg"],
    categorySlug: "makeup",
    rating: 4.7,
    reviewCount: 198,
    stock: 88,
    brand: "أريسا",
    isBestseller: true,
    prime: true,
    ingredients:
      "ماء، شمع كرنوبا، شمع عسل النحل، غليسرين، حمض الستيريك، خلاصة البابونج، بانثينول، فيتامين E.",
    weight: "10 مل",
    origin: "اليابان",
  },
  {
    name: "أحمر خدود وردي بتأثير طبيعي",
    description:
      "بودرة أحمر خدود ناعمة بدرجات وردية تمنح وجنتيكِ لوناً طبيعياً ومشرقاً. قابلة للمزج بسهولة وتدوم طوال اليوم. مناسبة لجميع درجات البشرة.",
    price: 75,
    image: "/images/prod-foundation.jpg",
    images: ["/images/prod-foundation.jpg", "/images/prod-eyeshadow.jpg"],
    categorySlug: "makeup",
    rating: 4.6,
    reviewCount: 134,
    stock: 70,
    brand: "أريسا",
    isNew: true,
    prime: true,
    ingredients: "تالك، ميكا، سيليكا، خلاصة الورد، فيتامين E، أصباغ معدنية طبيعية.",
    weight: "8 جم",
    origin: "كوريا الجنوبية",
  },
  {
    name: "برايمر مثبت للمكياج - قاعدة مضيئة",
    description:
      "برايمر يوحد سطح البشرة ويصغر المسام ويمنحها إشراقة فورية. يثبت المكياج ويطيل ثباته حتى 12 ساعة. خفيف وغير دهني ومناسب للبشرة الدهنية والمختلطة.",
    price: 112,
    oldPrice: 140,
    image: "/images/prod-foundation.jpg",
    images: ["/images/prod-foundation.jpg", "/images/prod-moisturizer.jpg"],
    categorySlug: "makeup",
    rating: 4.7,
    reviewCount: 156,
    stock: 53,
    brand: "أريسا لوكس",
    prime: true,
    ingredients:
      "ماء، سيكلوبنتاسيلوكسان، غليسرين، نياسيناميد، حمض الهيالورونيك، خلاصة الصبار، فيتامين B3.",
    weight: "30 مل",
    origin: "فرنسا",
  },
  {
    name: "كونسيلر تغطية كاملة - مقاوم للتجاعيد",
    description:
      "كونسيلر كريمي بتغطية عالية يخفي الهالات السوداء والبقع والتصبغات فوراً. يحتوي على فيتامين C وحمض الهيالورونيك لرعاية المنطقة الحساسة حول العين. لا يتشقق ولا يتراكم بالخطوط الدقيقة.",
    price: 98,
    image: "/images/prod-foundation.jpg",
    images: ["/images/prod-foundation.jpg", "/images/prod-mascara.jpg"],
    categorySlug: "makeup",
    rating: 4.8,
    reviewCount: 203,
    stock: 67,
    brand: "أريسا",
    isNew: true,
    isChoice: true,
    prime: true,
    ingredients:
      "ماء، غليسرين، فيتامين C، حمض الهيالورونيك، خلاصة الخيار، فيتامين E، ببتيدات.",
    weight: "5 مل",
    origin: "كوريا الجنوبية",
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
    brand: "أريسا",
    prime: true,
    ingredients: "شمع كرنوبا، شمع كانديليرا، زيت الخروع، أصباغ سوداء، فيتامين E.",
    weight: "0.5 جم",
    origin: "اليابان",
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
    brand: "أريسا لوكس",
    isFeatured: true,
    prime: true,
    ingredients: "شعيرات صناعية ناعمة، مقابض خشب الزان، ألمنيوم مقاوم للصدأ.",
    weight: "طقم 10 قطع",
    origin: "الصين",
  },
  // ===== Lips =====
  {
    name: "أحمر شفاه ماط فاخر - ثبات 12 ساعة",
    description:
      "أحمر شفاه بتركيبة ماط مخملي يمنح لوناً مكثفاً بلمسة واحدة. ثبات يصل إلى 12 ساعة دون جفاف أو تشقق. غني بزبدة الشيا وزيت جوز الهند لترطيب الشفاه. متوفر بدرجات متعددة.",
    price: 69,
    oldPrice: 89,
    image: "/images/prod-lipstick.jpg",
    images: ["/images/prod-lipstick.jpg", "/images/prod-lipgloss.jpg"],
    categorySlug: "lips",
    rating: 4.8,
    reviewCount: 245,
    stock: 120,
    brand: "أريسا",
    shades: ["أحمر كلاسيكي", "وردي عاري", "نود بيج", "أحمر فونت", "بنفسجي داكن"],
    isFeatured: true,
    isBestseller: true,
    isChoice: true,
    prime: true,
    ingredients: "زبدة الشيا، زيت جوز الهند، شمع كرنوبا، فيتامين E، أصباغ طبيعية.",
    weight: "3.5 جم",
    origin: "فرنسا",
  },
  {
    name: "جلوس الشفاه اللامع - لمعان زجاجي",
    description:
      "جلوس شفاه بتركيبة لامعة غير لزجة تمنح شفاهكِ مظهراً ممتلئاً ولامعاً. خفيف الوزن ومريح على الشفاه، يحتوي على حمض الهيالورونيك للترطيب. يمكن استخدامه بمفرده أو فوق أحمر الشفاه.",
    price: 55,
    image: "/images/prod-lipgloss.jpg",
    images: ["/images/prod-lipgloss.jpg", "/images/prod-lipstick.jpg"],
    categorySlug: "lips",
    rating: 4.6,
    reviewCount: 178,
    stock: 84,
    brand: "أريسا",
    shades: ["شفاف لامع", "وردي لؤلؤي", "خوخي", "أحمر خفيف"],
    isNew: true,
    prime: true,
    ingredients: "زبدة الشيا، زيت الجوجوبا، حمض الهيالورونيك، خلاصة الفيتامين E.",
    weight: "6 مل",
    origin: "كوريا الجنوبية",
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
    brand: "أريسا",
    shades: ["أحمر", "وردي", "نود", "بني"],
    prime: true,
    ingredients: "شمع كانديليرا، زبدة الكاكاو، فيتامين E، أصباغ.",
    weight: "1.2 جم",
    origin: "ألمانيا",
  },
  {
    name: "تينت الشفاه طويل الأمد - لون طبيعي",
    description:
      "تينت شفاه سائل يمنح لوناً طبيعياً يدوم حتى 8 ساعات. خفيف جداً وغير لزج، مثالي للإطلالة اليومية الطبيعية. يتفاعل مع درجة حموضة الشفاه لإظهار لون مخصص لكِ.",
    price: 48,
    image: "/images/prod-lipgloss.jpg",
    images: ["/images/prod-lipgloss.jpg", "/images/prod-lipstick.jpg"],
    categorySlug: "lips",
    rating: 4.4,
    reviewCount: 96,
    stock: 58,
    brand: "أريسا",
    shades: ["وردي طبيعي", "خوخي", "توتي", "مرجاني"],
    isNew: true,
    prime: true,
    ingredients: "ماء، غليسرين، خلاصة الفراولة، حمض الهيالورونيك، أصباغ طبيعية.",
    weight: "4 مل",
    origin: "كوريا الجنوبية",
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
    brand: "أريسا",
    prime: true,
    ingredients: "زبدة الكاكاو، زبدة الشيا، زيت اللوز، شمع النحل، فيتامين E، نكهة فراولة.",
    weight: "4 جم",
    origin: "الإمارات",
  },
  // ===== Hair =====
  {
    name: "سيروم نمو الشعر بزيت الأرغان والبيوتين",
    description:
      "سيروم مركّز يغذي فروة الرأس ويحفز نمو الشعر ويقلل التساقط. يحتوي على زيت الأرغان المغربي والبيوتين والكافيين. يعزز كثافة الشعر ويمنحه قوة ولمعاناً. مناسب لجميع أنواع الشعر.",
    price: 135,
    oldPrice: 175,
    image: "/images/prod-hairserum.jpg",
    images: ["/images/prod-hairserum.jpg", "/images/prod-hairmask.jpg"],
    categorySlug: "hair",
    rating: 4.8,
    reviewCount: 234,
    stock: 62,
    brand: "أريسا لوكس",
    isFeatured: true,
    isBestseller: true,
    isChoice: true,
    prime: true,
    ingredients:
      "زيت الأرغان المغربي، بيوتين، كافيين، زيت إكليل الجبل، نياسيناميد، ببتيدات، فيتامين E.",
    weight: "60 مل",
    origin: "المغرب",
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
    brand: "أريسا",
    prime: true,
    ingredients: "ماء، خلاصة الصبار، زيت الأرغان، بروتين القمح، بانثينول، فيتامين B5.",
    weight: "300 مل",
    origin: "فرنسا",
  },
  {
    name: "ماسك الشعر المغذي - ترميم عميق",
    description:
      "ماسك شعر غني بالكيراتين وزبدة الشيا لترميم الشعر التالف بعمق. يرطب ويغذي ويمنح الشعر نعومة ولمعاناً فائقاً. يستخدم مرة أو مرتين أسبوعياً للحصول على شعر صحي وقوي.",
    price: 95,
    oldPrice: 120,
    image: "/images/prod-hairmask.jpg",
    images: ["/images/prod-hairmask.jpg", "/images/prod-hairserum.jpg"],
    categorySlug: "hair",
    rating: 4.7,
    reviewCount: 189,
    stock: 71,
    brand: "أريسا لوكس",
    isBestseller: true,
    prime: true,
    ingredients: "كيراتين، زبدة الشيا، زيت جوز الهند، زيت الأرغان، بانثينول، فيتامين E.",
    weight: "250 مل",
    origin: "المغرب",
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
    brand: "أريسا لوكس",
    isFeatured: true,
    isNew: true,
    isChoice: true,
    prime: true,
    ingredients: "100% زيت أرغان مغربي عضوي معصور على البارد.",
    weight: "100 مل",
    origin: "المغرب",
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
    brand: "أريسا",
    prime: true,
    ingredients: "ماء، زبدة الشيا، زيت الجوجوبا، بانثينول، خلاصة الورد، فيتامين B5.",
    weight: "300 مل",
    origin: "فرنسا",
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
    brand: "أريسا",
    shades: ["أحمر كلاسيكي", "وردي فاتح", "نود بيج", "أسود", "فرنسي أبيض", "ميتاليك ذهبي"],
    isFeatured: true,
    isBestseller: true,
    prime: true,
    ingredients: "راتنجات أكريليك، أصباغ معدنية، خالٍ من الفورمالديهايد والتولوين.",
    weight: "12 مل",
    origin: "كوريا الجنوبية",
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
    brand: "أريسا لوكس",
    prime: true,
    ingredients: "ستانلس مقاوم للصدأ، مقابض بلاستيك ABS.",
    weight: "طقم 12 قطعة",
    origin: "باكستان",
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
    brand: "أريسا",
    isNew: true,
    prime: true,
    ingredients: "إيثيل أسيتات، زيت الجوجوبا، زيت اللوز، فيتامين E، خلاصة اللافندر.",
    weight: "100 مل",
    origin: "الإمارات",
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
    brand: "أريسا",
    prime: true,
    ingredients: "راتنج ABS، غراء لاصق طبي.",
    weight: "24 قطعة",
    origin: "الصين",
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
    brand: "أريسا لوكس",
    isFeatured: true,
    isBestseller: true,
    isChoice: true,
    prime: true,
    ingredients:
      "روائح عطرية: الورد البلغاري، الياسمين، العود الكمبودي، المسك الأبيض، العنبر، خشب الصندل.",
    weight: "100 مل",
    origin: "فرنسا",
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
    brand: "أريسا لوكس",
    isBestseller: true,
    prime: true,
    ingredients: "المسك الأبيض، اللوز، العنبر، الفانيليا، خشب الصندل، الياسمين.",
    weight: "90 مل",
    origin: "الإمارات",
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
    brand: "أريسا لوكس",
    isNew: true,
    prime: true,
    ingredients: "الياسمين الصنفوري، الزهر البرتقالي، فانيليا البوربون، العنبر، المسك.",
    weight: "100 مل",
    origin: "فرنسا",
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
    brand: "أريسا لوكس",
    isFeatured: true,
    isChoice: true,
    prime: true,
    ingredients: "العود الكمبودي، خشب الصندل، الورد التائفي، المسك، العنبر، الزعفران.",
    weight: "75 مل",
    origin: "الإمارات",
  },
  // ===== Skincare =====
  {
    name: "سيروم فيتامين C المركز - 20%",
    description:
      "سيروم بفيتامين C بتركيز 20% يوحّد لون البشرة ويفتح البقع الداكنة ويعزز إنتاج الكولاجين. يحتوي على حمض الفيروليك وفيتامين E لفعالية مضاعفة. يمنح البشرة إشراقة فورية ويقلل علامات التقدم في العمر.",
    price: 145,
    oldPrice: 195,
    image: "/images/prod-serum.jpg",
    images: ["/images/prod-serum.jpg", "/images/prod-moisturizer.jpg"],
    categorySlug: "skincare",
    rating: 4.8,
    reviewCount: 267,
    stock: 58,
    brand: "أريسا لوكس",
    isFeatured: true,
    isBestseller: true,
    isChoice: true,
    prime: true,
    ingredients:
      "ماء، فيتامين C (L-أسكوربيك أسيد 20%)، حمض الفيروليك، فيتامين E، حمض الهيالورونيك، غليسرين.",
    weight: "30 مل",
    origin: "كوريا الجنوبية",
  },
  {
    name: "كريم الترطيب اليومي مع حمض الهيالورونيك",
    description:
      "كريم ترطيب يومي خفيف بتركيبة حمض الهيالورونيك والسيراميد يرطب البشرة بعمق ويحافظ على رطوبتها لمدة 48 ساعة. غير دهني وسريع الامتصاص، مناسب لجميع أنواع البشرة. يحقق نضارة وإشراقاً.",
    price: 110,
    image: "/images/prod-moisturizer.jpg",
    images: ["/images/prod-moisturizer.jpg", "/images/prod-serum.jpg"],
    categorySlug: "skincare",
    rating: 4.7,
    reviewCount: 189,
    stock: 76,
    brand: "أريسا لوكس",
    isBestseller: true,
    prime: true,
    ingredients: "ماء، حمض الهيالورونيك، سيراميد، غليسرين، نياسيناميد، زبدة الشيا، فيتامين E.",
    weight: "50 مل",
    origin: "كوريا الجنوبية",
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
    brand: "أريسا",
    prime: true,
    ingredients: "ماء، خلاصة الشاي الأخضر، خلاصة الصبار، غليسرين، حمض الأمينو، بانثينول.",
    weight: "150 مل",
    origin: "اليابان",
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
    brand: "أريسا",
    isNew: true,
    prime: true,
    ingredients: "طين كاولين، طين بنتونيت، خلاصة الشاي الأخضر، زيت شجرة الشاي، حمض الساليسيليك.",
    weight: "100 مل",
    origin: "المغرب",
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
    brand: "أريسا لوكس",
    isFeatured: true,
    isNew: true,
    isChoice: true,
    prime: true,
    ingredients:
      "ثاني أكسيد التيتانيوم، أكسيد الزنك، نياسيناميد، حمض الهيالورونيك، خلاصة الشاي الأخضر.",
    weight: "50 مل",
    origin: "كوريا الجنوبية",
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
    brand: "أريسا",
    prime: true,
    ingredients: "ماء الورد الطبيعي، غليسرين، حمض الهيالورونيك، خلاصة البابونج، فيتامين B5.",
    weight: "200 مل",
    origin: "المغرب",
  },
];

// ===== Reviews generation =====

const REVIEW_AUTHORS = [
  "سارة العتيبي",
  "نورة المالكي",
  "ريم الشمري",
  "أمل القحطاني",
  "فاطمة الزهراني",
  "هند الدوسري",
  "لمى العنزي",
  "جود الحربي",
  "مها الغامدي",
  "روان السبيعي",
  "دانة المطيري",
  "شهد القرني",
];

const REVIEW_TEMPLATES: Array<{
  rating: number;
  title: string;
  body: string;
}> = [
  {
    rating: 5,
    title: "منتج رائع ويفوق التوقعات!",
    body: "استخدمته منذ أسبوعين والنتيجة مذهلة. الجودة ممتازة والتغليف فاخر. أنصح به بشدة لكل من تبحث عن نتيجة حقيقية. سأعيد الطلب بالتأكيد.",
  },
  {
    rating: 5,
    title: "أفضل منتج جربته في هذه الفئة",
    body: "جربت منتجات كثيرة لكن هذا отличается. الملمس خفيف، يمتص بسرعة، وترك إحساساً رائعاً. التوصيل كان سريعاً والتغليف أنيق جداً. شكراً أريسا.",
  },
  {
    rating: 5,
    title: "نتيجة مذهلة من أول استخدام",
    body: "لم أتوقع نتيجة بهذه السرعة! المنتج خفيف وغير دهني وترك بشرتي نضرة ومشرقة. الرائحة لطيفة جداً. أصبح من أساسيات روتيني اليومي.",
  },
  {
    rating: 4,
    title: "منتج جيد لكن السعر مرتفع قليلاً",
    body: "الجودة ممتازة والنتيجة مرضية لكن السعر يعتبر مرتفع مقارنة بمنتجات مشابهة. ومع ذلك الجودة تبرر السعر. أنصح به لمن تبحث عن منتج أصلي وفعّال.",
  },
  {
    rating: 5,
    title: "اختيار أريسا يستحق التجربة",
    body: "كنت مترددة في البداية لكن المنتج فاجأني. التركيبة غنية والمفعول واضح. التغليف أنيق ووصل بحالة ممتازة. تجربة تسوق مريحة من البداية للنهاية.",
  },
  {
    rating: 4,
    title: "جودة عالية وأثر واضح",
    body: "المنتج فعّال وأحسست بالفرق خلال أيام. الملمس لطيف والرائحة راقية. الوحيد أن العبوة كانت أصغر قليلاً مما توقعت لكنها كافية للاستخدام المنتظم.",
  },
  {
    rating: 5,
    title: "أصبح المفضل لدي!",
    body: "منتج لا أستغني عنه الآن. لاحظت فرقاً واضحاً من أول أسبوع. التركيبة لطيفة على البشرة ولم تسبب أي حساسية. أنصح به كل صديقاتي.",
  },
  {
    rating: 3,
    title: "جيد لكن يحتاج وقت لنرى النتيجة",
    body: "المنتج جيد عموماً لكن النتيجة لم تكن فورية كما توقعت. بعد شهر من الاستخدام المنتظم بدأت ألاحظ تحسناً تدريجياً. السعر معقول والجودة مقبولة.",
  },
  {
    rating: 5,
    title: "تجربة رائعة وخدمة ممتازة",
    body: "المنتج وصل بسرعة وكان مغلفاً بعناية. الجودة ممتازة والنتيجة فاقت توقعاتي. خدمة العملاء كانت متجاوبة عند استفساري. شكراً على الاحترافية.",
  },
  {
    rating: 4,
    title: "منتج فعّال وأنصح به",
    body: "أعجبني كثيراً. الملمس ناعم، الرائحة هادئة، والنتيجة جيدة. فقط أتمنى لو كانت هناك عبوة أكبر بسعر أفضل. عموماً تجربة مرضية وأنصح بالتجربة.",
  },
];

const REVIEW_DAYS = [2, 5, 8, 12, 16, 20, 25, 32, 40, 50, 65, 80, 95, 110, 130, 160];

export function generateReviews(productIndex: number, count: number): SeedReview[] {
  // Deterministic pseudo-random based on product index so seed is reproducible
  const reviews: SeedReview[] = [];
  let seed = productIndex * 17 + 3;
  const rand = () => {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };
  for (let i = 0; i < count; i++) {
    const tpl = REVIEW_TEMPLATES[Math.floor(rand() * REVIEW_TEMPLATES.length)];
    const author = REVIEW_AUTHORS[Math.floor(rand() * REVIEW_AUTHORS.length)];
    const daysAgo = REVIEW_DAYS[Math.floor(rand() * REVIEW_DAYS.length)];
    const helpful = Math.floor(rand() * 35);
    const verified = rand() > 0.1;
    reviews.push({
      author,
      rating: tpl.rating,
      title: tpl.title,
      body: tpl.body,
      helpful,
      verified,
      daysAgo,
    });
  }
  // Sort newest first (smaller daysAgo first)
  return reviews.sort((a, b) => a.daysAgo - b.daysAgo);
}

// Number of reviews per product (varies between 3-8)
export function reviewCountForProduct(productIndex: number): number {
  return 3 + (productIndex % 6); // 3..8
}

// ===== Beauty services (Task ID: 10) =====

export type SeedServiceCategory = {
  slug: string;
  name: string;
  nameEn: string;
  description: string;
  icon: string;
};

export type SeedService = {
  name: string;
  description: string;
  price: number;
  oldPrice?: number;
  duration: number; // in minutes
  image: string;
  category: string; // slug
  icon: string;
  rating: number;
  reviewCount: number;
  isFeatured?: boolean;
  isPopular?: boolean;
  whatIncluded: string[];
};

export const serviceCategories: SeedServiceCategory[] = [
  {
    slug: "bridal",
    name: "تجهيز العرايس",
    nameEn: "Bridal",
    description: "باقات تجهيز العروس الكاملة من المكياج والتسريحة والعناية لإطلالة العمر.",
    icon: "Crown",
  },
  {
    slug: "lips",
    name: "خدمات الشفاة",
    nameEn: "Lips",
    description: "تكبير وترطيب الشفاة بحمض الهيالورونيك والبوتوكس لشفايف ممتلئة ونضرة.",
    icon: "Heart",
  },
  {
    slug: "skincare",
    name: "العناية بالبشرة",
    nameEn: "Skincare",
    description: "جلسات تنظيف عميق، فيشيز ذهبي، وميكروبليدنغ لبشرة نضرة ومشرقة.",
    icon: "Sparkles",
  },
  {
    slug: "makeup",
    name: "المكياج الاحترافي",
    nameEn: "Makeup",
    description: "مكياج سهرة ويومي باحترافية عالية ومنتجات فاخرة يثبت طوال اليوم.",
    icon: "Brush",
  },
  {
    slug: "hair",
    name: "خدمات الشعر",
    nameEn: "Hair",
    description: "فرد برازيلي، صبغات عصرية، وعلاجات بالكيراتين لشعر صحي ولامع.",
    icon: "Wind",
  },
  {
    slug: "nails",
    name: "خدمات الأظافر",
    nameEn: "Nails",
    description: "مانكير وبادكير بأحدث الصيحات وتركيب أكريليك باحترافية.",
    icon: "Hand",
  },
  {
    slug: "laser",
    name: "إزالة الشعر",
    nameEn: "Laser",
    description: "جلسات ليزر متعددة الموجات لإزالة دائمة للشعر غير المرغوب بأمان تام.",
    icon: "Zap",
  },
  {
    slug: "spa",
    name: "سبا ومساج",
    nameEn: "Spa",
    description: "حمام مغربي تقليدي، مساج استرخاء، وطقوس عناية لاستعادة التوازن والنضارة.",
    icon: "Flower2",
  },
];

export const services: SeedService[] = [
  // ===== Bridal =====
  {
    name: "تجهيز العروس الكامل",
    description:
      "باقة العروس الشاملة لليوم الأجمل في حياتك. تشمل مكياج العروس، تسريحة عروس أنيقة، مناكير وبادكير، تنظيف بشرة عميق، ولمسات نهائية تدوم طوال اليوم. نوفّر لكِ حصة تجريبية قبل الزفاف بيومين لضمان إطلالة مثالية بدون توتر. فريقنا من خبيرات التجميل يعملن بأحدث المنتجات الفاخرة ليوم لا يُنسى.",
    price: 2500,
    oldPrice: 3000,
    duration: 240,
    image: "/images/cat-makeup.jpg",
    category: "bridal",
    icon: "Crown",
    rating: 5.0,
    reviewCount: 168,
    isFeatured: true,
    isPopular: true,
    whatIncluded: [
      "مكياج عروس احترافي يثبت طوال اليوم",
      "تسريحة عروس أنيقة تناسب فستانك",
      "مناكير وبادكير كامل",
      "تنظيف بشرة عميق قبل المكياج",
      "حصة تجريبية قبل الزفاف بيومين",
    ],
  },
  {
    name: "مكياج العروس",
    description:
      "مكياج عروس احترافي يثبت طوال اليوم بمنتجات فاخرة ولمسات لامعة تليق بإطلالتك الكبرى. نستخدم تكنيك متطور لإخفاء العيوب وإبراز ملامحك بطريقة طبيعية وفاخرة تدوم من الفجر حتى آخر الضيوف.",
    price: 600,
    duration: 90,
    image: "/images/cat-makeup.jpg",
    category: "bridal",
    icon: "Brush",
    rating: 4.9,
    reviewCount: 124,
    isPopular: true,
    whatIncluded: [
      "مكياج كامل بمنتجات فاخرة",
      "تركيبة ثابتة تدوم 12 ساعة",
      "لمسات لامعة لإطلالة العروس",
      "إصلاح العيوب وتوحيد اللون",
    ],
  },
  {
    name: "تسريحة العروس",
    description:
      "تسريحة عروس أنيقة تتناسب مع فستانك وإطلالتك العامة. نختار لكِ التسريحة المثالية سواء كانت رفعات ناعمة أو تسريحة منسدلة مع إكسسوارات تزيينية راقية تكمل إطلالة يوم العمر.",
    price: 500,
    duration: 75,
    image: "/images/cat-hair.jpg",
    category: "bridal",
    icon: "Wind",
    rating: 4.8,
    reviewCount: 87,
    whatIncluded: [
      "تشخيص نوع الشعر واختيار التسريحة",
      "تسريحة ثابتة طوال اليوم",
      "إضافة إكسسوارات الزينة",
      "لمسات نهائية لامعة",
    ],
  },
  // ===== Lips =====
  {
    name: "تكبير الشفاة بحمض الهيالورونيك",
    description:
      "حقن حمض الهيالورونيك الآمن لتكبير الشفايف وإعطائها مظهراً ممتلئاً وطبيعياً. يتم الإجراء بأيدي طبيبات مختصات باستخدام مواد معتمدة من هيئة الغذاء والدواء، مع اهتمام كامل بالتعقيم والنتائج الطبيعية المتوازنة مع ملامح وجهك.",
    price: 800,
    oldPrice: 950,
    duration: 45,
    image: "/images/cat-lips.jpg",
    category: "lips",
    icon: "Heart",
    rating: 4.9,
    reviewCount: 142,
    isFeatured: true,
    isPopular: true,
    whatIncluded: [
      "استشارة طبية وتشخيص الشفايف",
      "تخدير موضعي لراحة تامة",
      "حقن حمض الهيالورونيك المعتمد",
      "تدليك وتشكيل لنتيجة طبيعية",
      "متابعة بعد الجلسة",
    ],
  },
  {
    name: "بوتوكس الشفايف",
    description:
      "بوتوكس لتعديل شكل الشفايف وتقليل التشققات وخطوط الابتسامة. يعطي الشفايف مظهراً ناعماً ومتناسقاً مع ملامح الوجه، مع نتائج تدوم لعدة أشهر دون الحاجة لتكبير كبير.",
    price: 500,
    duration: 30,
    image: "/images/cat-lips.jpg",
    category: "lips",
    icon: "Heart",
    rating: 4.7,
    reviewCount: 64,
    whatIncluded: [
      "استشارة لتقييم الحالة",
      "حقن بوتوكس آمن وفعّال",
      "تقليل التشققات وخطوط الابتسامة",
      "مظهر طبيعي متناسق",
    ],
  },
  {
    name: "ترطيب الشفايف اللامع",
    description:
      "حقن ترطيب عميقة لشفايف لامعة ونضرة. تركيبة غنية بحمض الهيالورونيك والفيتامينات تعيد للشفايف حيويتها وتمنحها لمعة طبيعية دون تغيير حجمها. مثالية لشفايف جافة أو متشققة.",
    price: 350,
    duration: 30,
    image: "/images/cat-lips.jpg",
    category: "lips",
    icon: "Droplet",
    rating: 4.6,
    reviewCount: 48,
    whatIncluded: [
      "تنظيف وتحضير الشفايف",
      "حقن ترطيب بالفيتامينات",
      "تدليك لتوزيع الترطيب",
      "نضارة ولمعة فورية",
    ],
  },
  // ===== Skincare =====
  {
    name: "تنظيف البشرة العميق",
    description:
      "تنظيف عميق للمسام، تقشير خفيف، ماسك مغذٍ، وترطيب لبشرة نضرة ومشرقة. يناسب جميع أنواع البشرة ويزيل الرؤوس السوداء والشوائب ليمنحك إحساساً بالانتعاش والنضارة الفورية.",
    price: 350,
    oldPrice: 420,
    duration: 60,
    image: "/images/cat-skincare.jpg",
    category: "skincare",
    icon: "Sparkles",
    rating: 4.8,
    reviewCount: 132,
    isPopular: true,
    whatIncluded: [
      "تنظيف عميق للمسام",
      "تقشير خفيف بإزالة الخلايا الميتة",
      "ماسك مغذٍ مخصص لنوع بشرتك",
      "ترطيب ومرطب نهائي بحماية",
    ],
  },
  {
    name: "فيشيز ذهبي 24 قيراط",
    description:
      "جلسة فيشيز بالذهب 24 قيراط لنضارة وإشراقة فورية. الذهب ينشط الخلايا ويحفز الكولاجين، فيمنح بشرتكِ مظهراً متجدداً ومشدوداً وإشراقة ملكية لا تُقاوم. مثالية قبل المناسبات.",
    price: 450,
    duration: 75,
    image: "/images/cat-skincare.jpg",
    category: "skincare",
    icon: "Crown",
    rating: 4.9,
    reviewCount: 96,
    isFeatured: true,
    whatIncluded: [
      "تنظيف وتحضير البشرة",
      "ماسك ذهبي 24 قيراط",
      "تدليك تنشيطي للخلايا",
      "سيروم مضاد للأكسدة",
      "ترطيب وإشراقة نهائية",
    ],
  },
  {
    name: "ميكروبليدنغ الحواجب",
    description:
      "رسم شعرة الشعرة لحواجب طبيعية المظهر تدوم سنة كاملة. تقنية متطورة تمنحك حواجب كثيفة ومتناسقة تناسب ملامح وجهك دون الحاجة لرسمها يومياً. معلمّة معتمدة ونتائج طبيعية تماماً.",
    price: 700,
    duration: 90,
    image: "/images/cat-makeup.jpg",
    category: "skincare",
    icon: "Brush",
    rating: 4.7,
    reviewCount: 58,
    whatIncluded: [
      "تصميم شكل الحاجب المناسب لملامحك",
      "تخدير موضعي",
      "رسم شعرة الشعرة بصبغة آمنة",
      "تعليمات العناية بعد الجلسة",
    ],
  },
  // ===== Makeup =====
  {
    name: "مكياج السهرات",
    description:
      "مكياج سهرة فاخر مناسب للمناسبات والحفلات. تركيبة دراماتيكية أنيقة بإطلالة جريئة أو ناعمة حسب رغبتك، بمنتجات فاخرة تثبت طوال السهرة وتبدو رائعة في الصور.",
    price: 300,
    duration: 60,
    image: "/images/cat-makeup.jpg",
    category: "makeup",
    icon: "Brush",
    rating: 4.8,
    reviewCount: 110,
    isPopular: true,
    whatIncluded: [
      "تشخيص الإطلالة المطلوبة",
      "تجهيز البشرة قبل المكياج",
      "مكياج سهرة فاخر",
      "تركيبة ثابتة للمساء",
    ],
  },
  {
    name: "مكياج ناعم للنهار",
    description:
      "مكياج يومي ناعم يعزز جمالك الطبيعي. مناسب للعمل والمناسبات النهارية، يوحد لون البشرة ويبرز ملامحك بأناقة هادئة دون مظهر صناعي. يثبت طوال اليوم بمظهر طبيعي.",
    price: 200,
    duration: 45,
    image: "/images/cat-makeup.jpg",
    category: "makeup",
    icon: "Sparkles",
    rating: 4.7,
    reviewCount: 72,
    whatIncluded: [
      "تجهيز البشرة بالترطيب",
      "كريم أساس خفيف التغطية",
      "إبراز العينين بطريقة ناعمة",
      "لمسة شفاه طبيعية",
    ],
  },
  // ===== Hair =====
  {
    name: "فرد الشعر البرازيلي",
    description:
      "فرد برازيلي بالكيراتين لشعر ناعم ولامع بدون أضرار. يعالج الشعر التالف ويمنحه مظهراً صحياً وفائقاً يثبت لعدة أشهر. مناسب لجميع أنواع الشعر ويقلل التجعد بشكل كبير.",
    price: 1200,
    oldPrice: 1500,
    duration: 180,
    image: "/images/cat-hair.jpg",
    category: "hair",
    icon: "Wind",
    rating: 4.9,
    reviewCount: 154,
    isFeatured: true,
    whatIncluded: [
      "تشخيص نوع الشعر وحالته",
      "غسول تحضيري عميق",
      "علاج بالكيراتين البرازيلي",
      "سشوار وفرد بالحرارة",
      "ماسةك ترطيب نهائي",
    ],
  },
  {
    name: "صبغة الشعر",
    description:
      "صبغة شعر احترافية بألوان عصرية ومنتجات آمنة تخفف الضرر. نختار لكِ الدرجة المثالية التي تتناسب مع لون بشرتك وملامحك، مع عناية تامة بفروة الرأس ولمسة لامعة نهائية.",
    price: 400,
    duration: 120,
    image: "/images/cat-hair.jpg",
    category: "hair",
    icon: "Palette",
    rating: 4.6,
    reviewCount: 88,
    whatIncluded: [
      "استشارة لاختيار الدرجة",
      "صبغة بمنتجات آمنة على الشعر",
      "علاج وقائي بعد الصبغة",
      "تصفيف نهائي ولمسة لامعة",
    ],
  },
  // ===== Nails =====
  {
    name: "مانكير وبادكير كلاسيك",
    description:
      "عناية كاملة بالأظافر مع طلاء جل يدوم أسبوعين. يشمل تقليم الأظافر، علاج الجلدة، تلميع، ترطيب اليدين والقدمين، وطلاء جل احترافي بأي لون تختارينه من تشكيلتنا الفاخرة.",
    price: 200,
    duration: 60,
    image: "/images/cat-nails.jpg",
    category: "nails",
    icon: "Hand",
    rating: 4.8,
    reviewCount: 117,
    isPopular: true,
    whatIncluded: [
      "تقليم وتشكيل الأظافر",
      "علاج الجلدة وترطيب اليدين",
      "تلميع وتحضير الظفر",
      "طلاء جل احترافي يدوم أسبوعين",
    ],
  },
  {
    name: "تركيب أظافر أكريليك",
    description:
      "تركيب أظافر أكريليك بأشكال وألوان متنوعة. نقدم لكِ تشكيلة واسعة من التصاميم العصرية والكلاسيكية، بتركيز على المتانة والمظهر الطبيعي. مثالية لمن تبحث عن أظافر طويلة وقوية.",
    price: 300,
    duration: 90,
    image: "/images/cat-nails.jpg",
    category: "nails",
    icon: "Hand",
    rating: 4.7,
    reviewCount: 73,
    whatIncluded: [
      "تحضير الأظافر الطبيعية",
      "تركيب أكريليك باحترافية",
      "تشكيل وتصميم حسب رغبتك",
      "طلاء وتلميع نهائي",
    ],
  },
  // ===== Laser =====
  {
    name: "إزالة الشعر بالليزر",
    description:
      "جلسة ليزر متعددة الموجات لإزالة دائمة للشعر غير المرغوب. تقنية متطورة تناسب جميع أنواع البشرة بأمان تام، مع تبريد فوري لتقليل الانزعاج. جلستنا الواحدة تمنحك نعومة فورية تستمر أسابيع.",
    price: 600,
    oldPrice: 750,
    duration: 60,
    image: "/images/cat-skincare.jpg",
    category: "laser",
    icon: "Zap",
    rating: 4.8,
    reviewCount: 134,
    isFeatured: true,
    whatIncluded: [
      "استشارة وتحديد نوع البشرة",
      "تخدير موضعي عند الحاجة",
      "جلسة ليزر بتقنية متعددة الموجات",
      "تبريد فوري لراحة تامة",
      "ماسةك مهدئ بعد الجلسة",
    ],
  },
  // ===== Spa =====
  {
    name: "حمام مغربي كامل",
    description:
      "حمام مغربي تقليدي مع تقشير بالكيس وغسل بالصابون البلدي. طقوس استرخاء كاملة تنقي البشرة من الخلايا الميتة وتمنحها نعومة وإشراقة فورية. تجربة علاجية أصيلة لاستعادة النضارة والحيوية.",
    price: 250,
    duration: 90,
    image: "/images/cat-skincare.jpg",
    category: "spa",
    icon: "Flower2",
    rating: 4.9,
    reviewCount: 102,
    whatIncluded: [
      "جلوس بخار لفتح المسام",
      "صابون بلدي تقليدي",
      "تقشير بالكيس المغربي",
      "غسل وترطيب بالزيوت الطبيعية",
      "شاي مغربي واسترخاء",
    ],
  },
  {
    name: "مساج استرخاء",
    description:
      "جلسة مساج سويدي للاسترخاء وتخفيف التوتر. تقنيات متخصصة لتحرير العضلات المشدودة وتنشيط الدورة الدموية، مع زيوت عطرية فاخرة تمنحك تجربة استرخاء كاملة للجسد والروح.",
    price: 400,
    duration: 60,
    image: "/images/cat-skincare.jpg",
    category: "spa",
    icon: "Heart",
    rating: 4.8,
    reviewCount: 91,
    whatIncluded: [
      "اختيار الزيوت العطرية المفضلة",
      "مساج سويدي لكامل الجسم",
      "تدفئة العضلات وتنشيط الدورة",
      "شاي أعشاب للاسترخاء",
    ],
  },
];
