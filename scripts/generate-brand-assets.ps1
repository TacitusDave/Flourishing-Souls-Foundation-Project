# Regenerates every brand asset from the source logo files.
# Usage: powershell -NoProfile -ExecutionPolicy Bypass -File scripts/generate-brand-assets.ps1
# Re-run whenever the source logo changes. Windows PowerShell + .NET only.

$ErrorActionPreference = "Stop"
Add-Type -AssemblyName System.Drawing

# --- Source logo files (edit these paths if the sources move) ---------------
$srcIcon     = "C:\Users\david\Pictures\Flourishing Solus Content\fsf-1-lcon.png"
$srcWordmark = "C:\Users\david\Pictures\Flourishing Solus Content\fsf-2-Text.png"

$root  = Split-Path -Parent $PSScriptRoot
$brand = Join-Path $root "public\images\brand-assets"
$icons = Join-Path $root "public\icons"
New-Item -ItemType Directory -Force -Path $brand, $icons | Out-Null

function New-Canvas([int]$w, [int]$h, [System.Drawing.Color]$bg) {
  $bmp = New-Object System.Drawing.Bitmap($w, $h)
  $g = [System.Drawing.Graphics]::FromImage($bmp)
  $g.InterpolationMode  = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
  $g.SmoothingMode      = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
  $g.PixelOffsetMode    = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
  $g.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality
  $g.Clear($bg)
  return @($bmp, $g)
}

# Draw the square-cropped source into a $size square with padding ratio $pad.
function Copy-Square([string]$srcPath, [int]$size, [double]$pad, [System.Drawing.Color]$bg) {
  $src = New-Object System.Drawing.Bitmap($srcPath)
  $canvas = New-Canvas $size $size $bg
  $bmp = $canvas[0]; $g = $canvas[1]
  $inner = [int][math]::Floor($size * (1 - 2 * $pad))
  $off   = [int][math]::Floor($size * $pad)
  $side  = [math]::Min($src.Width, $src.Height)
  $sx = [int](($src.Width  - $side) / 2)
  $sy = [int](($src.Height - $side) / 2)
  $dst = New-Object System.Drawing.Rectangle($off, $off, $inner, $inner)
  $srcRect = New-Object System.Drawing.Rectangle($sx, $sy, $side, $side)
  $g.DrawImage($src, $dst, $srcRect, [System.Drawing.GraphicsUnit]::Pixel)
  $g.Dispose(); $src.Dispose()
  return $bmp
}

function Save-Png($bmp, [string]$path) {
  $bmp.Save($path, [System.Drawing.Imaging.ImageFormat]::Png)
  $bmp.Dispose()
}

# .ico container with PNG-compressed entries (all modern browsers support this).
function Write-Ico([object[]]$entries, [string]$outPath) {
  $ms = New-Object System.IO.MemoryStream
  $bw = New-Object System.IO.BinaryWriter($ms)
  $bw.Write([uint16]0); $bw.Write([uint16]1); $bw.Write([uint16]$entries.Count)
  $offset = 6 + 16 * $entries.Count
  $blobs = @()
  foreach ($e in $entries) {
    $bytes = [System.IO.File]::ReadAllBytes($e.Path)
    $blobs += ,$bytes
    $bw.Write([byte]($e.Size -band 0xFF))
    $bw.Write([byte]($e.Size -band 0xFF))
    $bw.Write([byte]0); $bw.Write([byte]0)
    $bw.Write([uint16]1); $bw.Write([uint16]32)
    $bw.Write([uint32]$bytes.Length)
    $bw.Write([uint32]$offset)
    $offset += $bytes.Length
  }
  foreach ($b in $blobs) { $bw.Write($b) }
  $bw.Flush()
  [System.IO.File]::WriteAllBytes($outPath, $ms.ToArray())
  $bw.Close(); $ms.Close()
}

$white = [System.Drawing.Color]::White

# 1) Copy the masters into the repo
Copy-Item $srcIcon     (Join-Path $brand "fsf-icon.png")     -Force
Copy-Item $srcWordmark (Join-Path $brand "fsf-wordmark.png") -Force

# 2) Favicon set — white background so the ring holds up on dark tab bars
$tmp = Join-Path $env:TEMP ("fsf-fav-{0}" -f [guid]::NewGuid().ToString("N"))
New-Item -ItemType Directory -Force -Path $tmp | Out-Null
$pngs = @()
foreach ($s in 16, 32, 48) {
  $p = Join-Path $tmp ("fav-{0}.png" -f $s)
  Save-Png (Copy-Square $srcIcon $s 0.06 $white) $p
  $pngs += ,@{ Size = $s; Path = $p }
}
Write-Ico $pngs (Join-Path $root "public\favicon.ico")
Remove-Item $tmp -Recurse -Force

# 3) PWA / manifest icons
Save-Png (Copy-Square $srcIcon 192 0.08 $white) (Join-Path $icons "icon-192.png")
Save-Png (Copy-Square $srcIcon 512 0.08 $white) (Join-Path $icons "icon-512.png")

# 4) Apple touch icon — opaque; iOS applies its own corner masking
Save-Png (Copy-Square $srcIcon 180 0.10 $white) (Join-Path $root "public\apple-touch-icon.png")

# 5) Open Graph share image 1200x630 — icon + wordmark lockup on white
$icon = New-Object System.Drawing.Bitmap($srcIcon)
$word = New-Object System.Drawing.Bitmap($srcWordmark)

$iconH = 380; $iconW = 380                       # icon source is square
$wordW = 660
$wordH = [int][math]::Round($wordW * $word.Height / $word.Width)
$gap   = 64
$total = $iconW + $gap + $wordW
if ($total -gt 1080) {
  $k = 1080.0 / $total
  $iconW = [int]($iconW * $k); $iconH = $iconW
  $wordW = [int]($wordW * $k)
  $wordH = [int][math]::Round($wordW * $word.Height / $word.Width)
  $gap   = [int]($gap * $k)
  $total = $iconW + $gap + $wordW
}

$og = New-Canvas 1200 630 $white
$ogBmp = $og[0]; $g = $og[1]
$startX = [int]((1200 - $total) / 2)
$iconY  = [int]((630 - $iconH) / 2)
$wordY  = [int]((630 - $wordH) / 2)
$wordX = $startX + $iconW + $gap
$iconRect = New-Object System.Drawing.Rectangle($startX, $iconY, $iconW, $iconH)
$wordRect = New-Object System.Drawing.Rectangle($wordX, $wordY, $wordW, $wordH)
$g.DrawImage($icon, $iconRect,
  (New-Object System.Drawing.Rectangle(0, 0, $icon.Width, $icon.Height)), [System.Drawing.GraphicsUnit]::Pixel)
$g.DrawImage($word, $wordRect,
  (New-Object System.Drawing.Rectangle(0, 0, $word.Width, $word.Height)), [System.Drawing.GraphicsUnit]::Pixel)
$g.Dispose()
Save-Png $ogBmp (Join-Path $root "public\images\og-image.png")
$icon.Dispose(); $word.Dispose()

Write-Host "Brand assets generated:"
Get-ChildItem $root\public\favicon.ico, $root\public\apple-touch-icon.png, $icons, (Join-Path $root "public\images\og-image.png"), $brand |
  ForEach-Object { Write-Host ("  {0}  ({1} bytes)" -f $_.FullName.Substring($root.Length + 1), $_.Length) }
