Add-Type -AssemblyName System.Drawing

function New-RoundedRectPath {
    param([float]$x, [float]$y, [float]$w, [float]$h, [float]$radius)

    $path = New-Object System.Drawing.Drawing2D.GraphicsPath
    $d = $radius * 2
    $path.AddArc($x, $y, $d, $d, 180, 90)
    $path.AddArc($x + $w - $d, $y, $d, $d, 270, 90)
    $path.AddArc($x + $w - $d, $y + $h - $d, $d, $d, 0, 90)
    $path.AddArc($x, $y + $h - $d, $d, $d, 90, 90)
    $path.CloseFigure()
    return $path
}

$root = Split-Path -Parent $PSScriptRoot
$iconsDir = Join-Path $root 'icons'
$assetsDir = Join-Path $root 'assets'
New-Item -ItemType Directory -Force -Path $iconsDir | Out-Null
New-Item -ItemType Directory -Force -Path $assetsDir | Out-Null

$size = 1024
$master = New-Object System.Drawing.Bitmap($size, $size)
$g = [System.Drawing.Graphics]::FromImage($master)
$g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
$g.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::AntiAliasGridFit
$g.Clear([System.Drawing.Color]::Transparent)

# Rounded square background with a blue diagonal gradient.
$path = New-RoundedRectPath 0 0 $size $size 230
$rect = New-Object System.Drawing.RectangleF(0, 0, $size, $size)
$brush = New-Object System.Drawing.Drawing2D.LinearGradientBrush(
    $rect,
    [System.Drawing.Color]::FromArgb(255, 26, 115, 232),
    [System.Drawing.Color]::FromArgb(255, 11, 87, 208),
    45
)
$g.FillPath($brush, $path)

# White "A" + "文" mark.
$white = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::White)
$format = New-Object System.Drawing.StringFormat
$format.Alignment = [System.Drawing.StringAlignment]::Center
$format.LineAlignment = [System.Drawing.StringAlignment]::Center

$fontA = New-Object System.Drawing.Font(
    'Segoe UI',
    390,
    [System.Drawing.FontStyle]::Bold,
    [System.Drawing.GraphicsUnit]::Pixel
)
$fontWen = New-Object System.Drawing.Font(
    'Microsoft YaHei',
    330,
    [System.Drawing.FontStyle]::Bold,
    [System.Drawing.GraphicsUnit]::Pixel
)

$rectA = New-Object System.Drawing.RectangleF(100, 210, 380, 600)
$rectWen = New-Object System.Drawing.RectangleF(500, 250, 420, 540)
$wen = [string][char]0x6587

$g.DrawString('A', $fontA, $white, $rectA, $format)
$g.DrawString($wen, $fontWen, $white, $rectWen, $format)

# Save the web logo plus extension icons.
$logoPath = Join-Path $assetsDir 'logo.png'
$logo = New-Object System.Drawing.Bitmap(512, 512)
$logoGraphics = [System.Drawing.Graphics]::FromImage($logo)
$logoGraphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$logoGraphics.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
$logoGraphics.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality
$logoGraphics.DrawImage($master, 0, 0, 512, 512)
$logo.Save($logoPath, [System.Drawing.Imaging.ImageFormat]::Png)
$logoGraphics.Dispose()
$logo.Dispose()

foreach ($iconSize in 48, 128) {
    $bitmap = New-Object System.Drawing.Bitmap($iconSize, $iconSize)
    $graphics = [System.Drawing.Graphics]::FromImage($bitmap)
    $graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $graphics.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
    $graphics.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality
    $graphics.Clear([System.Drawing.Color]::Transparent)
    $graphics.DrawImage($master, 0, 0, $iconSize, $iconSize)
    $iconPath = Join-Path $iconsDir ("icon{0}.png" -f $iconSize)
    $bitmap.Save($iconPath, [System.Drawing.Imaging.ImageFormat]::Png)
    $graphics.Dispose()
    $bitmap.Dispose()
}

# Small toolbar sizes use a simplified "A →" mark so they stay legible.
foreach ($iconSize in 16, 32) {
    $bitmap = New-Object System.Drawing.Bitmap($iconSize, $iconSize)
    $graphics = [System.Drawing.Graphics]::FromImage($bitmap)
    $graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
    $graphics.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::AntiAliasGridFit
    $graphics.Clear([System.Drawing.Color]::Transparent)

    $smallPath = New-RoundedRectPath 0 0 $iconSize $iconSize ($iconSize * 0.22)
    $smallBrush = New-Object System.Drawing.SolidBrush(
        [System.Drawing.Color]::FromArgb(255, 26, 115, 232)
    )
    $graphics.FillPath($smallBrush, $smallPath)

    $smallWhite = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::White)
    $smallFormat = New-Object System.Drawing.StringFormat
    $smallFormat.Alignment = [System.Drawing.StringAlignment]::Center
    $smallFormat.LineAlignment = [System.Drawing.StringAlignment]::Center
    $smallFont = New-Object System.Drawing.Font(
        'Segoe UI',
        ($iconSize * 0.62),
        [System.Drawing.FontStyle]::Bold,
        [System.Drawing.GraphicsUnit]::Pixel
    )
    $smallRect = New-Object System.Drawing.RectangleF(
        ($iconSize * 0.05),
        ($iconSize * 0.12),
        ($iconSize * 0.62),
        ($iconSize * 0.76)
    )
    $graphics.DrawString('A', $smallFont, $smallWhite, $smallRect, $smallFormat)

    $pen = New-Object System.Drawing.Pen(
        [System.Drawing.Color]::White,
        [Math]::Max(1, $iconSize * 0.08)
    )
    $pen.StartCap = [System.Drawing.Drawing2D.LineCap]::Round
    $pen.EndCap = [System.Drawing.Drawing2D.LineCap]::Round
    $x1 = $iconSize * 0.64
    $x2 = $iconSize * 0.88
    $y = $iconSize * 0.55
    $graphics.DrawLine($pen, $x1, $y, $x2, $y)
    $graphics.DrawLine($pen, ($x2 - $iconSize * 0.12), ($y - $iconSize * 0.12), $x2, $y)
    $graphics.DrawLine($pen, ($x2 - $iconSize * 0.12), ($y + $iconSize * 0.12), $x2, $y)

    $iconPath = Join-Path $iconsDir ("icon{0}.png" -f $iconSize)
    $bitmap.Save($iconPath, [System.Drawing.Imaging.ImageFormat]::Png)
    $pen.Dispose()
    $smallFont.Dispose()
    $smallFormat.Dispose()
    $smallWhite.Dispose()
    $smallBrush.Dispose()
    $smallPath.Dispose()
    $graphics.Dispose()
    $bitmap.Dispose()
}

$fontA.Dispose()
$fontWen.Dispose()
$format.Dispose()
$white.Dispose()
$brush.Dispose()
$path.Dispose()
$g.Dispose()
$master.Dispose()

Write-Output "Logo: $logoPath"
Write-Output "Icons: $iconsDir"
