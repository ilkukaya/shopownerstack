# ShopOwnerStack: yayın planı ve yapılacaklar

Son güncelleme: 26 Eylül 2026

Bu belge sitenin durumunu, yapılan işleri ve **senin yapman gereken birkaç adımı** anlatır.
Adımlar önem sırasına göre dizildi. Hepsi ücretsiz, tek istisna alan adı (yılda yaklaşık 10-12 $).

---

## 1. Başlangıçta durum neydi?

| Konu | Durum |
| --- | --- |
| Teknik altyapı | Sağlamdı (Astro, Netlify, hızlı statik site). |
| İçerik | **Tamamı uydurmaydı.** "Ürünü aldık, 6 hafta kullandık, 27 dakikada fatura kestik" gibi test iddiaları, puanlar ve fiyatlar gerçek değildi. Bu haliyle yayına almak hem okuru yanıltırdı hem de ABD FTC kurallarına aykırı olurdu. Affiliate programları da bu tür siteleri reddeder. |
| Fiyatlar | Çoğu yanlıştı (ör. Jobber 39 $ yazıyordu, gerçekte 29 $). |
| Tasarım | Tamamı büyük harf, sarı-lacivert "şantiye" görünümü. Şablon gibi, yapay zekâ işi gibi duruyordu. |
| Alan adı | Kod `shopownerstack.com` adresini kullanıyordu ama **bu alan adı sana ait görünmüyor.** Canonical ve sitemap adresleri başkasının alan adını gösteriyordu. Bu SEO açısından ciddi bir hataydı. |
| Reklam / Analytics | Kodda yer vardı ama hiçbiri bağlı değildi. |
| Netlify | Site yayında: `shopownerstack.netlify.app`. Form özelliği kapalıydı. |

## 2. Neler yapıldı?

**İçerik: artık gerçek ve dürüst**
- 11 yazılım incelemesi, 8 karşılaştırma, 8 "alternatifler" sayfası, 7 rehber ve 8 meslek sayfası baştan yazıldı.
- Fiyatlar 2026 kaynaklarından kontrol edildi. Doğrulanamayan fiyatlar uydurulmadı, "Quote-based" (teklif usulü) olarak işaretlendi.
- Her incelemenin altında kaynak listesi var (satıcı sayfaları, G2, Capterra vb.).
- Site artık "araştırmaya dayalı inceleme" yaptığını açıkça söylüyor. Uydurma test iddiası kalmadı.
- Hesaplayıcıdaki saatlik ücretler gerçek kaynaklara bağlandı (HomeGuide, AAA vb.).

**Tasarım: tamamen yenilendi**
- Güven veren editoryal görünüm: serif başlıklar, temiz kartlar, "para yeşili" marka rengi, yeni logo.
- Mobilde önce okunacak yapı. İnceleme sayfalarında kaydırınca aşağıdan çıkan "Try Jobber" çubuğu var (affiliate tıklamasını artırır).
- İnceleme sayfalarına içindekiler listesi, özet tablosu ve yapışkan yan panel eklendi.
- Tüm sayfalar 360 px telefon genişliğinde yatay kaydırma yapmadan açılıyor (57 sayfa tek tek kontrol edildi).
- Lighthouse puanları: performans 99-100, erişilebilirlik 96-100, en iyi uygulamalar 100, SEO 100.

**SEO (Google)**
- Canonical, sitemap ve robots adresleri artık otomatik olarak sitenin gerçek adresinden üretiliyor.
- Her sayfa için ayrı sosyal medya görseli (44 adet, 1200x630) otomatik üretiliyor.
- Yapılandırılmış veri (JSON-LD) eklendi: SoftwareApplication + Review, ItemList, FAQPage, Article, BreadcrumbList, WebSite + SearchAction. Sahte "AggregateRating" kaldırıldı, çünkü Google ceza verebilir.
- Başlıklar arama niyetine göre yazıldı ("Jobber Review 2026: Pricing, Pros, Cons…").
- Deploy önizlemeleri ve branch sürümleri `noindex`. Google sadece asıl siteyi görür.
- Site içi arama eklendi (Pagefind, ücretsiz).

**AEO / GEO (ChatGPT, Perplexity, Google AI yanıtları)**
- Her sayfada H1'in hemen altında doğrudan cevap kutusu var. Yapay zekâ motorları bunu alıntılar.
- `robots.txt` GPTBot, ClaudeBot, PerplexityBot, Google-Extended gibi AI botlarına açıkça izin veriyor.
- `/llms.txt` (site özeti) ve `/llms-full.txt` (tüm içeriğin düz metni) üretiliyor.
- Kaynak gösterme, tarih ve yöntem sayfası eklendi. Bunlar güvenilirlik sinyali (E-E-A-T) olarak işe yarar.

**Gelir altyapısı**
- AdSense: kod hazır. Yayıncı kimliğini (publisher ID) girdiğin anda reklamlar açılır ve `ads.txt` otomatik oluşur.
- Affiliate: tüm "Visit/Try" butonları `/go/<araç>/` üzerinden gider. Affiliate linkini tek bir yere yazman yeterli.
- GA4 tıklama takibi: hangi butonun hangi sayfada kaç kez tıklandığı ayrı ayrı ölçülür (`placement`).
- Netlify Forms: bülten ve iletişim formları çalışır durumda.
- Yeni sayfalar eklendi: Terms of use (kullanım şartları), gerçek iletişim formu ve güncellenmiş Privacy (AdSense için zorunlu metinler).

**Affiliate araştırması**
- `docs/affiliate-programs.md`: 34 programın komisyonu, ağı ve başvuru linki listelendi. En çok kazandıracaklar en üstte.

---

## 3. Senin yapman gerekenler (sırayla)

### Adım 1: Alan adı al (en önemlisi, ~10-12 $/yıl)
AdSense `netlify.app` alt alan adını kabul etmez. Affiliate programları da kendi alan adı ister.
1. `shopownerstack.com` boşsa Namecheap, Porkbun veya Cloudflare Registrar'dan al. Doluysa benzer bir ad seç.
2. Netlify > shopownerstack > **Domain management** > **Add a domain** > alan adını yaz ve Netlify DNS'i seç. Netlify sana 4 "nameserver" verir.
3. Alan adını aldığın firmada nameserver'ları bu 4 adresle değiştir. HTTPS sertifikası otomatik gelir.
4. Netlify > **Site configuration > Environment variables** > `SITE_URL` = `https://www.alanadin.com` ekle, sonra yeniden deploy et. (Bunu bana da söyleyebilirsin, ben eklerim.)

### Adım 2: Google Search Console ve Bing (ücretsiz, 10 dakika)
1. https://search.google.com/search-console > **URL prefix** > site adresini gir > **HTML tag** yöntemini seç.
2. Etiketteki `content="..."` değerini Netlify'da `PUBLIC_GOOGLE_SITE_VERIFICATION` olarak ekle, deploy et, sonra "Verify"a bas.
3. **Sitemaps** menüsüne `sitemap-index.xml` yaz ve gönder.
4. https://www.bing.com/webmasters > "Import from Google Search Console" ile tek tıkla ekle. ChatGPT'nin arama tarafı Bing'i kullanır.

### Adım 3: Google Analytics 4 (ücretsiz)
1. https://analytics.google.com > yeni mülk > Web > site adresi. `G-XXXXXXX` kimliğini al.
2. Netlify'da `PUBLIC_GA_ID` olarak ekle.

### Adım 4: Affiliate programlarına başvur
`docs/affiliate-programs.md` dosyasındaki "Apply first" listesiyle başla: Jobber, Housecall Pro, Boulevard, ServiceM8, Workiz.
- Çoğu PartnerStack üzerinden çalışır (https://partnerstack.com, tek hesapla birçok programa başvurulur).
- Onay gelince bana affiliate linkini gönder, ilgili dosyaya (`src/content/tools/jobber.md` > `affiliateUrl`) ben eklerim. Link sitenin her yerinde otomatik çalışmaya başlar.
- Başvuru formunda site trafiğini dürüst yaz. Yeni sitenin reddedilmesi normaldir, 1-2 ay sonra tekrar başvur.

### Adım 5: AdSense (site 20-30 sayfa ve biraz trafik olunca)
1. https://adsense.google.com > siteyi ekle.
2. `ca-pub-XXXXXXXXXXXXXXXX` kimliğini Netlify'da `PUBLIC_ADSENSE_CLIENT` olarak ekle, deploy et.
3. AdSense > Ads > **By ad unit** > "In-article" birimi oluştur. `data-ad-slot` numarasını `PUBLIC_ADSENSE_SLOT_INARTICLE` olarak ekle.
4. AdSense > **Privacy & messaging** > Avrupa (GDPR) onay mesajını aç. Ücretsizdir, kod gerekmez.
5. Trafik ayda 1.000 oturumu geçince **Mediavine Journey**'e, 25.000 sayfa görüntülemeyi geçince **Raptive**'e başvur. Bunlar AdSense'ten 3-5 kat fazla öder.

### Adım 6: Bülten (isteğe bağlı)
Formlar şimdilik Netlify'da toplanıyor (Netlify > Forms). Liste büyüyünce ücretsiz MailerLite veya Kit hesabı aç, e-postaları oraya aktar.

---

## 4. Büyüme planı (ücretsiz)

"Dünyanın en çok ziyaret edilen sitesi" bir anda olmaz. Bu nişte kazandıran şey, **satın alma niyeti yüksek**
aramalarda ("jobber pricing", "housecall pro vs jobber", "best plumbing software") ilk sayfada çıkmaktır.
Bu aramaların ziyaretçi başına değeri çok yüksektir: tek bir kayıt 100-1.500 $ komisyon getirebilir.

1. **Her hafta 2-3 yeni sayfa.** Öncelik sırası: yeni karşılaştırmalar (ServiceTitan vs Housecall Pro, Jobber vs Housecall Pro vs Workiz), yeni meslekler (pest control, pool service, roofing, painting, locksmith, pressure washing), yeni kategoriler (telefon sistemi: Quo/OpenPhone; bordro: Gusto; muhasebe: QuickBooks).
2. **Fiyatları 2-3 ayda bir kontrol et.** Güncel tarih hem Google hem AI motorları için güçlü bir sinyal. "Jobber fiyatlarını güncelle" demen yeterli.
3. **Gerçek deneyim ekle (en güçlü sinyal).** Bir aracın ücretsiz denemesini açıp kendi ekran görüntülerini alırsan inceleme "hands-on" olur. Google bunu çok daha üst sıraya koyar. Sadece gerçekten yaptığın şeyi yaz.
4. **Reddit, Facebook grupları ve forumlar.** r/sweatystartup, r/HVAC, r/Plumbing gibi yerlerde yardımcı cevaplar ver, uygun olduğunda rehberlere link ver. Spam yapma.
5. **Ücretsiz araçlar.** Hesaplayıcı gibi araçlar doğal backlink toplar. Sıradakiler: "missed call cost calculator", "no-show cost calculator", "software cost comparison".
6. **Search Console'u her hafta aç.** 8-20. sırada görünen sorguları bul, o sayfaları güçlendir.

## 5. Teknik notlar (geliştirici için)

- İçerik `src/content/` altında Markdown dosyalarında. Şema `src/content.config.ts` içinde.
- Ortam değişkenleri: `SITE_URL`, `PUBLIC_GA_ID`, `PUBLIC_ADSENSE_CLIENT`, `PUBLIC_ADSENSE_SLOT_INARTICLE`, `PUBLIC_GOOGLE_SITE_VERIFICATION`, `PUBLIC_BING_SITE_VERIFICATION`.
- Build: `pnpm build` (Astro + Pagefind). Önizleme: `pnpm preview`.
