/**
 * seed.ts — سكريبت تهيئة البيانات الأولية (مستقل تماماً)
 *
 * لا يستورد من src/ لتجنب مشاكل ESM على Vercel.
 * البيانات مدمجة هنا مباشرة.
 *
 * يُشغّل تلقائياً أثناء البناء عبر scripts/auto-db.mjs
 * أو يدوياً: bun run db:seed
 */
import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

// ===== بيانات الفئات =====
const categories = [
  { slug: "makeup", name: "مكياج", nameEn: "Makeup", description: "كريمات الأساس، ظلال العيون، الماسكارا وأدوات المكياج الفاخرة لإطلالة ساحرة.", image: "/images/cat-makeup.jpg", icon: "Sparkles" },
  { slug: "lips", name: "شفاه", nameEn: "Lips", description: "أحمر شفاه، جلوس، وأقلام تحديد لشفاه ممتلئة وجذابة طوال اليوم.", image: "/images/cat-lips.jpg", icon: "Heart" },
  { slug: "hair", name: "شعر", nameEn: "Hair", description: "سيرومات، شامبو، ماسكات وزيوت لعناية متكاملة بشعر صحي ولامع.", image: "/images/cat-hair.jpg", icon: "Wind" },
  { slug: "nails", name: "أظافر", nameEn: "Nails", description: "طلاءات أظافر جل طويلة الأمد، طقم العناية، ومستحضرات التركيب.", image: "/images/cat-nails.jpg", icon: "Hand" },
  { slug: "perfume", name: "عطور", nameEn: "Perfume", description: "عطور شرقية وفرنسية فاخرة بروائح الورد والمسك والعود تدوم طويلاً.", image: "/images/cat-perfume.jpg", icon: "Flower2" },
  { slug: "skincare", name: "عناية بالبشرة", nameEn: "Skincare", description: "سيرومات، كريمات ترطيب، غسول وواقي شمس لبشرة نضرة ومشرقة.", image: "/images/cat-skincare.jpg", icon: "Droplet" },
];

// ===== بيانات المنتجات =====
const products = [
  { name: "كريم أساس فاخر - تغطية كاملة", description: "كريم أساس بتغطية كاملة وملمس حريري يوحد لون البشرة ويخفي العيوب. يدوم ٢٤ ساعة مع مكونات مرطبة. مناسب لجميع أنواع البشرة. خالٍ من البارابين والزيوت المعدنية.", price: 145, oldPrice: 195, image: "/images/prod-foundation.jpg", images: ["/images/prod-foundation.jpg"], categorySlug: "makeup", rating: 4.7, reviewCount: 234, stock: 45, brand: "أريسا لوكس", shades: null, isFeatured: true, isBestseller: true, isNew: false, isChoice: true, prime: true, ingredients: "ماء، غليسرين، حمض الهيالورونيك، خلاصة الشاي الأخضر، فيتامين E، أكسيد الزنك.", weight: "30 مل", origin: "كوريا الجنوبية" },
  { name: "باليت ظلال العيون الذهبية - ١٢ لون", description: "باليت ظلال عيون فاخر بـ ١٢ درجة عصرية بين المطفأ واللامع. أصباغ غنية تثبت طوال اليوم بدون تطاير. تركيبة قابلة للمزج سهلة التطبيق. مثالية للنهار والسهرات.", price: 185, oldPrice: null, image: "/images/prod-eyeshadow.jpg", images: ["/images/prod-eyeshadow.jpg"], categorySlug: "makeup", rating: 4.8, reviewCount: 156, stock: 38, brand: "أريسا لوكس", shades: null, isFeatured: true, isBestseller: false, isNew: true, isChoice: false, prime: true, ingredients: "تالك، ميكا، سيليكا، خلاصة الورد، فيتامين E، أصباغ معدنية طبيعية.", weight: "8 جم", origin: "كوريا الجنوبية" },
  { name: "ماسكارا الحجم الفائق - مقاومة للماء", description: "ماسكارا تمنح رموشكِ حجماً وطولاً مضاعفاً بلمسة واحدة. تركيبة مقاومة للماء والعرق تدوم ٢٤ ساعة. فرشاة مبتكرة تصل لكل رمشة. سهلة الإزالة بالماء الدافئ.", price: 89, oldPrice: 115, image: "/images/prod-mascara.jpg", images: ["/images/prod-mascara.jpg"], categorySlug: "makeup", rating: 4.6, reviewCount: 298, stock: 67, brand: "أريسا", shades: null, isFeatured: false, isBestseller: true, isNew: false, isChoice: false, prime: true, ingredients: "شمع العسل، شمع الكرنوبا، خلاصة الصبار، فيتامين E، أصباغ سوداء.", weight: "10 مل", origin: "اليابان" },
  { name: "أحمر شفاه ماط فاخر - ثبات ١٢ ساعة", description: "أحمر شفاه بتركيبة ماط مخملي يمنح لوناً مكثفاً بلمسة واحدة. ثبات يصل إلى ١٢ ساعة دون جفاف أو تشقق. غني بزبدة الشيا وزيت جوز الهند لترطيب الشفاه. متوفر بدرجات متعددة.", price: 69, oldPrice: 89, image: "/images/prod-lipstick.jpg", images: ["/images/prod-lipstick.jpg"], categorySlug: "lips", rating: 4.8, reviewCount: 245, stock: 89, brand: "أريسا", shades: JSON.stringify(["أحمر كلاسيكي", "وردي", "نود", "خمري", "برتقالي"]), isFeatured: true, isBestseller: true, isNew: false, isChoice: true, prime: true, ingredients: "زبدة الشيا، زيت جوز الهند، شمع العسل، فيتامين E، أصباغ معدنية.", weight: "3.5 جم", origin: "فرنسا" },
  { name: "جلوس الشفاه اللامع - لمعان زجاجي", description: "جلوس شفاه بتركيبة لامعة غير لزجة تمنح شفاهكِ مظهراً ممتلئاً ولامعاً. خفيف الوزن ومريح على الشفاه، يحتوي على حمض الهيالورونيك للترطيب. يمكن استخدامه بمفرده أو فوق أحمر الشفاه.", price: 55, oldPrice: null, image: "/images/prod-lipgloss.jpg", images: ["/images/prod-lipgloss.jpg"], categorySlug: "lips", rating: 4.6, reviewCount: 178, stock: 72, brand: "أريسا", shades: null, isFeatured: false, isBestseller: false, isNew: true, isChoice: false, prime: true, ingredients: "حمض الهيالورونيك، زيت جوجوبا، خلاصة الورد، جليسرين نباتي.", weight: "6 مل", origin: "كوريا الجنوبية" },
  { name: "سيروم نمو الشعر بزيت الأرغان والبيوتين", description: "سيروم مركّز يغذي فروة الرأس ويحفز نمو الشعر ويقلل التساقط. يحتوي على زيت الأرغان المغربي والبيوتين والكافيين. يعزز كثافة الشعر ويمنحه قوة ولمعاناً. مناسب لجميع أنواع الشعر.", price: 135, oldPrice: 175, image: "/images/prod-hairserum.jpg", images: ["/images/prod-hairserum.jpg"], categorySlug: "hair", rating: 4.8, reviewCount: 234, stock: 51, brand: "أريسا لوكس", shades: null, isFeatured: true, isBestseller: true, isNew: false, isChoice: true, prime: true, ingredients: "زيت الأرغان المغربي، البيوتين، الكافيين، خلاصة إكليل الجبل، فيتامين B5.", weight: "100 مل", origin: "المغرب" },
  { name: "شامبو خالي من السلفات - للشعر المصبوغ", description: "شامبو لطيف خالٍ من السلفات والبارابين يحافظ على لون الشعر المصبوغ ويرطبه بعمق. يحتوي على زيت الأرغان والكيراتين. ينظف بلطف ويمنح الشعر نعومة ولمعاناً صحياً. آمن للاستخدام اليومي.", price: 85, oldPrice: null, image: "/images/prod-shampoo.jpg", images: ["/images/prod-shampoo.jpg"], categorySlug: "hair", rating: 4.5, reviewCount: 167, stock: 84, brand: "أريسا", shades: null, isFeatured: false, isBestseller: false, isNew: false, isChoice: false, prime: true, ingredients: "زيت الأرغان، الكيراتين، خلاصة الصبار، بانثينول، أحماض أمينية.", weight: "400 مل", origin: "فرنسا" },
  { name: "ماسك الشعر المغذي - بزيت الأرغان", description: "ماسك شعر عميق التغذية يصلح الشعر التالف ويمنحه قوة ولمعاناً. تركيبة كثيفة بزيت الأرغان والكيراتين والبروتين. يُستخدم مرة أسبوعياً لنتائج مذهلة. يقلل التقصف وينعم الشعر.", price: 110, oldPrice: 140, image: "/images/prod-hairmask.jpg", images: ["/images/prod-hairmask.jpg"], categorySlug: "hair", rating: 4.7, reviewCount: 189, stock: 43, brand: "أريسا لوكس", shades: null, isFeatured: true, isBestseller: false, isNew: true, isChoice: false, prime: true, ingredients: "زيت الأرغان، الكيراتين، بروتين القمح، زبدة الشيا، فيتامين E.", weight: "250 مل", origin: "المغرب" },
  { name: "طلاء أظافر جل طويل الأمد - ٧ أيام", description: "طلاء أظافر بتركيبة الجل التي تمنح لمعاناً زجاجياً وثباتاً يصل إلى ٧ أيام دون تقشر. يجف بسرعة تحت ضوء LED. ألوان غنية ومشبعة بدرجات عصرية. خالٍ من الفورمالديهايد والتولوين.", price: 45, oldPrice: 60, image: "/images/prod-nailpolish.jpg", images: ["/images/prod-nailpolish.jpg"], categorySlug: "nails", rating: 4.7, reviewCount: 187, stock: 120, brand: "أريسا", shades: JSON.stringify(["أحمر", "وردي", "نود", "أسود", "ذهبي"]), isFeatured: true, isBestseller: true, isNew: false, isChoice: false, prime: true, ingredients: "راتنج طبيعي، أصباغ معدنية، خلاصة الشاي الأخضر، ميثاكريلات.", weight: "10 مل", origin: "كوريا الجنوبية" },
  { name: "عطر الورد الدمشقي الفاخر - ١٠٠ مل", description: "عطر شرقي زهري فاخر مستوحى من ورود دمشق الأصيلة. يفتح بنفحات الورد البلغاري والياسمين، ويتطور إلى قلب من العود والمسك. يدوم أكثر من ١٠ ساعات. تركيبة فاخرة بتركيز EDP.", price: 285, oldPrice: 360, image: "/images/prod-perfume1.jpg", images: ["/images/prod-perfume1.jpg"], categorySlug: "perfume", rating: 4.9, reviewCount: 198, stock: 34, brand: "أريسا لوكس", shades: null, isFeatured: true, isBestseller: true, isNew: false, isChoice: true, prime: true, ingredients: "زيوت عطرية: ورد بلغاري، ياسمين، عود، مسك أبيض، صندل.", weight: "100 مل", origin: "الإمارات" },
  { name: "سيروم فيتامين C المركز - ٢٠٪", description: "سيروم بفيتامين C بتركيز ٢٠٪ يوحّد لون البشرة ويفتح البقع الداكنة ويعزز إنتاج الكولاجين. يحتوي على حمض الفيروليك وفيتامين E لفعالية مضاعفة. يمنح البشرة إشراقة فورية ويقلل علامات التقدم في العمر.", price: 145, oldPrice: 195, image: "/images/prod-serum.jpg", images: ["/images/prod-serum.jpg"], categorySlug: "skincare", rating: 4.8, reviewCount: 267, stock: 56, brand: "أريسا لوكس", shades: null, isFeatured: true, isBestseller: true, isNew: false, isChoice: true, prime: true, ingredients: "فيتامين C ٢٠٪، حمض الفيروليك، فيتامين E، حمض الهيالورونيك، غليسرين.", weight: "30 مل", origin: "كوريا الجنوبية" },
  { name: "كريم الترطيب اليومي مع حمض الهيالورونيك", description: "كريم ترطيب يومي خفيف بتركيبة حمض الهيالورونيك والسيراميد يرطب البشرة بعمق ويحافظ على رطوبتها لمدة ٤٨ ساعة. غير دهني وسريع الامتصاص، مناسب لجميع أنواع البشرة. يحقق نضارة وإشراقاً.", price: 110, oldPrice: null, image: "/images/prod-moisturizer.jpg", images: ["/images/prod-moisturizer.jpg"], categorySlug: "skincare", rating: 4.7, reviewCount: 189, stock: 78, brand: "أريسا لوكس", shades: null, isFeatured: false, isBestseller: true, isNew: false, isChoice: false, prime: true, ingredients: "حمض الهيالورونيك، سيراميد، غليسرين، خلاصة الشاي الأخضر، فيتامين B5.", weight: "50 مل", origin: "كوريا الجنوبية" },
  { name: "واقي الشمس الخفيف SPF ٥٠+ - بدون أثر أبيض", description: "واقي شمس خفيف الوزن بعامل حماية SPF ٥٠+ يحمي البشرة من الأشعة فوق البنفسجية UVA وUVB. تركيبة غير دهنية لا تترك أثراً أبيض وتصلح كقاعدة للمكياج. مقاوم للعرق والماء. مناسب للبشرة الحساسة.", price: 125, oldPrice: null, image: "/images/prod-moisturizer.jpg", images: ["/images/prod-moisturizer.jpg"], categorySlug: "skincare", rating: 4.8, reviewCount: 203, stock: 67, brand: "أريسا لوكس", shades: null, isFeatured: true, isBestseller: false, isNew: true, isChoice: true, prime: true, ingredients: "أكسيد الزنك، ثاني أكسيد التيتانيوم، حمض الهيالورونيك، خلاصة الشاي الأخضر.", weight: "50 مل", origin: "اليابان" },
  { name: "تونر موازن للبشرة - بالورد الطبيعي", description: "تونر بماء الورد الطبيعي يوازن درجة حموضة البشرة ويصغر المسام ويحضّر البشرة لاستقبال السيروم والكريم. يرطب وينعش البشرة بعمق. خالٍ من الكحول والعطور الصناعية. للاستخدام اليومي.", price: 72, oldPrice: null, image: "/images/prod-serum.jpg", images: ["/images/prod-serum.jpg"], categorySlug: "skincare", rating: 4.6, reviewCount: 134, stock: 81, brand: "أريسا", shades: null, isFeatured: false, isBestseller: false, isNew: false, isChoice: false, prime: true, ingredients: "ماء الورد الطبيعي، غليسرين، حمض الهيالورونيك، خلاصة البابونج، فيتامين B5.", weight: "200 مل", origin: "المغرب" },
];

// ===== بيانات الخدمات =====
const services = [
  { name: "تجهيز العروس الكامل", description: "باقة متكاملة لتجهيز العروس تشمل مكياج العروس، تسريحة، مناكير وبادكير، تنظيف بشرة، ولمسات نهائية. حصة تجريبية قبل الزفاف بيومين. تجربة فاخرة تليق بيومكِ المميز.", price: 2500, oldPrice: null, duration: 240, image: "/images/cat-makeup.jpg", category: "bridal", icon: "Crown", isFeatured: true, isPopular: true, isActive: true, rating: 5.0, reviewCount: 87, whatIncluded: JSON.stringify(["مكياج عروس احترافي", "تسريحة عروس أنيقة", "مناكير وبادكير", "تنظيف بشرة عميق", "حصة تجريبية قبل الزفاف"]) },
  { name: "مكياج العروس", description: "مكياج عروس احترافي يثبت طوال اليوم، بمنتجات فاخرة ولمسات لامعة. يمنحكِ إطلالة ملكية في يومكِ المميز.", price: 600, oldPrice: null, duration: 90, image: "/images/cat-makeup.jpg", category: "bridal", icon: "Sparkles", isFeatured: false, isPopular: true, isActive: true, rating: 4.9, reviewCount: 112, whatIncluded: JSON.stringify(["مكياج احترافي", "منتجات فاخرة", "تثبيت طويل الأمد", "استشارة ألوان"]) },
  { name: "تكبير الشفاة بحمض الهيالورونيك", description: "حقن حمض الهيالورونيك الآمن لتكبير الشفايف وإعطائها مظهراً ممتلئاً وطبيعياً. يتم الإجراء بأيدي طبيبات مختصات باستخدام مواد معتمدة من هيئة الغذاء والدواء، مع اهتمام كامل بالتعقيم والنتائج الطبيعية المتوازنة مع ملامح وجهك.", price: 800, oldPrice: 950, duration: 45, image: "/images/cat-lips.jpg", category: "lips", icon: "Heart", isFeatured: true, isPopular: true, isActive: true, rating: 4.9, reviewCount: 142, whatIncluded: JSON.stringify(["استشارة طبية", "حقن حمض الهيالورونيك", "تخدير موضعي", "متابعة بعد الإجراء"]) },
  { name: "تنظيف البشرة العميق", description: "تنظيف عميق للمسام، تقشير، ماسك، وترطيب لبشرة نضرة. يجدد خلايا البشرة ويمنحها إشراقة فورية.", price: 350, oldPrice: null, duration: 60, image: "/images/cat-skincare.jpg", category: "skincare", icon: "Droplet", isFeatured: false, isPopular: true, isActive: true, rating: 4.7, reviewCount: 234, whatIncluded: JSON.stringify(["تنظيف عميق للمسام", "تقشير لطيف", "ماسك مغذٍّ", "ترطيب نهائي"]) },
  { name: "فيليش ذهبي ٢٤ قيراط", description: "جلسة فيليش بالذهب ٢٤ قيراط لنضارة وإشراقة فورية. الذهب ينشط الخلايا ويحفز الكولاجين، فيمنح بشرتكِ مظهراً متجدداً ومشدوداً وإشراقة ملكية لا تُقاوم. مثالية قبل المناسبات.", price: 450, oldPrice: null, duration: 75, image: "/images/cat-skincare.jpg", category: "skincare", icon: "Sparkles", isFeatured: true, isPopular: false, isActive: true, rating: 4.9, reviewCount: 96, whatIncluded: JSON.stringify(["تقشير بالذهب", "ماسك ذهبي ٢٤ قيراط", "تدليك وجه", "ترطيب فاخر"]) },
  { name: "مكياج السهرات", description: "مكياج سهرة فاخر مناسب للمناسبات والحفلات. يبرز جمالكِ بإطلالة جريئة وأنيقة تثبت طوال الليل.", price: 300, oldPrice: null, duration: 60, image: "/images/cat-makeup.jpg", category: "makeup", icon: "Sparkles", isFeatured: false, isPopular: true, isActive: true, rating: 4.8, reviewCount: 178, whatIncluded: JSON.stringify(["مكياج سهرة كامل", "رموش صناعية", "تنسيق ألوان", "تثبيت طويل الأمد"]) },
  { name: "فرد الشعر البرازيلي", description: "فرد برازيلي بالكيراتين لشعر ناعم ولامع بدون أضرار. يعالج الشعر التالف ويمنحه مظهراً صحياً وفائقاً يثبت لعدة أشهر. مناسب لجميع أنواع الشعر ويقلل التجعد بشكل كبير.", price: 1200, oldPrice: 1500, duration: 180, image: "/images/cat-hair.jpg", category: "hair", icon: "Wind", isFeatured: true, isPopular: false, isActive: true, rating: 4.9, reviewCount: 154, whatIncluded: JSON.stringify(["فرد برازيلي بالكيراتين", "علاج الشعر التالف", "تغذية عميقة", "تصفيف نهائي"]) },
  { name: "مانيكير وباديكير كلاسيك", description: "عناية كاملة بالأظافر مع طلاء جل يدوم أسبوعين. يشمل تنظيف، تقليم، تلميع، وطلاء احترافي.", price: 200, oldPrice: null, duration: 60, image: "/images/cat-nails.jpg", category: "nails", icon: "Hand", isFeatured: false, isPopular: true, isActive: true, rating: 4.7, reviewCount: 203, whatIncluded: JSON.stringify(["تنظيف وتقليم الأظافر", "تلميع وتنعيم", "طلاء جل", "عناية بالبشرة"]) },
  { name: "إزالة الشعر بالليزر", description: "جلسة ليزر متعددة الموجات لإزالة دائمة للشعر غير المرغوب. تقنية متطورة تناسب جميع أنواع البشرة بأمان تام، مع تبريد فوري لتقليل الانزعاج. جلستنا الواحدة تمنحكِ نعومة فورية تستمر أسابيع.", price: 600, oldPrice: 750, duration: 60, image: "/images/cat-skincare.jpg", category: "laser", icon: "Zap", isFeatured: true, isPopular: false, isActive: true, rating: 4.8, reviewCount: 134, whatIncluded: JSON.stringify(["استشارة تحديد نوع البشرة", "جلسة ليزر متعددة الموجات", "تبريد فوري", "كريم مهدئ بعد الجلسة"]) },
  { name: "حمام مغربي كامل", description: "حمام مغربي تقليدي مع تقشير بالكيس وغسل بالصابون البلدي. طقوس استرخاء كاملة تنقي البشرة من الخلايا الميتة وتمنحها نعومة وإشراقة فورية. تجربة علاجية أصيلة لاستعادة النضارة والحيوية.", price: 250, oldPrice: null, duration: 90, image: "/images/cat-skincare.jpg", category: "spa", icon: "Droplet", isFeatured: false, isPopular: true, isActive: true, rating: 4.9, reviewCount: 102, whatIncluded: JSON.stringify(["صابون بلدي أصيل", "تقشير بالكيس المغربي", "غسل بزيت الأرغان", "ماسك بالطين"]) },
  { name: "مساج استرخاء", description: "جلسة مساج سويدي للاسترخاء وتخفيف التوتر. تقنيات متخصصة لتحرير العضلات المشدودة وتنشيط الدورة الدموية، مع زيوت عطرية فاخرة تمنحكِ تجربة استرخاء كاملة للجسد والروح.", price: 400, oldPrice: null, duration: 60, image: "/images/cat-skincare.jpg", category: "spa", icon: "Heart", isFeatured: false, isPopular: false, isActive: true, rating: 4.8, reviewCount: 91, whatIncluded: JSON.stringify(["اختيار الزيوت العطرية المفضلة", "مساج سويدي لكامل الجسم", "تدفئة العضلات وتنشيط الدورة", "شاي أعشاب للاسترخاء"]) },
];

// ===== مولّد المراجعات =====
const reviewAuthors = ["سارة الدوسري", "نورة العتيبي", "ريم الشمري", "أمل القحطاني", "فاطمة الزهراني", "هند المالكي", "لمى السبيعي", "جود المطيري", "دانة الغامدي", "مها الحربي"];
const reviewTitles = ["منتج رائع!", "أفضل ما جربته", "نتيجة مذهلة", "جودة عالية", "أنصح به بشدة", "تجربة ممتازة", "يفوق التوقعات", "سعيدة جداً"];
const reviewBodies = [
  "المنتج فعّال وأحسست بالفرق خلال أيام. الملمس لطيف والرائحة راقية. الوحيد أن العبوة كانت أصغر قليلاً مما توقعت لكنها كافية للاستخدام المنتظم.",
  "جودة ممتازة والتغليف فاخر. وصل الطلب بسرعة وكريم الأساس رائع جداً! سأطلبه مرة أخرى بالتأكيد.",
  "جربت منتجات كثيرة لكن هذا مختلف. الملمس خفيف، يمتص بسرعة، وترك إحساساً رائعاً. التوصيل كان سريعاً والتغليف أنيق جداً.",
  "منتج يستحق كل ريال. النتيجة فاقت توقعاتي والجودة عالية جداً. خدمة العملاء ممتازة والرد سريع.",
  "أحببت المنتج كثيراً. الرائحة جميلة والتأثير واضح بعد أسبوعين من الاستخدام. سأكرر الطلب بالتأكيد.",
];

function generateReviews(productIndex: number, count: number) {
  const reviews = [];
  for (let i = 0; i < count; i++) {
    const seed = (productIndex * 31 + i * 17) % reviewAuthors.length;
    const titleSeed = (productIndex * 13 + i * 7) % reviewTitles.length;
    const bodySeed = (productIndex * 19 + i * 11) % reviewBodies.length;
    const rating = 4 + ((productIndex + i) % 2);
    reviews.push({
      author: reviewAuthors[seed],
      rating,
      title: reviewTitles[titleSeed],
      body: reviewBodies[bodySeed],
      helpful: ((productIndex * 7 + i * 3) % 50),
      verified: true,
      daysAgo: 5 + ((productIndex * 11 + i * 5) % 150),
    });
  }
  return reviews;
}

function reviewCountForProduct(productIndex: number) {
  return 3 + (productIndex % 6);
}

function daysAgoDate(days: number): Date {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d;
}

async function seed() {
  console.log("🌱 Seeding database...");

  await db.serviceBooking.deleteMany();
  await db.service.deleteMany();
  await db.review.deleteMany();
  await db.orderItem.deleteMany();
  await db.order.deleteMany();
  await db.product.deleteMany();
  await db.category.deleteMany();

  // أدخلي الفئات
  const categoryMap = new Map<string, string>();
  for (const c of categories) {
    const created = await db.category.create({
      data: {
        slug: c.slug,
        name: c.name,
        nameEn: c.nameEn,
        description: c.description,
        image: c.image,
        icon: c.icon,
      },
    });
    categoryMap.set(c.slug, created.id);
    console.log(`  ✓ Category: ${c.name}`);
  }

  // أدخلي المنتجات + المراجعات
  let reviewTotal = 0;
  for (let i = 0; i < products.length; i++) {
    const p = products[i];
    const categoryId = categoryMap.get(p.categorySlug);
    if (!categoryId) continue;
    const created = await db.product.create({
      data: {
        name: p.name,
        description: p.description,
        price: p.price,
        oldPrice: p.oldPrice ?? null,
        image: p.image,
        images: typeof p.images === "string" ? p.images : JSON.stringify(p.images),
        categoryId,
        rating: p.rating,
        reviewCount: p.reviewCount,
        stock: p.stock,
        brand: p.brand,
        shades: p.shades ?? null,
        isFeatured: p.isFeatured ?? false,
        isBestseller: p.isBestseller ?? false,
        isNew: p.isNew ?? false,
        isChoice: p.isChoice ?? false,
        prime: p.prime ?? true,
        ingredients: p.ingredients ?? null,
        weight: p.weight ?? null,
        origin: p.origin ?? null,
      },
    });

    const count = reviewCountForProduct(i);
    const reviews = generateReviews(i, count);
    for (const r of reviews) {
      await db.review.create({
        data: {
          productId: created.id,
          author: r.author,
          rating: r.rating,
          title: r.title,
          body: r.body,
          helpful: r.helpful,
          verified: r.verified,
          createdAt: daysAgoDate(r.daysAgo),
        },
      });
      reviewTotal++;
    }
  }
  console.log(`  ✓ ${products.length} products inserted`);
  console.log(`  ✓ ${reviewTotal} reviews inserted`);

  // أدخلي الخدمات
  for (const s of services) {
    await db.service.create({
      data: {
        name: s.name,
        description: s.description,
        price: s.price,
        oldPrice: s.oldPrice ?? null,
        duration: s.duration,
        image: s.image,
        category: s.category,
        icon: s.icon,
        isFeatured: s.isFeatured ?? false,
        isPopular: s.isPopular ?? false,
        isActive: s.isActive ?? true,
        rating: s.rating,
        reviewCount: s.reviewCount,
        whatIncluded: s.whatIncluded ?? null,
      },
    });
  }
  console.log(`  ✓ ${services.length} services inserted`);

  console.log("✅ Seeding complete!");
  await db.$disconnect();
}

seed().catch((e) => {
  console.error("❌ Seed error:", e);
  db.$disconnect();
  process.exit(1);
});
