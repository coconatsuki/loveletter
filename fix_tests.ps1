# PowerShell script to fix GameScoring tests
$filePath = "src\pages\__tests__\GameScoring.test.jsx"
$content = Get-Content $filePath -Raw

# Replace the old pattern with new pattern
$content = $content -replace 'let firebaseCallback;\s+mockOnValue\.mockImplementation\(\(ref, callback\) => \{\s+firebaseCallback = callback;\s+return vi\.fn\(\);\s+\}\);', 'const { triggerCallbacks } = setupFirebaseMocks();'

$content = $content -replace 'firebaseCallback\(\{ val: \(\) => roomData \}\);', 'triggerCallbacks(roomData);'

$content = $content -replace 'firebaseCallback\(\{ val: \(\) => null \}\);', 'triggerCallbacks(null);'

Set-Content $filePath $content
Write-Host "Fixed test patterns in $filePath"
