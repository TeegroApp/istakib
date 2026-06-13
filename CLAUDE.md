# Proje Dosyası: Kanban Tarzı İş Takip Uygulaması

## 1. Proje Özeti
Farklı alanlardan ve kategorilerden iş/task'ları tek yerden ekleyip takip edebileceğin, Kanban tarzı (sürükle-bırak sütunlar) çalışan, çok kullanıcılı, kapsamlı bir iş takip uygulaması. İş akışı aşamaları ve kategori yapısı tamamen özelleştirilebilir. Tamamlanan işler arşive taşınır. Uygulama web, mobil ve masaüstünde çalışacak; veriler buluttan senkronize olacak.

## 2. Amaç ve Kapsam
- **Çözdüğü sorun:** Farklı projelerin ve alanların işlerini dağınık şekilde değil, tek bir merkezi panoda hiyerarşik kategorilere ayırarak görsel olarak takip etmek.
- **Hedef kullanıcı:** Önce proje sahibi (sen), ardından eklenen diğer kullanıcılar — çok kullanıcılı bir yapı.
- **Çıktı:** Web, mobil ve masaüstünde çalışan, bulut senkronizasyonlu bir uygulama.

## 3. Ana Özellikler

### Kanban Panosu & Özelleştirilebilir İş Akışları
- İş akışı **aşama aşama** ilerler ve **tamamen özelleştirilebilir**: kullanıcı kendi sütunlarını/aşamalarını tanımlar (sabit değil).
- Örnek aşamalar: "Fikir → Planlama → Devam Ediyor → İncelemede → Bitti" — ama her pano için farklı kurulabilir.
- Task'ların aşamalar arasında sürükle-bırak ile taşınması.
- Task ekleme, düzenleme, silme.
- Task detayları: başlık, açıklama, kategori, öncelik, son tarih, atanan kişi, etiketler.

### Hiyerarşik & Özelleştirilebilir Kategoriler
- Kategori yapısı çok katmanlı: **Ana kategori → Alt kategori → Kategori**.
- Tüm kategoriler kullanıcı tarafından oluşturulabilir, düzenlenebilir, silinebilir.
- Farklı alanlardan task'ları bu hiyerarşiye göre ayırma.
- Kategoriye / alt kategoriye göre filtreleme ve görüntüleme.

### Arşiv
- Tamamlanan işleri arşive taşıma.
- Arşivden geri getirebilme ve arşivde arama.

### Çok Kullanıcılı Yapı
- Kullanıcı kayıt / giriş (hesap sistemi).
- **Ortak takım panoları:** birden fazla kullanıcının aynı panoda çalışması.
- **Yetki rolleri:** yönetici ve üye gibi farklı yetki seviyeleri.
- **Kişisel panolar:** her kullanıcının kendine ait panosu, istenirse başkalarıyla paylaşılabilir.

### Ek Özellikler
- **Bildirimler:** task atandığında, son tarih yaklaştığında vb.
- **Yorumlar & dosya ekleme:** task'lara yorum yazma ve dosya iliştirme.
- **Etiketler & filtreler:** task'lara etiket ekleme, gelişmiş filtreleme.
- **Takvim görünümü:** son tarihlere göre task'ları takvimde görme.

### Veritabanı & Gerçek Zamanlı Senkronizasyon
- Tüm veriler bir **veritabanında** tutulur (kullanıcılar, panolar, aşamalar, kategoriler, task'lar, arşiv).
- **Gerçek zamanlı (real-time) kayıt ve güncelleme:** bir task eklendiğinde/değiştirildiğinde/taşındığında değişiklik anında kaydedilir ve diğer kullanıcıların ekranına anında yansır (sayfa yenilemeye gerek yok).
- Veriler bulutta tutulur; kullanıcı her cihazdan (web/mobil/masaüstü) aynı güncel verilere erişir.

## 4. Tasarım Yönü
- **Tema:** Hem **açık (Sakin & Odaklı)** hem **koyu (Profesyonel)** tema; kullanıcı geçiş yapabilir.
- **İmza öğesi:** **Renk kodlu kategoriler** — her ana kategori/alan kendi rengine sahip; bu renk hem kartta hem sütunda akar, böylece onlarca farklı alanı bir bakışta tarayabilirsin.
- **Genel his:** Sade, bol boşluklu, göz yormayan; yoğun bilgiyi düzenli gösteren.
- *Ayrıntılar (yazı tipleri, tam renk paleti) kodlama aşamasında netleştirilecek.*

## 5. Platformlar
- **Önce web** (ilk versiyon burada çıkacak), sonra mobil ve masaüstü.
- Tercihen tek bir kod tabanından üçü birden çıkarılacak.

## 6. Teknoloji Önerisi
- **Ön yüz (frontend):** React (web) + React Native veya Flutter (mobil). Masaüstü için web uygulamasını Electron/Tauri ile sarmak.
- **Veritabanı & arka uç:** **Supabase** (PostgreSQL tabanlı) veya **Firebase** — ikisi de kullanıcı girişi, veritabanı ve **gerçek zamanlı (real-time) güncellemeyi** hazır sunar; bir veri değiştiğinde tüm bağlı kullanıcılara anında yansır. Sıfırdan sunucu yazmak gerekmez.
- İlk versiyon (MVP) sadece web; sonra mobil/masaüstüne genişletilir.

## 7. Önerilen Geliştirme Aşamaları
1. **Aşama 1 — MVP (web):** Tek kullanıcı, özelleştirilebilir Kanban aşamaları, hiyerarşik kategoriler, arşiv.
2. **Aşama 2:** Kullanıcı hesapları + bulut senkronizasyonu.
3. **Aşama 3:** Çoklu kullanıcı, roller, paylaşımlı panolar.
4. **Aşama 4:** Ek özellikler (bildirim, yorum, dosya, takvim) + mobil/masaüstü sürümleri.

## 8. Kısıtlar ve Tercihler
- Arayüz dili: Türkçe.
- Tema: açık + koyu (kullanıcı seçer).
- Bütçe / zaman sınırı: *(belirtilecek)*
