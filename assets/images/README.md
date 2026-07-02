# Görseller — Değiştirme Rehberi

Bu klasördeki tüm dosyalar **yer tutucu (placeholder)** görsellerdir. Sitenin
hiçbir yerinde "kırık resim" ikonu görünmemesi için marka renklerinde,
üzerinde önerilen boyut ve içerik etiketi yazan görseller otomatik
oluşturuldu.

## Nasıl değiştirilir?
Gerçek fotoğrafınızı, **aynı dosya adıyla** ve mümkünse belirtilen boyuta
yakın bir çözünürlükte bu klasöre kopyalayın. Örneğin:

- `treatment-fue.jpg` → FUE saç ekimi hizmet kartı görseli (800×600)
- `doctor-1.jpg` → İlk doktorunuzun portresi (600×750, dikey)
- `ba-before.jpg` / `ba-after.jpg` → Öncesi/sonrası kaydırıcısı

HTML veya CSS'te hiçbir şey değiştirmeniz gerekmez — dosya adı aynı kaldığı
sürece site otomatik olarak yeni görseli kullanır.

## Tam dosya listesi ve önerilen boyutlar
| Dosya | Önerilen Boyut | Kullanım Yeri |
|---|---|---|
| about-clinic.jpg | 1000×1250 | Hakkımızda bölümü |
| clinic-interior-1.jpg | 1200×800 | Kliniğimiz — bekleme alanı |
| clinic-interior-2.jpg | 1200×800 | Kliniğimiz — operasyon odası |
| vip-transfer.jpg | 1000×1250 | VIP Deneyim bölümü |
| treatment-*.jpg | 800×600 | Hizmet kartları |
| ba-before.jpg / ba-after.jpg | 1200×800 | Önce/Sonra kaydırıcı |
| gallery-1..4.jpg | 800×1000 | Galeri ızgarası |
| doctor-1..4.jpg | 600×750 | Doktor kartları |
| hotel-1..3.jpg | 900×650 | Konaklama ortakları |
| blog-1..3.jpg | 700×480 | Blog kartları |
| product-aftercare.jpg | 700×700 | Bakım ürünü bölümü |
| video-thumb-1..4.jpg | 900×560 | Video kapak görselleri |
| accred-1..3.png | 260×110 | Akreditasyon logoları (şeffaf zemin önerilir) |
| press-1..4.png | 220×90 | Basın logoları (şeffaf zemin önerilir) |
| dubai-office.jpg | 1000×1250 | Dubai ofisi bölümü |
| og-cover.jpg | 1200×630 | Sosyal medya paylaşım kapağı |

## Yeniden placeholder üretmek isterseniz
`scripts/generate_placeholders.py` dosyasını çalıştırarak (Python + Pillow
gerektirir) tüm placeholder setini yeniden oluşturabilirsiniz — örneğin yeni
bir sayfa için ek görsel ihtiyacı doğarsa listeye ekleyip tekrar çalıştırın.
