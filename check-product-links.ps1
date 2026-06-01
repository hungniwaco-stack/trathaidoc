param(
  [string]$FilePath = ".\\index.html",
  [int]$TimeoutSec = 20
)

if (-not (Test-Path -LiteralPath $FilePath)) {
  Write-Error "Khong tim thay file: $FilePath"
  exit 1
}

$content = Get-Content -LiteralPath $FilePath -Raw
$regex = 'href="(https://s\.shopee\.vn/[^"]+)"'
$matches = [regex]::Matches($content, $regex)
$urls = $matches | ForEach-Object { $_.Groups[1].Value } | Select-Object -Unique

if (-not $urls -or $urls.Count -eq 0) {
  Write-Host "Khong tim thay link s.shopee.vn trong $FilePath"
  exit 0
}

$results = foreach ($u in $urls) {
  try {
    $resp = Invoke-WebRequest -Uri $u -MaximumRedirection 10 -UseBasicParsing -TimeoutSec $TimeoutSec
    [PSCustomObject]@{
      Url       = $u
      Status    = $resp.StatusCode
      FinalUrl  = $resp.BaseResponse.ResponseUri.AbsoluteUri
      IsHealthy = $resp.StatusCode -ge 200 -and $resp.StatusCode -lt 400
      Error     = ""
    }
  } catch {
    $code = if ($_.Exception.Response) { [int]$_.Exception.Response.StatusCode } else { -1 }
    $final = if ($_.Exception.Response -and $_.Exception.Response.ResponseUri) {
      $_.Exception.Response.ResponseUri.AbsoluteUri
    } else {
      ""
    }
    [PSCustomObject]@{
      Url       = $u
      Status    = $code
      FinalUrl  = $final
      IsHealthy = $false
      Error     = $_.Exception.Message
    }
  }
}

$results | Format-Table -AutoSize

$ok = ($results | Where-Object { $_.IsHealthy }).Count
$total = $results.Count
$fail = $total - $ok

Write-Host ""
Write-Host "Tong: $total | OK: $ok | Loi: $fail"

if ($fail -gt 0) {
  exit 1
}

exit 0
