Add-Type -AssemblyName System.Drawing

$projectRoot = Split-Path -Parent $PSScriptRoot
$outDir = Join-Path $projectRoot 'icons'
New-Item -ItemType Directory -Force -Path $outDir | Out-Null

foreach ($size in 16, 32, 48, 128) {
    $bitmap = New-Object System.Drawing.Bitmap($size, $size)
    $graphics = [System.Drawing.Graphics]::FromImage($bitmap)
    $graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
    $graphics.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::AntiAliasGridFit
    $graphics.Clear([System.Drawing.Color]::Transparent)

    $padding = [Math]::Max(1, [Math]::Round($size * 0.03))
    $circle = New-Object System.Drawing.RectangleF(
        $padding,
        $padding,
        ($size - 2 * $padding),
        ($size - 2 * $padding)
    )

    $blue = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 26, 115, 232))
    $graphics.FillEllipse($blue, $circle)

    $fontSize = [Math]::Round($size * 0.56)
    $font = New-Object System.Drawing.Font(
        'Segoe UI',
        $fontSize,
        [System.Drawing.FontStyle]::Bold,
        [System.Drawing.GraphicsUnit]::Pixel
    )
    $white = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::White)
    $format = New-Object System.Drawing.StringFormat
    $format.Alignment = [System.Drawing.StringAlignment]::Center
    $format.LineAlignment = [System.Drawing.StringAlignment]::Center
    $textRect = New-Object System.Drawing.RectangleF(0, 0, $size, $size)
    $graphics.DrawString('T', $font, $white, $textRect, $format)

    $path = Join-Path $outDir ("icon{0}.png" -f $size)
    $bitmap.Save($path, [System.Drawing.Imaging.ImageFormat]::Png)

    $font.Dispose()
    $white.Dispose()
    $blue.Dispose()
    $format.Dispose()
    $graphics.Dispose()
    $bitmap.Dispose()
}

Write-Output "Icons generated: $outDir"
