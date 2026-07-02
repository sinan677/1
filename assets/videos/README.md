# Videolar — Değiştirme Rehberi

"Hasta Hikayeleri" bölümündeki video kartları şu an **boş altyapı** olarak
kuruludur: kapak görselleri var, oynatıcı çalışıyor, ama video dosyası
henüz bağlanmadı. Tıklandığında zarif bir "video yakında eklenecek"
mesajı gösterir — kırık video ikonu göstermez.

## Kendi videonuzu eklemek için

1. Video dosyanızı (mp4 formatı önerilir, web için optimize edilmiş,
   ideal olarak <50MB) bu klasöre kopyalayın. Örnek: `video-1.mp4`
2. `index.html` içinde ilgili video kartını bulun:

   ```html
   <button class="video-card reveal" data-video-src="" data-video-title="Hasta Hikayesi 1">
   ```

3. `data-video-src=""` kısmını dosya yolunuzla doldurun:

   ```html
   <button class="video-card reveal" data-video-src="assets/videos/video-1.mp4" data-video-title="Hasta Hikayesi 1">
   ```

4. Kaydedin — başka hiçbir şey değiştirmenize gerek yok. Kart artık
   tıklandığında videoyu lightbox içinde oynatacak.

## YouTube / Vimeo gibi harici bir video kullanmak isterseniz
`main.js` içindeki `video-lightbox` bölümünü bulup `<video>` elementi
yerine bir `<iframe>` embed kodu oluşturacak şekilde küçük bir değişiklik
yapmanız yeterli (embed URL'sini `data-video-src` alanına yazabilirsiniz).
İsterseniz bu değişikliği benden tekrar isteyebilirsiniz.

## Kapak görselleri
Kapak görselleri (`video-thumb-1.jpg` vb.) `assets/images/` klasöründedir,
bu klasörde değil — bkz. `assets/images/README.md`.
